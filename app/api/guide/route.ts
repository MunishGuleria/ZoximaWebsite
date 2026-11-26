import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import {
  EmailClient,
  EMAIL_FONT,
  type EmailMessage,
  emailShell,
  escapeHtml,
  rowsTable,
  sendEmail,
  teamInbox,
} from '@/lib/email/acs'
import { SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE } from '@/lib/site/content/salesforce-guide'
import {
  SF_GUIDE_PDF_FALLBACK_URL,
  SF_GUIDE_TITLE,
  WORK_EMAIL_MESSAGE,
  isWebmail,
} from '@/lib/site/content/salesforce-guide-email'

/* --------------------------------------------------------------------------
   Salesforce guide request (/partners/salesforce/guide/get) → ACS Email.

   For each genuine request:
   1. The visitor gets the guide email with a LINK to the PDF (not an
      attachment). If this fails the visitor sees an error (502).
   2. The team (CONTACT_TO_EMAIL) gets a new-lead alert, replyTo the visitor.
      A failure here is logged; the visitor still sees success.
   3. When GUIDE_LEADS_WEBHOOK_URL is set, the lead is POSTed as JSON to it
      (a Power Automate "When an HTTP request is received" flow that adds a
      row to the leads Excel sheet). A failure is logged, never shown.

   Config: AZURE_COMMUNICATION_CONNECTION_STRING, CONTACT_FROM_EMAIL,
   CONTACT_TO_EMAIL (as the contact form), plus optional GUIDE_FROM_EMAIL
   (sender of the visitor email; else CONTACT_FROM_EMAIL), GUIDE_PDF_URL and
   GUIDE_LEADS_WEBHOOK_URL. See .env.example. No secrets in this file.
   -------------------------------------------------------------------------- */

// ACS polls for the send status (two sends) plus the webhook; allow for it.
export const maxDuration = 30

const NOT_CONFIGURED = 'The guide form is not configured. Please email info@zoxima.com and we will send you the guide.'
const SEND_FAILED = 'We could not email the guide. Please email info@zoxima.com and we will send it to you.'
const UNSUBSCRIBE_MAILTO = 'mailto:info@zoxima.com?subject=Unsubscribe'
const CONTACT_URL = 'https://www.zoxima.com/contact'
const SITE_URL = 'https://www.zoxima.com'
const PROBLEM_IDS = SF_GUIDE_PROBLEMS.map((p) => p.id) as [string, ...string[]]

/** A single-line text field: trimmed, no line breaks (they would end up in subjects). */
const line = (max: number, required?: string) => {
  const base = z.string(required ? { required_error: required } : undefined).trim()
  return (required ? base.min(1, required) : base)
    .max(max, `Please keep this under ${max} characters.`)
    .transform((s) => s.replace(/[\r\n\t]+/g, ' '))
}

const GuideSchema = z.object({
  firstName: line(80, 'Please enter your first name.'),
  lastName: line(80, 'Please enter your last name.'),
  email: z
    .string({ required_error: 'Please enter your work email.' })
    .trim()
    .min(1, 'Please enter your work email.')
    .max(200)
    .email(WORK_EMAIL_MESSAGE)
    .refine((e) => !isWebmail(e), WORK_EMAIL_MESSAGE),
  company: line(160, 'Please enter your company.'),
  jobTitle: line(120, 'Please enter your job title.'),
  problem: z.enum(PROBLEM_IDS, { errorMap: () => ({ message: 'Please choose the problem that matters most.' }) }),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please tick the box to receive the guide.' }) }),
  // Section page the visitor came from (?from=<id>) and channel (?source=).
  from: z.string().trim().max(80).optional().default(''),
  source: line(100).optional().default(''),
  // Honeypot: real users never fill this in (browsers do not autofill it).
  zx_check: z.string().max(500).optional(),
})

/* --------------------------------------------------------------------------
   Basic abuse guard. In memory, so it is per server instance: on Vercel each
   warm serverless instance keeps its own counts and a cold start resets them.
   It stops a script hammering one instance, not a determined attacker.
   -------------------------------------------------------------------------- */
const IP_LIMIT = 5
const IP_WINDOW_MS = 10 * 60 * 1000
const EMAIL_WINDOW_MS = 2 * 60 * 1000
const ipHits = new Map<string, number[]>()
const emailSentAt = new Map<string, number>()

function prune(now: number) {
  if (ipHits.size + emailSentAt.size < 500) return
  for (const [ip, hits] of ipHits) if (hits.every((t) => now - t > IP_WINDOW_MS)) ipHits.delete(ip)
  for (const [email, t] of emailSentAt) if (now - t > EMAIL_WINDOW_MS) emailSentAt.delete(email)
}

function clientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

/** The PDF link: GUIDE_PDF_URL when it is an absolute http(s) URL, else the default. */
function pdfUrl() {
  const configured = process.env.GUIDE_PDF_URL?.trim()
  if (configured) {
    try {
      const url = new URL(configured)
      if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString()
    } catch {}
    console.error('[guide] GUIDE_PDF_URL is not an absolute URL; using the default PDF link')
  }
  return SF_GUIDE_PDF_FALLBACK_URL
}

/** Queues the email; if ACS rejects the custom headers, sends once more without them. */
async function sendWithHeaders(client: EmailClient, message: EmailMessage) {
  try {
    return await sendEmail(client, message)
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode
    if (!message.headers || status !== 400) throw err
    console.warn('[guide] ACS rejected the custom headers; resending without List-Unsubscribe:', err)
    return sendEmail(client, { ...message, headers: undefined })
  }
}

/** POSTs the lead to the Power Automate flow. Never throws. */
async function postLead(url: string, lead: Record<string, unknown>) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text().catch(() => '')}`.trim())
    return true
  } catch (err) {
    console.error('[guide] Leads webhook failed; lead row NOT added (the emails were still sent):', err)
    return false
  }
}

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = GuideSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Please check the highlighted fields and try again.',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    )
  }

  const { firstName, lastName, email, company, jobTitle, problem: problemId, consent, source, zx_check } = parsed.data

  // Silently accept honeypot hits so bots do not learn they were caught.
  if (zx_check) {
    console.warn('[guide] Honeypot filled; guide request dropped (nothing sent).')
    return NextResponse.json({ success: true }, { status: 200 })
  }

  /* Rate limits ------------------------------------------------------------ */
  const now = Date.now()
  prune(now)
  const ip = clientIp(request)
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS)
  if (recent.length >= IP_LIMIT) {
    console.warn(`[guide] Rate limit: ${ip} made ${recent.length} requests in 10 minutes`)
    return NextResponse.json(
      { error: 'Too many requests from your network. Please try again in a few minutes.' },
      { status: 429 }
    )
  }
  const emailKey = email.toLowerCase()
  const lastSent = emailSentAt.get(emailKey)
  if (lastSent && now - lastSent < EMAIL_WINDOW_MS) {
    return NextResponse.json(
      { error: 'We have just sent the guide to this address. Please check your inbox, or try again in a couple of minutes.' },
      { status: 429 }
    )
  }
  ipHits.set(ip, [...recent, now])

  const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()
  // The guide can come from its own MailFrom address (its display name, e.g.
  // "Zoxima Salesforce Team", is set on that address in Azure).
  const guideFrom = process.env.GUIDE_FROM_EMAIL?.trim() || from
  if (!connectionString || !from || !guideFrom) {
    console.error('[guide] AZURE_COMMUNICATION_CONNECTION_STRING or CONTACT_FROM_EMAIL is not set')
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 500 })
  }

  let client: EmailClient
  try {
    client = new EmailClient(connectionString)
  } catch (err) {
    // A malformed connection string throws here.
    console.error('[guide] Could not create the ACS EmailClient:', err)
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 500 })
  }

  const problem = SF_GUIDE_PROBLEMS.find((p) => p.id === problemId)!
  const fromProblem = SF_GUIDE_PROBLEMS.find((p) => p.id === parsed.data.from)
  const fromPage = fromProblem ? `${SF_GUIDE_ROUTE}/${fromProblem.id}` : ''
  const channel = source.replace(/[^\w .:/@+-]/g, '').slice(0, 100)
  const name = `${firstName} ${lastName}`
  const inbox = teamInbox()
  const pdf = pdfUrl()
  const date = new Date(now).toISOString()
  const sectionLine = `That's section ${problem.n}${problem.page ? `, starting on page ${problem.page}` : ''}.`

  /* 1. The guide, to the visitor -------------------------------------------- */
  const guideEmail: EmailMessage = {
    senderAddress: guideFrom,
    recipients: { to: [{ address: email, displayName: name }] },
    replyTo: [{ address: inbox[0], displayName: 'Zoxima Salesforce Team' }],
    headers: { 'List-Unsubscribe': `<${UNSUBSCRIBE_MAILTO}>` },
    content: {
      subject: `Your guide: ${SF_GUIDE_TITLE}`,
      plainText: [
        `Hi ${firstName},`,
        '',
        `Thanks for your interest. Here is your copy of ${SF_GUIDE_TITLE}.`,
        '',
        `Download the full guide (PDF): ${pdf}`,
        '',
        `You told us ${problem.title} matters most right now. ${sectionLine}`,
        '',
        `Want to talk about where your Salesforce stands? Reply to this email or contact us at ${CONTACT_URL}`,
        '',
        'Best regards,',
        'The Zoxima Salesforce Team',
        '',
        '--',
        `Zoxima Solutions LLC, Fremont, California · Unsubscribe: ${UNSUBSCRIBE_MAILTO}`,
        'Salesforce is a trademark of Salesforce, Inc. This guide is independent and is not endorsed by Salesforce.',
      ].join('\n'),
      html: emailShell(`
        <p style="margin:0 0 28px;font-size:20px;font-weight:700;letter-spacing:-0.01em">Zoxima</p>
        <p style="margin:0 0 16px">Hi ${escapeHtml(firstName)},</p>
        <p style="margin:0 0 24px">Thanks for your interest. Here is your copy of <strong>${SF_GUIDE_TITLE}</strong>.</p>
        <p style="margin:0 0 28px">
          <a href="${escapeHtml(pdf)}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-weight:600;padding:13px 22px;border-radius:8px;font-family:${EMAIL_FONT}">Download the full guide (PDF)</a>
        </p>
        <p style="margin:0 0 16px">You told us <strong>${escapeHtml(problem.title)}</strong> matters most right now. ${sectionLine}</p>
        <p style="margin:0 0 24px">Want to talk about where your Salesforce stands? Reply to this email or contact us at <a href="${CONTACT_URL}" style="color:#111111">${CONTACT_URL}</a></p>
        <p style="margin:0 0 32px">Best regards,<br />The Zoxima Salesforce Team</p>
        <div style="border-top:1px solid #e5e5e5;padding-top:16px;font-size:12px;line-height:1.5;color:#555555">
          <p style="margin:0 0 6px">Zoxima Solutions LLC, Fremont, California · <a href="${UNSUBSCRIBE_MAILTO}" style="color:#555555">Unsubscribe</a></p>
          <p style="margin:0">Salesforce is a trademark of Salesforce, Inc. This guide is independent and is not endorsed by Salesforce.</p>
        </div>
      `),
    },
  }

  let guideId: string
  try {
    guideId = await sendWithHeaders(client, guideEmail)
  } catch (err) {
    console.error(`[guide] Guide email to ${email} failed; nothing else sent:`, err)
    return NextResponse.json({ error: SEND_FAILED }, { status: 502 })
  }
  emailSentAt.set(emailKey, now)
  // The ACS message id lets an admin trace delivery (Microsoft 365 message trace).
  console.log(`[guide] Guide sent to ${email}, ACS id ${guideId}`)

  /* 2. Lead alert to the team, and 3. the leads sheet row, in parallel ------- */
  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Company', company],
    ['Job title', jobTitle],
    ['Problem that matters most', `${problem.n}. ${problem.title}`],
    ['Came from', fromPage ? `${SITE_URL}${fromPage}` : 'Not from a section page'],
    ['Channel', channel || 'Not set (no ?source= on the link)'],
    ['Consent to emails', consent ? 'Yes' : 'No'],
    ['Requested at', date],
    ['Guide email', `Sent, ACS id ${guideId}`],
  ]
  const alert: EmailMessage = {
    senderAddress: from,
    recipients: { to: inbox.map((address) => ({ address })) },
    // Hitting "Reply" answers the visitor directly.
    replyTo: [{ address: email, displayName: name }],
    content: {
      subject: `New guide request: ${name}, ${company}`,
      plainText: [
        'New Salesforce guide request from the Zoxima website',
        '',
        ...rows.map(([label, value]) => `${label}: ${value}`),
      ].join('\n'),
      html: emailShell(`
        <h2 style="margin:0 0 20px;font-size:18px;font-weight:600">New Salesforce guide request</h2>
        ${rowsTable(rows)}
        <p style="margin:20px 0 0;font-size:13px;color:#555555">Reply to this email to answer ${escapeHtml(firstName)} directly.</p>
      `),
    },
  }

  const webhook = process.env.GUIDE_LEADS_WEBHOOK_URL?.trim()
  const [alertResult] = await Promise.allSettled([
    sendEmail(client, alert),
    webhook
      ? postLead(webhook, {
          date,
          firstName,
          lastName,
          email,
          company,
          jobTitle,
          problem: problem.title,
          fromPage,
          channel,
          consent,
        })
      : Promise.resolve(false),
  ])
  if (alertResult.status === 'fulfilled') {
    console.log(`[guide] Lead alert sent to ${inbox.join(', ')}, ACS id ${alertResult.value}`)
  } else {
    console.error(`[guide] Lead alert for ${email} failed (guide was sent, ACS id ${guideId}):`, alertResult.reason)
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
