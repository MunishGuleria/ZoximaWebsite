import { NextResponse, type NextRequest } from 'next/server'
import { EmailClient, type EmailMessage } from '@azure/communication-email'
import { z } from 'zod'
/* --------------------------------------------------------------------------
   Contact form → Azure Communication Services (ACS) Email.

   Every genuine enquiry sends ONE email: a notification to CONTACT_TO_EMAIL
   (comma-separated list allowed; info@zoxima.com when unset), with replyTo set to the visitor so the team can answer directly. Nothing is
   sent to the visitor. If the notification fails, the visitor sees an error.

   SECURITY: no secrets live in this file. Configure them in the environment
   (.env locally, Vercel → Project → Settings → Environment Variables in
   production). See .env.example for what each variable is.
   -------------------------------------------------------------------------- */

// ACS polls for the send status; allow enough time for it.
export const maxDuration = 30

const NOT_CONFIGURED = 'The contact form is not configured. Please email info@zoxima.com.'
const SEND_FAILED = 'We could not send your message. Please email info@zoxima.com.'

/** Where enquiries go: CONTACT_TO_EMAIL (comma-separated), else info@zoxima.com. */
function teamInbox() {
  const list = (process.env.CONTACT_TO_EMAIL ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)
  return list.length ? list : ['info@zoxima.com']
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
  // Honeypot: real users never fill this in (browsers do not autofill it).
  zx_check: z.string().max(500).optional(),
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

/* Plain white/ink email shell: no brand colours, safe in any client. */
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

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

  const { name, email, phone, business, role, topic, message, zx_check } = parsed.data

  // Silently accept honeypot hits so bots do not learn they were caught.
  if (zx_check) {
    console.warn('[contact] Honeypot filled; enquiry dropped (not sent).')
    return NextResponse.json({ success: true }, { status: 200 })
  }

  const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()

  if (!connectionString || !from) {
    console.error('[contact] AZURE_COMMUNICATION_CONNECTION_STRING or CONTACT_FROM_EMAIL is not set')
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 500 })
  }

  const inbox = teamInbox()

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ...(phone ? ([['Phone', phone]] as [string, string][]) : []),
    ...(business ? ([['Company', business]] as [string, string][]) : []),
    ...(role ? ([['Role', role]] as [string, string][]) : []),
    ...(topic ? ([['Wants to improve', topic]] as [string, string][]) : []),
    ['Message', message || 'No message provided'],
  ]

  /* Notification to the team ------------------------------------------------ */
  const notification: EmailMessage = {
    senderAddress: from,
    recipients: { to: inbox.map((address) => ({ address })) },
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

  // The ACS message id lets an admin trace delivery (Microsoft 365 message trace).
  console.log(`[contact] Enquiry sent to ${inbox.join(', ')}, ACS id ${id}`)
  return NextResponse.json({ success: true, id }, { status: 200 })
}
