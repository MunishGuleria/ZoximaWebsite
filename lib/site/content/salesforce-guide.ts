import type { PageContent } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   Free guide: "10 Salesforce problems that quietly cost mid-size companies"
   (/partners/salesforce/guide, a hub plus one page per section). The full
   guide is a PDF sent by email (gated); the site shows only each section's opening.

   The same ten problems are the cards on /partners/salesforce ("What we fix")
   and on the hub; each card opens /partners/salesforce/guide/<id>. The guide
   band (home Salesforce section and the Salesforce page) uses SF_GUIDE_BAND.
   -------------------------------------------------------------------------- */

export const SF_GUIDE_ROUTE = "/partners/salesforce/guide"

export type GuideProblem = {
  /** URL slug of the section page: /partners/salesforce/guide/<id>. */
  id: string
  /** Section number in the guide (1–10). */
  n: number
  title: string
  /** One-line teaser for the problem cards. */
  short: string
  /** The opening story (shown on the section page). */
  open: string
  /** "What it costs the business" (shown on the section page). */
  cost: string
  /** Page in the PDF where this section starts (used in the guide email). */
  page: number
}

/* The ten sections, word for word from Zoxima's guide-flow prototype
   (Zoxima_Website_Guide_Flow.html, Nov 2026). Only the opening story and
   "What it costs the business" are published on the website; the rest of each
   section (why it happens, the fixes, the build) is only in the emailed PDF. */
export const SF_GUIDE_PROBLEMS: GuideProblem[] = [
  {
    id: "reports-nobody-trusts",
    n: 1,
    title: "Reports nobody trusts",
    short: "Reviews start with \"that number can't be right\"",
    open: "The pipeline review starts, the dashboard goes on screen, and within two minutes someone says \"that number can't be right.\" The rest of the meeting is spent arguing about the data instead of the deals. Soon leaders stop opening Salesforce reports and ask for spreadsheets instead, and the company is back to managing on gut feel.",
    cost: "When reports aren't trusted, forecasts become guesses and decisions slow down. Managers spend hours each week rebuilding numbers in Excel. Worse, wrong numbers that look right lead to wrong calls on hiring, inventory and targets. The return from fixing reports is quick and easy to see: fewer side spreadsheets, shorter reviews and a forecast leadership can act on.",
    page: 5,
  },
  {
    id: "messy-data",
    n: 2,
    title: "Messy data",
    short: "You find three records for one customer",
    open: "A rep searches for a customer and finds three versions of the same account. Another opens a deal that was due to close six months ago and is still marked \"open.\" Marketing sends an email to a contact who left the company last year. Everyone knows the data is messy, so nobody fully trusts it, and nobody wants to be the one who cleans it.",
    cost: "Messy data wastes selling time, inflates the pipeline and makes every report from Section 1 unreliable. Duplicates mean two reps chase the same customer, or the customer gets mixed messages. Stale deals make the forecast look healthier than it is. Bad data is also the biggest single reason AI projects fail to deliver, as covered in Section 4. Cleaning it up gives a quick return in time saved and a more honest forecast.",
    page: 8,
  },
  {
    id: "salesforce-extra-work",
    n: 3,
    title: "When Salesforce feels like extra work",
    short: "Reps update it on Friday afternoon because they have to",
    open: "Reps keep their real notes in a notebook, a spreadsheet or their head, and update Salesforce on Friday afternoon because they have to. Managers chase updates before every review. It is tempting to call this a discipline problem, but usually it isn't. When people avoid a system, the system is usually asking too much of them and giving too little back.",
    cost: "Low adoption means the company is paying for licenses that hold only half the story. Pipeline data is late and patchy, coaching is based on guesswork, and when a rep leaves, their customer knowledge leaves with them. Better adoption pays back through better forecasts, faster onboarding of new reps and customer history that stays with the company.",
    page: 10,
  },
  {
    id: "ai-readiness",
    n: 4,
    title: "AI readiness",
    short: "AI answers come back vague or wrong",
    open: "Every board is asking \"what are we doing with AI?\" Salesforce now offers Agentforce and Einstein features, and the pressure to switch something on is high. But many companies that try AI on top of their CRM get answers that are vague, wrong or ignored. The problem is rarely the AI. It is what the AI has to work with, and whether anyone was clear about what it should do.",
    cost: "A failed AI project costs license fees, partner time and, most of all, credibility. After one bad attempt, it becomes much harder to get support for the next one. Gartner predicted in June 2025 that over 40% of agentic AI projects will be canceled by the end of 2027, citing escalating costs, unclear business value or inadequate risk controls (Gartner press release, 25 June 2025; based on a Gartner poll of 3,412 webinar attendees in January 2025). Getting ready first means the money spent on AI produces results people use.",
    page: 12,
  },
  {
    id: "automation-that-isnt",
    n: 5,
    title: "The work you thought was automatic, isn't",
    short: "Alerts go to people who left; approvals sit for days",
    open: "Somewhere in your Salesforce there are automations that were set up years ago: an alert when a big deal is created, a task when a lead comes in, an approval for discounts. Most people assume they still work. Some do. Some fire at the wrong time, some do nothing, and some cause odd behavior that people have learned to work around without knowing why.",
    cost: "Broken or outdated automation means missed follow-ups, slow approvals and manual work that people thought was handled. There is also a growing risk. Salesforce ended support for Workflow Rules and Process Builder on 31 December 2025 (Salesforce Help, \"Workflow Rules and Process Builder end of support\"). Existing automations built with these tools may still run, but Salesforce no longer fixes bugs in them, so if one breaks there is no safety net. Moving them to Flow now is cheaper than repairing a failure later.",
    page: 14,
  },
  {
    id: "data-silos",
    n: 6,
    title: "Sales data still lives in silos",
    short: "Reps check the ERP or call finance to answer a customer",
    open: "A customer calls about a late order. The rep opens Salesforce and sees the account, but not the order, the invoice or the open support case. They switch to the ERP, then email, then a shared drive, and still have to call someone in finance. The customer waits, and the rep looks like they don't know their own account.",
    cost: "When systems don't talk to each other, reps waste time switching screens and asking colleagues for information. Worse, they walk into conversations missing key facts: an overdue invoice, an open complaint, or a big order placed last week. Connecting the right systems saves time every day and avoids awkward, costly moments with customers.",
    page: 16,
  },
  {
    id: "one-customer-view",
    n: 7,
    title: "Bring every customer's story into one clear view",
    short: "Reps ask three people for an update before a meeting",
    open: "Before a customer meeting, a rep has fifteen minutes. The account record has dozens of related lists, the email history is somewhere else, the orders are in the ERP, and the last meeting notes are in a notebook. There is too much to read, spread across too many places, in too little time. So the rep goes in with half the picture.",
    cost: "Without a clear customer view, reps miss cross-sell chances, repeat questions the customer already answered, and miss warning signs such as falling orders or an unresolved complaint. Managers can't quickly see the health of key accounts. A good customer view makes every conversation better prepared and helps protect and grow the most valuable accounts.",
    page: 18,
  },
  {
    id: "cold-leads",
    n: 8,
    title: "Leads that go cold waiting for action",
    short: "Web leads wait a day or more for a first call",
    open: "A lot of business is lost not to competitors, but to waiting. A buyer fills in a form, then waits a day, two days, a week to hear back. By then they have spoken to someone else, or the need has passed. Deals that were moving stall at the same stage for weeks. And when a buyer goes quiet, many teams simply stop trying.",
    cost: "Speed matters a great deal in the first response. A widely cited Harvard Business Review study (Oldroyd, McElheran and Elkington, \"The Short Life of Online Sales Leads\", March 2011) audited 2,241 US companies and found that firms that contacted a web lead within an hour were nearly seven times as likely to qualify it as those that waited even an hour longer. Every lead that goes cold is marketing money already spent with no return.",
    page: 20,
  },
  {
    id: "mobile-field-reps",
    n: 9,
    title: "Mobile for field reps",
    short: "Visit notes get typed up at night",
    open: "A field rep finishes a customer visit, gets back in the car and drives to the next one. They mean to update Salesforce, but the mobile app shows a page built for a desktop screen. So they try to remember the details and type them up on a laptop in the evening. By then half the detail is gone, and the evening goes to clerical work instead of rest.",
    cost: "When updating on the phone is hard, visit notes arrive late, thin or not at all. Managers can't see what happened in the field until days later, and follow-ups get missed. Reps lose evening hours to admin. Making mobile easy gives back rep time and gives the business same-day field information.",
    page: 22,
  },
  {
    id: "daily-actions",
    n: 10,
    title: "The daily actions that make the business",
    short: "Deals show no activity for weeks",
    open: "Calls, emails, meetings and site visits are the real work of selling. Yet in most companies only a fraction of them ever reach Salesforce. It is easy to assume reps don't want to log their work. Usually that is not true. Logging is simply hard: it takes time, it is spread across tools, and it gives the rep nothing back.",
    cost: "Management loses sight of what is really happening, so coaching and forecasting are based on partial information. Deals suffer because when a rep is away or leaves, nobody knows the last conversation. And the rep suffers too: their effort is invisible, they get chased for updates, and they can't easily look back at their own history with a customer.",
    page: 24,
  },
]

/** The band that points to the guide (home Salesforce section, Salesforce page). */
export const SF_GUIDE_BAND = {
  eyebrow: "Free guide",
  title: "10 Salesforce problems that quietly cost mid-size companies",
  body: "How to spot each one, what it costs, and how to fix it.",
  cta: { label: "Read the guide", href: SF_GUIDE_ROUTE },
}

/** Hub copy (prototype screen 3). */
export const SF_GUIDE_INTRO = [
  "Most mid-size companies see three or four of these. Pick yours to start reading.",
]

/** The PDF, as described on the hub and the form page. */
export const SF_GUIDE_PDF = {
  name: "The Salesforce Guide",
  facts: "27 pages · 10 sections · PDF",
  audience: "For CEOs, sales heads and Salesforce owners in companies of 200–1,000 people.",
}

export const SF_GUIDE_PAGE: PageContent = {
  route: SF_GUIDE_ROUTE,
  crumbs: [
    { label: "Partners", href: "/partners" },
    { label: "Salesforce", href: "/partners/salesforce" },
  ],
  seoTitle: "10 Salesforce problems that quietly cost mid-size companies | Zoxima",
  seoDescription:
    "A free guide to the 10 Salesforce problems we fix most often: how to spot each one, what it costs, and how to fix it.",
  eyebrow: "Free guide",
  h1: "10 Salesforce problems that quietly cost mid-size companies",
  h1Accent: "quietly cost mid-size companies",
  sub: "How to spot each one, what it costs, and how to fix it.",
  heroCtas: [
    { label: "Get the full guide by email", href: `${SF_GUIDE_ROUTE}/get` },
  ],
  sections: [],
  closing: {
    h2: "Seeing a few of these in your Salesforce?",
    body: "Tell us which ones. We’ll tell you what we’d fix first, and what it would take.",
    ctas: [
      { label: "Talk to us", href: "/contact?topic=Salesforce&msg=guide" },
      { label: "Our Salesforce practice", href: "/partners/salesforce" },
    ],
  },
}
