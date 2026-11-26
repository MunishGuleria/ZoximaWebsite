import { NextResponse, type NextRequest } from 'next/server'
import { EmailClient, type EmailMessage } from '@azure/communication-email'
import { z } from 'zod'
import { ZOXIMA_LOGO_PNG_BASE64 } from '@/lib/email/zoxima-logo'

/* --------------------------------------------------------------------------
   Contact form → Azure Communication Services (ACS) Email.

   Every genuine enquiry sends TWO emails:
     1. a notification to the Zoxima inbox (replyTo = the visitor), and
     2. an acknowledgement to the visitor (replyTo = the team).
   The notification is the one that matters: if it fails the visitor sees an
   error. If only the acknowledgement fails, the lead is already delivered, so
   the visitor still sees success and the failure is logged.

   SECURITY: no secrets live in this file. Configure them in the environment
   (.env locally, Vercel → Project → Settings → Environment Variables in
   production). See .env.example for what each variable is.
   -------------------------------------------------------------------------- */

// ACS polls for the send status; allow enough time for both emails.
export const maxDuration = 30

const NOT_CONFIGURED = 'The contact form is not configured. Please email info@zoxima.com.'
const SEND_FAILED = 'We could not send your message. Please email info@zoxima.com.'

/** Splits a comma-separated env value into trimmed, non-empty addresses. */
function addressList(value: string | undefined, fallback: string) {
  const list = (value ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)
  return list.length ? list : [fallback]
}

const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('A valid email is required').max(200),
  phone: z.string().trim().max(40).optional().default(''),
  business: z.string().trim().max(160).optional().default(''),
  role: z.string().trim().max(120).optional().default(''),
  // "What would you like to improve?" on the contact page.
  topic: z.string().trim().max(80).optional().default(''),
  message: z.string().trim().max(4000).optional().default(''),
  // Honeypot: real users never fill this in.
  company_website: z.string().max(0).optional(),
})

/** Escapes user input before it is interpolated into an email. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Escapes and keeps the visitor's line breaks in an HTML email. */
function escapeMultiline(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, '<br />')
}

/** Queues one email with ACS and waits until it has been accepted or failed. */
async function sendEmail(client: EmailClient, message: EmailMessage) {
  const poller = await client.beginSend(message, { updateIntervalInMs: 1000 })
  const result = await poller.pollUntilDone()
  if (result.status !== 'Succeeded') {
    throw new Error(
      `ACS send ${result.id} ended as ${result.status}: ${result.error?.code ?? ''} ${result.error?.message ?? ''}`.trim()
    )
  }
  return result.id
}

/* Plain white/ink email shell: no brand colours, safe in any client. The
   acknowledgement adds the Zoxima logo as an inline image (LOGO_CID). */
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

const LOGO_CID = 'zoxima-logo'

/** The logo, attached inline and shown by <img src="cid:zoxima-logo">. */
const LOGO_ATTACHMENT = {
  name: 'zoxima-logo.png',
  contentType: 'image/png',
  contentInBase64: ZOXIMA_LOGO_PNG_BASE64,
  contentId: LOGO_CID,
}

function emailShell(inner: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#ffffff;color:#111111;font-family:${FONT};font-size:15px;line-height:1.6">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px">
      ${inner}
    </div>
  </body>
</html>`
}

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Please check the highlighted fields and try again.',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    )
  }

  const { name, email, phone, business, role, topic, message, company_website } = parsed.data

  // Silently accept honeypot hits so bots do not learn they were caught.
  if (company_website) {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()

  if (!connectionString || !from) {
    console.error('[contact] AZURE_COMMUNICATION_CONNECTION_STRING or CONTACT_FROM_EMAIL is not set')
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 500 })
  }

  const teamInbox = addressList(process.env.CONTACT_TO_EMAIL, 'info@zoxima.com')
  const teamReplyTo = process.env.CONTACT_REPLY_TO?.trim() || teamInbox[0]
  const firstName = name.split(/\s+/)[0]

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ...(phone ? ([['Phone', phone]] as [string, string][]) : []),
    ...(business ? ([['Company', business]] as [string, string][]) : []),
    ...(role ? ([['Role', role]] as [string, string][]) : []),
    ...(topic ? ([['Wants to improve', topic]] as [string, string][]) : []),
    ['Message', message || 'No message provided'],
  ]

  /* 1. Notification to the team -------------------------------------------- */
  const notification: EmailMessage = {
    senderAddress: from,
    recipients: { to: teamInbox.map((address) => ({ address })) },
    // Hitting "Reply" answers the visitor directly.
    replyTo: [{ address: email, displayName: name }],
    content: {
      subject: business ? `New enquiry from ${name}, ${business}` : `New enquiry from ${name}`,
      plainText: [
        'New enquiry from the Zoxima website',
        '',
        ...rows.map(([label, value]) => `${label}: ${value}`),
      ].join('\n'),
      html: emailShell(`
        <h2 style="margin:0 0 20px;font-size:18px;font-weight:600">New enquiry from the Zoxima website</h2>
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:14px">
          ${rows
            .map(
              ([label, value]) =>
                `<tr>
                  <td style="vertical-align:top;padding:8px 16px 8px 0;border-top:1px solid #e5e5e5;white-space:nowrap"><strong>${label}</strong></td>
                  <td style="vertical-align:top;padding:8px 0;border-top:1px solid #e5e5e5">${escapeMultiline(value)}</td>
                </tr>`
            )
            .join('')}
        </table>
        <p style="margin:20px 0 0;font-size:13px;color:#555555">Reply to this email to answer ${escapeHtml(name)} directly.</p>
      `),
    },
  }

  /* 2. Acknowledgement to the visitor --------------------------------------- */
  const echoText = [
    ...(topic ? [`Topic: ${topic}`] : []),
    ...(message ? [`Your message:\n${message}`] : []),
  ]
  const echoHtml = [
    ...(topic
      ? [`<p style="margin:0 0 8px"><strong>Topic:</strong> ${escapeHtml(topic)}</p>`]
      : []),
    ...(message
      ? [`<p style="margin:0"><strong>Your message:</strong><br />${escapeMultiline(message)}</p>`]
      : []),
  ]

  const acknowledgement: EmailMessage = {
    senderAddress: from,
    recipients: { to: [{ address: email, displayName: name }] },
    // Customer replies reach the team, not the no-reply sender.
    replyTo: [{ address: teamReplyTo }],
    content: {
      subject: 'We’ve received your message | Zoxima',
      plainText: [
        `Hi ${firstName},`,
        '',
        'Thank you for getting in touch with Zoxima. We have received your message and someone from our team will get back to you within one business day.',
        ...(echoText.length ? ['', 'For your reference, here is what you sent us:', '', ...echoText] : []),
        '',
        'If you have anything to add in the meantime, just reply to this email.',
        '',
        'The Zoxima team',
        'https://zoxima.com',
      ].join('\n'),
      html: emailShell(`
        <img src="cid:${LOGO_CID}" width="104" height="104" alt="Zoxima" style="display:block;width:104px;height:104px;margin:0 0 16px -12px;border:0" />
        <p style="margin:0 0 16px">Hi ${escapeHtml(firstName)},</p>
        <p style="margin:0 0 16px">Thank you for getting in touch with Zoxima. We have received your message and someone from our team will get back to you within one business day.</p>
        ${
          echoHtml.length
            ? `<p style="margin:0 0 8px">For your reference, here is what you sent us:</p>
               <div style="margin:0 0 16px;padding:12px 16px;border-left:2px solid #111111;color:#333333">${echoHtml.join('')}</div>`
            : ''
        }
        <p style="margin:0 0 16px">If you have anything to add in the meantime, just reply to this email.</p>
        <p style="margin:0">The Zoxima team<br /><a href="https://zoxima.com" style="color:#111111">zoxima.com</a></p>
      `),
    },
    attachments: [LOGO_ATTACHMENT],
  }

  let client: EmailClient
  try {
    client = new EmailClient(connectionString)
  } catch (err) {
    // A malformed connection string throws here.
    console.error('[contact] Could not create the ACS EmailClient:', err)
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 500 })
  }

  let id: string
  try {
    id = await sendEmail(client, notification)
  } catch (err) {
    console.error('[contact] Notification email failed, lead NOT delivered:', err)
    return NextResponse.json({ error: SEND_FAILED }, { status: 502 })
  }

  // The lead is delivered; a failed acknowledgement must not show the visitor an error.
  try {
    await sendEmail(client, acknowledgement)
  } catch (err) {
    console.error(`[contact] Acknowledgement email failed (notification ${id} was sent):`, err)
  }

  return NextResponse.json({ success: true, id }, { status: 200 })
}
