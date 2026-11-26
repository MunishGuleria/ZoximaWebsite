// Solutions pages: copy transcribed verbatim from Zoxima_Website_Content_v2.docx.
import { type PageContent, STANDARD_CLOSING, SALEZX_PANEL, SALEZX_URL } from "@/lib/site/types"

const crumbs = [{ label: "Solutions", href: "/solutions" }]

export const SOLUTION_PAGES: PageContent[] = [
  {
    route: "/solutions/lead-to-quote",
    crumbs,
    seoTitle: "Lead to quote | Zoxima",
    seoDescription: "Every lead and quote followed to a decision.",
    eyebrow: "Solutions",
    h1: "Every lead and quote followed to a decision",
    h1Accent: "a decision",
    sub: "Every enquiry owned, every follow-up planned, and run until won or lost.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Enquiries from forms, mailboxes, trade shows and calls that never get an owner." },
          { body: "Quotes that go quiet after they are sent." },
          { body: "Follow-ups that depend on someone remembering." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "Every enquiry captured from every source and assigned within the hour." },
          { body: "A follow-up plan agreed with each rep every week." },
          { body: "Quotes followed on a clock until won or lost." },
          { body: "Replies read and routed, so no customer waits." },
          { body: "Managers see every lead, its owner and its status." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Lead and enquiry management in your CRM, with mobile access for the field.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "Routing, follow-up timers and reminders.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "Agents that read enquiries and replies, draft follow-ups and flag customers who are waiting.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "marketplace-sales-service-crm",
            summary: "A digital-native company — sales CRM for 4,000+ users.",
          },
          {
            slug: "business-schools-admissions-ai",
            summary: "Leading business schools — enquiry-to-admission agents.",
          },
        ],
      },
      SALEZX_PANEL,
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/solutions/pricing",
    crumbs,
    seoTitle: "Pricing and quotes | Zoxima",
    seoDescription: "The right price, every time, and quotes out fast.",
    eyebrow: "Solutions",
    h1: "The right price, every time",
    h1Accent: "every time",
    sub: "Discounts based on what actually wins, quotes out fast, and approvals without chasing.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Discounts given to close when less would have won." },
          { body: "Quotes that take days to build from spreadsheets." },
          { body: "Approvals waiting in someone’s inbox." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "A recommended discount with its reasons, based on your win history." },
          { body: "Quotes built from your price lists, rate cards and past quotes." },
          { body: "Approvals routed by your limits." },
          { body: "Every revision tracked to a decision." },
          { body: "Margin visible to managers." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Pricing and quote (CPQ) apps on your CRM.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "Approval workflows by discount, value and customer.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "AI pricing guidance and quote drafting from your documents.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "technology-promotional-pricing",
            summary: "A $7B+ global technology company — CRM promotional pricing.",
          },
        ],
      },
      SALEZX_PANEL,
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/solutions/order-to-invoice",
    crumbs,
    seoTitle: "Order to invoice | Zoxima",
    seoDescription: "Orders delivered and billed without delays, including Direct Store Delivery.",
    eyebrow: "Solutions",
    h1: "Orders delivered and billed without delays",
    h1Accent: "without delays",
    sub: "Every order tracked from booking to invoice, with exceptions sent to the person who can fix them.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Orders stuck on credit, stock, missing purchase orders or paperwork." },
          { body: "Customers who find out about a delay before the rep does." },
          { body: "Invoices that do not match the order." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "Every booked order checked each day: committed, dispatched, invoiced." },
          { body: "Stuck orders sent to the person who can release them." },
          { body: "Reps and customers kept informed at each step." },
          { body: "Invoices checked against the order before they go out." },
          { body: "Direct Store Delivery routes, loads, deliveries and cash in one flow." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Order management and Direct Store Delivery apps.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "Order-to-invoice workflows and exception routing across ERP and CRM.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "Agents that track exceptions and draft customer updates.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "bottled-water-direct-store-delivery",
            summary:
              "A bottled-water company shipping ~10 million liters a day — Direct Store Delivery solution.",
          },
        ],
      },
      SALEZX_PANEL,
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/solutions/collections",
    crumbs,
    seoTitle: "Collections and credit | Zoxima",
    seoDescription: "Cash collected on time, with credit risk flagged early.",
    eyebrow: "Solutions",
    h1: "Cash collected on time",
    h1Accent: "on time",
    sub: "Every invoice owned, every payment commitment checked, and risks flagged before an order is held.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Payments chased at month-end instead of before they are due." },
          { body: "Customer promises that no one checks." },
          { body: "Orders held on credit while the customer waits." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "A weekly collections list for every owner, from your ERP, by due date and aging." },
          { body: "One action for every invoice: an email, a call or a visit." },
          { body: "Reminders sent once your team approves them." },
          { body: "Payment commitments recorded and checked on the day." },
          { body: "Customers close to their credit limit flagged before an order is held." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Collections trackers and management views.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "Weekly cycles, reminders and escalations.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "Agents that read customer replies, record commitments and flag risk.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "corporate-services-finance-operations",
            summary: "A Fortune 500 corporate services company — finance operations automation.",
          },
          {
            slug: "healthcare-invoice-validation",
            summary: "A leading hospital network — invoice validation and payout tracking.",
          },
        ],
      },
      SALEZX_PANEL,
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/solutions/service-renewals",
    crumbs,
    seoTitle: "Service contract renewals | Zoxima",
    seoDescription: "Service contracts renewed before they lapse.",
    eyebrow: "Solutions",
    h1: "Service contracts renewed before they lapse",
    h1Accent: "before they lapse",
    sub: "Every renewal owned and tracked to a decision.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Renewals that reach the customer after the contract has ended." },
          { body: "Contracts with no owner." },
          { body: "Third-party service providers who call first." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "Every contract due in the next 30, 60 and 90 days, with an owner." },
          { body: "Planned actions for every contract: email, call or visit." },
          { body: "Renewal emails from your templates, sent once approved." },
          { body: "Every decision recorded, with the reason for any loss." },
          { body: "Escalation before any contract lapses." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Service and contract management apps.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "Renewal workflows and escalations.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "Agents that read contract registers and customer replies.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "electrical-products-leadership-ai",
            summary:
              "A $900M wires and cables maker — service and loyalty data joined for leadership.",
          },
        ],
      },
      SALEZX_PANEL,
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/solutions/sales-productivity",
    crumbs,
    seoTitle: "Sales productivity | Zoxima",
    seoDescription: "Every rep prepared for every customer.",
    eyebrow: "Solutions",
    h1: "Every rep prepared for every customer",
    h1Accent: "every customer",
    sub: "A brief before every meeting, and one note after it updates everything.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Reps who walk into meetings knowing only what is in the CRM." },
          { body: "Evenings spent typing notes." },
          { body: "Promises made in meetings that no one tracks." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "A brief before every meeting from CRM, ERP, email and service records." },
          { body: "Answers in the meeting: last price, stock, order and payment status." },
          { body: "One note after the meeting updates the CRM, sets tasks and drafts the follow-up." },
          { body: "Every promise becomes a task with a date." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Field sales apps and CRM.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "CRM updates, task creation and follow-up drafts.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "Sales assistants and meeting briefs grounded in your data.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "marketplace-sales-service-crm",
            summary: "A digital-native company — CRM for 4,000+ users.",
          },
          {
            slug: "conglomerate-approvals-sales-targets",
            summary: "A diversified conglomerate — sales target automation.",
          },
        ],
      },
      SALEZX_PANEL,
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/solutions/sales-reviews",
    crumbs,
    seoTitle: "Sales reviews and performance | Zoxima",
    seoDescription: "Reviews that end in actions that get done.",
    eyebrow: "Solutions",
    h1: "Reviews that end in actions",
    h1Accent: "in actions",
    sub: "Live numbers in the room, and decisions turned into actions that get done.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Review meetings spent collecting numbers." },
          { body: "Decisions made but not followed up." },
          { body: "Leaders who see problems after the month has closed." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "A pre-read before every review, from all your systems." },
          { body: "Live answers during the review." },
          { body: "Decisions turned into actions with owners and dates." },
          { body: "Actions chased all week." },
          { body: "Morning briefs for leadership on the numbers that matter." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Review dashboards and leadership views.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "Action tracking and follow-up.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "Executive briefs and nudges.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "electrical-products-leadership-ai",
            summary:
              "A $900M wires and cables maker — morning briefs and alerts for leadership.",
          },
        ],
      },
      SALEZX_PANEL,
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/solutions/field-service",
    crumbs,
    seoTitle: "Field service and customer support | Zoxima",
    seoDescription: "Service jobs, cases and support across voice, chat and email.",
    eyebrow: "Solutions",
    h1: "Service that keeps customers",
    h1Accent: "keeps customers",
    sub: "Every service request owned, every job closed on time, every customer answered.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Service calls that miss their SLA." },
          { body: "Technicians without the history they need." },
          { body: "Support queues that grow faster than the team." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "Every case and job captured, assigned and tracked to closure." },
          { body: "Technicians with customer, asset and history on mobile." },
          { body: "Spare parts and service orders linked to the job." },
          { body: "Customers answered on voice, chat and email." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Service CRM and field service apps.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "Case routing, SLA tracking and escalation.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "Voice and chat agents, and case triage.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "visa-services-voice-ai",
            summary:
              "A global visa and consular services company — voice AI for queries and add-on services.",
          },
          {
            slug: "postal-case-tagging-ai",
            summary: "A national postal and logistics operator — AI that reads every enquiry and tags the case.",
          },
        ],
      },
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/solutions/distributor-channel",
    crumbs,
    seoTitle: "Distributors, schemes and loyalty | Zoxima",
    seoDescription: "Partner onboarding, schemes, incentives and loyalty at scale.",
    eyebrow: "Solutions",
    h1: "A channel that sells for you",
    h1Accent: "sells for you",
    sub: "Partner onboarding, schemes, incentives and loyalty, run on one system.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Partner onboarding that takes weeks." },
          { body: "Schemes calculated by hand and paid late." },
          { body: "Loyalty programs that are hard to run at scale." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "Partners onboarded with documents checked and approvals routed." },
          { body: "Schemes defined once, calculated automatically and paid on proof." },
          { body: "Partner portals for orders, claims and statements." },
          { body: "Loyalty programs for retailers and consumers." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Partner portals, onboarding and loyalty apps.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "Scheme calculations, claims and payouts.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "Partner intelligence and agents that answer partners.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "building-materials-partner-network",
            summary:
              "A $9B building materials manufacturer — partner onboarding and intelligence.",
          },
          {
            slug: "bottled-water-direct-store-delivery",
            summary: "A bottled-water company — loyalty app for 2 million customers.",
          },
        ],
      },
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/solutions/finance-operations",
    crumbs,
    seoTitle: "Operations and finance AI | Zoxima",
    seoDescription: "Invoice processing, approvals, reconciliation, commissions and payouts.",
    eyebrow: "Solutions",
    h1: "Finance operations that run themselves",
    h1Accent: "run themselves",
    sub: "Invoices, approvals, reconciliation and payouts, handled by agents and checked by people.",
    sections: [
      {
        kind: "list",
        title: "Where it slips today",
        style: "rows",
        items: [
          { body: "Invoices checked by hand against several systems." },
          { body: "Approvals waiting in inboxes." },
          { body: "Commissions calculated in spreadsheets." },
        ],
      },
      {
        kind: "list",
        title: "How we drive it",
        style: "checks",
        items: [
          { body: "Invoices read, matched and validated across ERP, CRM and documents." },
          { body: "Capex and spend approvals routed and tracked." },
          { body: "Commissions calculated and payouts tracked." },
          { body: "Exceptions sent to the right person." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Applications",
            body: "Finance and approval apps.",
            href: "/capabilities/applications",
          },
          {
            title: "Automations",
            body: "Approval and reconciliation workflows.",
            href: "/capabilities/automations",
          },
          {
            title: "AI",
            body: "Document intelligence and finance operations agents.",
            href: "/capabilities/ai",
          },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "corporate-services-finance-operations",
            summary:
              "A Fortune 500 corporate services company — AI invoice processing and capex approvals.",
          },
          {
            slug: "healthcare-invoice-validation",
            summary:
              "A leading hospital network — invoice validation, commissions and payouts.",
          },
        ],
      },
    ],
    closing: STANDARD_CLOSING,
  },
]

/** Page names for the overview, in doc order (the H1 heading of each solution). */
export const SOLUTION_NAMES = [
  "Lead to quote",
  "Pricing and quotes",
  "Order to invoice",
  "Collections and credit",
  "Service contract renewals",
  "Sales productivity",
  "Sales reviews and performance",
  "Field service and customer support",
  "Distributors, schemes and loyalty",
  "Operations and finance AI",
]

// /solutions shows all ten solutions on one page behind a filter
// (components/solutions/explorer.tsx); the hero reuses the doc's Home §3
// heading and intro, so there are no overview-only sections.
export const SOLUTIONS_OVERVIEW: PageContent = {
  route: "/solutions",
  seoTitle: "Sales operations solutions, lead to cash | Zoxima",
  seoDescription:
    "Great sales operations is the difference: leads, pricing, orders, collections, renewals, productivity, reviews, service, channel and finance operations.",
  h1: "Great sales operations is the difference.",
  h1Accent: "difference.",
  sub: "Sales operations is where every customer hears from you on time, every order and payment is tracked until it’s done, and nothing waits on someone’s memory. We build the systems that make that happen.",
  sections: [],
  closing: STANDARD_CLOSING,
}
