// Capabilities and Industries copy, transcribed verbatim from Zoxima_Website_Content_v2.docx.
import { type PageContent, STANDARD_CLOSING, SALEZX_PANEL, SALEZX_URL } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   Capabilities
   -------------------------------------------------------------------------- */

// Capabilities pages: copy verbatim from Zoxima_Website_Content_v2.docx
// (Capabilities overview, Applications, Automations, AI, How our AI works,
// Platforms). Nothing added: no eyebrows, no invented section titles.
// The overview's three pillars render as the home page's expanding panels
// (app/capabilities/page.tsx), so only "How we deliver" is a section here.
export const CAPABILITY_PILLARS = [
  {
    title: "Applications",
    body: "The enterprise apps your teams use every day: CRM, field sales and service, partner portals, Direct Store Delivery and loyalty.",
    cta: "Explore applications",
    href: "/capabilities/applications",
  },
  {
    title: "Automations",
    body: "Workflows that move work between people and systems: approvals, order to invoice, collections, renewals, schemes and integration.",
    cta: "Explore automations",
    href: "/capabilities/automations",
  },
  {
    title: "AI",
    body: "Agents that read, decide and act inside your processes: sales, service, voice, documents, finance operations and executive briefs.",
    cta: "Explore AI",
    href: "/capabilities/ai",
  },
]

export const CAPABILITIES_OVERVIEW: PageContent = {
  route: "/capabilities",
  seoTitle: "Applications, automations and AI for sales | Zoxima",
  seoDescription: "Applications, automations and AI, designed as one system for sales and service.",
  h1: "Applications, automations and AI, built to work together",
  h1Accent: "built to work together",
  sub: "Most companies buy these separately and connect them later. We design them as one system from the start.",
  sections: [
    {
      kind: "list",
      title: "How we deliver",
      style: "numbered",
      items: [
        { title: "Discover", body: "We map how you sell and serve, and where work slips." },
        { title: "Design", body: "We design the system with a fixed scope and clear outcomes." },
        { title: "Build", body: "In short releases, on your platforms." },
        { title: "Adopt", body: "We train your teams and run it with you until it sticks." },
      ],
    },
  ],
  closing: STANDARD_CLOSING,
}

const CAPABILITIES_CRUMB = { label: "Capabilities", href: "/capabilities" }

export const CAPABILITY_PAGES: PageContent[] = [
  {
    route: "/capabilities/applications",
    crumbs: [CAPABILITIES_CRUMB],
    seoTitle: "Enterprise applications | Zoxima",
    seoDescription: "CRM, field, partner and customer apps built on Microsoft, Salesforce or custom platforms.",
    h1: "The applications your teams use every day",
    h1Accent: "use every day",
    sub: "CRM, field, partner and customer apps, built on the platforms you already trust.",
    sections: [
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          { icon: "crm", title: "CRM and sales systems", body: "Accounts, opportunities, quotes and forecasts, rolled out to thousands of users." },
          { icon: "mobile", title: "Field sales and field service apps", body: "Visits, orders, collections and service jobs, on mobile and offline." },
          { icon: "portal", title: "Distributor and partner portals", body: "Onboarding, orders, schemes, claims and statements." },
          { icon: "truck", title: "Direct Store Delivery", body: "Routes, loads, deliveries, returns and cash, in one app." },
          { icon: "loyalty", title: "Loyalty and customer apps", body: "At consumer scale, with millions of users." },
          { icon: "contract", title: "Service and contract management", body: "Installed base, contracts, warranty and renewals." },
        ],
      },
      {
        kind: "stack",
        title: "Built on",
        groups: [
          {
            name: "Built on",
            items: [
              "Microsoft Dynamics 365 and Power Apps",
              "Salesforce",
              "Custom builds on React, React Native, Flutter and Node.js",
            ],
          },
        ],
      },
      { kind: "proof", items: ["4,000+ users on a single CRM rollout", "2 million customers on one loyalty app"] },
      {
        kind: "links",
        title: "Related",
        items: [
          { title: "Order to invoice", body: "", href: "/solutions?s=order-to-invoice" },
          { title: "Sales productivity", body: "", href: "/solutions?s=sales-productivity" },
          { title: "Field service and customer support", body: "", href: "/solutions?s=field-service" },
          { title: "Distributors, schemes and loyalty", body: "", href: "/solutions?s=distributor-channel" },
        ],
      },
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/capabilities/automations",
    crumbs: [CAPABILITIES_CRUMB],
    seoTitle: "Business process automation for sales and finance | Zoxima",
    seoDescription: "Approvals, order to invoice, collections, renewals and integration, automated end to end.",
    h1: "Workflows that move work, without chasing",
    h1Accent: "without chasing",
    sub: "The steps between people and systems are where time and money slip. We automate them.",
    sections: [
      {
        kind: "list",
        title: "What we automate",
        style: "cards",
        items: [
          { icon: "approve", title: "Approvals", body: "Discounts, capex, credit and claims, routed and tracked to a decision." },
          { icon: "invoice", title: "Order to invoice", body: "Booking, credit checks, dispatch, invoicing and exceptions." },
          { icon: "cash", title: "Collections cycles", body: "Weekly lists, reminders, payment commitments and escalations." },
          { icon: "renew", title: "Renewals", body: "Contracts coming due, owners and actions, escalation before a lapse." },
          { icon: "percent", title: "Schemes and incentives", body: "Calculations, eligibility and payouts." },
          { icon: "plug", title: "Integration", body: "ERP, CRM, email, Teams and documents kept in step." },
        ],
      },
      {
        kind: "list",
        title: "How it works",
        style: "checks",
        items: [
          { body: "Your rules decide each step." },
          { body: "Every action is logged." },
          { body: "People step in only where judgment is needed." },
        ],
      },
      {
        kind: "stack",
        title: "Built on",
        groups: [
          { name: "Built on", items: ["Power Automate", "Azure integration services", "Custom services where needed"] },
        ],
      },
      {
        kind: "links",
        title: "Related",
        items: [
          { title: "Collections and credit", body: "", href: "/solutions?s=collections" },
          { title: "Service contract renewals", body: "", href: "/solutions?s=service-renewals" },
          { title: "Order to invoice", body: "", href: "/solutions?s=order-to-invoice" },
          { title: "Operations and finance AI", body: "", href: "/solutions?s=finance-operations" },
        ],
      },
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/capabilities/ai",
    crumbs: [CAPABILITIES_CRUMB],
    seoTitle: "Enterprise AI agents for sales and service | Zoxima",
    seoDescription:
      "AI agents connected to your ERP, CRM and documents that read, decide and act, with your people in control.",
    h1: "AI agents that run real business processes",
    h1Accent: "real business processes",
    sub: "Agents connected to your ERP, CRM and documents that read, decide and act, with your people in control.",
    sections: [
      {
        kind: "list",
        title: "What our agents do",
        style: "cards",
        items: [
          { icon: "sales", title: "Sales agents", body: "Meeting briefs, follow-ups, pricing guidance and answers in the field." },
          { icon: "service", title: "Service agents", body: "Case triage, renewals, warranty and service follow-up." },
          { icon: "voice", title: "Voice agents", body: "Inbound and outbound calls at scale, for queries, reminders and upsell." },
          { icon: "document", title: "Document intelligence", body: "Invoices, contracts, claims and purchase orders read and checked." },
          { icon: "finance", title: "Finance operations agents", body: "Invoice validation, reconciliation, commissions and payouts." },
          { icon: "brief", title: "Executive briefs", body: "Morning briefs and nudges on the numbers that matter, for leadership." },
        ],
      },
      {
        kind: "list",
        title: "Governance",
        style: "checks",
        items: [
          { body: "Your data stays in your environment and is not used to train models." },
          { body: "Access is granted by your IT and can be revoked." },
          { body: "Customer-facing actions are approved by people." },
          { body: "Every action is logged." },
        ],
      },
      {
        kind: "proof",
        items: [
          "50k+ AI voice calls every week",
          "AI agents in production across manufacturing, consumer goods and services",
        ],
      },
      {
        kind: "salezx",
        body: "See our AI in a product.",
        cta: { label: "Visit salezx.com", href: SALEZX_URL, external: true },
      },
    ],
    // The doc's AI page closes with two buttons only.
    closing: {
      ctas: [
        { label: "How our AI works", href: "/capabilities/ai/how-it-works" },
        { label: "Contact us", href: "/contact" },
      ],
    },
  },
  {
    route: "/capabilities/ai/how-it-works",
    crumbs: [CAPABILITIES_CRUMB, { label: "AI", href: "/capabilities/ai" }],
    seoTitle: "How our enterprise AI agents work | Zoxima",
    seoDescription:
      "Multi-agent systems, MCP connectors, retrieval over your data, human approval and full observability.",
    h1: "How our AI works",
    h1Accent: "AI works",
    sub: "A clear architecture, so you know what the AI reads, what it does, and who is in control.",
    sections: [
      {
        kind: "list",
        title: "The architecture, in six layers",
        style: "numbered",
        items: [
          {
            title: "Connect",
            body: "MCP-based connectors to your ERP, CRM, email, Teams and document stores, with access scoped to what each agent needs.",
          },
          {
            title: "Understand",
            body: "One customer record joined across systems, and retrieval (RAG) over your price lists, contracts and records, so answers are grounded in your data.",
          },
          {
            title: "Act",
            body: "Multi-agent orchestration: specialized agents plan and carry out multi-step tasks, using tools to update records, create tasks and draft messages.",
          },
          {
            title: "Control",
            body: "Human-in-the-loop approvals, your business rules, guardrails, and evaluation before any agent goes live.",
          },
          {
            title: "Observe",
            body: "Every action logged, traceable and measurable, with dashboards for owners and managers.",
          },
          {
            title: "Choose your model",
            body: "Model-agnostic: Azure OpenAI, Claude or open models, matched to the task, cost and data policy.",
          },
        ],
      },
      {
        kind: "text",
        title: "Where it runs",
        body: [
          "In your Microsoft or cloud environment, with data residency respected. Your data is not used to train models.",
        ],
      },
      {
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
      },
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/capabilities/platforms",
    crumbs: [CAPABILITIES_CRUMB],
    seoTitle: "Dynamics 365, Power Platform and Salesforce | Zoxima",
    seoDescription:
      "Microsoft Solutions Partner. Dynamics 365, Power Platform, Copilot Studio, Azure AI, Salesforce and modern AI frameworks.",
    h1: "Built on the platforms you trust",
    h1Accent: "platforms you trust",
    sub: "We pick the platform that fits your business, not the one we prefer to sell.",
    sections: [
      {
        kind: "stack",
        groups: [
          {
            name: "Microsoft",
            items: [
              "Microsoft Solutions Partner",
              "Dynamics 365 Sales, Customer Service and Field Service",
              "Power Apps and Power Automate",
              "Copilot Studio",
              "Azure OpenAI and Azure AI Search",
              "Apps listed on Microsoft AppSource",
            ],
          },
          { name: "Salesforce", items: ["Sales Cloud and Service Cloud implementations, extensions and support."] },
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
      },
    ],
    closing: STANDARD_CLOSING,
  },
]

/* --------------------------------------------------------------------------
   Industries
   -------------------------------------------------------------------------- */

export const INDUSTRIES_OVERVIEW: PageContent = {
  route: "/industries",
  seoTitle: "Sales and service systems by industry | Zoxima",
  seoDescription:
    "Sales and service systems for manufacturers, building materials, consumer goods, education and digital-native companies: CRM, field sales, service and AI.",
  h1: "Deep in manufacturing. Proven beyond it.",
  h1Accent: "Proven beyond it.",
  sub: "We build for how each industry actually sells and serves.",
  sections: [
    {
      kind: "list",
      title: "Industry cards",
      style: "cards",
      items: [
        {
          title: "Manufacturing",
          body: "Distributors, projects, field teams and service contracts.",
          href: "/industries/manufacturing",
        },
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
        {
          title: "Consumer goods",
          body: "Direct Store Delivery, distributors, schemes and loyalty.",
          href: "/industries/consumer-goods",
        },
        {
          title: "Education",
          body: "Admissions, counseling and placements.",
          href: "/industries/education",
        },
        {
          title: "Digital natives",
          body: "Inside sales, customer success, renewals and support.",
          href: "/industries/digital-natives",
        },
      ],
    },
  ],
  closing: STANDARD_CLOSING,
}

const INDUSTRIES_CRUMB = { label: "Industries", href: "/industries" }

export const INDUSTRY_PAGES: PageContent[] = [
  {
    route: "/industries/manufacturing",
    crumbs: [INDUSTRIES_CRUMB],
    seoTitle: "Sales and service systems for manufacturers | Zoxima",
    seoDescription:
      "Sales and service systems for manufacturers: leads, quotes, orders, collections, service contracts and AI.",
    eyebrow: "Industries",
    h1: "Built for how manufacturers sell and serve",
    h1Accent: "sell and serve",
    sub: "From the first enquiry to the last service visit, across distributors, projects and direct accounts.",
    sections: [
      {
        kind: "list",
        title: "How this industry sells and serves",
        style: "rows",
        items: [
          { body: "Sales through distributors, dealers and direct key accounts, often all three." },
          { body: "Engineered quotes and price lists that change often." },
          { body: "Orders that move through credit, production and dispatch before they are billed." },
          { body: "An installed base with service contracts, warranty and spare parts." },
        ],
      },
      {
        kind: "list",
        title: "Where money slips",
        style: "rows",
        items: [
          { body: "Enquiries and quotes that go quiet." },
          { body: "Discounts given to close when less would have won." },
          { body: "Orders stuck on credit, stock or paperwork." },
          { body: "Payments that run past due, and new orders held as a result." },
          { body: "Service contracts that lapse without a renewal call." },
        ],
      },
      {
        kind: "links",
        title: "What we build",
        items: [
          { title: "Lead to quote", body: "", href: "/solutions?s=lead-to-quote" },
          { title: "Pricing and quotes", body: "", href: "/solutions?s=pricing" },
          { title: "Order to invoice", body: "", href: "/solutions?s=order-to-invoice" },
          { title: "Collections and credit", body: "", href: "/solutions?s=collections" },
          { title: "Service contract renewals", body: "", href: "/solutions?s=service-renewals" },
          { title: "Field service and customer support", body: "", href: "/solutions?s=field-service" },
          { title: "Distributors, schemes and loyalty", body: "", href: "/solutions?s=distributor-channel" },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "electrical-products-leadership-ai",
            summary:
              "A $900M wires and cables maker — AI briefs for leadership across ERP, CRM and loyalty data.",
          },
          {
            slug: "conglomerate-approvals-sales-targets",
            summary: "A diversified conglomerate — seven custom apps for approvals and sales targets.",
          },
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
    route: "/industries/appliances-manufacturing",
    crumbs: [INDUSTRIES_CRUMB],
    seoTitle: "Sales and service systems for appliance makers | Zoxima",
    seoDescription:
      "Channel sales, installation, warranty, service contracts and spare parts for appliance manufacturers.",
    eyebrow: "Industries",
    h1: "Built for appliance manufacturers",
    h1Accent: "appliance manufacturers",
    sub: "Sell through the channel, install and service at scale, and keep every customer after the sale.",
    sections: [
      {
        kind: "list",
        title: "How this industry sells and serves",
        style: "rows",
        items: [
          { body: "Sales through distributors, retailers, online marketplaces and large accounts." },
          { body: "Installation, demos and warranty registration after every sale." },
          { body: "High-volume service: field technicians, call centers, spare parts." },
          { body: "Extended warranty and service contracts as a growing revenue line." },
        ],
      },
      {
        kind: "list",
        title: "Where money slips",
        style: "rows",
        items: [
          { body: "Schemes and incentives that are hard to calculate and slow to pay." },
          { body: "Installations and service calls that miss their SLA." },
          { body: "Extended warranties and service contracts that are never offered or never renewed." },
          { body: "Spare parts orders stuck between service and supply." },
          { body: "Channel payments past due." },
        ],
      },
      {
        kind: "links",
        title: "What we build",
        items: [
          { title: "Distributors, schemes and loyalty", body: "", href: "/solutions?s=distributor-channel" },
          { title: "Field service and customer support", body: "", href: "/solutions?s=field-service" },
          { title: "Service contract renewals", body: "", href: "/solutions?s=service-renewals" },
          { title: "Order to invoice", body: "", href: "/solutions?s=order-to-invoice" },
          { title: "Collections and credit", body: "", href: "/solutions?s=collections" },
          { title: "AI voice agents for service and support", body: "", href: "/capabilities/ai" },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "electrical-products-leadership-ai",
            summary: "A $900M wires and cables maker — AI briefs and alerts for leadership.",
          },
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
    route: "/industries/building-materials",
    crumbs: [INDUSTRIES_CRUMB],
    seoTitle: "Dealer and project sales for building materials | Zoxima",
    seoDescription: "Partner networks, schemes, credit, project sales and AI for building materials manufacturers.",
    eyebrow: "Industries",
    h1: "Built for building materials manufacturers",
    h1Accent: "building materials manufacturers",
    sub: "Large partner networks, schemes and credit, and project sales, run on one system.",
    sections: [
      {
        kind: "list",
        title: "How this industry sells and serves",
        style: "rows",
        items: [
          { body: "Sales through thousands of dealers and partners, plus direct project sales." },
          { body: "Schemes and incentives that change every season." },
          { body: "Credit limits and collections that decide whether the next order ships." },
          { body: "Influencers such as contractors and architects who shape demand." },
        ],
      },
      {
        kind: "list",
        title: "Where money slips",
        style: "rows",
        items: [
          { body: "Partner onboarding that takes weeks." },
          { body: "Scheme calculations done by hand and paid late." },
          { body: "Orders held on credit while payments wait." },
          { body: "Project leads that are never followed up." },
        ],
      },
      {
        kind: "links",
        title: "What we build",
        items: [
          { title: "Distributors, schemes and loyalty", body: "", href: "/solutions?s=distributor-channel" },
          { title: "Collections and credit", body: "", href: "/solutions?s=collections" },
          { title: "Order to invoice", body: "", href: "/solutions?s=order-to-invoice" },
          { title: "Lead to quote", body: "", href: "/solutions?s=lead-to-quote" },
          { title: "Sales reviews and performance", body: "", href: "/solutions?s=sales-reviews" },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "building-materials-partner-network",
            summary:
              "A $9B building materials manufacturer — partner onboarding, sales systems and AI on Microsoft.",
          },
        ],
      },
      SALEZX_PANEL,
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/industries/consumer-goods",
    crumbs: [INDUSTRIES_CRUMB],
    seoTitle: "Distributor, DSD and loyalty for consumer goods | Zoxima",
    seoDescription:
      "Direct Store Delivery, distributor management, schemes, loyalty and AI for consumer goods companies.",
    eyebrow: "Industries",
    h1: "Built for consumer goods companies",
    h1Accent: "consumer goods companies",
    sub: "Direct Store Delivery, distributors, schemes and loyalty, at consumer scale.",
    sections: [
      {
        kind: "list",
        title: "How this industry sells and serves",
        style: "rows",
        items: [
          { body: "Products sold through distributors, retail and Direct Store Delivery routes." },
          { body: "High order volume, thin margins and many small accounts." },
          { body: "Trade schemes and retailer loyalty that drive volume." },
        ],
      },
      {
        kind: "list",
        title: "Where money slips",
        style: "rows",
        items: [
          { body: "Short shipments and missed deliveries." },
          { body: "Cash collected on routes that does not reconcile." },
          { body: "Schemes that are paid without proof of performance." },
          { body: "Retailers who order less without anyone noticing." },
        ],
      },
      {
        kind: "links",
        title: "What we build",
        items: [
          {
            title: "Order to invoice and Direct Store Delivery",
            body: "",
            href: "/solutions?s=order-to-invoice",
          },
          { title: "Distributors, schemes and loyalty", body: "", href: "/solutions?s=distributor-channel" },
          { title: "Collections and credit", body: "", href: "/solutions?s=collections" },
          { title: "Sales reviews and performance", body: "", href: "/solutions?s=sales-reviews" },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "bottled-water-direct-store-delivery",
            summary:
              "A bottled-water company shipping ~10 million liters a day — Direct Store Delivery and a loyalty app for 2 million customers.",
          },
          {
            slug: "snack-foods-ai-agents",
            summary: "A snack foods brand sold in 100 countries — AI agents across retail and manufacturing.",
          },
        ],
      },
    ],
    closing: STANDARD_CLOSING,
  },
  {
    route: "/industries/education",
    crumbs: [INDUSTRIES_CRUMB],
    seoTitle: "Admissions CRM and AI for education | Zoxima",
    seoDescription:
      "Admissions CRM, AI counselors, voice and social agents, and GoEd placement intelligence for colleges.",
    eyebrow: "Industries",
    h1: "Built for colleges and universities",
    h1Accent: "colleges and universities",
    sub: "From the first enquiry to admission, and from classroom to placement.",
    sections: [
      {
        kind: "list",
        title: "How education sells and serves",
        style: "rows",
        items: [
          {
            body: "Thousands of enquiries from websites, social media, fairs and calls every admissions season.",
          },
          { body: "Counselors who follow up by phone and message, often by hand." },
          { body: "Placement teams working with hundreds of recruiters." },
        ],
      },
      {
        kind: "list",
        title: "Where it slips",
        style: "rows",
        items: [
          { body: "Enquiries that never get a call back." },
          { body: "Counselors buried in repeat questions." },
          { body: "Applicants who drop off between enquiry and admission." },
          { body: "Placement data spread across spreadsheets." },
        ],
      },
      {
        kind: "list",
        title: "What we build",
        style: "cards",
        items: [
          {
            title: "Admissions CRM",
            body: "Every enquiry captured, owned and followed to a decision.",
          },
          {
            title: "AI counselors",
            body: "Website, chat and social agents that answer applicants 24/7.",
          },
          {
            title: "Voice agents",
            body: "Outbound and inbound calls at admissions scale.",
          },
          {
            title: "Counselor assistant",
            body: "A brief on every applicant and the next best action.",
          },
        ],
      },
      {
        // Doc button "[Learn about GoEd →]" omitted until the GoEd URL is confirmed.
        kind: "text",
        title: "GoEd",
        body: [
          "Our product for colleges: admissions and placement intelligence in one place. It helps colleges see which applicants will convert, which students need support, and which recruiters to engage.",
        ],
      },
      {
        kind: "cases",
        title: "Case study",
        items: [
          {
            slug: "business-schools-admissions-ai",
            summary:
              "Leading business schools — voice, social and website agents, and an admissions CRM.",
          },
        ],
      },
    ],
    closing: {
      h2: "Let’s talk about your admissions season",
      body: "Tell us how enquiries reach you today. We’ll show you what we’d build.",
      ctas: [{ label: "Contact us", href: "/contact" }],
    },
  },
  {
    route: "/industries/digital-natives",
    crumbs: [INDUSTRIES_CRUMB],
    seoTitle: "Sales and service CRM for digital natives | Zoxima",
    seoDescription:
      "Sales CRM, customer success, renewals, support automation and voice AI for digital businesses.",
    eyebrow: "Industries",
    h1: "Built for digital businesses",
    h1Accent: "digital businesses",
    sub: "Inside sales, customer success and support, run at the speed your business grows.",
    sections: [
      {
        kind: "list",
        title: "How this industry sells and serves",
        style: "rows",
        items: [
          { body: "High lead volume through inside sales teams." },
          { body: "Subscriptions, renewals and upgrades." },
          { body: "Customer support across chat, email and voice." },
        ],
      },
      {
        kind: "list",
        title: "Where money slips",
        style: "rows",
        items: [
          { body: "Leads that wait too long for a first call." },
          { body: "Renewals that are noticed too late." },
          { body: "Support queues that grow faster than the team." },
        ],
      },
      {
        kind: "links",
        title: "What we build",
        items: [
          { title: "Lead to quote", body: "", href: "/solutions?s=lead-to-quote" },
          { title: "Sales productivity", body: "", href: "/solutions?s=sales-productivity" },
          { title: "Service contract renewals", body: "", href: "/solutions?s=service-renewals" },
          { title: "Field service and customer support", body: "", href: "/solutions?s=field-service" },
          { title: "AI voice and chat agents", body: "", href: "/capabilities/ai" },
        ],
      },
      {
        kind: "cases",
        title: "Case studies",
        items: [
          {
            slug: "marketplace-sales-service-crm",
            summary:
              "A digital-native company — sales and service CRM for 4,000+ users across three businesses.",
          },
          {
            slug: "visa-services-voice-ai",
            summary:
              "A global visa and consular services company — voice AI for customer queries and add-on services.",
          },
        ],
      },
    ],
    closing: STANDARD_CLOSING,
  },
]
