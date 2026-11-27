import { BOOK_ANCHOR } from "@/lib/site/content/health-check-booking"
import { SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"
import type { Cta, PageContent } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   Salesforce practice page (/partners/salesforce): the health check offer.

   The page opens with the partner-page hero (as on /partners/microsoft:
   eyebrow chip, headline, subline, buttons, proof strip on ink), with the
   Salesforce partner copy supplied by Zoxima (Nov 2026). Below it, in the
   order of Zoxima's clickable prototype (screen 2): ten areas, how it works,
   quick wins and roadmap, the offer, customer reviews, the guide band.
   Rendered by components/site/salesforce-page.tsx.
   -------------------------------------------------------------------------- */

/** Scorecard dot on an area: red, amber or green (an example scorecard). */
export type AreaStatus = "r" | "a" | "g"

export type SalesforcePageContent = {
  /** Route, SEO, crumbs and the hero's H1 (+ h1Accent), sub and buttons. */
  page: PageContent
  /** The hero's chip and proof strip. `sub` is an extra line for
   *  /llms-full.txt only (the hero shows page.sub); empty when none. */
  hero: { eyebrow: string; sub: string; proof: { text: string; stars?: boolean }[] }
  rating: { value: string; label: [string, string] }
  areas: {
    eyebrow: string
    title: string
    accent: string
    items: { name: string; sub: string; status: AreaStatus; href: string }[]
    note: string
    noteSmall: string
    /** Button under the list: the guide page with all 10 problems. */
    cta: Cta
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
    /** The booking card (#book) that ends the offer. */
    book: { button: string; title: string; body: string }
  }
  reviews: { eyebrow: string; title: string; accent: string }
  guide: { eyebrow: string; title: string; cta: Cta }
}

/** Every "Book your health check" on the page opens the booking card (#book). */
const BOOK: Cta = { label: "Book your health check", href: `#${BOOK_ANCHOR}` }


export const SALESFORCE_PAGE: SalesforcePageContent = {
  page: {
    route: "/partners/salesforce",
    seoTitle: "Salesforce consulting partner | Zoxima",
    seoDescription:
      "We design, build and fix Salesforce for mid-size and large companies, so reports can be trusted, data stays clean and reps spend their time selling.",
    h1: "Salesforce that your sales team actually uses.",
    h1Accent: "actually uses.",
    sub: "We design, build and fix Salesforce for mid-size and large companies, so reports can be trusted, data stays clean and reps spend their time selling.",
    // No hero button: booking is in the offer section (it opens the booking card).
    sections: [],
  },
  hero: {
    eyebrow: "Salesforce Partner",
    sub: "",
    proof: [
      { text: "4.97 rating from 41 reviews", stars: true },
      { text: "75+ Salesforce projects" },
      { text: "26 Salesforce certifications" },
    ],
  },
  rating: { value: "4.97", label: ["Salesforce partner rating", "on AppExchange"] },
  areas: {
    eyebrow: "What we check",
    title: "Ten areas, one clear scorecard",
    accent: "one clear scorecard",
    items: [
      { name: "Reports", sub: "Numbers leaders can trust", status: "r", href: SF_GUIDE_ROUTE },
      { name: "Data", sub: "One true view of every customer", status: "r", href: SF_GUIDE_ROUTE },
      { name: "Process and adoption", sub: "A system reps want to use", status: "a", href: SF_GUIDE_ROUTE },
      { name: "AI readiness", sub: "AI built on solid data and clear goals", status: "a", href: SF_GUIDE_ROUTE },
      { name: "Automations", sub: "Processes on supported tools", status: "r", href: SF_GUIDE_ROUTE },
      { name: "Connected systems", sub: "ERP, email and chat in one place", status: "a", href: SF_GUIDE_ROUTE },
      { name: "Customer view", sub: "The whole story before every call", status: "a", href: SF_GUIDE_ROUTE },
      { name: "Leads", sub: "Faster follow-up, fewer lost deals", status: "g", href: SF_GUIDE_ROUTE },
      { name: "Mobile", sub: "Reps prep and update on the go", status: "a", href: SF_GUIDE_ROUTE },
      { name: "Daily actions", sub: "Every call and email captured", status: "g", href: SF_GUIDE_ROUTE },
    ],
    note: "See where your biggest wins are, and where to start.",
    noteSmall: "(Dots show an example scorecard.)",
    cta: { label: "Browse the 10 problems", href: SF_GUIDE_ROUTE },
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
    book: {
      button: BOOK.label,
      title: "Book your health check call",
      body: "Pick a day and a time for a 20-minute call. We'll confirm it by email and send a calendar invite.",
    },
  },
  reviews: { eyebrow: "Customer reviews", title: "What customers say on AppExchange", accent: "on AppExchange" },
  guide: {
    eyebrow: "Free guide",
    title: "10 common Salesforce problems and how to fix them",
    cta: { label: "Read the guide", href: SF_GUIDE_ROUTE },
  },
}
