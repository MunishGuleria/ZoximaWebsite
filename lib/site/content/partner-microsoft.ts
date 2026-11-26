import type { PartnerPractice } from "@/components/site/partner-detail"

/* Microsoft practice page (/partners/microsoft). Copy supplied by Zoxima (Nov 2026),
   transcribed verbatim. Rendered by components/site/partner-detail.tsx. */

const MS_PROFILE =
  "https://appsource.microsoft.com/en-us/marketplace/partner-dir/923bb7ae-3d80-46c7-b4b1-dd832ab44683/overview"
const APPSOURCE = "https://appsource.microsoft.com/en-us/product"

export const MICROSOFT_PRACTICE: PartnerPractice = {
  page: {
    route: "/partners/microsoft",
    crumbs: [{ label: "Partners", href: "/partners" }],
    seoTitle: "Microsoft Dynamics 365 and Power Platform partner | Zoxima",
    seoDescription:
      "Dynamics 365, Power Platform, Azure AI and Copilot Studio solutions for large enterprises, from a Microsoft Solutions Partner with three designations.",
    h1: "Sales, service and AI, built on the Microsoft stack you already own.",
    h1Accent: "you already own.",
    sub: "We build Dynamics 365, Power Platform, Azure AI and Copilot Studio solutions for large enterprises. Microsoft has recognized our work with three Solutions Partner designations and a specialization in Agentic Business Solutions.",
    heroCtas: [
      { label: "Talk to us", href: "/contact" },
      { label: "See our work", href: "#selected-work" },
    ],
    sections: [],
    closing: {
      h2: "Get more from the Microsoft tools you already pay for.",
      body: "Tell us what’s slowing your sales or service teams down.",
      ctas: [
        { label: "Talk to us", href: "/contact" },
        { label: "See our work", href: "#selected-work" },
      ],
    },
  },
  eyebrow: "Microsoft Solutions Partner",
  proof: [
    { text: "Microsoft Solutions Partner: Business Applications · Data & AI · Digital & App Innovation" },
    { text: "Microsoft specialization: Agentic Business Solutions" },
    { text: "90+ enterprise projects" },
    { text: "25+ enterprise AI projects live" },
  ],
  badges: [
    { label: "Business Applications", href: MS_PROFILE },
    { label: "Data & AI", href: MS_PROFILE },
    { label: "Digital & App Innovation", href: MS_PROFILE },
    { label: "Agentic Business Solutions", href: MS_PROFILE },
  ],
  who: {
    title: "Who we work with",
    body: [
      "We work with large and mid-size companies that run on Microsoft: Dynamics 365, Office 365, Teams and Azure. Many already pay for these tools but use only part of what they can do.",
      "Manufacturing is our core, especially building materials, FMCG, appliances and industrial distribution. We also work in logistics, corporate services and education.",
    ],
  },
  offer: {
    title: "What we build",
    items: [
      {
        name: "Applications",
        points: [
          "Dynamics 365 Sales and Customer Service, set up around how your teams really sell and serve customers.",
          "Field sales and distributor apps that work offline.",
          "Dealer and customer 360 views, and Power Apps for the processes your ERP doesn’t cover.",
        ],
      },
      {
        name: "Automations",
        points: [
          "Power Automate workflows for approvals, assignments, escalations and reminders.",
          "Integrations with SAP and other ERPs.",
          "Service routing with SLA tracking.",
          "Invoice and document processing.",
        ],
      },
      {
        name: "AI",
        points: [
          "Copilot Studio agents for sales and service teams.",
          "Multi-agent systems on Azure OpenAI.",
          "MCP connections that let AI work safely across CRM, ERP and documents.",
          "Retrieval over product and policy documents, plus daily briefs and nudges that tell each rep what to do next.",
        ],
      },
      {
        name: "Data and insight",
        body: "Power BI dashboards on Dataverse and ERP data, so leaders get one view of sales, service and collections.",
      },
      {
        name: "Support and enhancement",
        body: "Ongoing admin, change requests and enhancements, with a focus on cutting repeat support tickets.",
      },
    ],
  },
  work: {
    title: "Selected work",
    items: [
      {
        title: "A $9B building materials group",
        body: "We built one CRM on Dynamics 365 for both trade sales and key-account sales. It replaced the old field sales app and gave reps a full view of every dealer and retailer, with offline mobile apps for the field. We then added a customer service platform that brings in website, email and phone enquiries, and AI on Copilot Studio that plans a rep’s visits in one click.",
        results: [
          "Core system live in about 8 months.",
          "90%+ adoption across the trade sales team.",
          "Dealer records from different business lines merged into one clean view.",
        ],
        caseStudy: "building-materials-partner-network",
      },
      {
        title: "A Fortune 500 corporate services company",
        body: "We built a finance operations suite on the Microsoft stack. It covers capital expenditure approvals, AI-based invoice processing, menu approvals and automatic market price collection.",
        results: [
          "Approvals that used to move by email now run through one tracked workflow.",
          "Invoices are read and checked by AI before they reach the finance team.",
          "Leadership gets a weekly status report on capital spend without anyone building it by hand.",
        ],
        caseStudy: "corporate-services-finance-operations",
      },
      {
        title: "A leading online recruitment and classifieds group",
        body: "We implemented Dynamics 365 Sales and Customer Service for the group’s main business, then extended it to two more businesses in the same group.",
        results: ["2,000+ users on Dynamics 365 Sales and Service.", "One platform reused across three businesses."],
        caseStudy: "marketplace-sales-service-crm",
      },
      {
        title: "A large packaged-water company",
        body: "We built a direct store delivery app on Power Platform for van sales teams. It covers routes, orders, deliveries and collections from the truck.",
        caseStudy: "bottled-water-direct-store-delivery",
      },
      {
        title: "A large diversified manufacturing group",
        body: "We built seven custom apps on Power Platform, including smart approvals and sales target automation, so these processes run on one platform instead of spreadsheets.",
        caseStudy: "conglomerate-approvals-sales-targets",
      },
      {
        title: "A national postal and logistics operator",
        body: "We automated case tagging in Dynamics 365. Website enquiry emails are now sorted by business unit and category automatically, so they reach the right team faster.",
        caseStudy: "postal-case-tagging-ai",
      },
    ],
  },
  apps: {
    title: "Ready-made apps on Microsoft Marketplace",
    intro: "Our Power Platform apps give you a working starting point instead of a blank build.",
    items: [
      {
        name: "Field Sales",
        body: "Visit planning, check-ins and order capture for reps on the road.",
        href: `${APPSOURCE}/dynamics-365/zoximasolutuionspvtltd1654840932298.fieldsales`,
      },
      {
        name: "Building Material App",
        body: "Visit execution, order booking and order tracking for building materials sales teams.",
        href: `${APPSOURCE}/web-apps/zoximasolutuionspvtltd1654840932298.building_material_app`,
      },
      {
        name: "Sales Team Application",
        body: "Daily activities and transactions for sales teams in one app.",
        href: `${APPSOURCE}/dynamics-365/zoximasolutuionspvtltd1654840932298.sales_team_application`,
      },
      {
        name: "Inspection App",
        body: "Digital forms, scheduling and reporting for inspections.",
        href: `${APPSOURCE}/web-apps/zoximasolutuionspvtltd1654840932298.inspection_app`,
      },
      {
        name: "Employee Onboarding",
        body: "A guided onboarding flow for new joiners.",
        href: `${APPSOURCE}/dynamics-365/zoximasolutuionspvtltd1654840932298.employee_onboarding`,
      },
    ],
    cta: { label: "See our apps on Microsoft Marketplace", href: MS_PROFILE, external: true },
  },
  steps: {
    title: "How we work",
    items: [
      { title: "Understand", body: "We start with your sales and service process and your business goals, not the software." },
      { title: "Design", body: "We agree a clear scope, screens and success measures before the build starts." },
      { title: "Build", body: "We work in short cycles, with a demo at the end of each." },
      { title: "Roll out", body: "We train users, support adoption and track usage after go-live." },
      { title: "Improve", body: "Ongoing enhancement and support, with AI added where it pays off." },
    ],
  },
  why: {
    title: "Why Zoxima",
    items: [
      {
        title: "Validated by Microsoft",
        body: "We’re a Solutions Partner in Business Applications, Data & AI, and Digital & App Innovation, and we hold Microsoft’s specialization in Agentic Business Solutions, awarded only after Microsoft audits a partner’s delivery.",
      },
      {
        title: "Enterprise scale",
        body: "We run systems with thousands of users, including 4,000+ on a single CRM rollout, with many roles and complex security.",
      },
      {
        title: "Sales process first",
        body: "We’ve spent 15 years on sales productivity and CRM with hundreds of enterprises.",
      },
      {
        title: "AI that’s already live",
        body: "We have 25+ enterprise AI projects in production, not pilots.",
      },
      {
        title: "Both major platforms",
        body: "We deliver on both Microsoft and Salesforce, so our advice isn’t tied to one vendor.",
      },
    ],
  },
}
