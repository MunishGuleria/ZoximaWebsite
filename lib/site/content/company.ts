// Copy transcribed verbatim from Zoxima_Website_Content_v2.docx (Products,
// Company and Legal sections). [Bracketed] items are the doc's placeholders.
import { type Item, type PageContent, type Section, SALEZX_URL, STANDARD_CLOSING } from "@/lib/site/types"
import type { LegalSection } from "@/components/site/legal-doc"

export const CONTACT_EMAIL = "info@zoxima.com"

// Desk cards are text only (the original desk pictures are multicolour;
// site rule: white, ink and navy only).
const desk = (title: string, body: string): Item => ({
  title,
  body,
  href: SALEZX_URL,
  external: true,
  linkLabel: "See this desk on salezx.com",
})

export const PRODUCTS_PAGE: PageContent = {
  route: "/products",
  seoTitle: "Salezx: ready-made sales operations desks | Zoxima",
  seoDescription:
    "Salezx is your strongest sales ops team on the CRM, ERP reports and email you already use: desks for collections, renewals, orders, leads and pricing.",
  eyebrow: "Products",
  h1: "Salezx: your strongest sales ops team",
  h1Accent: "sales ops team",
  // Wording as on salezx.com (Oct 2026).
  sub: "Great salespeople win deals. Great sales operations win consistently. Salezx is that sales ops team, on the CRM, ERP reports and email you already use. Start with the desk where your money slips. Live in about a week.",
  heroCtas: [
    { label: "Visit salezx.com", href: SALEZX_URL, external: true },
    { label: "Contact us", href: "/contact" },
  ],
  sections: [
    {
      kind: "text",
      title: "Where money slips",
      body: [
        "Invoices past due with no one following up. Contracts that lapse without a renewal call. Orders stuck between booking and billing. Quotes that go quiet. None of it is anyone’s fault. It is just too much to track by hand.",
      ],
    },
    {
      kind: "list",
      title: "Start with the desk where your money slips",
      style: "cards",
      items: [
        desk("Collections", "Invoices tracked with each rep: cash on time, credit risk low."),
        desk("Service Renewals", "Every service contract tracked, owned and renewed before it lapses."),
        desk("Ordering & Billing", "Every order shipped and billed right, without getting stuck."),
        desk("Lead Actions", "Every lead, quote and closure followed up, by the rep and Salezx together."),
        desk("Pricing & Quote", "The right discount with its reasons, and the quote out in minutes."),
        desk("Rep Desk", "Every meeting prepared; tasks and follow-ups from one note."),
        desk("Review", "A digital assistant on every review call: live numbers, actions set and chased."),
      ],
    },
    {
      kind: "list",
      title: "A week with Salezx",
      style: "numbered",
      items: [
        { title: "Monday", body: "Each owner gets a list with one action per item." },
        { title: "Through the week", body: "Tasks in Outlook To-Do, approved emails go out, replies are read and recorded." },
        { title: "Every morning", body: "A card for management with the risks and results." },
        { title: "End of week", body: "A recap and a 30-minute review." },
      ],
    },
    {
      kind: "list",
      title: "Every desk includes",
      style: "checks",
      items: [
        { body: "A weekly action list" },
        { body: "Outlook To-Do tasks" },
        { body: "Approved email templates" },
        { body: "Replies read and recorded" },
        { body: "Answers in Teams" },
        { body: "A weekly review" },
        { body: "A morning card for management" },
        { body: "Escalations to the managers you name" },
      ],
    },
    {
      kind: "stack",
      title: "Works with what you run",
      intro: "Nothing is replaced.",
      groups: [{ name: "Works with", items: ["ERP reports", "CRM", "Email", "Teams", "Shared drives"] }],
    },
    {
      kind: "text",
      title: "Backlog Clean-up",
      body: ["Old overdues, lapsed contracts, stuck orders and cold leads, cleared once, with an outcome for every item."],
    },
    {
      kind: "list",
      title: "How it starts",
      style: "numbered",
      items: [
        { title: "Pick your desk", body: "The one where your money slips most." },
        { title: "Live in about a week", body: "From access granted and reports available." },
        { title: "Add desks when you are ready", body: "Priced by volume, not seats." },
      ],
    },
    {
      kind: "text",
      title: "Your data, your control",
      body: ["Your data stays in your environment. Nothing reaches a customer without your team’s approval."],
    },
  ],
  closing: {
    h2: "See Salezx in action",
    ctas: [{ label: "Visit salezx.com", href: SALEZX_URL, external: true }],
  },
}

export const ABOUT_PAGE: PageContent = {
  route: "/about",
  seoTitle: "About Zoxima: sales automation and enterprise AI",
  seoDescription:
    "Zoxima builds sales automation and enterprise AI for large enterprises. Headquartered in Fremont, California.",
  eyebrow: "Company",
  h1: "We build the sales operations large enterprises run on",
  h1Accent: "large enterprises run on",
  sub: "Applications, automations and AI for sales and service, delivered by people who know how manufacturers sell.",
  sections: [
    {
      kind: "text",
      title: "Our story",
      body: [
        "Zoxima started by building sales and service systems for large enterprises. Over 90+ large enterprise projects, we saw the same pattern: great salespeople win deals, but great sales operations win consistently. We built our practice around that, and then built Salezx to bring it to every sales team.",
      ],
    },
    {
      kind: "list",
      title: "What we believe",
      style: "cards",
      items: [
        { title: "Results over technology", body: "We start with where money slips, not with a platform." },
        { title: "People stay in control", body: "AI does the work; your team makes the calls." },
        { title: "Built to last", body: "Systems your teams use every day, not pilots that fade." },
      ],
    },
    {
      kind: "list",
      title: "Leadership",
      style: "rows",
      items: [
        {
          title: "Jagpreet Singh, Founder and CEO",
          body: "Almost 15 years in sales productivity, CRM and automation with hundreds of enterprises, and more than 17 years in enterprise technology across the SAP, Oracle and Microsoft ecosystems. Based in the San Francisco Bay Area.",
        },
      ],
    },
    {
      kind: "list",
      title: "Where we are",
      style: "rows",
      items: [
        { title: "Headquarters", body: "Fremont, California" },
        { title: "Global Delivery Center", body: "engineering and delivery teams supporting customers worldwide" },
      ],
    },
    {
      kind: "stack",
      title: "Partners",
      groups: [{ name: "Partners", items: ["Microsoft Solutions Partner", "Salesforce", "Apps on Microsoft AppSource"] }],
    },
    { kind: "proof", items: ["90+ large enterprise projects", "Microsoft Solutions Partner", "Salesforce Partner"] },
  ],
  closing: STANDARD_CLOSING,
}

/** Insights, shown as a section of the About page (the /insights page was
 *  retired; it redirects to /about#insights). */
export const INSIGHTS_SECTION: Section = {
  kind: "list",
  title: "Insights",
  intro: "Ideas from the work: what we see building sales and service systems for large enterprises.",
  style: "cards",
  items: [
    {
      title: "Where manufacturers lose money between order and cash",
      body: "Most margin is lost after the deal is won: in stuck orders, billing errors and payments that run late. Five places to look first, and how to fix each one.",
    },
    {
      title: "Why most sales AI pilots never reach production",
      body: "Pilots succeed in demos and fail in operations. The reasons are usually data access, ownership and trust, not the model. What to get right before you start.",
    },
    {
      title: "Multi-agent systems in sales operations: what actually works",
      body: "Specialized agents for orders, collections and renewals, coordinated and governed. What we have learned putting them into production.",
    },
  ],
}

export const PARTNERS_PAGE: PageContent = {
  route: "/partners",
  seoTitle: "Microsoft and Salesforce partner | Zoxima",
  seoDescription:
    "Zoxima is a Salesforce Partner and a Microsoft Solutions Partner, building sales, service and AI systems on Salesforce, Dynamics 365 and Power Platform.",
  eyebrow: "Company",
  h1: "Partners in what we build",
  h1Accent: "what we build",
  sub: "Microsoft Solutions Partner and Salesforce Partner. We build on the platform that fits your business, not the one we prefer to sell.",
  heroCtas: [
    { label: "Salesforce practice", href: "/partners/salesforce" },
    { label: "Microsoft practice", href: "/partners/microsoft" },
  ],
  sections: [],
  closing: STANDARD_CLOSING,
}

export const SECURITY_PAGE: PageContent = {
  route: "/security",
  seoTitle: "Security, data protection and AI governance | Zoxima",
  seoDescription:
    "How Zoxima protects your data and governs AI: your data is never used to train models, access stays with your IT, and every agent action is logged.",
  eyebrow: "Company",
  h1: "Security and trust",
  h1Accent: "trust",
  sub: "How we protect your data, and how we keep AI under your control.",
  sections: [
    {
      kind: "list",
      title: "Your data",
      style: "checks",
      items: [
        { body: "Your data stays in your environment wherever possible." },
        { body: "Your data is not used to train AI models." },
        { body: "Access is granted by your IT, limited to what is needed, and can be revoked at any time." },
      ],
    },
    {
      kind: "list",
      title: "AI governance",
      style: "checks",
      items: [
        { body: "Human approval for anything that reaches a customer." },
        { body: "Your business rules applied exactly as set." },
        { body: "Every agent action logged and traceable." },
        { body: "Agents evaluated before they go live." },
      ],
    },
    {
      kind: "text",
      title: "Hosting",
      body: ["Hosted on cloud infrastructure that holds SOC 2 Type II attestation."],
    },
    { kind: "text", title: "Report a concern", body: [CONTACT_EMAIL] },
  ],
  closing: STANDARD_CLOSING,
}

export const CAREERS_PAGE: PageContent = {
  route: "/careers",
  seoTitle: "Careers at Zoxima: build sales automation and AI",
  seoDescription:
    "Build sales automation and enterprise AI that large enterprises run on. See how the Zoxima team works and how to apply.",
  eyebrow: "Company",
  h1: "Build systems that companies run on",
  h1Accent: "companies run on",
  sub: "Work on applications, automations and AI that are used every day by thousands of people.",
  sections: [
    {
      kind: "list",
      title: "Why Zoxima",
      style: "checks",
      items: [
        { body: "Real systems in production, not slideware." },
        { body: "Modern AI: multi-agent systems, voice AI, retrieval and evaluation." },
        { body: "Small teams, real ownership." },
        { body: "A global team across Fremont and our Global Delivery Center." },
      ],
    },
    { kind: "text", title: "Apply", body: [CONTACT_EMAIL] },
  ],
}

export const CONTACT_PAGE: PageContent = {
  route: "/contact",
  seoTitle: "Contact Zoxima: talk about your sales operation",
  seoDescription:
    "Talk to Zoxima about your sales operation. Tell us where work slips today and we will get back to you within one business day.",
  eyebrow: "Company",
  h1: "Let’s talk about your sales operation",
  h1Accent: "sales operation",
  sub: "Tell us where work slips today. We will get back to you within one business day.",
  sections: [],
}

/** Topics for the contact form's "What would you like to improve?" field. */
export const CONTACT_TOPICS = [
  "Leads and quotes",
  "Pricing",
  "Orders and billing",
  "Collections",
  "Service and renewals",
  "Sales productivity",
  "Finance operations",
  "Other",
] as const

/* Privacy Policy: Zoxima's text (Nov 2026), word for word. One policy for
   everyone, with "Additional information for users in India" at the end (the
   old /privacy-india page now redirects to it). The page body is
   components/site/legal-doc.tsx; PRIVACY_PAGE carries the hero, SEO and route. */
export const PRIVACY_PAGE: PageContent = {
  route: "/privacy",
  seoTitle: "Privacy Policy | Zoxima",
  seoDescription:
    "How Zoxima collects, uses and protects your personal information on zoxima.com, including your rights and additional information for users in India.",
  eyebrow: "Legal",
  h1: "Privacy Policy",
  sub: "Last updated: November 26, 2026",
  sections: [],
}

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    heading: "Introduction",
    blocks: [
      "This Privacy Policy explains how Zoxima collects, uses and protects your personal information when you use zoxima.com (the “Website”).",
      "The Website is operated by Zoxima Solutions LLC, 44870 Osgood Road, Suite 5, Fremont, CA, USA, together with its affiliate Zoxima Solutions Private Limited, Sector 142, Noida, Uttar Pradesh, India (“Zoxima,” “we,” “us” or “our”). If you’re in India, also see “Additional information for users in India” at the end of this policy.",
    ],
  },
  {
    id: "information-we-collect",
    heading: "1. Information we collect",
    blocks: [
      "**Information you give us**",
      [
        "Your name and contact details (email, phone number)",
        "Your company name and job title",
        "Messages and enquiries you send through our forms",
      ],
      "**Information collected automatically**",
      [
        "IP address and general location",
        "Browser type and device information",
        "Pages visited and time spent on the Website",
        "How you found the Website",
      ],
      "We only collect what we need for the purposes below.",
    ],
  },
  {
    id: "how-we-use",
    heading: "2. How we use your information",
    blocks: [
      "We use your information to:",
      [
        "respond to your enquiries",
        "arrange and hold consultations you ask for",
        "send you the information you request",
        "send you updates about our services, only if you agree",
        "understand how the Website is used and improve it",
        "keep the Website secure and meet our legal duties",
      ],
      "Data we handle for clients during a project is governed by our written agreement with that client, not by this policy.",
    ],
  },
  {
    id: "sharing",
    heading: "3. Who we share your information with",
    blocks: [
      "We do not sell, rent or trade your personal information.",
      "We share limited information only with service providers who help us host the Website, send emails and manage enquiries, such as:",
      [
        "**Vercel**, for website hosting and usage analytics",
        "**Microsoft Azure Communication Services**, for sending emails from form submissions",
      ],
      "These providers may only use your information to provide their service to us, and must keep it secure.",
      "We may also share information if the law, a court or a government authority requires it, or if Zoxima’s business is merged or sold. In that case, your information stays protected under this policy.",
    ],
  },
  {
    id: "where-processed",
    heading: "4. Where your information is processed",
    blocks: [
      "Zoxima works from the United States and India. Your information may be stored or accessed in either country, and on our service providers’ cloud servers. We protect it the same way wherever it is processed.",
    ],
  },
  {
    id: "retention",
    heading: "5. How long we keep your information",
    blocks: [
      [
        "**Form and enquiry data:** up to 2 years, then deleted",
        "**Website usage data:** as set by our analytics provider’s retention rules",
        "If you ask us to delete your information, we’ll delete it unless the law requires us to keep it",
      ],
    ],
  },
  {
    id: "protection",
    heading: "6. How we protect your information",
    blocks: [
      [
        "All data sent through the Website is encrypted using HTTPS/TLS",
        "We use secure, reputable cloud services for storage",
        "Only authorized team members can access personal information",
        "We review our security practices regularly",
        "We check our service providers for security standards",
      ],
    ],
  },
  {
    id: "your-rights",
    heading: "7. Your rights",
    blocks: [
      "You can ask us to:",
      [
        "**Access.** Get a copy of the personal information we hold about you.",
        "**Correction.** Correct inaccurate or incomplete information.",
        "**Deletion.** Delete your personal information.",
        "**Opt out.** Stop sending you marketing emails, at any time, by emailing us.",
      ],
      "To make a request, email info@zoxima.com with the subject “Privacy request.” We may ask you to confirm your identity first. We respond within 30 days.",
    ],
  },
  {
    id: "cookies",
    heading: "8. Cookies and tracking",
    blocks: [
      "We keep tracking to a minimum:",
      ["essential cookies that make the Website work", "analytics through Vercel, to understand how the Website is used"],
      "We don’t use third-party advertising or tracking cookies. You can control cookies through your browser settings.",
      "**Do Not Track.** The Website does not currently respond to browser “Do Not Track” signals. We don’t allow third parties to track you across other websites through our Website.",
    ],
  },
  {
    id: "children",
    heading: "9. Children",
    blocks: [
      "The Website is meant for businesses and isn’t directed at anyone under 18. We don’t knowingly collect personal information from children. If you believe we have, please contact us and we’ll delete it.",
    ],
  },
  {
    id: "changes",
    heading: "10. Changes to this policy",
    blocks: [
      "We may update this policy when our practices or the law change. We’ll post the updated policy on this page with a new “Last updated” date. For major changes, we’ll also tell you by email if we have your contact details.",
    ],
  },
  {
    id: "contact",
    heading: "11. Contact us",
    blocks: [
      "For any question about this policy or your personal information:",
      "Zoxima Solutions LLC",
      "44870 Osgood Road, Suite 5",
      "Fremont, CA, USA",
      CONTACT_EMAIL,
    ],
  },
  {
    id: "india",
    heading: "Additional information for users in India",
    blocks: [
      "This section applies if you use the Website from India. It is written in line with the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025. If it conflicts with any other part of this policy, this section applies for users in India.",
      "**Data Fiduciary.** For users in India, Zoxima Solutions Private Limited, Sector 142, Noida, Uttar Pradesh, India, is the “Data Fiduciary” for your personal data. You are the “Data Principal.”",
      "**Consent.** When you submit a form on the Website, you consent to us using your data for the purposes shown on that form and in this policy. You can withdraw your consent at any time by emailing info@zoxima.com. Withdrawing consent is as easy as giving it. Once you withdraw, we’ll stop using your data for that purpose. This doesn’t affect anything we did lawfully before you withdrew.",
      "**Your rights in India.** In addition to the rights in section 7, you have the right to:",
      [
        "get a summary of the personal data we hold about you and how we use it",
        "have your data erased when it’s no longer needed or when you withdraw consent",
        "nominate another person to exercise your rights if you die or become unable to",
        "raise a grievance with us, as explained below",
      ],
      "**Transfers outside India.** Your data may be processed in the United States by our affiliate, Zoxima Solutions LLC, and by our service providers. We follow any restrictions the Government of India places on transfers outside India.",
      "**Data breaches.** If a breach affects your personal data, we’ll inform you and the Data Protection Board of India as the law requires.",
      "**Grievance Officer.** If you have a concern about how we handle your personal data, contact:",
      "Grievance Officer",
      "Zoxima Solutions Private Limited",
      "Sector 142, Noida, Uttar Pradesh, India",
      CONTACT_EMAIL,
      "We’ll acknowledge your complaint and aim to resolve it within 30 days, and in any case within 90 days. If you aren’t satisfied with our response, you can complain to the Data Protection Board of India.",
    ],
  },
]

/* Terms of Service: Zoxima's text (Nov 2026), word for word. The page body is
   components/site/legal-doc.tsx; TERMS_PAGE carries the hero, SEO and route. */
export const TERMS_PAGE: PageContent = {
  route: "/terms",
  seoTitle: "Terms of Service | Zoxima",
  seoDescription:
    "The Terms of Service for zoxima.com, operated by Zoxima Solutions LLC, Fremont, California, with its affiliate Zoxima Solutions Private Limited.",
  eyebrow: "Legal",
  h1: "Terms of Service",
  sub: "Last updated: November 26, 2026",
  sections: [],
}

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    heading: "Introduction",
    blocks: [
      "These Terms of Service (“Terms”) govern your use of zoxima.com and any pages, content and forms on it (the “Website”). The Website is operated by Zoxima Solutions LLC, a California company, together with its affiliate Zoxima Solutions Private Limited (“Zoxima,” “we,” “us” or “our”).",
      "By using the Website, you agree to these Terms. If you don’t agree, please don’t use the Website.",
    ],
  },
  {
    id: "who-can-use",
    heading: "1. Who can use the Website",
    blocks: [
      "The Website is intended for businesses and business professionals. You must be at least 18 years old to use it. If you use the Website for a company, you confirm that you’re authorized to act for that company.",
    ],
  },
  {
    id: "purpose",
    heading: "2. What the Website is for",
    blocks: [
      "The Website gives information about Zoxima, our services, our work and our partnerships. Content on the Website, including articles and case studies, is general information only. It is not professional, technical, legal or financial advice for your specific situation.",
    ],
  },
  {
    id: "separate-agreements",
    heading: "3. Our services are covered by separate agreements",
    blocks: [
      "Any consulting, implementation, development, support or other services we provide are governed by a separate written agreement, such as a statement of work, proposal or master services agreement, signed by you and Zoxima. If those documents conflict with these Terms, the signed agreement controls.",
      "Prices, offers and service descriptions on the Website are for information. They’re not a binding offer and may change without notice. A price or scope only becomes binding when it’s confirmed in writing in a signed agreement.",
    ],
  },
  {
    id: "forms",
    heading: "4. Forms",
    blocks: [
      "When you fill in a form, you agree to:",
      [
        "give accurate, current information",
        "use only your own business contact details, or details you’re authorized to share",
        "not submit anything unlawful, harmful or misleading",
      ],
      "We may contact you about your request and about related Zoxima services. You can opt out of marketing messages at any time by contacting us.",
    ],
  },
  {
    id: "privacy",
    heading: "5. Privacy",
    blocks: [
      "How we collect and use personal information is explained in our Privacy Policy, which forms part of these Terms.",
    ],
  },
  {
    id: "intellectual-property",
    heading: "6. Intellectual property",
    blocks: [
      "The Website and its content, including text, graphics, logos, designs, case studies and software, belong to Zoxima or its licensors. They’re protected by copyright, trademark and other laws.",
      "You may view the Website for your own internal business use. You may not copy, republish, sell, modify or distribute any content without our written permission, except as allowed by law.",
      "The Zoxima name and logo are our trademarks. Microsoft, Dynamics 365, Azure, Power BI, Teams, SharePoint, Office 365, Copilot, Salesforce, Sales Cloud, Service Cloud, AppExchange and AgentExchange are trademarks of their respective owners. Partner badges are shown under the terms of our partner programs. Showing them doesn’t mean those companies endorse every statement on the Website.",
    ],
  },
  {
    id: "acceptable-use",
    heading: "7. Acceptable use",
    blocks: [
      "You agree not to:",
      [
        "use the Website in a way that breaks any law",
        "try to gain unauthorized access to the Website, its servers or any connected systems",
        "introduce viruses, malware or other harmful code",
        "scrape, crawl or harvest data from the Website using automated tools, except for standard search engine indexing",
        "interfere with the Website’s operation or security",
        "pretend to be another person or company",
      ],
    ],
  },
  {
    id: "third-party-links",
    heading: "8. Third-party links",
    blocks: [
      "The Website links to third-party sites, such as Microsoft Marketplace, Salesforce AgentExchange and social media. We don’t control those sites and aren’t responsible for their content, policies or practices. Your use of them is governed by their own terms.",
    ],
  },
  {
    id: "case-studies",
    heading: "9. Customer references and case studies",
    blocks: [
      "Case studies describe customers by size and sector, not by name, unless the customer has agreed otherwise. Results described in case studies reflect specific projects. They aren’t a promise that you’ll get the same results.",
    ],
  },
  {
    id: "disclaimer",
    heading: "10. Disclaimer",
    blocks: [
      "The Website and its content are provided “as is” and “as available.” To the fullest extent allowed by law, we make no warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy or non-infringement. We don’t promise that the Website will always be available, error-free or free of harmful components.",
    ],
  },
  {
    id: "indemnity",
    heading: "11. Indemnity",
    blocks: [
      "You agree to defend and indemnify Zoxima against any claims, losses or costs, including reasonable legal fees, that arise from your misuse of the Website or your breach of these Terms.",
    ],
  },
  {
    id: "changes",
    heading: "12. Changes to the Website and these Terms",
    blocks: [
      "We may change, suspend or remove any part of the Website at any time. We may also update these Terms. The “Last updated” date shows when they last changed. If you keep using the Website after an update, you accept the updated Terms.",
    ],
  },
  {
    id: "governing-law",
    heading: "13. Governing law and disputes",
    blocks: [
      "These Terms are governed by the laws of the State of California, USA, without regard to its conflict-of-law rules. Any dispute about these Terms or the Website will be brought only in the state or federal courts located in Alameda County, California, and you agree to the jurisdiction of those courts.",
    ],
  },
  {
    id: "users-in-india",
    heading: "14. Users in India",
    blocks: [
      "If you use the Website from India, these Terms are between you and Zoxima Solutions Private Limited, Sector 142, Noida, Uttar Pradesh, India. They are governed by the laws of India, and any dispute about these Terms or the Website will be brought only in the courts at Noida, Uttar Pradesh, which will have exclusive jurisdiction. For users in India, this section replaces section 13.",
    ],
  },
  {
    id: "general",
    heading: "15. General",
    blocks: [
      "If any part of these Terms is found unenforceable, the rest stays in effect. If we don’t enforce a right, we haven’t waived it. You may not transfer your rights under these Terms. We may transfer ours to an affiliate or successor.",
    ],
  },
  {
    id: "contact",
    heading: "16. Contact us",
    blocks: ["Zoxima Solutions LLC", "44870 Osgood Road, Suite 5", "Fremont, CA, USA", CONTACT_EMAIL],
  },
]
