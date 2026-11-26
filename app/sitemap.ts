import type { MetadataRoute } from "next"
import { CASE_STUDIES } from "@/lib/site/content/case-studies"
import { SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"
import { ALL_ROUTES } from "@/lib/site/pages"

const SITE_URL = "https://www.zoxima.com"

/**
 * Generated at build time from the page data (Zoxima_Website_Content_v2.docx),
 * so it can never drift from the routes that exist. Old URLs are redirects
 * (next.config.mjs) and are deliberately left out.
 */
type Freq = MetadataRoute.Sitemap[number]["changeFrequency"]

function weight(path: string): { priority: number; changeFrequency: Freq } {
  if (path === "/") return { priority: 1.0, changeFrequency: "weekly" }
  if (path === "/case-studies") return { priority: 0.8, changeFrequency: "weekly" }
  if (/^\/(privacy|terms)$/.test(path)) return { priority: 0.3, changeFrequency: "yearly" }
  const depth = path.split("/").length - 1
  return { priority: depth === 1 ? 0.9 : 0.7, changeFrequency: "monthly" }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const paths = [
    "/",
    "/case-studies",
    ...ALL_ROUTES.filter((r) => !r.startsWith("/solutions/")),
    ...CASE_STUDIES.map((c) => `/case-studies/${c.slug}`),
    // The Salesforce guide's section pages (the hub is in ALL_ROUTES).
    ...SF_GUIDE_PROBLEMS.map((p) => `${SF_GUIDE_ROUTE}/${p.id}`),
  ]

  return paths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    ...weight(path),
  }))
}
