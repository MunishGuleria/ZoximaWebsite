/* --------------------------------------------------------------------------
   Visuals for the content pages: which photo / Salezx desk / illustration
   sits in each hero, and which photo each case study uses. Kept apart from
   the doc copy (lib/site/content/*), which stays a verbatim transcription.
   -------------------------------------------------------------------------- */
import type { PageContent, Visual } from "@/lib/site/types"

const photo = (name: string, alt: string, position?: string, list?: string[]): Visual => ({
  kind: "photo",
  src: `/images/pages/${name}.webp`,
  alt,
  position,
  list,
})

export const DESK = {
  lead: "/desks/01_lead_to_quote.webp",
  pricing: "/desks/02_pricing_cpq.webp",
  orders: "/desks/03_orders.webp",
  collections: "/desks/04_collections.webp",
  renewals: "/desks/05_renewals.webp",
  productivity: "/desks/06_productivity.webp",
  governance: "/desks/07_governance.webp",
} as const

const desks = (...keys: (keyof typeof DESK)[]): Visual => ({ kind: "desks", srcs: keys.map((k) => DESK[k]) })

const ROUTE_VISUALS: Record<string, Visual> = {
  // Capabilities: hero visuals carry doc text only (pillar names, item titles).
  "/capabilities": {
    kind: "chain",
    items: [
      { title: "Applications", icon: "apps" },
      { title: "Automations", icon: "flow" },
      { title: "AI", icon: "ai" },
    ],
  },
  "/capabilities/applications": photo("applications", "Analytics application on a laptop"),
  "/capabilities/automations": photo("automations", "Connected systems running automated work"),
  "/capabilities/ai": photo("ai", "AI lettering over a field of connected data"),
  "/capabilities/ai/how-it-works": {
    kind: "illustration",
    src: "/hero-unified-ai-v2.webp",
    alt: "One AI layer connecting CRM, sales, operations, security and data",
  },
  "/capabilities/platforms": photo("platforms", "CRM dashboard on a laptop"),

  "/industries": photo("corporate", "Glass office tower"),
  "/industries/manufacturing": photo("manufacturing", "Engineer assembling an electronics board"),
  "/industries/appliances-manufacturing": photo("appliances", "Modern office kitchen with appliances"),
  "/industries/building-materials": photo("construction", "High-rise construction under cranes"),
  "/industries/consumer-goods": photo("consumer-goods", "Supermarket aisle stocked with consumer goods"),
  "/industries/education": photo("education", "Graduates throwing their caps"),
  "/industries/digital-natives": photo("digital-natives", "Team working on laptops"),

  "/solutions": desks("lead", "orders", "collections"),
  "/solutions/lead-to-quote": desks("lead"),
  "/solutions/pricing": desks("pricing"),
  "/solutions/order-to-invoice": desks("orders"),
  "/solutions/collections": desks("collections"),
  "/solutions/service-renewals": desks("renewals"),
  "/solutions/sales-productivity": desks("productivity"),
  "/solutions/sales-reviews": desks("governance"),
  "/solutions/field-service": desks("renewals", "productivity"),
  "/solutions/distributor-channel": desks("orders", "pricing"),
  "/solutions/finance-operations": desks("collections", "orders"),

  "/products": desks("collections", "renewals", "orders"),
  "/about": photo("corporate", "Glass office tower"),
  "/careers": photo("team", "Team planning at a whiteboard"),
  "/partners": photo("platforms", "CRM dashboard on a laptop"),
  "/security": { kind: "index" },
  "/contact": { kind: "none" },
  "/case-studies": photo("construction", "High-rise construction under cranes"),
}

export function visualFor(page: PageContent): Visual {
  return page.visual ?? ROUTE_VISUALS[page.route] ?? { kind: "index" }
}

/** Photo per case study (cards in the library and the case-study hero). */
export const CASE_IMAGES: Record<string, string> = {
  "building-materials-partner-network": "/images/pages/construction.webp",
  "electrical-products-leadership-ai": "/images/pages/manufacturing.webp",
  "snack-foods-ai-agents": "/images/pages/consumer-goods.webp",
  "bottled-water-direct-store-delivery": "/images/pages/bottle.webp",
  "marketplace-sales-service-crm": "/images/pages/digital-natives.webp",
  "corporate-services-finance-operations": "/images/pages/corporate.webp",
  "conglomerate-approvals-sales-targets": "/images/pages/dashboard.webp",
  "technology-promotional-pricing": "/images/pages/applications.webp",
  "healthcare-invoice-validation": "/images/pages/insights.webp",
  "visa-services-voice-ai": "/images/pages/team.webp",
  "business-schools-admissions-ai": "/images/pages/education.webp",
  "medical-imaging-sales-service": "/images/pages/appliances.webp",
  "building-materials-dealer-apps": "/images/pages/platforms.webp",
  "education-crm-learning-app": "/images/pages/education.webp",
  "logistics-workforce-ai": "/images/pages/automations.webp",
  "postal-case-tagging-ai": "/images/pages/ai.webp",
}

export const caseImage = (slug: string) => CASE_IMAGES[slug] ?? "/images/pages/dashboard.webp"

/** Photo for a card that links to an industry page (same photo as its hero). */
export function photoForHref(href?: string): string | undefined {
  if (!href?.startsWith("/industries/")) return undefined
  const v = ROUTE_VISUALS[href]
  return v?.kind === "photo" ? v.src : undefined
}
