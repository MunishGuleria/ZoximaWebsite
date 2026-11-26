import { NextResponse, type NextRequest } from 'next/server'
import { EmailClient, type EmailMessage, emailShell, rowsTable, escapeHtml, sendEmail, teamInbox } from '@/lib/email/acs'
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
        ${rowsTable(rows)}
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
