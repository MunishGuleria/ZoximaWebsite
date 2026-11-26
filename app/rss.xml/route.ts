import { CASE_STUDIES } from "@/lib/site/content/case-studies"
import { SITE_URL } from "@/lib/site/schema"

/* RSS 2.0 feed of Zoxima's case studies, for feed readers and AI/search
   crawlers. Built at deploy time; linked from every page's <head>. */
export const dynamic = "force-static"

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")

export function GET() {
  const built = new Date().toUTCString()
  const items = CASE_STUDIES.map((c) => {
    const url = `${SITE_URL}/case-studies/${c.slug}`
    const description = [c.who, c.summary].filter(Boolean).join(" ")
    const categories = [c.industry, ...c.capabilities].filter(Boolean) as string[]
    return `    <item>
      <title>${esc(c.name)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(description)}</description>
${categories.map((cat) => `      <category>${esc(cat)}</category>`).join("\n")}
    </item>`
  }).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Zoxima case studies</title>
    <link>${SITE_URL}/case-studies</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Applications, automations and AI in production at large enterprises.</description>
    <language>en-us</language>
    <lastBuildDate>${built}</lastBuildDate>
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
