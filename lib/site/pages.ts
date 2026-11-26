import {
  CAPABILITIES_OVERVIEW,
  CAPABILITY_PAGES,
  INDUSTRIES_OVERVIEW,
  INDUSTRY_PAGES,
} from "@/lib/site/content/capabilities-industries"
import {
  ABOUT_PAGE,
  CAREERS_PAGE,
  CONTACT_PAGE,
  INSIGHTS_SECTION,
  PARTNERS_PAGE,
  PRIVACY_PAGE,
  PRODUCTS_PAGE,
  SECURITY_PAGE,
  TERMS_PAGE,
} from "@/lib/site/content/company"
import {
  AI_FAQ,
  AI_INSIDE,
  AI_WHERE_IT_RUNS,
  APPLY_SECTION,
  APPSOURCE_APPS,
  COVERAGE_SECTION,
  INDUSTRY_CARDS,
  PARTNER_STACK,
  PILLARS_SECTION,
  PLATFORM_STACK,
  SCALE_PROOF,
  WHERE_WE_ARE,
  WORK_CASES,
} from "@/lib/site/content/shared"
import { type PageContent, type Section } from "@/lib/site/types"
import { SOLUTION_PAGES, SOLUTIONS_OVERVIEW } from "@/lib/site/content/solutions"
import { MICROSOFT_PRACTICE } from "@/lib/site/content/partner-microsoft"
import { SALESFORCE_PRACTICE } from "@/lib/site/content/partner-salesforce"

/* --------------------------------------------------------------------------
   Thin doc pages carry more real Zoxima content: blocks from the doc's own
   home page and the live home sections (lib/site/content/shared.ts), each
   placed only where it is on the page's topic. The doc's sections keep
   their order; added blocks go where they read naturally.
   -------------------------------------------------------------------------- */
const titled = (page: PageContent, title: string) =>
  page.sections.find((s) => "title" in s && s.title === title) as Section

const ENRICHED: Record<string, (p: PageContent) => Section[]> = {
  "/about": (p) => [
    titled(p, "Our story"),
    titled(p, "What we believe"),
    PILLARS_SECTION,
    titled(p, "Leadership"),
    titled(p, "Where we are"),
    INDUSTRY_CARDS,
    PARTNER_STACK,
    SCALE_PROOF,
    WORK_CASES,
    INSIGHTS_SECTION,
  ],
  "/careers": (p) => [
    titled(p, "Why Zoxima"),
    PILLARS_SECTION,
    SCALE_PROOF,
    PLATFORM_STACK,
    WHERE_WE_ARE,
    APPLY_SECTION,
  ],
  "/security": (p) => [
    titled(p, "Your data"),
    titled(p, "AI governance"),
    AI_INSIDE,
    AI_WHERE_IT_RUNS,
    ...p.sections.filter((s) => s.kind === "text" && ["Hosting", "Compliance", "Report a concern"].includes(s.title)),
    AI_FAQ,
  ],
  "/industries": (p) => [{ ...p.sections[0], title: "Industries" } as Section, COVERAGE_SECTION, SCALE_PROOF, WORK_CASES],
  "/capabilities": (p) => [...p.sections, SCALE_PROOF, WORK_CASES],
  "/capabilities/platforms": (p) => [...p.sections, APPSOURCE_APPS, SCALE_PROOF],
}

const enrich = (page: PageContent): PageContent => {
  const add = ENRICHED[page.route]
  return add ? { ...page, sections: add(page).filter(Boolean) } : page
}

/** Every data-driven page, keyed by its route from the content doc. */
const DOC_PAGES: PageContent[] = [
  CAPABILITIES_OVERVIEW,
  ...CAPABILITY_PAGES,
  INDUSTRIES_OVERVIEW,
  ...INDUSTRY_PAGES,
  SOLUTIONS_OVERVIEW,
  ...SOLUTION_PAGES,
  PRODUCTS_PAGE,
  ABOUT_PAGE,
  PARTNERS_PAGE,
  MICROSOFT_PRACTICE.page,
  SALESFORCE_PRACTICE.page,
  SECURITY_PAGE,
  CAREERS_PAGE,
  CONTACT_PAGE,
  PRIVACY_PAGE,
  TERMS_PAGE,
]

const ALL_PAGES = DOC_PAGES.map(enrich)

/** Every doc route with a page, for the sitemap. */
export const ALL_ROUTES = ALL_PAGES.map((p) => p.route)

/** The page for a route; throws at build time if the doc route is missing. */
export function pageFor(route: string): PageContent {
  const page = ALL_PAGES.find((p) => p.route === route)
  if (!page) throw new Error(`No content for route ${route}`)
  return page
}
