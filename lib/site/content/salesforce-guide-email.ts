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

export const WORK_EMAIL_MESSAGE = "Please enter a valid email address."
