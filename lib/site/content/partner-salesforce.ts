import { SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"
import type { Cta, PageContent } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   Salesforce practice page (/partners/salesforce): the health check offer.

   Copy and order follow Zoxima's clickable prototype (screen 2, "Salesforce
   page = the carousel ad, in more detail"): hook, ten areas, how it works,
   quick wins and roadmap, the offer, customer reviews, the guide band.
   Rendered by components/site/salesforce-page.tsx.
   -------------------------------------------------------------------------- */

/** Scorecard dot on an area: red, amber or green (an example scorecard). */
export type AreaStatus = "r" | "a" | "g"

export type SalesforcePageContent = {
  /** Route and SEO (title, description). h1/sub feed structured data. */
  page: PageContent
  hero: { eyebrow: string; h1: string; accent: string; sub: string; cta: Cta }
  rating: { value: string; label: [string, string] }
  areas: {
    eyebrow: string
    title: string
    accent: string
    items: { name: string; sub: string; status: AreaStatus; href: string }[]
    note: string
    noteSmall: string
  }
  steps: { eyebrow: string; title: string; accent: string; items: { title: string; body: string; icon: "target" | "search" | "doc" }[]; footer: string }
  next: {
    eyebrow: string
    title: string
    accent: string
    cards: { label: string; items: string[]; footer: string }[]
  }
  offer: {
    eyebrow: string
    title: string
    accent: string
    prices: { label: string; from?: string; price: string; body: string }[]
    notes: { accent: string; rest: string; body: string }[]
    cta: Cta
  }
  reviews: { eyebrow: string; title: string; accent: string }
  guide: { eyebrow: string; title: string; cta: Cta }
}

/** The health check booking link (hero CTA scrolls to the offer, which ends here). */
const BOOK: Cta = { label: "Book your health check", href: "/contact?topic=Salesforce&msg=health-check" }

/** Problem n's page in the guide. */
const problemHref = (n: number) => {
  const p = SF_GUIDE_PROBLEMS.find((x) => x.n === n)
  return p ? `${SF_GUIDE_ROUTE}/${p.id}` : SF_GUIDE_ROUTE
}

const H1 = "Is your Salesforce helping you sell, or just keeping records?"

export const SALESFORCE_PAGE: SalesforcePageContent = {
  page: {
    route: "/partners/salesforce",
    seoTitle: "Salesforce consulting partner | Zoxima",
    seoDescription:
      "We design, build and fix Salesforce for mid-size and large companies, so reports can be trusted, data stays clean and reps spend their time selling.",
    h1: H1,
    h1Accent: "helping you sell,",
    // Not shown on the page: the Service description in structured data and /llms-full.txt.
    sub: "We design, build and fix Salesforce for mid-size and large companies, so reports can be trusted, data stays clean and reps spend their time selling.",
    sections: [],
  },
  hero: {
    eyebrow: "Salesforce health check with fixes",
    h1: H1,
    accent: "helping you sell,",
    sub: "The fix is simpler than you think.",
    cta: { label: BOOK.label, href: "#sf-offer" },
  },
  rating: { value: "4.97", label: ["Salesforce partner rating", "on AppExchange"] },
  areas: {
    eyebrow: "What we check",
    title: "Ten areas, one clear scorecard",
    accent: "one clear scorecard",
    items: [
      { name: "Reports", sub: "Numbers leaders can trust", status: "r", href: problemHref(1) },
      { name: "Data", sub: "One true view of every customer", status: "r", href: problemHref(2) },
      { name: "Process and adoption", sub: "A system reps want to use", status: "a", href: problemHref(3) },
      { name: "AI readiness", sub: "AI built on solid data and clear goals", status: "a", href: problemHref(4) },
      { name: "Automations", sub: "Processes on supported tools", status: "r", href: problemHref(5) },
      { name: "Connected systems", sub: "ERP, email and chat in one place", status: "a", href: problemHref(6) },
      { name: "Customer view", sub: "The whole story before every call", status: "a", href: problemHref(7) },
      { name: "Leads", sub: "Faster follow-up, fewer lost deals", status: "g", href: problemHref(8) },
      { name: "Mobile", sub: "Reps prep and update on the go", status: "a", href: problemHref(9) },
      { name: "Daily actions", sub: "Every call and email captured", status: "g", href: problemHref(10) },
    ],
    note: "See where your biggest wins are, and where to start.",
    noteSmall: "(Dots show an example scorecard.)",
  },
  steps: {
    eyebrow: "How it works",
    title: "Simple for you, start to finish",
    accent: "start to finish",
    items: [
      { title: "Understand your priorities", body: "A conversation about your goals and what hurts most", icon: "target" },
      { title: "Detailed review of your setup", body: "Read-only access, nothing in your system changes", icon: "search" },
      { title: "Clear findings report", body: "Plus a free re-scan after the fixes", icon: "doc" },
    ],
    footer: "Done by experts, with AI-assisted checks.",
  },
  next: {
    eyebrow: "What happens next",
    title: "Quick wins now, a clear roadmap for what's next",
    accent: "a clear roadmap",
    cards: [
      { label: "Choose your quick wins", items: ["Trusted reports", "Clean data", "Working automations"], footer: "Fixed scope, fixed price, done in weeks." },
      { label: "Defined roadmap", items: ["ERP integration", "A full customer view", "AI"], footer: "Planned in the right order." },
    ],
  },
  offer: {
    eyebrow: "The offer",
    title: "Start with a health check",
    accent: "health check",
    prices: [
      { label: "Health check", price: "$1,995", body: "Scorecard, findings report and a free re-scan" },
      { label: "Each fix", from: "from", price: "$2,500", body: "Fixed scope, fixed price, done in weeks" },
    ],
    notes: [
      { accent: "Free", rest: " with two or more fixes", body: "The health check costs nothing" },
      { accent: "Credited back", rest: " within 30 days", body: "If you buy fixes after the check" },
    ],
    cta: BOOK,
  },
  reviews: { eyebrow: "Customer reviews", title: "What customers say on AppExchange", accent: "on AppExchange" },
  guide: {
    eyebrow: "Free guide",
    title: "10 common Salesforce problems and how to fix them",
    cta: { label: "Read the guide", href: SF_GUIDE_ROUTE },
  },
}
