/* --------------------------------------------------------------------------
   Real Zoxima content reused across pages, so thin pages carry more than the
   doc gave them. Nothing here is new copy: each block names where it comes
   from (the content doc or the live home page). Pages pick only the blocks
   that sit on their topic.
   -------------------------------------------------------------------------- */
import { CAPABILITY_PILLARS } from "@/lib/site/content/capabilities-industries"
import { CONTACT_EMAIL } from "@/lib/site/content/company"
import type { Section } from "@/lib/site/types"

/** Home §7 "Built and running at enterprise scale" — the figures as the live
 *  home page shows them (components/home/engineering-scale.tsx). */
export const SCALE_PROOF: Section = {
  kind: "proof",
  title: "Built and running at enterprise scale",
  items: [
    "90+ large enterprise projects",
    "25+ enterprise AI projects live",
    "4,000+ users on a single CRM rollout",
    "$20B+ in orders, collections and renewals managed",
    "50K+ AI voice calls every week",
  ],
}

/** Home §5 "Applications. Automations. AI." with the capability pillars. */
export const PILLARS_SECTION: Section = {
  kind: "list",
  title: "Applications. Automations. AI.",
  style: "cards",
  items: CAPABILITY_PILLARS.map((p) => ({
    title: p.title,
    body: p.body,
    href: p.href,
    linkLabel: p.cta,
    icon: p.title === "Applications" ? "apps" : p.title === "Automations" ? "flow" : "ai",
  })),
}

/** Home §8 "Work that runs every day" — the three home case cards. */
export const WORK_CASES: Section = {
  kind: "cases",
  title: "Work that runs every day",
  items: [
    { slug: "building-materials-partner-network", summary: "Sales systems and AI for a nationwide partner network." },
    {
      slug: "bottled-water-direct-store-delivery",
      summary: "Direct Store Delivery and a loyalty app for 2 million customers.",
    },
    {
      slug: "corporate-services-finance-operations",
      summary: "AI invoice processing, capex approvals and price intelligence.",
    },
  ],
}

/** Home §3 research strip, with its sources and closing line. */
export const RESEARCH_PROOF: Section = {
  kind: "proof",
  title: "What we drive for our customers",
  intro:
    "Most companies know this. The gap is doing it every week, for every invoice, every quote and every contract. That’s what we build.",
  items: [
    "43% of B2B invoices in the US are paid late",
    "8% more operating profit from a 1% better price",
    "2× the margin on service compared with new equipment",
  ],
  sources: [
    "Atradius Payment Practices Barometer, North America, 2025",
    "McKinsey, “The Power of Pricing”",
    "BCG, Aftermarket Services, 2025",
  ],
}

/** Home §4 "Built for how manufacturers sell and serve". */
export const COVERAGE_SECTION: Section = {
  kind: "stack",
  title: "Built for how manufacturers sell and serve",
  intro: "From the first enquiry to the last service visit.",
  groups: [
    {
      name: "Sales",
      items: [
        "Lead and enquiry management",
        "CRM and account management",
        "Pricing, quotes and CPQ",
        "Field sales",
        "Distributor and dealer management",
        "Schemes, incentives and loyalty",
        "Order management and Direct Store Delivery",
        "Order to invoice",
        "Collections and credit",
        "Sales reviews and forecasting",
      ],
    },
    {
      name: "Service",
      items: [
        "Service CRM and case management",
        "Field service",
        "Installed base and assets",
        "Service contracts and warranty",
        "Spare parts and service orders",
        "Customer support on voice, chat and email",
        "SLA and service performance",
      ],
    },
    {
      name: "Operations and finance",
      items: ["Invoice processing", "Approvals", "Reconciliation", "Commissions and payouts"],
    },
  ],
}

/** Home §6 "AI that works inside your business, not beside it". */
export const AI_INSIDE: Section = {
  kind: "list",
  title: "AI that works inside your business, not beside it",
  style: "rows",
  items: [
    {
      title: "Multi-agent systems",
      body: "Specialized agents for orders, collections, renewals and service, coordinating the work between them.",
    },
    { title: "MCP connections", body: "A standard, secure way for agents to reach your ERP, CRM, email and documents." },
    { title: "Grounded answers", body: "Retrieval over your own price lists, contracts and records, not guesses." },
    { title: "Human in the loop", body: "Every customer-facing action approved by your team." },
    { title: "Observable by design", body: "Every agent action logged and traceable." },
  ],
}

/** How our AI works: "Where it runs" and the FAQ. */
export const AI_WHERE_IT_RUNS: Section = {
  kind: "text",
  title: "Where it runs",
  body: ["In your Microsoft or cloud environment, with data residency respected. Your data is not used to train models."],
}

export const AI_FAQ: Section = {
  kind: "faq",
  title: "FAQ",
  items: [
    {
      q: "Does the AI act on its own?",
      a: "Only inside the rules you set. Anything that reaches a customer is approved by your team.",
    },
    { q: "Is our data used for training?", a: "No." },
    {
      q: "Which systems can it connect to?",
      a: "Common ERPs, CRMs, email, Teams and document stores, through standard connectors or the reports you already produce.",
    },
    { q: "Can we start small?", a: "Yes. Most customers start with one process and expand." },
  ],
}

/** Platforms page stack, for pages that talk about the work itself. */
export const PLATFORM_STACK: Section = {
  kind: "stack",
  title: "Built on the platforms you trust",
  groups: [
    {
      name: "Microsoft",
      items: [
        "Dynamics 365 Sales, Customer Service and Field Service",
        "Power Apps and Power Automate",
        "Copilot Studio",
        "Azure OpenAI and Azure AI Search",
      ],
    },
    { name: "Salesforce", items: ["Sales Cloud", "Service Cloud", "Experience Cloud", "CPQ", "Agentforce"] },
    {
      name: "AI and engineering stack",
      items: [
        "Agent frameworks such as LangGraph",
        "Leading models including Azure OpenAI and Claude",
        "Voice AI",
        "React, React Native, Flutter and Node.js",
      ],
    },
  ],
}

/** Partner work, from the official listings the home page cites
 *  (components/home/partners.tsx): Microsoft platforms, Salesforce clouds and
 *  the apps Zoxima lists on AppSource. */
export const PARTNER_STACK: Section = {
  kind: "stack",
  title: "Partners",
  groups: [
    {
      name: "Microsoft Solutions Partner",
      items: [
        "Dynamics 365 Sales",
        "Dynamics 365 Customer Service",
        "Dynamics 365 Field Service",
        "Power Apps",
        "Power Automate",
        "Power BI",
        "Copilot",
        "Azure AI",
      ],
    },
    {
      name: "Salesforce",
      items: ["Sales Cloud", "Service Cloud", "Experience Cloud", "CPQ", "Agentforce", "Marketing Cloud Account Engagement"],
    },
    {
      name: "Apps on Microsoft AppSource",
      items: ["Building Material App", "Field Sales", "Sales Team Application", "Inspection App", "Employee Onboarding"],
    },
  ],
}

const APPSOURCE = "https://appsource.microsoft.com/en-us/product"

/** Zoxima's AppSource apps, names and summaries as published there. */
export const APPSOURCE_APPS: Section = {
  kind: "list",
  title: "Apps on Microsoft AppSource",
  style: "cards",
  items: [
    {
      title: "Building Material App",
      body: "Visit planning, product catalog, offers and schemes, on-the-spot orders and an AI assistant for field teams.",
      href: `${APPSOURCE}/web-apps/zoximasolutuionspvtltd1654840932298.building_material_app`,
      external: true,
      linkLabel: "View on AppSource",
      icon: "mobile",
    },
    {
      title: "Field Sales",
      body: "Orders, visit planning, complaints, expenses and dashboards for sales teams in manufacturing and distribution.",
      href: `${APPSOURCE}/dynamics-365/zoximasolutuionspvtltd1654840932298.fieldsales`,
      external: true,
      linkLabel: "View on AppSource",
      icon: "truck",
    },
    {
      title: "Sales Team Application",
      body: "One app for trade, non-trade, quality and technical-service teams: orders, complaints, events and visits.",
      href: `${APPSOURCE}/dynamics-365/zoximasolutuionspvtltd1654840932298.sales_team_application`,
      external: true,
      linkLabel: "View on AppSource",
      icon: "crm",
    },
    {
      title: "Inspection App",
      body: "Digital inspection forms, scheduling, templates and reports, synced in real time.",
      href: `${APPSOURCE}/web-apps/zoximasolutuionspvtltd1654840932298.inspection_app`,
      external: true,
      linkLabel: "View on AppSource",
      icon: "approve",
    },
    {
      title: "Employee Onboarding",
      body: "Paperwork, training and first steps for new hires in one guided flow.",
      href: `${APPSOURCE}/dynamics-365/zoximasolutuionspvtltd1654840932298.employee_onboarding`,
      external: true,
      linkLabel: "View on AppSource",
      icon: "contract",
    },
  ],
}

/** About "Where we are". */
export const WHERE_WE_ARE: Section = {
  kind: "list",
  title: "Where we are",
  style: "rows",
  items: [
    { title: "Headquarters", body: "Fremont, California" },
    { title: "Global Delivery Center", body: "engineering and delivery teams supporting customers worldwide" },
  ],
}

/** Industries overview cards, linking to each industry. */
export const INDUSTRY_CARDS: Section = {
  kind: "list",
  title: "Deep in manufacturing. Proven beyond it.",
  style: "cards",
  items: [
    { title: "Manufacturing", body: "Distributors, projects, field teams and service contracts.", href: "/industries/manufacturing" },
    {
      title: "Appliances manufacturing",
      body: "Channel sales, installation, warranty and service at scale.",
      href: "/industries/appliances-manufacturing",
    },
    {
      title: "Building materials",
      body: "Partner networks, schemes, credit and project sales.",
      href: "/industries/building-materials",
    },
    { title: "Consumer goods", body: "Direct Store Delivery, distributors, schemes and loyalty.", href: "/industries/consumer-goods" },
    { title: "Education", body: "Admissions, counseling and placements.", href: "/industries/education" },
    {
      title: "Digital natives",
      body: "Inside sales, customer success, renewals and support.",
      href: "/industries/digital-natives",
    },
  ],
}

export const APPLY_SECTION: Section = { kind: "text", title: "Apply", body: [CONTACT_EMAIL] }
