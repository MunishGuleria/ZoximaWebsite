import { notFound } from "next/navigation"
import { SitePage, pageMetadata } from "@/components/site/site-page"
import { GuideSection, guideSectionPage } from "@/components/site/guide-section"
import { SF_GUIDE_PROBLEMS } from "@/lib/site/content/salesforce-guide"

/* One section of the Salesforce guide, e.g. /partners/salesforce/guide/reports-nobody-trusts. */

export const dynamicParams = false

export function generateStaticParams() {
  return SF_GUIDE_PROBLEMS.map((p) => ({ slug: p.id }))
}

const problemFor = (slug: string) => SF_GUIDE_PROBLEMS.find((p) => p.id === slug)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const problem = problemFor((await params).slug)
  return problem ? pageMetadata(guideSectionPage(problem)) : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const problem = problemFor((await params).slug)
  if (!problem) notFound()
  return <SitePage page={guideSectionPage(problem)} label={problem.title} layout={<GuideSection problem={problem} />} />
}
