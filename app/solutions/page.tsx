import { SolutionsExplorer, type SolutionEntry } from "@/components/solutions/explorer"
import { SitePage, pageMetadata } from "@/components/site/site-page"
import { DESK, visualFor } from "@/lib/site/media"
import { SOLUTION_NAMES, SOLUTION_PAGES } from "@/lib/site/content/solutions"
import { pageFor } from "@/lib/site/pages"

const page = pageFor("/solutions")

export const metadata = pageMetadata(page)

/* All ten solutions on one page, behind a filter (?s=<slug>). */
const entries: SolutionEntry[] = SOLUTION_PAGES.map((p, i) => {
  const v = visualFor(p)
  return {
    slug: p.route.split("/").pop() ?? String(i),
    name: SOLUTION_NAMES[i],
    page: p,
    desk: v.kind === "desks" ? v.srcs[0] : DESK.lead,
  }
})

export default function Page() {
  return <SitePage page={page} label="Solutions" sections={<SolutionsExplorer entries={entries} />} />
}
