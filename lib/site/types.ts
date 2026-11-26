/* --------------------------------------------------------------------------
   Content model for every page built from Zoxima_Website_Content_v2.docx.

   Pages are data: a hero, an ordered list of sections, and a closing. The
   copy is transcribed from the doc verbatim (US English, [bracketed] figures
   kept as-is until confirmed). Layout lives in components/site/*.
   -------------------------------------------------------------------------- */

export interface Cta {
  label: string
  href: string
  /** Opens in a new tab (e.g. salezx.com). */
  external?: boolean
}

/** One entry in a list. Doc lines shaped "Title. Body" are split into both. */
export interface Item {
  title?: string
  body: string
  /** Optional link for the whole item (e.g. a solution page). */
  href?: string
  /** Optional link label shown under the item, e.g. "Explore applications". */
  linkLabel?: string
  external?: boolean
  /** Optional illustration shown on the card (e.g. a Salezx desk). */
  image?: string
  /** Optional icon name for cards (see ICONS in components/site/sections.tsx). */
  icon?: string
}

/** The hero's right-hand visual. Pages without one get the section index. */
export type Visual =
  | {
      kind: "photo"
      src: string
      alt: string
      position?: string
      /** Optional frosted card over the photo listing doc items. */
      list?: string[]
    }
  /** Linked cards with flowing connectors (e.g. Applications → Automations → AI). */
  | { kind: "chain"; items: { title: string; icon: string }[] }
  | { kind: "illustration"; src: string; alt: string }
  | { kind: "desks"; srcs: string[] }
  | { kind: "index" }
  | { kind: "none" }

export type Section =
  /** A titled list. `style` picks the layout:
   *  cards    — a grid of bordered cards (title + body)
   *  numbered — steps with large numerals (ordered process / architecture)
   *  checks   — compact checklist (governance, "every desk includes")
   *  rows     — ruled rows, title left, body right (dense reference lists) */
  | {
      kind: "list"
      title: string
      intro?: string
      style: "cards" | "numbered" | "checks" | "rows"
      items: Item[]
    }
  /** Prose paragraphs under a title (story, "where it runs", notes). */
  | { kind: "text"; title: string; body: string[] }
  /** Linked rows to other pages ("What we build" on industry pages, "Related"). */
  | { kind: "links"; title: string; intro?: string; items: Item[] }
  /** Teasers for case studies. `slug` links to /case-studies/<slug>. */
  | { kind: "cases"; title: string; items: { slug: string; summary: string }[] }
  /** Short proof statements in a row. */
  | { kind: "proof"; title?: string; intro?: string; items: string[]; /** Source line under each figure. */ sources?: string[] }
  /** Platform / stack groups, e.g. "Built on". */
  | { kind: "stack"; title?: string; intro?: string; groups: { name: string; items: string[] }[] }
  | { kind: "faq"; title: string; items: { q: string; a: string }[] }
  /** The Salezx cross-sell panel. */
  | { kind: "salezx"; body: string; cta?: Cta }

export interface Closing {
  /** Optional: some doc pages close with buttons only. */
  h2?: string
  body?: string
  ctas: Cta[]
}

export interface PageContent {
  /** Route as in the doc, e.g. "/solutions/lead-to-quote". */
  route: string
  /** Breadcrumb trail above the hero (excluding Home and the page itself). */
  crumbs?: { label: string; href: string }[]
  seoTitle: string
  seoDescription: string
  /** Small line above the H1 (section name), sentence case. */
  eyebrow?: string
  h1: string
  /** Trailing words of the H1 set in the serif accent. Must be a suffix of h1. */
  h1Accent?: string
  sub: string
  heroCtas?: Cta[]
  /** Overrides the route's default hero visual (lib/site/media.ts). */
  visual?: Visual
  sections: Section[]
  closing?: Closing
}

/** The standard closing used across the site. */
export const STANDARD_CLOSING: Closing = {
  h2: "Let’s talk about your sales operation",
  body: "Tell us where work slips today. We’ll show you what we’d build, and how fast.",
  ctas: [{ label: "Contact us", href: "/contact" }],
}

export const SALEZX_URL = "https://salezx.com"

export const SALEZX_PANEL: Section = {
  kind: "salezx",
  body: "Want it ready-made? Salezx runs this as a desk, live in about a week.",
  cta: { label: "Visit salezx.com", href: SALEZX_URL, external: true },
}

/* --------------------------------------------------------------------------
   Case studies
   -------------------------------------------------------------------------- */
export type CapabilityTag = "Applications" | "Automations" | "AI"

export interface CaseStudy {
  slug: string
  /** Short name, e.g. "Building materials manufacturer". */
  name: string
  seoTitle: string
  seoDescription: string
  /** "Who they are" line (size and sector only). */
  who: string
  /** Two or three sentences: the problem and what we built (hero line). */
  summary?: string
  challenge: string[]
  built: string[]
  /** 2–3 results; bracketed placeholders kept until confirmed. */
  results: string[]
  platform: string
  capabilities: CapabilityTag[]
  /** Industry label as used in the doc's filters, if any. */
  industry?: string
  /** Result/solution labels from the doc's tags, e.g. "Collections". */
  results_tags: string[]
  /** Slug of the related case study, if the doc gives one. */
  related?: string
}
