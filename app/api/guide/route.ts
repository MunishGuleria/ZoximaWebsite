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
import { ZOXIMA_LOGO_PNG_BASE64 } from '@/lib/email/zoxima-logo'
import {
  SF_GUIDE_PDF_URL,
  SF_GUIDE_TITLE,
  WORK_EMAIL_MESSAGE,
} from '@/lib/site/content/salesforce-guide-email'

/* --------------------------------------------------------------------------
   Salesforce guide request (/partners/salesforce/guide/get) → ACS Email.

   For each genuine request:
   1. The visitor gets the guide email with a LINK to the PDF (not an
      attachment). If this fails the visitor sees an error (502).
   2. The team (CONTACT_TO_EMAIL) gets a new-lead alert, replyTo the visitor.
      A failure here is logged; the visitor still sees success.

   Config: the same as the contact form (AZURE_COMMUNICATION_CONNECTION_STRING,
   CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL). The PDF is the file at
   public/guides/zoxima-salesforce-guide.pdf. No secrets in this file.
   -------------------------------------------------------------------------- */

// ACS polls for the send status of two sends; allow for it.
export const maxDuration = 30

const NOT_CONFIGURED = 'The guide form is not configured. Please email info@zoxima.com and we will send you the guide.'
const SEND_FAILED = 'We could not email the guide. Please email info@zoxima.com and we will send it to you.'
const UNSUBSCRIBE_MAILTO = 'mailto:info@zoxima.com?subject=Unsubscribe'
const SENDER_NAME = 'Zoxima Solutions'
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
  lastName: line(80).optional().default(''),
  email: z
    .string({ required_error: 'Please enter your email.' })
    .trim()
    .min(1, 'Please enter your email.')
    .max(200)
    .email(WORK_EMAIL_MESSAGE),
  company: line(160).optional().default(''),
  jobTitle: line(120).optional().default(''),
  // Optional: the problem that matters most (a section id), or empty.
  problem: z.union([z.enum(PROBLEM_IDS), z.literal('')]).optional().default(''),
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
  if (!connectionString || !from) {
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

  const problem = SF_GUIDE_PROBLEMS.find((p) => p.id === problemId)
  const fromProblem = SF_GUIDE_PROBLEMS.find((p) => p.id === parsed.data.from)
  const fromPage = fromProblem ? `${SF_GUIDE_ROUTE}/${fromProblem.id}` : ''
  const channel = source.replace(/[^\w .:/@+-]/g, '').slice(0, 100)
  const name = `${firstName} ${lastName}`.trim()
  const inbox = teamInbox()
  const pdf = SF_GUIDE_PDF_URL
  const date = new Date(now).toISOString()
  // Only when they picked a problem: point them at its section in the PDF.
  const startHere = problem
    ? `section ${problem.n}${problem.page ? ` on page ${problem.page}` : ''}`
    : ''

  /* 1. The guide, to the visitor -------------------------------------------- */
  // Written as a short personal note, not a marketing template (no banner, no
  // big button, no sales pitch, no bulk-mail header), so Gmail is more likely
  // to put it in Primary rather than Promotions.
  const guideEmail: EmailMessage = {
    senderAddress: from,
    recipients: { to: [{ address: email, displayName: name }] },
    replyTo: [{ address: inbox[0], displayName: SENDER_NAME }],
    content: {
      subject: `Your Salesforce guide from ${SENDER_NAME}`,
      plainText: [
        `Hi ${firstName},`,
        '',
        `Here's the Salesforce guide you asked for: ${SF_GUIDE_TITLE}.`,
        '',
        `Download the guide (PDF): ${pdf}`,
        '',
        ...(problem ? [`You said "${problem.title}" matters most right now, so start with ${startHere}.`, ''] : []),
        "If anything in it sounds familiar, just reply to this email and we'll take a look.",
        '',
        'Best regards,',
        SENDER_NAME,
        '',
        '--',
        `Zoxima Solutions LLC, Fremont, California · Unsubscribe: ${UNSUBSCRIBE_MAILTO}`,
        'Salesforce is a trademark of Salesforce, Inc. This guide is independent and is not endorsed by Salesforce.',
      ].join('\n'),
      html: `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#ffffff;color:#17212B;font-family:${EMAIL_FONT};font-size:15px;line-height:1.6">
    <div style="max-width:560px;margin:0 auto;padding:28px 20px">
      <img src="cid:zoxima-logo" width="76" height="76" alt="Zoxima Solutions" style="display:block;width:76px;height:76px;margin:0 0 16px -10px;border:0" />
      <p style="margin:0 0 14px">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 14px">Here's the Salesforce guide you asked for: <strong>${SF_GUIDE_TITLE}</strong>.</p>
      <p style="margin:0 0 14px"><a href="${escapeHtml(pdf)}" style="color:#1F3A5F;font-weight:600">Download the guide (PDF)</a></p>
      ${problem ? `<p style="margin:0 0 14px">You said <strong>${escapeHtml(problem.title)}</strong> matters most right now, so start with ${startHere}.</p>` : ''}
      <p style="margin:0 0 14px">If anything in it sounds familiar, just reply to this email and we'll take a look.</p>
      <p style="margin:0 0 28px">Best regards,<br />${SENDER_NAME}</p>
      <p style="margin:0;padding-top:14px;border-top:1px solid #e5e5e5;font-size:12px;line-height:1.5;color:#666666">
        Zoxima Solutions LLC, Fremont, California · <a href="${UNSUBSCRIBE_MAILTO}" style="color:#666666">Unsubscribe</a><br />
        Salesforce is a trademark of Salesforce, Inc. This guide is independent and is not endorsed by Salesforce.
      </p>
    </div>
  </body>
</html>`,
    },
    // The logo, shown by <img src="cid:zoxima-logo"> without loading anything from the web.
    attachments: [
      { name: 'zoxima-logo.png', contentType: 'image/png', contentInBase64: ZOXIMA_LOGO_PNG_BASE64, contentId: 'zoxima-logo' },
    ],
  }

  let guideId: string
  try {
    guideId = await sendEmail(client, guideEmail)
  } catch (err) {
    console.error(`[guide] Guide email to ${email} failed; nothing else sent:`, err)
    return NextResponse.json({ error: SEND_FAILED }, { status: 502 })
  }
  emailSentAt.set(emailKey, now)
  // The ACS message id lets an admin trace delivery (Microsoft 365 message trace).
  console.log(`[guide] Guide sent to ${email}, ACS id ${guideId}`)

  /* 2. Lead alert to the team ----------------------------------------------- */
  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Company', company || 'Not given'],
    ['Job title', jobTitle || 'Not given'],
    ['Problem that matters most', problem ? `${problem.n}. ${problem.title}` : 'Not chosen'],
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
      subject: `New Salesforce guide request from Zoxima website: ${company ? `${name}, ${company}` : name}`,
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

  const [alertResult] = await Promise.allSettled([sendEmail(client, alert)])
  if (alertResult.status === 'fulfilled') {
    console.log(`[guide] Lead alert sent to ${inbox.join(', ')}, ACS id ${alertResult.value}`)
  } else {
    console.error(`[guide] Lead alert for ${email} failed (guide was sent, ACS id ${guideId}):`, alertResult.reason)
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
