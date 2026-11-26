import type { Metadata } from "next"

import { Hero } from "@/components/home/hero"
import { ProofBar } from "@/components/home/proof-bar"
import { WhatWeDrive } from "@/components/home/what-we-drive"
import { Coverage } from "@/components/home/coverage"
// Previous scroll deck: import { Capabilities } from "@/components/home/capabilities"
import { CapabilitiesStack } from "@/components/home/capabilities-stack"
import { MicrosoftWork, SalesforceWork } from "@/components/home/partners"
import { McpAdvantage } from "@/components/home/mcp-advantage"
import { EngineeringScale } from "@/components/home/engineering-scale"
import { Work } from "@/components/home/work"
import { Products } from "@/components/home/products"
import { ClosingCta } from "@/components/home/closing-cta"
import { SiteFooter } from "@/components/site-footer"
import { ORGANIZATION_SCHEMA, SALEZX_SCHEMA } from "@/lib/site/schema"

const SITE_URL = "https://www.zoxima.com"

export const metadata: Metadata = {
  // The root page shares a segment with the root layout, so `title.template`
  // does not apply here — the brand has to be written into the title itself.
  title: "Zoxima | Sales automation and enterprise AI",
  description:
    "Zoxima builds the applications, automations and AI agents that run sales and service for large enterprises.",
  alternates: { canonical: "/", types: { "application/rss+xml": [{ url: "/rss.xml", title: "Zoxima case studies" }] } },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Zoxima",
    title: "Zoxima | Sales automation and enterprise AI",
    description:
      "Zoxima builds the applications, automations and AI agents that run sales and service for large enterprises.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Zoxima: Large enterprises run their sales and service on systems we build." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoxima | Sales automation and enterprise AI",
    description:
      "Zoxima builds the applications, automations and AI agents that run sales and service for large enterprises.",
    images: ["/og-image.png"],
  },
}

/* --------------------------------------------------------------------------
   Structured data.
   Organization + WebSite establish the entity (Zoxima Solutions LLC, Fremont);
   BreadcrumbList and Service give crawlers the site's shape. No FAQPage here:
   Google only accepts FAQ markup for questions shown on the page, and the home
   page shows none (FAQ markup lives on /capabilities/ai/how-it-works).

   The company and Salezx entities live in lib/site/schema.ts (shared with
   every inner page).
   -------------------------------------------------------------------------- */
const websiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Zoxima",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
}

const serviceSchema = {
  "@type": "Service",
  "@id": `${SITE_URL}/#service`,
  name: "Applications, automations and AI for sales and service",
  serviceType:
    "Salesforce and Microsoft Dynamics 365 implementation, Power Platform applications, workflow automation and agentic AI",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: [{ "@type": "Country", name: "United States" }],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Zoxima services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Applications",
          url: `${SITE_URL}/capabilities/applications`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Automations",
          url: `${SITE_URL}/capabilities/automations`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI",
          url: `${SITE_URL}/capabilities/ai`,
        },
      },
    ],
  },
}

const breadcrumbSchema = {
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
  ],
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    ORGANIZATION_SCHEMA,
    websiteSchema,
    serviceSchema,
    SALEZX_SCHEMA,
    breadcrumbSchema,
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Structured data is static and authored here — no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main" className="zx">
        <Hero />
        <ProofBar />
        <WhatWeDrive />
        <Coverage />
        <McpAdvantage />
        <EngineeringScale />
        <CapabilitiesStack />
        <SalesforceWork />
        <MicrosoftWork />
        <Work />
        <Products />
        <ClosingCta />
      </main>

      <SiteFooter />
    </>
  )
}
