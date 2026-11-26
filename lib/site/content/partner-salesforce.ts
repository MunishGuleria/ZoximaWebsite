import type { PartnerPractice } from "@/components/site/partner-detail"
import { SF_GUIDE_BAND, SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"


/* Salesforce practice page (/partners/salesforce). Copy supplied by Zoxima (Nov 2026),
   transcribed verbatim. Rendered by components/site/partner-detail.tsx. */
export const SALESFORCE_PRACTICE: PartnerPractice = {
  page: {
    route: "/partners/salesforce",
    crumbs: [{ label: "Partners", href: "/partners" }],
    seoTitle: "Salesforce consulting partner | Zoxima",
    seoDescription:
      "We design, build and fix Salesforce for mid-size and large companies, so reports can be trusted, data stays clean and reps spend their time selling.",
    h1: "Salesforce that your sales team actually uses.",
    h1Accent: "actually uses.",
    sub: "We design, build and fix Salesforce for mid-size and large companies, so reports can be trusted, data stays clean and reps spend their time selling.",
    heroCtas: [
      { label: "Talk to us", href: "/contact" },
      { label: "Read the free guide", href: SF_GUIDE_ROUTE },
    ],
    sections: [],
    closing: {
      h2: "Let’s see what your Salesforce could be doing.",
      body: "Tell us what’s not working.",
      ctas: [
        { label: "Talk to us", href: "/contact" },
        { label: "Read the free guide", href: SF_GUIDE_ROUTE },
      ],
    },
  },
  eyebrow: "Salesforce Partner",
  proof: [
    { text: "4.97 rating from 41 reviews", stars: true },
    { text: "75+ Salesforce projects" },
    { text: "26 Salesforce certifications" },
  ],
  who: {
    title: "Who we work with",
    body: [
      "Most of our Salesforce customers already have Salesforce in place. It works, but not as well as it should. Reports don’t match reality, automations have piled up over the years, and the field team still keeps notes outside the system.",
      "We work with companies of 200 to 1,000+ employees in manufacturing, building materials, distribution, education and services. Some need a full build. Most need the setup they already have to work properly.",
    ],
  },
  offer: {
    title: "What we do",
    items: [
      {
        name: "Implementation",
        body: "New Sales Cloud and Service Cloud rollouts, set up around how your team really sells. That covers your stages, approvals, territories and handoffs.",
      },
      {
        name: "Fix and optimize",
        body: "For orgs that have grown messy. We clean up data, rebuild reports people can trust, simplify screens and move retired Workflow Rules and Process Builder automations to Flow.",
      },
      {
        name: "Integration",
        body: "Connect Salesforce to your ERP, email, Teams or Google Chat, document stores and e-signature tools, so reps see the full customer picture in one place.",
      },
      {
        name: "Custom apps and mobile",
        body: "Lightning Web Components, field sales apps, distributor and dealer portals, and mobile setups built for reps who work on the road.",
      },
      {
        name: "AI on Salesforce",
        body: "Get your data and processes ready first, then add AI where it pays off, such as summaries, next-best actions and nudges. No AI for its own sake.",
      },
      {
        name: "Managed support",
        body: "Ongoing admin, reporting and enhancement support on a monthly retainer.",
      },
    ],
  },
  work: {
    title: "Selected work",
    items: [
      {
        title: "A large education technology company",
        body: "This company runs a large sales and service operation on Salesforce. We implemented and support its Salesforce CRM, and extended it with custom applications on React and Node.js. Its sales and service teams work from one system instead of spreadsheets and separate tools, and new needs are built on the same platform rather than bolted on outside it.",
        caseStudy: "education-crm-learning-app",
      },
      {
        title: "A building materials manufacturer",
        body: "This manufacturer sells through field reps and a wide distributor network. We connected Salesforce to a field sales app and a distributor management system, built on Flutter and Node.js. Field reps log visits and orders from their phones, distributors work on the same data, and management sees field activity and the distributor pipeline in one place.",
        caseStudy: "building-materials-dealer-apps",
      },
    ],
    footer: {
      label: "Read what our customers say on our AppExchange listing",
      href: "https://appexchange.salesforce.com/appxConsultingListingDetail?listingId=a0N3A00000FnDXAUA3",
      external: true,
    },
  },
  /* "What we fix": the ten guide sections as cards (Zoxima's guide-flow
     prototype, screen 2). Each card opens that section's page. */
  problems: {
    title: "What we fix",
    intro: "The 10 problems we see most in companies of 200–1,000 people.",
    items: SF_GUIDE_PROBLEMS.map((p) => ({
      label: `Problem ${p.n}`,
      title: p.title,
      body: p.short,
      href: `${SF_GUIDE_ROUTE}/${p.id}`,
    })),
    guide: {
      eyebrow: "Free guide for Salesforce users",
      title: SF_GUIDE_BAND.title,
      body: "How to spot each one, what it costs, and how to fix it. Read the start of any section free. Get the full guide by email.",
      cta: { label: "Get the full guide by email", href: `${SF_GUIDE_ROUTE}/get` },
      secondary: { label: "Browse the 10 problems", href: SF_GUIDE_ROUTE },
    },
  },
  steps: {
    title: "How we work",
    items: [
      { title: "Understand", body: "We start with your sales process and priorities, not the software." },
      { title: "Review", body: "We look at your org, data and automations, and agree a fixed scope." },
      { title: "Build", body: "We work in short cycles, with a demo at the end of each." },
      { title: "Hand over", body: "We train your users and admins and document what was built." },
      { title: "Support", body: "We stay on hand, or step back. Your choice." },
    ],
  },
  why: {
    title: "Why Zoxima",
    items: [
      {
        title: "Sales process first",
        body: "We’ve spent 15 years on sales productivity and CRM with hundreds of enterprises.",
      },
      {
        title: "Both major platforms",
        body: "We deliver on both Salesforce and Microsoft, so our advice isn’t tied to one vendor.",
      },
      { title: "Fixed scope, clear price", body: "You know what you’re getting before work starts." },
      { title: "Rated by customers", body: "4.97 from 41 reviews, across 75+ Salesforce projects." },
    ],
  },
}
