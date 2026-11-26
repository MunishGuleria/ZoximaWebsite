import { notFound } from "next/navigation"
import { SitePage, pageMetadata } from "@/components/site/site-page"
import { SOLUTION_PAGES } from "@/lib/site/content/solutions"

const bySlug = (slug: string) => SOLUTION_PAGES.find((p) => p.route === `/solutions/${slug}`)

export const dynamicParams = false

export function generateStaticParams() {
  return SOLUTION_PAGES.map((p) => ({ slug: p.route.replace("/solutions/", "") }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const page = bySlug((await params).slug)
  return page ? pageMetadata(page) : {}
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = bySlug((await params).slug)
  if (!page) notFound()
  return <SitePage page={page} />
}
