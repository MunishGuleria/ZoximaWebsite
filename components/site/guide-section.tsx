import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/site/reveal"
import { AccentTitle, CtaButton, accentFor } from "@/components/site/page-hero"
import { GuideGate } from "@/components/site/guide-gate"
import { SF_GUIDE_PAGE, SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE, type GuideProblem } from "@/lib/site/content/salesforce-guide"
import type { PageContent } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   One section of the Salesforce guide (/partners/salesforce/guide/<id>), as
   one centred reading column (left-aligned text), like the prototype.
   Only the opening story and what it costs are on the website;
   the rest, including the fix, reaches the visitor only in the emailed PDF,
   behind the gate (guide-gate.tsx). Then previous / next problem.
   White, ink and navy only.
   -------------------------------------------------------------------------- */

export const guideSectionRoute = (id: string) => `${SF_GUIDE_ROUTE}/${id}`
export const guideGetHref = (id: string) => `${SF_GUIDE_ROUTE}/get?from=${id}`

/** The page data for a section: drives metadata, breadcrumbs, JSON-LD and the closing. */
export function guideSectionPage(p: GuideProblem): PageContent {
  return {
    route: guideSectionRoute(p.id),
    crumbs: [...(SF_GUIDE_PAGE.crumbs ?? []), { label: "Guide", href: SF_GUIDE_ROUTE }],
    seoTitle: `${p.title} | Salesforce guide | Zoxima`,
    seoDescription: p.cost,
    eyebrow: `Problem ${p.n} of ${SF_GUIDE_PROBLEMS.length}`,
    h1: p.title,
    sub: p.open,
    sections: [],
    closing: {
      h2: "Seeing a few of these in your Salesforce?",
      body: SF_GUIDE_PAGE.closing?.body,
      ctas: [{ label: "Talk to us", href: "/contact?topic=Salesforce" }],
    },
  }
}

const rise = (delay: number) => ({ "--zx-rise-delay": `${delay}s`, "--zx-rise-y": "18px", "--zx-rise-dur": "0.8s" }) as CSSProperties

export function GuideSection({ problem }: { problem: GuideProblem }) {
  const i = SF_GUIDE_PROBLEMS.indexOf(problem)
  const prev = SF_GUIDE_PROBLEMS[i - 1]
  const next = SF_GUIDE_PROBLEMS[i + 1]
  const getHref = guideGetHref(problem.id)

  return (
    <>
      <section className="zx-backdrop-ribbon relative isolate overflow-hidden">
        <div className="zx-container relative pb-7 pt-28 sm:pb-8 sm:pt-32 lg:pt-[8.5rem]">
          <div className="mx-auto max-w-[60rem]">
            <Link
              href={`${SF_GUIDE_ROUTE}#problems`}
              className="zx-rise inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink-700 transition-colors hover:text-ink-950"
              style={rise(0)}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All 10 problems
            </Link>
            <p className="zx-rise zx-eyebrow mt-8" style={rise(0.04)}>
              Problem {problem.n} of {SF_GUIDE_PROBLEMS.length}
            </p>
            <h1
              className="zx-rise zx-display mt-4 max-w-[22ch] text-[2.25rem] leading-[1.06] tracking-[-0.04em] text-ink-950 sm:text-[3rem] lg:text-[3.4rem]"
              style={rise(0.08)}
            >
              <AccentTitle text={problem.title} accent={accentFor(problem.title)} />
            </h1>
          </div>
        </div>
      </section>

      <section className="zx-section !pt-0">
        <div className="zx-container">
          <div className="mx-auto max-w-[60rem]">
            <Reveal as="p" className="text-[1.1875rem] leading-relaxed text-ink-800 sm:text-[1.3125rem]">
              {problem.open}
            </Reveal>

            <Reveal index={1} className="mt-10">
              <h2 className="text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-ink-950 sm:text-2xl">
                What it costs the business
              </h2>
              <p className="mt-4 text-[1.125rem] leading-relaxed text-ink-700 sm:text-[1.1875rem]">{problem.cost}</p>
              {/* A text fade (mask), hinting at what the PDF carries; no tint. */}
              <p
                className="mt-5 text-[1.125rem] leading-relaxed text-ink-400 [-webkit-mask-image:linear-gradient(to_bottom,#000_15%,transparent)] [mask-image:linear-gradient(to_bottom,#000_15%,transparent)] sm:text-[1.1875rem]"
              >
                Next in this section: why it happens, the short-term and long-term fix, the recurring effort, and how the build works…
              </p>
            </Reveal>

            <Reveal index={2} className="mt-10">
              <GuideGate getHref={getHref} page={problem.page}>
                <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_24px_60px_-40px_rgba(31,42,97,0.35)] sm:p-8">
                  <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink-950 sm:text-[1.375rem]">
                    Keep reading: get the full guide by email
                  </h2>
                  <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-600">
                    The rest of this section, and all 10 sections, arrive as one PDF in your inbox.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                    <CtaButton cta={{ label: "Continue reading", href: getHref }} />
                    <span className="text-sm text-ink-500">Free · takes 30 seconds</span>
                  </div>
                </div>
              </GuideGate>
            </Reveal>

            <nav aria-label="More problems" className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
              {prev ? (
                <Link href={guideSectionRoute(prev.id)} className="group min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600">
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
                    Previous problem
                  </span>
                  <span className="mt-1.5 block leading-snug text-ink-700 group-hover:text-ink-950">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={guideSectionRoute(next.id)} className="group min-w-0 sm:text-right">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600">
                    Next problem
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                  <span className="mt-1.5 block leading-snug text-ink-700 group-hover:text-ink-950">{next.title}</span>
                </Link>
              )}
            </nav>

            <p className="mt-10 text-sm leading-relaxed text-ink-500">
              Salesforce is a trademark of Salesforce, Inc. The guide is independent and is not endorsed by Salesforce.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
