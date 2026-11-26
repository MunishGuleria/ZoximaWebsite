/* --------------------------------------------------------------------------
   The emailed Salesforce guide: the PDF link and the work-email rule, shared
   by the request form (components/site/guide-request-form.tsx) and its API
   (app/api/guide/route.ts). Section numbers and the PDF page each section
   starts on live on SF_GUIDE_PROBLEMS (n, page) in salesforce-guide.ts.
   -------------------------------------------------------------------------- */

/** The guide's full title, as used in the visitor email. */
export const SF_GUIDE_TITLE = "10 Salesforce Problems That Quietly Cost Mid-Size Companies"

/** The guide PDF: the file at public/guides/zoxima-salesforce-guide.pdf. */
export const SF_GUIDE_PDF_URL = "https://www.zoxima.com/guides/zoxima-salesforce-guide.pdf"

/** Remembers, in this browser, that the guide was sent (section pages read it). */
export const SF_GUIDE_EMAIL_KEY = "zx-guide-email"

export const WORK_EMAIL_MESSAGE = "Please enter a valid work email."

/* Free webmail. Exact domains, plus brand families on any country domain
   (yahoo.co.uk, hotmail.fr, gmx.de, yandex.ru, outlook.in …). */
const WEBMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "ymail.com",
  "rocketmail.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "pm.me",
  "protonmail.com",
  "protonmail.ch",
  "zoho.com",
  "zohomail.com",
  "zohomail.in",
  "mail.com",
])
const WEBMAIL_FAMILIES = new Set(["gmail", "yahoo", "hotmail", "outlook", "live", "aol", "yandex", "gmx"])
const COUNTRY_SUFFIX = /^(com|net|org|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/

/** True for free webmail addresses (gmail, yahoo, hotmail, outlook …). */
export function isWebmail(email: string) {
  const domain = email.trim().toLowerCase().split("@").pop() ?? ""
  if (WEBMAIL_DOMAINS.has(domain)) return true
  const dot = domain.indexOf(".")
  if (dot < 0) return false
  return WEBMAIL_FAMILIES.has(domain.slice(0, dot)) && COUNTRY_SUFFIX.test(domain.slice(dot + 1))
}
