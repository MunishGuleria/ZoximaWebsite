import { notFound } from "next/navigation"
import { SitePage, pageMetadata } from "@/components/site/site-page"
import { CaseStudyDetail } from "@/components/site/case-study-detail"
import { CASE_STUDIES } from "@/lib/site/content/case-studies"
import { caseImage } from "@/lib/site/media"
import { CAPABILITY_PILLARS } from "@/lib/site/content/capabilities-industries"
import { SOLUTION_NAMES, SOLUTION_PAGES } from "@/lib/site/content/solutions"
import type { CaseStudy, Item, PageContent } from "@/lib/site/types"

/* The case study's own tags, linked: each result tag to its solution (doc
   solution name and line) and each capability to its page (doc pillar). */
const RESULT_SLUG: Record<string, string> = {
  "Lead to quote": "lead-to-quote",
  Pricing: "pricing",
  "Order to invoice": "order-to-invoice",
  Collections: "collections",
  Renewals: "service-renewals",
  "Sales productivity": "sales-productivity",
  Reviews: "sales-reviews",
  Service: "field-service",
  Channel: "distributor-channel",
  "Finance operations": "finance-operations",
}

/** Related case study: another from the same industry when there is one (the
 *  closest by shared capabilities and results, the doc's pick on a tie);
 *  otherwise the doc's own pick. */
function relatedCase(c: CaseStudy): CaseStudy | undefined {
  const docPick = c.related ? CASE_STUDIES.find((r) => r.slug === c.related) : undefined
  const sameIndustry = CASE_STUDIES.filter((r) => r.slug !== c.slug && r.industry === c.industry)
  if (!sameIndustry.length) return docPick
  const score = (r: CaseStudy) =>
    r.capabilities.filter((t) => c.capabilities.includes(t)).length +
    r.results_tags.filter((t) => c.results_tags.includes(t)).length +
    (r.slug === c.related ? 0.5 : 0)
  return [...sameIndustry].sort((a, b) => score(b) - score(a))[0]
}

function relatedLinks(c: CaseStudy): Item[] {
  const solutions = c.results_tags.flatMap((t) => {
    const i = SOLUTION_PAGES.findIndex((p) => p.route === `/solutions/${RESULT_SLUG[t]}`)
    return i < 0 ? [] : [{ title: SOLUTION_NAMES[i], body: SOLUTION_PAGES[i].h1, href: `/solutions?s=${RESULT_SLUG[t]}` }]
  })
  const capabilities = c.capabilities.flatMap((t) => {
    const p = CAPABILITY_PILLARS.find((x) => x.title === t)
    return p ? [{ title: p.title, body: p.body, href: p.href }] : []
  })
  return [...solutions, ...capabilities]
}

/* Page data for metadata, structured data and the closing. The page body is
   CaseStudyDetail (components/site/case-study-detail.tsx). */
function toPage(c: CaseStudy): PageContent {
  return {
    route: `/case-studies/${c.slug}`,
    crumbs: [{ label: "Case studies", href: "/case-studies" }],
    seoTitle: c.seoTitle,
    seoDescription: c.seoDescription,
    eyebrow: "Case study",
    h1: c.name,
    sub: c.summary ?? c.who,
    visual: { kind: "photo", src: caseImage(c.slug), alt: "" },
    sections: [],
    closing: {
      h2: "Let’s talk about your sales operation",
      body: "Tell us where work slips today. We’ll show you what we’d build, and how fast.",
      ctas: [
        { label: "See more case studies", href: "/case-studies" },
        { label: "Contact us", href: "/contact" },
      ],
    },
  }
}

const bySlug = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug)

export const dynamicParams = false

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const study = bySlug((await params).slug)
  return study ? pageMetadata(toPage(study)) : {}
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const study = bySlug((await params).slug)
  if (!study) notFound()
  const index = CASE_STUDIES.indexOf(study)
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length]
  return (
    <SitePage
      page={toPage(study)}
      label={study.name}
      layout={<CaseStudyDetail study={study} index={index} related={relatedCase(study)} next={next} links={relatedLinks(study)} />}
    />
  )
}
