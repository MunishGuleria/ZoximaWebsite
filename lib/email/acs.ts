import { EmailClient, type EmailMessage } from '@azure/communication-email'

/* --------------------------------------------------------------------------
   Shared Azure Communication Services (ACS) Email helpers for the API routes
   (app/api/contact, app/api/guide). Server-only: never import from a client
   component. No secrets here; see .env.example for the variables.
   -------------------------------------------------------------------------- */

export { EmailClient, type EmailMessage }

/** Where the team's emails go: CONTACT_TO_EMAIL (comma-separated), else info@zoxima.com. */
export function teamInbox() {
  const list = (process.env.CONTACT_TO_EMAIL ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)
  return list.length ? list : ['info@zoxima.com']
}

/** Escapes user input before it is interpolated into an email. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Escapes and keeps the visitor's line breaks in an HTML email. */
export function escapeMultiline(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, '<br />')
}

/** Queues one email with ACS and waits until it has been accepted or failed. */
export async function sendEmail(client: EmailClient, message: EmailMessage) {
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
export const EMAIL_FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

export function emailShell(inner: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#ffffff;color:#111111;font-family:${EMAIL_FONT};font-size:15px;line-height:1.6">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px">
      ${inner}
    </div>
  </body>
</html>`
}

/** A label/value table for the team's notification emails (values escaped). */
export function rowsTable(rows: [string, string][]) {
  return `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:14px">
          ${rows
            .map(
              ([label, value]) =>
                `<tr>
                  <td style="vertical-align:top;padding:8px 16px 8px 0;border-top:1px solid #e5e5e5;white-space:nowrap"><strong>${escapeHtml(label)}</strong></td>
                  <td style="vertical-align:top;padding:8px 0;border-top:1px solid #e5e5e5">${escapeMultiline(value)}</td>
                </tr>`
            )
            .join('')}
        </table>`
}
