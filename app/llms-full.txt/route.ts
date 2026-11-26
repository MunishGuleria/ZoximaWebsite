import { CASE_STUDIES } from "@/lib/site/content/case-studies"
import { MICROSOFT_PRACTICE } from "@/lib/site/content/partner-microsoft"
import { SALESFORCE_PRACTICE } from "@/lib/site/content/partner-salesforce"
import { ALL_ROUTES, pageFor } from "@/lib/site/pages"
import { SITE_URL } from "@/lib/site/schema"
import type { PartnerPractice } from "@/components/site/partner-detail"
import type { PageContent, Section } from "@/lib/site/types"

/* /llms-full.txt: the site's content as plain Markdown for AI assistants and
   answer engines (the short index is /llms.txt). Built from the same data the
   pages render, so it never drifts from the site. Legal pages are left out. */
export const dynamic = "force-static"

const LEGAL = new Set(["/privacy", "/terms"])
const PRACTICES = new Set([MICROSOFT_PRACTICE.page.route, SALESFORCE_PRACTICE.page.route])

function section(s: Section): string {
  const head = "title" in s && s.title ? `### ${s.title}\n` : ""
  const intro = "intro" in s && s.intro ? `${s.intro}\n` : ""
  switch (s.kind) {
    case "list":
      return head + intro + s.items.map((it) => `- ${it.title ? `${it.title}: ` : ""}${it.body}`).join("\n")
    case "text":
      return head + s.body.join("\n\n")
    case "links":
      return head + intro + s.items.map((it) => `- ${it.title ?? it.body}${it.title && it.body ? `: ${it.body}` : ""}`).join("\n")
    case "cases":
      return head + s.items.map((c) => `- ${c.summary} (${SITE_URL}/case-studies/${c.slug})`).join("\n")
    case "proof":
      return head + intro + s.items.map((p) => `- ${p}`).join("\n")
    case "stack":
      return head + intro + s.groups.map((g) => `- ${g.name}: ${g.items.join(", ")}`).join("\n")
    case "faq":
      return head + s.items.map((f) => `**${f.q}**\n${f.a}`).join("\n\n")
    case "salezx":
      return s.body
  }
}

function page(p: PageContent): string {
  const body = p.sections.map(section).filter(Boolean).join("\n\n")
  return `## ${p.h1}\nURL: ${SITE_URL}${p.route}\n\n${p.sub}${body ? `\n\n${body}` : ""}`
}

function practice(d: PartnerPractice): string {
  const out = [`## ${d.page.h1}`, `URL: ${SITE_URL}${d.page.route}`, "", d.page.sub, "", d.proof.map((p) => `- ${p.text}`).join("\n")]
  if (d.who) out.push("", `### ${d.who.title}`, d.who.body.join("\n\n"))
  if (d.offer)
    out.push(
      "",
      `### ${d.offer.title}`,
      d.offer.items.map((it) => `- ${it.name}: ${[it.body, ...(it.points ?? [])].filter(Boolean).join(" ")}`).join("\n")
    )
  if (d.work)
    out.push(
      "",
      `### ${d.work.title}`,
      d.work.items.map((w) => `- ${w.title}: ${w.body}${w.results?.length ? ` Results: ${w.results.join(" ")}` : ""}`).join("\n")
    )
  if (d.problems) out.push("", `### ${d.problems.title}`, d.problems.items.map((p) => `- ${p}`).join("\n"))
  if (d.apps) out.push("", `### ${d.apps.title}`, d.apps.items.map((a) => `- ${a.name}: ${a.body} (${a.href})`).join("\n"))
  if (d.steps) out.push("", `### ${d.steps.title}`, d.steps.items.map((s) => `- ${s.title}: ${s.body}`).join("\n"))
  if (d.why) out.push("", `### ${d.why.title}`, d.why.items.map((w) => `- ${w.title}: ${w.body}`).join("\n"))
  return out.join("\n")
}

function caseStudy(c: (typeof CASE_STUDIES)[number]): string {
  const results = c.results.filter((r) => !r.includes("["))
  return [
    `### ${c.name}`,
    `URL: ${SITE_URL}/case-studies/${c.slug}`,
    "",
    c.who,
    ...(c.summary ? ["", c.summary] : []),
    "",
    "Challenge:",
    ...c.challenge.map((x) => `- ${x}`),
    "",
    "What we built:",
    ...c.built.map((x) => `- ${x}`),
    ...(results.length ? ["", "Results:", ...results.map((x) => `- ${x}`)] : []),
    ...(c.platform ? ["", `Platform: ${c.platform}`] : []),
  ].join("\n")
}

export function GET() {
  const pages = ALL_ROUTES.filter((r) => !LEGAL.has(r) && !PRACTICES.has(r) && !r.startsWith("/solutions/")).map(pageFor)
  const text = [
    "# Zoxima: full site content",
    "",
    "> Zoxima builds the applications, automations and AI agents that run sales and service for large enterprises. Zoxima Solutions LLC, 44870 Osgood Road, Suite 5, Fremont, California, USA, with its affiliate Zoxima Solutions Private Limited, Noida, India. Contact: info@zoxima.com.",
    "",
    `Short index: ${SITE_URL}/llms.txt`,
    "",
    "# Partner practices",
    "",
    practice(SALESFORCE_PRACTICE),
    "",
    practice(MICROSOFT_PRACTICE),
    "",
    "# Pages",
    "",
    pages.map(page).join("\n\n"),
    "",
    "# Case studies",
    "",
    CASE_STUDIES.map(caseStudy).join("\n\n"),
    "",
  ].join("\n")
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
