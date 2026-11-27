import type { PageContent } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   Free guide: "10 Salesforce Problems That Cost Mid-Size Companies"
   (/partners/salesforce/guide, a hub plus one page per section). The full
   guide is a PDF sent by email; each problem page shows the problem (picture,
   story, one sourced fact, the signs) and an inline form for the PDF.

   The same ten problems are the cards on /partners/salesforce ("What we fix")
   and on the hub; each card opens /partners/salesforce/guide/<id>. The guide
   band (home Salesforce section and the Salesforce page) uses SF_GUIDE_BAND.
   -------------------------------------------------------------------------- */

export const SF_GUIDE_ROUTE = "/partners/salesforce/guide"

export type GuideProblem = {
  /** URL slug of the problem page: /partners/salesforce/guide/<id>. */
  id: string
  /** Problem number in the guide (1–10). */
  n: number
  /** Section title (as in the PDF, the request form and the emails). */
  title: string
  /** Short card title (hub cards, image alt). */
  cardTitle: string
  /** One-line teaser for the problem cards. */
  short: string
  /** Tagline beside "Problem N of 10" (shown uppercase). */
  tag: string
  /** The problem page's H1; h1Accent is the part of it shown in red. */
  h1: string
  h1Accent: string
  /** The line under the H1 (same message as the problem's ad). */
  body: string
  /** The problem's picture, with its real size so it shows whole. */
  image: { src: string; width: number; height: number }
  /** The opening story (drop-cap paragraph). */
  open: string
  /** The sourced fact: the big number, its text, and the source
   *  (sourceTitle, if any, is the part of source set in italics). */
  num: string
  numText: string
  source: string
  sourceTitle?: string
  /** "Sound familiar?" signs. */
  signs: string[]
  /** What the free guide covers for this problem. */
  inside: string[]
  /** "What it costs the business" (SEO description, llms-full.txt). */
  cost: string
  /** Page in the PDF where this problem starts (problem page, guide email). */
  page: number
}

/* The ten problems, word for word from Zoxima's guide prototype (Nov 2026):
   SECTIONS (title, open, cost), SHORT, PAGES and BRIEFS (the rest). The
   answers (causes, fixes, upkeep) are only in the emailed PDF. */
export const SF_GUIDE_PROBLEMS: GuideProblem[] = [
  {
    id: "reports-nobody-trusts",
    n: 1,
    title: "Reports nobody trusts",
    cardTitle: "Reports nobody trusts",
    short: "Reviews start with \"that number can't be right\"",
    tag: "When reports and reality don’t match",
    h1: "Do your Salesforce reports tell the truth?",
    h1Accent: "tell the truth?",
    body: "Wrong filters, stale deals and messy data mean leadership plans on numbers that aren’t real.",
    image: { src: "/guides/problems/problem-1.jpg", width: 1200, height: 470 },
    open: "The pipeline review starts, the dashboard goes on screen, and within two minutes someone says \"that number can't be right.\" The rest of the meeting is spent arguing about the data instead of the deals. Soon leaders stop opening Salesforce reports and ask for spreadsheets instead, and the company is back to managing on gut feel.",
    num: "91%",
    numText: "say the CRM data behind key decisions is inaccurate at least sometimes",
    source: "Validity, The State of CRM Data Health in 2022. Survey of 1,240+ CRM users in the US, UK and Australia.",
    sourceTitle: "The State of CRM Data Health in 2022",
    signs: [
      "Leaders ask for a spreadsheet instead of opening the dashboard.",
      "Two reports that should match show different totals.",
      "Reports still filter on last year's regions, products or dates.",
    ],
    inside: [
      "The four reasons reports drift away from reality, and the one most teams miss",
      "A fix you can start this week, and the change that keeps the numbers right",
      "The short upkeep routine your admin can own",
      "Three checks that tell you the numbers can be trusted again",
    ],
    cost: "When reports aren't trusted, forecasts become guesses and decisions slow down. Managers spend hours each week rebuilding numbers in Excel. Worse, wrong numbers that look right lead to wrong calls on hiring, inventory and targets. The return from fixing reports is quick and easy to see: fewer side spreadsheets, shorter reviews and a forecast leadership can act on.",
    page: 3,
  },
  {
    id: "messy-data",
    n: 2,
    title: "Messy data",
    cardTitle: "Messy data",
    short: "You find three records for one customer",
    tag: "The duplicate data problem",
    h1: "A broken view of your customers in Salesforce?",
    h1Accent: "your customers",
    body: "Messy data means a wrong view of customers, an inflated pipeline and reports you can’t trust.",
    image: { src: "/guides/problems/problem-2.jpg", width: 1200, height: 458 },
    open: "A rep searches for a customer and finds three versions of the same account. Another opens a deal that was due to close six months ago and is still marked \"open.\" Marketing sends an email to a contact who left the company last year. Everyone knows the data is messy, so nobody fully trusts it, and nobody wants to be the one who cleans it.",
    num: "44%",
    numText: "estimate their company loses more than 10% of annual revenue to poor-quality CRM data",
    source: "Validity, The State of CRM Data Health in 2022. Survey of 1,240+ CRM users in the US, UK and Australia.",
    sourceTitle: "The State of CRM Data Health in 2022",
    signs: [
      "Searching for a customer returns two or three versions.",
      "Open deals still show close dates months in the past.",
      "Accounts are still owned by people who left.",
    ],
    inside: [
      "The five data problems found in almost every Salesforce org, and where they really come from",
      "How to clean up without losing anything, and why the order matters",
      "The rules that stop the mess coming back",
      "Three signs your data is clean for good",
    ],
    cost: "Messy data wastes selling time, inflates the pipeline and makes every report from Section 1 unreliable. Duplicates mean two reps chase the same customer, or the customer gets mixed messages. Stale deals make the forecast look healthier than it is. Bad data is also the biggest single reason AI projects fail to deliver, as covered in Section 4. Cleaning it up gives a quick return in time saved and a more honest forecast.",
    page: 5,
  },
  {
    id: "salesforce-extra-work",
    n: 3,
    title: "When Salesforce feels like extra work",
    cardTitle: "When Salesforce feels like extra work",
    short: "Reps update it on Friday afternoon because they have to",
    tag: "Built around how your team sells",
    h1: "Does Salesforce feel like extra work for your sales team?",
    h1Accent: "extra work",
    body: "Too many fields, little in return and no refresher training mean updates happen late, or not at all.",
    image: { src: "/guides/problems/problem-3.jpg", width: 1200, height: 541 },
    open: "Reps keep their real notes in a notebook, a spreadsheet or their head, and update Salesforce on Friday afternoon because they have to. Managers chase updates before every review. It is tempting to call this a discipline problem, but usually it isn't. When people avoid a system, the system is usually asking too much of them and giving too little back.",
    num: "<30%",
    numText: "of reps' time is spent actually selling",
    source: "Salesforce, State of Sales, 5th edition. 7,775 sales professionals worldwide, surveyed Aug–Sep 2022.",
    sourceTitle: "State of Sales",
    signs: [
      "Reps update Salesforce on Friday afternoon because they have to.",
      "Managers run reviews from spreadsheets or slides.",
      "Screens show dozens of fields reps never fill.",
    ],
    inside: [
      "Five reasons reps avoid Salesforce, and none of them is laziness",
      "The changes that make reps want to keep it up to date",
      "Why where you run pipeline reviews matters more than more training",
      "How you'll know adoption has really changed",
    ],
    cost: "Low adoption means the company is paying for licenses that hold only half the story. Pipeline data is late and patchy, coaching is based on guesswork, and when a rep leaves, their customer knowledge leaves with them. Better adoption pays back through better forecasts, faster onboarding of new reps and customer history that stays with the company.",
    page: 7,
  },
  {
    id: "ai-readiness",
    n: 4,
    title: "AI readiness",
    cardTitle: "Not ready for AI",
    short: "AI answers come back vague or wrong",
    tag: "Get the basics right before you switch it on",
    h1: "Is your Salesforce data ready for AI?",
    h1Accent: "ready for AI?",
    body: "AI only knows what Salesforce knows. Messy data, unclear goals and disconnected systems are why many AI projects stall.",
    image: { src: "/guides/problems/problem-4.jpg", width: 1200, height: 485 },
    open: "Every board is asking \"what are we doing with AI?\" Salesforce now offers Agentforce and Einstein features, and the pressure to switch something on is high. But many companies that try AI on top of their CRM get answers that are vague, wrong or ignored. The problem is rarely the AI. It is what the AI has to work with, and whether anyone was clear about what it should do.",
    num: "40%+",
    numText: "of agentic AI projects expected to be canceled by the end of 2027",
    source: "Gartner press release, 25 June 2025, citing escalating costs, unclear business value or inadequate risk controls. Based on a Gartner poll of 3,412 webinar attendees, January 2025.",
    signs: [
      "Leadership asks \"what are we doing with AI?\" with no clear use case.",
      "Key records are duplicated or incomplete.",
      "Orders and invoices sit outside Salesforce.",
    ],
    inside: [
      "The five reasons AI projects on CRM stall",
      "How to pick a first use case that pays back",
      "What to fix before you switch anything on",
      "How to tell whether your pilot actually worked",
    ],
    cost: "A failed AI project costs license fees, partner time and, most of all, credibility. After one bad attempt, it becomes much harder to get support for the next one. Gartner predicted in June 2025 that over 40% of agentic AI projects will be canceled by the end of 2027, citing escalating costs, unclear business value or inadequate risk controls (Gartner press release, 25 June 2025; based on a Gartner poll of 3,412 webinar attendees in January 2025). Getting ready first means the money spent on AI produces results people use.",
    page: 9,
  },
  {
    id: "automation-that-isnt",
    n: 5,
    title: "The work you thought was automatic, isn't",
    cardTitle: "Automations that quietly fail",
    short: "Alerts go to people who left; approvals sit for days",
    tag: "Move them to Flow before something breaks",
    h1: "Are your approvals, renewals and follow-ups running on tools Salesforce no longer supports?",
    h1Accent: "Salesforce no longer supports?",
    body: "Many automations still run on retired tools. If one breaks, Salesforce won’t fix it, and you may only notice when a renewal is missed.",
    image: { src: "/guides/problems/problem-5.jpg", width: 1200, height: 483 },
    open: "Somewhere in your Salesforce there are automations that were set up years ago: an alert when a big deal is created, a task when a lead comes in, an approval for discounts. Most people assume they still work. Some do. Some fire at the wrong time, some do nothing, and some cause odd behavior that people have learned to work around without knowing why.",
    num: "31 Dec 2025",
    numText: "Salesforce ended support for Workflow Rules and Process Builder. Old automations may still run, but Salesforce no longer fixes them if they break.",
    source: "Salesforce Help: Workflow Rules and Process Builder end of support.",
    signs: [
      "Alerts go to people who left the company.",
      "Discount approvals sit for days.",
      "Fields change on their own, or records save slowly.",
    ],
    inside: [
      "What to check now that Workflow Rules and Process Builder are unsupported",
      "Why approvals are often the slowest step in a deal, and how to speed them up",
      "Why much of your \"AI\" wish list may already be possible with plain automation",
      "Three checks that your automations are safe",
    ],
    cost: "Broken or outdated automation means missed follow-ups, slow approvals and manual work that people thought was handled. There is also a growing risk. Salesforce ended support for Workflow Rules and Process Builder on 31 December 2025 (Salesforce Help, \"Workflow Rules and Process Builder end of support\"). Existing automations built with these tools may still run, but Salesforce no longer fixes bugs in them, so if one breaks there is no safety net. Moving them to Flow now is cheaper than repairing a failure later.",
    page: 11,
  },
  {
    id: "data-silos",
    n: 6,
    title: "Sales data still lives in silos",
    cardTitle: "Sales data in silos",
    short: "Reps check the ERP or call finance to answer a customer",
    tag: "Connect what matters first, the rest step by step",
    h1: "Is your sales data still in silos outside Salesforce?",
    h1Accent: "outside Salesforce?",
    body: "Scattered data costs your team time, embarrasses you in front of customers and leaves leaders deciding on half the picture.",
    image: { src: "/guides/problems/problem-6.jpg", width: 1200, height: 464 },
    open: "A customer calls about a late order. The rep opens Salesforce and sees the account, but not the order, the invoice or the open support case. They switch to the ERP, then email, then a shared drive, and still have to call someone in finance. The customer waits, and the rep looks like they don't know their own account.",
    num: "2%",
    numText: "of IT leaders say more than half of their company's apps are integrated. The average company runs 897 apps.",
    source: "MuleSoft, 2025 Connectivity Benchmark Report. Interviews with 1,050 IT leaders worldwide.",
    sourceTitle: "2025 Connectivity Benchmark Report",
    signs: [
      "Reps check the ERP or call finance to answer order questions.",
      "Email and calendars live outside Salesforce.",
      "Signed orders are re-keyed into the ERP.",
    ],
    inside: [
      "Where sales data usually gets stuck, and what it costs in front of customers",
      "The quick connections reps notice in the first week",
      "When ERP integration is worth it, and what to decide first",
      "How you'll know the silos are gone",
    ],
    cost: "When systems don't talk to each other, reps waste time switching screens and asking colleagues for information. Worse, they walk into conversations missing key facts: an overdue invoice, an open complaint, or a big order placed last week. Connecting the right systems saves time every day and avoids awkward, costly moments with customers.",
    page: 13,
  },
  {
    id: "one-customer-view",
    n: 7,
    title: "Bring every customer's story into one clear view",
    cardTitle: "No clear customer view",
    short: "Reps ask three people for an update before a meeting",
    tag: "Bring in what sits in your ERP, email, chat and shared files",
    h1: "Bring every customer’s story into one clear view in Salesforce.",
    h1Accent: "one clear view",
    body: "Limited time, too much to read and too many places to look mean reps walk into conversations half-prepared.",
    image: { src: "/guides/problems/problem-7.jpg", width: 1200, height: 457 },
    open: "Before a customer meeting, a rep has fifteen minutes. The account record has dozens of related lists, the email history is somewhere else, the orders are in the ERP, and the last meeting notes are in a notebook. There is too much to read, spread across too many places, in too little time. So the rep goes in with half the picture.",
    num: "10",
    numText: "tools, on average, used by sales teams to close deals",
    source: "Salesforce, State of Sales, 5th edition. 7,775 sales professionals worldwide, surveyed Aug–Sep 2022.",
    sourceTitle: "State of Sales",
    signs: [
      "Reps ask three people for an update before a meeting.",
      "Account pages are long, with key facts buried.",
      "Open issues or overdue invoices surprise the rep in the meeting.",
    ],
    inside: [
      "What a useful customer view shows, and what it leaves out",
      "A broken view and a complete one, side by side",
      "How to build it in phases, starting with data you already have",
      "How you'll know reps are actually using it",
    ],
    cost: "Without a clear customer view, reps miss cross-sell chances, repeat questions the customer already answered, and miss warning signs such as falling orders or an unresolved complaint. Managers can't quickly see the health of key accounts. A good customer view makes every conversation better prepared and helps protect and grow the most valuable accounts.",
    page: 15,
  },
  {
    id: "cold-leads",
    n: 8,
    title: "Leads that go cold waiting for action",
    cardTitle: "Leads that go cold",
    short: "Web leads wait a day or more for a first call",
    tag: "Let Salesforce remind your team before leads go cold",
    h1: "Are good leads going cold in your Salesforce?",
    h1Accent: "going cold",
    body: "At every stage, business is lost not to better competitors, but to waiting.",
    image: { src: "/guides/problems/problem-8.jpg", width: 1200, height: 535 },
    open: "A lot of business is lost not to competitors, but to waiting. A buyer fills in a form, then waits a day, two days, a week to hear back. By then they have spoken to someone else, or the need has passed. Deals that were moving stall at the same stage for weeks. And when a buyer goes quiet, many teams simply stop trying.",
    num: "7×",
    numText: "Leads contacted within an hour were nearly seven times as likely to qualify as leads contacted later",
    source: "Harvard Business Review, The Short Life of Online Sales Leads, March 2011. Audit of 2,241 US companies.",
    sourceTitle: "The Short Life of Online Sales Leads",
    signs: [
      "New web leads wait a day or more for a first call.",
      "Leads sit in a shared queue with no owner.",
      "Deals stay at the same stage for weeks with no next step.",
    ],
    inside: [
      "The three points where leads and deals go cold",
      "How to decide what \"fast\" means for your business",
      "What to do when a buyer goes quiet (it isn't more chasing)",
      "How you'll know follow-up has improved",
    ],
    cost: "Speed matters a great deal in the first response. A widely cited Harvard Business Review study (Oldroyd, McElheran and Elkington, \"The Short Life of Online Sales Leads\", March 2011) audited 2,241 US companies and found that firms that contacted a web lead within an hour were nearly seven times as likely to qualify it as those that waited even an hour longer. Every lead that goes cold is marketing money already spent with no return.",
    page: 17,
  },
  {
    id: "mobile-field-reps",
    n: 9,
    title: "Mobile for field reps",
    cardTitle: "Field reps can't work on mobile",
    short: "Visit notes get typed up at night",
    tag: "Quick updates on the phone, no laptop work in the evening",
    h1: "Do your field reps love using the Salesforce mobile app?",
    h1Accent: "love using",
    body: "The phone should brief reps before every meeting and capture notes after it.",
    image: { src: "/guides/problems/problem-9.jpg", width: 1200, height: 452 },
    open: "A field rep finishes a customer visit, gets back in the car and drives to the next one. They mean to update Salesforce, but the mobile app shows a page built for a desktop screen. So they try to remember the details and type them up on a laptop in the evening. By then half the detail is gone, and the evening goes to clerical work instead of rest.",
    num: "Free",
    numText: "Phone keyboard dictation lets reps speak visit notes into the Salesforce mobile app at no extra cost.",
    source: "Built into iPhone and Android keyboards; works in text fields of the Salesforce mobile app.",
    signs: [
      "Visit notes are typed up in the evening on a laptop.",
      "The mobile app shows desktop-size pages.",
      "Visit updates arrive days after the visit.",
    ],
    inside: [
      "The mobile features most companies never switch on",
      "How to make logging a visit take seconds",
      "How reps keep working where the signal is weak",
      "How you'll know field reps have moved to mobile",
    ],
    cost: "When updating on the phone is hard, visit notes arrive late, thin or not at all. Managers can't see what happened in the field until days later, and follow-ups get missed. Reps lose evening hours to admin. Making mobile easy gives back rep time and gives the business same-day field information.",
    page: 19,
  },
  {
    id: "daily-actions",
    n: 10,
    title: "The daily actions that make the business",
    cardTitle: "Daily actions never logged",
    short: "Deals show no activity for weeks",
    tag: "Easy on reps, informative for managers",
    h1: "The daily actions that make the business, captured in Salesforce.",
    h1Accent: "captured in Salesforce.",
    body: "When daily actions reach Salesforce on their own, reps keep a diary of every deal, managers coach with facts and nothing gets lost.",
    image: { src: "/guides/problems/problem-10.jpg", width: 1200, height: 470 },
    open: "Calls, emails, meetings and site visits are the real work of selling. Yet in most companies only a fraction of them ever reach Salesforce. It is easy to assume reps don't want to log their work. Usually that is not true. Logging is simply hard: it takes time, it is spread across tools, and it gives the rep nothing back.",
    num: "70%",
    numText: "of reps' time goes to non-selling tasks such as admin and meeting prep",
    source: "Salesforce, State of Sales, 6th edition. 5,500 sales professionals across 27 countries.",
    sourceTitle: "State of Sales",
    signs: [
      "Open deals show no activity for weeks.",
      "Calls and emails live in phones and inboxes.",
      "Managers chase reps for updates before every review.",
    ],
    inside: [
      "Why reps really don't log activity, seen from their side",
      "The one change that captures around half of all activity on its own",
      "Five changes that make capture a win for reps and managers",
      "How you'll know activity is being captured",
    ],
    cost: "Management loses sight of what is really happening, so coaching and forecasting are based on partial information. Deals suffer because when a rep is away or leaves, nobody knows the last conversation. And the rep suffers too: their effort is invisible, they get chased for updates, and they can't easily look back at their own history with a customer.",
    page: 21,
  },
]

/** The band that points to the guide (home Salesforce section, Salesforce page). */
export const SF_GUIDE_BAND = {
  eyebrow: "Free guide",
  title: "10 Salesforce problems that cost mid-size companies",
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
  facts: "25 pages · 10 sections · PDF",
  audience: "For CEOs, sales heads and Salesforce owners in companies of 200–1,000 people.",
}

export const SF_GUIDE_PAGE: PageContent = {
  route: SF_GUIDE_ROUTE,
  crumbs: [
    { label: "Salesforce", href: "/partners/salesforce" },
  ],
  seoTitle: "10 Salesforce problems that cost mid-size companies | Zoxima",
  seoDescription:
    "A free guide to the 10 Salesforce problems we fix most often: how to spot each one, what it costs, and how to fix it.",
  eyebrow: "Free guide",
  // The hub H1 matches the PDF cover and the prototype.
  h1: "10 Salesforce problems that cost mid-size companies",
  h1Accent: "cost mid-size companies",
  sub: "How to spot each one, what it costs, and how to fix it.",
  heroCtas: [
    { label: "Get the full guide by email", href: `${SF_GUIDE_ROUTE}/get` },
    { label: "Browse the 10 problems", href: "#problems" },
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
