import { EMAIL_FONT } from '@/lib/email/acs'
import { ZOXIMA_LOGO_PNG_BASE64 } from '@/lib/email/zoxima-logo'

/* --------------------------------------------------------------------------
   The branded visitor email (guide email, booking confirmation): header with
   the logo and "Zoxima Solutions", the body, "Best regards" and a signature
   with the logo, then a small footer. Tables and inline styles, so it holds
   up in Outlook. Server-only. The logo is an inline attachment (cid), so no
   image is loaded from the web.
   -------------------------------------------------------------------------- */

export const SENDER_NAME = 'Zoxima Solutions'
export const SITE_URL = 'https://www.zoxima.com'

/** Attach this to every message that uses brandedEmail(). */
export const LOGO_ATTACHMENT = {
  name: 'zoxima-logo.png',
  contentType: 'image/png',
  contentInBase64: ZOXIMA_LOGO_PNG_BASE64,
  contentId: 'zoxima-logo',
}

/** `inner`: the body HTML (already escaped). `footer`: footer HTML. */
export function brandedEmail(inner: string, footer: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F6F8FA;color:#17212B;font-family:${EMAIL_FONT};font-size:15px;line-height:1.6">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F8FA">
      <tr><td align="center" style="padding:32px 16px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #DCE3EA;border-radius:10px;overflow:hidden">
          <tr><td style="background:#1F3A5F;padding:18px 28px">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="background:#ffffff;border-radius:10px;padding:4px"><img src="cid:zoxima-logo" width="56" height="56" alt="Zoxima" style="display:block;width:56px;height:56px;border:0" /></td>
              <td style="padding-left:14px;color:#ffffff;font-size:20px;font-weight:700;font-family:${EMAIL_FONT}">${SENDER_NAME}</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:28px">
            ${inner}
            <p style="margin:0 0 16px">Best regards,</p>
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;padding-right:12px;border-right:2px solid #F2A541"><img src="cid:zoxima-logo" width="60" height="60" alt="Zoxima" style="display:block;width:60px;height:60px;border:0" /></td>
              <td style="vertical-align:middle;padding-left:12px;font-family:${EMAIL_FONT}">
                <div style="color:#1F3A5F;font-size:16px;font-weight:700">${SENDER_NAME}</div>
                <div style="color:#4A5868;font-size:13px">Salesforce Partner · Fremont, California</div>
                <a href="${SITE_URL}" style="color:#2E7D9A;font-size:13px;text-decoration:none">www.zoxima.com</a>
              </td>
            </tr></table>
          </td></tr>
          <tr><td style="border-top:1px solid #DCE3EA;padding:16px 28px;font-size:12px;line-height:1.5;color:#4A5868">
            ${footer}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}
