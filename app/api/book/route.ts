import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import {
  EmailClient,
  type EmailMessage,
  emailShell,
  escapeHtml,
  rowsTable,
  sendEmail,
  teamInbox,
} from '@/lib/email/acs'
import { brandedEmail, LOGO_ATTACHMENT, SENDER_NAME } from '@/lib/email/branded'
import { formatIn, googleCalendarUrl, outlookCalendarUrl, slotToUtc } from '@/lib/email/calendar'
import {
  BOOK_MAX_DAYS,
  BOOK_SLOTS,
  formatBookDate,
  isWeekend,
} from '@/lib/site/content/health-check-booking'

/* --------------------------------------------------------------------------
   Health check call booking (/partners/salesforce#book) → ACS Email.

   For each genuine booking:
   1. The team (CONTACT_TO_EMAIL) gets the request, replyTo the visitor. If
      this fails the visitor sees an error (502), so no booking is lost.
   2. The visitor gets a confirmation of the time they asked for. A failure
      here is logged; the booking still reached the team.

   Config: the same as the contact form (AZURE_COMMUNICATION_CONNECTION_STRING,
   CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL). No secrets in this file.
   -------------------------------------------------------------------------- */

export const maxDuration = 30

const FALLBACK = 'Please email info@zoxima.com with a time that suits you and we will set up the call.'
const NOT_CONFIGURED = `Booking is not available right now. ${FALLBACK}`
const SEND_FAILED = `We could not send your booking. ${FALLBACK}`

const DATE = /^\d{4}-\d{2}-\d{2}$/
const CALL_MINUTES = 20

const BookSchema = z.object({
  name: z
    .string({ required_error: 'Please enter your name.' })
    .trim()
    .min(1, 'Please enter your name.')
    .max(120, 'Please keep this under 120 characters.')
    .transform((s) => s.replace(/[\r\n\t]+/g, ' ')),
  email: z
    .string({ required_error: 'Please enter your email.' })
    .trim()
    .min(1, 'Please enter your email.')
    .max(200)
    .email('Please enter a valid email address.'),
  date: z.string({ required_error: 'Please pick a day.' }).regex(DATE, 'Please pick a day.'),
  slot: z.enum(BOOK_SLOTS, { errorMap: () => ({ message: 'Please pick a time.' }) }),
  // The visitor's IANA time zone, from the browser (e.g. America/Los_Angeles).
  timeZone: z
    .string()
    .trim()
    .max(64)
    .regex(/^[A-Za-z0-9_+\-/]*$/)
    .optional()
    .default(''),
  // Honeypot: real users never fill this in.
  zx_check: z.string().max(500).optional(),
})

/* Basic abuse guard, per server instance (as in /api/guide). */
const IP_LIMIT = 5
const IP_WINDOW_MS = 10 * 60 * 1000
const ipHits = new Map<string, number[]>()

function clientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

/** The date is a weekday from today (UTC, a day of leeway) up to BOOK_MAX_DAYS ahead. */
function dateProblem(date: string, now: number) {
  const day = Date.parse(`${date}T00:00:00Z`)
  if (Number.isNaN(day)) return 'Please pick a day.'
  const today = Date.parse(new Date(now).toISOString().slice(0, 10) + 'T00:00:00Z')
  if (day < today - 86_400_000) return 'Please pick a day from today onwards.'
  if (day > today + BOOK_MAX_DAYS * 86_400_000) return `Please pick a day within the next ${BOOK_MAX_DAYS} days.`
  if (isWeekend(date)) return 'Please pick a weekday.'
  return ''
}

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = BookSchema.safeParse(payload)
  const now = Date.now()
  const badDate = parsed.success ? dateProblem(parsed.data.date, now) : ''
  if (!parsed.success || badDate) {
    const issues = parsed.success ? {} : parsed.error.flatten().fieldErrors
    return NextResponse.json(
      {
        error: 'Please check the highlighted fields and try again.',
        issues: badDate ? { ...issues, date: [badDate] } : issues,
      },
      { status: 422 }
    )
  }

  const { name, email, date, slot, timeZone, zx_check } = parsed.data

  if (zx_check) {
    console.warn('[book] Honeypot filled; booking dropped (nothing sent).')
    return NextResponse.json({ success: true }, { status: 200 })
  }

  const ip = clientIp(request)
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS)
  if (recent.length >= IP_LIMIT) {
    console.warn(`[book] Rate limit: ${ip} made ${recent.length} requests in 10 minutes`)
    return NextResponse.json(
      { error: 'Too many requests from your network. Please try again in a few minutes.' },
      { status: 429 }
    )
  }
  ipHits.set(ip, [...recent, now])
  if (ipHits.size > 500) for (const [k, v] of ipHits) if (v.every((t) => now - t > IP_WINDOW_MS)) ipHits.delete(k)

  const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()
  if (!connectionString || !from) {
    console.error('[book] AZURE_COMMUNICATION_CONNECTION_STRING or CONTACT_FROM_EMAIL is not set')
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 500 })
  }

  let client: EmailClient
  try {
    client = new EmailClient(connectionString)
  } catch (err) {
    console.error('[book] Could not create the ACS EmailClient:', err)
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 500 })
  }

  const inbox = teamInbox()
  const firstName = name.split(' ')[0]
  const day = formatBookDate(date)
  const zone = timeZone ? ` (${timeZone.replace(/_/g, ' ')})` : ''
  const when = `${day} at ${slot}${zone}`

  /* 1. The booking, to the team --------------------------------------------- */
  // The call as an exact instant, so the team sees it in their own time and
  // can add it to a calendar with the visitor as the guest.
  const start = slotToUtc(date, slot, timeZone)
  const end = new Date(start.getTime() + CALL_MINUTES * 60_000)
  const event = {
    title: `Salesforce Health Check call: ${name}`,
    start,
    end,
    guest: email,
    details: [
      '20-minute call about the Salesforce Health Check, booked on zoxima.com.',
      `Name: ${name}`,
      `Email: ${email}`,
      `Requested: ${when}`,
    ].join('\n'),
  }
  const gcal = googleCalendarUrl(event)
  const outlook = outlookCalendarUrl(event)
  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Requested time', when],
    ['In California', formatIn(start, 'America/Los_Angeles')],
    ['In India', formatIn(start, 'Asia/Kolkata')],
    ['Time zone', timeZone || 'Not known (taken as UTC)'],
    ['Booked at', new Date(now).toISOString()],
  ]
  const button = (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:8px;background:#111111;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">${label}</a>`
  const alert: EmailMessage = {
    senderAddress: from,
    recipients: { to: inbox.map((address) => ({ address })) },
    replyTo: [{ address: email, displayName: name }],
    content: {
      subject: `Health check call request from Zoxima website: ${name}, ${day} at ${slot}`,
      plainText: [
        'New Salesforce Health Check call request from the Zoxima website',
        '',
        ...rows.map(([label, value]) => `${label}: ${value}`),
        '',
        `Add to Google Calendar (${email} is added as a guest): ${gcal}`,
        `Add to Outlook (${email} is added as a guest): ${outlook}`,
        '',
        `Saving the event sends ${firstName} the calendar invite. They have been told to expect it within one business day.`,
      ].join('\n'),
      html: emailShell(`
        <h2 style="margin:0 0 20px;font-size:18px;font-weight:600">New health check call request</h2>
        ${rowsTable(rows)}
        <p style="margin:24px 0 10px;font-size:14px;font-weight:600">Add to your calendar (${escapeHtml(email)} is added as a guest):</p>
        <div>${button(gcal, 'Add to Google Calendar')}${button(outlook, 'Add to Outlook')}</div>
        <p style="margin:14px 0 0;font-size:13px;color:#555555">Saving the event sends ${escapeHtml(firstName)} the calendar invite. They have been told to expect it within one business day. Or reply to this email to agree another time.</p>
      `),
    },
  }

  let alertId: string
  try {
    alertId = await sendEmail(client, alert)
  } catch (err) {
    console.error(`[book] Booking alert for ${email} failed; nothing else sent:`, err)
    return NextResponse.json({ error: SEND_FAILED }, { status: 502 })
  }
  console.log(`[book] Booking from ${email} sent to ${inbox.join(', ')}, ACS id ${alertId}`)

  /* 2. Confirmation, to the visitor ------------------------------------------ */
  const confirmation: EmailMessage = {
    senderAddress: from,
    recipients: { to: [{ address: email, displayName: name }] },
    replyTo: [{ address: inbox[0], displayName: SENDER_NAME }],
    content: {
      subject: `Your Salesforce Health Check call with ${SENDER_NAME}`,
      plainText: [
        `Hi ${firstName},`,
        '',
        'Thanks for booking a call about the Salesforce Health Check. You asked for:',
        '',
        when,
        '',
        'We will confirm this time and send you a calendar invite within one business day.',
        'If the time does not suit any more, just reply to this email.',
        '',
        'Best regards,',
        SENDER_NAME,
        'www.zoxima.com',
        '',
        '--',
        'Zoxima Solutions LLC, Fremont, California',
      ].join('\n'),
      html: brandedEmail(
        `<p style="margin:0 0 14px">Hi ${escapeHtml(firstName)},</p>
            <p style="margin:0 0 18px">Thanks for booking a call about the Salesforce Health Check. You asked for:</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px"><tr>
              <td style="background:#F6F8FA;border-left:4px solid #1F3A5F;border-radius:6px;padding:14px 18px">
                <div style="color:#1F3A5F;font-size:17px;font-weight:700">${escapeHtml(day)}</div>
                <div style="color:#17212B;font-size:15px">${escapeHtml(slot)}${escapeHtml(zone)} · 20 minutes</div>
              </td>
            </tr></table>
            <p style="margin:0 0 22px">We will confirm this time and send you a calendar invite within one business day. If the time does not suit any more, just reply to this email.</p>`,
        'Zoxima Solutions LLC, Fremont, California'
      ),
    },
    attachments: [LOGO_ATTACHMENT],
  }

  const [confirmResult] = await Promise.allSettled([sendEmail(client, confirmation)])
  const confirmationSent = confirmResult.status === 'fulfilled'
  if (confirmResult.status === 'fulfilled') {
    console.log(`[book] Confirmation sent to ${email}, ACS id ${confirmResult.value}`)
  } else {
    console.error(`[book] Confirmation to ${email} failed (booking reached the team, ACS id ${alertId}):`, confirmResult.reason)
  }

  // The booking reached the team either way; the form says whether the
  // confirmation email went out too.
  return NextResponse.json({ success: true, confirmationSent }, { status: 200 })
}
