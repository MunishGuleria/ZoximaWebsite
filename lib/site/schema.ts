/* --------------------------------------------------------------------------
   The company and its product as schema.org entities, shared by every page:
   the home page puts them in its graph, and every inner page repeats the
   company (search engines read each page on its own, so the HQ, hours and
   founder travel with every page, not only the home page).

   HQ (confirmed by Zoxima): Zoxima Solutions LLC, 44870 Osgood Road, Suite 5,
   Fremont, California, USA 94539. Hours: Monday–Friday, 8:30 AM – 5:00 PM PST.
   Typed as Organization + ProfessionalService so the entity is eligible for
   local and map results as well as acting as the publisher node.
   -------------------------------------------------------------------------- */
export const SITE_URL = "https://www.zoxima.com"

export const ORGANIZATION_SCHEMA = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: "Zoxima",
  legalName: "Zoxima Solutions LLC",
  alternateName: "Zoxima Solutions",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/zoxima-logo.png`,
  },
  description:
    "Zoxima builds the applications, automations and AI agents that run sales and service for large enterprises. Microsoft Solutions Partner and Salesforce Partner, headquartered in Fremont, California, with 90+ large enterprise projects. Maker of Salezx.",
  image: `${SITE_URL}/og-image.png`,
  slogan: "Large enterprises run their sales and service on systems we build.",
  email: "info@zoxima.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "44870 Osgood Road, Suite 5",
    addressLocality: "Fremont",
    addressRegion: "CA",
    postalCode: "94539",
    addressCountry: "US",
  },
  hasMap: "https://www.google.com/maps/search/?api=1&query=44870+Osgood+Road+Suite+5+Fremont+CA+94539",
  founder: {
    "@type": "Person",
    "@id": `${SITE_URL}/#founder`,
    name: "Jagpreet Singh",
    jobTitle: "Founder and CEO",
    worksFor: { "@id": `${SITE_URL}/#organization` },
    sameAs: ["https://www.linkedin.com/in/jagpreet-singh-931a9213/"],
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "08:30",
      closes: "17:00",
    },
  ],
  areaServed: [{ "@type": "Country", name: "United States" }],
  knowsAbout: [
    "Sales automation",
    "Sales operations",
    "Enterprise AI agents",
    "Multi-agent systems",
    "Model Context Protocol",
    "Microsoft Dynamics 365",
    "Microsoft Power Platform",
    "Microsoft Copilot Studio",
    "Azure OpenAI",
    "Salesforce Sales Cloud and Service Cloud",
    "CRM implementation",
    "Lead to quote",
    "Pricing and CPQ",
    "Order to invoice",
    "Direct Store Delivery",
    "Collections and credit",
    "Service contract renewals",
    "Field service",
    "Distributor and dealer management",
    "Schemes, incentives and loyalty",
    "Invoice processing and finance operations",
    "Voice AI",
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@id": `${SITE_URL}/#salezx` } },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Sales",
      email: "info@zoxima.com",
      availableLanguage: ["English"],
      areaServed: ["US"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "17:00",
      },
    },
  ],
  // Partner status as stated on /partners/microsoft and /partners/salesforce.
  award: [
    "Microsoft Solutions Partner: Business Applications",
    "Microsoft Solutions Partner: Data & AI",
    "Microsoft Solutions Partner: Digital & App Innovation",
    "Microsoft specialization: Agentic Business Solutions",
    "Salesforce Partner, rated 4.97 from 41 reviews on AppExchange",
  ],
  // The Indian affiliate, named in the Privacy Policy and Terms of Service.
  subOrganization: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#zoxima-india`,
    name: "Zoxima Solutions Private Limited",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sector 142",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  },
  sameAs: [
    "https://www.linkedin.com/company/zoxima/",
    "https://appexchange.salesforce.com/appxConsultingListingDetail?listingId=a0N3A00000FnDXAUA3",
  ],
}

/* Products get their own entities so an answer engine can attribute
   "who makes Salezx" back to Zoxima. */
export const SALEZX_SCHEMA = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#salezx`,
  name: "Salezx",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Microsoft Teams, Microsoft 365",
  url: "https://salezx.com",
  description:
    "Salezx is your strongest sales ops team, on the CRM, ERP reports and email you already use: desks for collections, service renewals, ordering and billing, lead actions, pricing and quotes, rep preparation and reviews. Start with the desk where your money slips; live in about a week. Built by Zoxima from its work for large enterprises.",
  publisher: { "@id": `${SITE_URL}/#organization` },
}
