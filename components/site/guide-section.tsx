import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CircleAlert, Lock } from "lucide-react"
import { AccentTitle, CtaButton } from "@/components/site/page-hero"
import { GuideGate } from "@/components/site/guide-gate"
import { SF_GUIDE_PAGE, SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE, type GuideProblem } from "@/lib/site/content/salesforce-guide"
import type { PageContent } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   One problem of the Salesforce guide (/partners/salesforce/guide/<id>): the
   same message as the problem's ad (tagline, headline, first line, picture),
   then a short story, one sourced fact and "Sound familiar?". The answers
   are only in the emailed PDF: the locked card (guide-gate.tsx) lists what
   the guide covers for this problem and links to the request form, or says
   the guide is already in this browser's inbox. Then the health-check strip
   and previous / next problem. One reading column, about 860px.
   Site theme: white, ink and the one navy accent; no tints.
   -------------------------------------------------------------------------- */

export const guideSectionRoute = (id: string) => `${SF_GUIDE_ROUTE}/${id}`
export const guideGetHref = (id: string) => `${SF_GUIDE_ROUTE}/get?from=${id}`

/** The page data for a problem: drives metadata, breadcrumbs and JSON-LD. */
export function guideSectionPage(p: GuideProblem): PageContent {
  return {
    route: guideSectionRoute(p.id),
    crumbs: [...(SF_GUIDE_PAGE.crumbs ?? []), { label: "Guide", href: SF_GUIDE_ROUTE }],
    seoTitle: `${p.title} | Salesforce guide | Zoxima`,
    seoDescription: p.cost,
    eyebrow: `Problem ${p.n} of ${SF_GUIDE_PROBLEMS.length}`,
    h1: p.h1,
    sub: p.open,
    sections: [],
  }
}

/** `text` with the first `part` in it wrapped by `wrap` (plain text, no HTML). */
function withPart(text: string, part: string | undefined, wrap: (s: string) => React.ReactNode) {
  const at = part ? text.indexOf(part) : -1
  if (!part || at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      {wrap(part)}
      {text.slice(at + part.length)}
    </>
  )
}

/** The site's serif accent on the H1's accent words. AccentTitle handles an
 *  accent that closes the heading; one mid-heading gets the same span. */
function H1Text({ text, accent }: { text: string; accent?: string }) {
  if (!accent || text.endsWith(accent)) return <AccentTitle text={text} accent={accent} />
  return withPart(text, accent, (s) => <span className="zx-serif text-navy-600">{s}</span>)
}

const navLink =
  "group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-navy-600 transition-colors hover:text-ink-950"

export function GuideSection({ problem: p }: { problem: GuideProblem }) {
  const i = SF_GUIDE_PROBLEMS.indexOf(p)
  const prev = SF_GUIDE_PROBLEMS[i - 1]
  const next = SF_GUIDE_PROBLEMS[i + 1]
  const getHref = guideGetHref(p.id)

  return (
    <article className="zx-container pb-5 pt-24 text-ink-800 sm:pt-28 lg:pt-32">
      <div className="mx-auto max-w-[812px]">
        <Link
          href={`${SF_GUIDE_ROUTE}#problems`}
          className="mb-4 mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink-700 transition-colors hover:text-ink-950"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All {SF_GUIDE_PROBLEMS.length} problems
        </Link>

        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="zx-eyebrow">
            Problem {p.n} of {SF_GUIDE_PROBLEMS.length}
          </p>
          <p className="zx-eyebrow">{p.tag}</p>
        </div>

        <h1 className="zx-display mb-5 mt-4 text-[2.25rem] leading-[1.06] tracking-[-0.04em] text-ink-950 min-[721px]:text-[3.125rem]">
          <H1Text text={p.h1} accent={p.h1Accent} />
        </h1>

        <p className="mb-7 text-xl leading-[1.55] text-ink-700">{p.body}</p>

        <figure className="mb-9 overflow-hidden rounded-2xl border border-line bg-white">
          <Image
            src={p.image.src}
            width={p.image.width}
            height={p.image.height}
            alt={p.cardTitle}
            priority
            sizes="(min-width: 860px) 812px, 100vw"
            className="block h-auto w-full"
          />
        </figure>

        <p className="mb-9 text-xl leading-[1.7] text-ink-800 first-letter:float-left first-letter:pr-2.5 first-letter:pt-1.5 first-letter:text-[58px] first-letter:font-semibold first-letter:leading-[0.9] first-letter:text-ink-950">
          {p.open}
        </p>

        <div className="zx-card !rounded-[20px] flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-5">
          <b className="zx-display whitespace-nowrap text-[2.5rem] text-ink-950">{p.num}</b>
          <span className="min-w-[14rem] flex-1 font-semibold leading-[1.4] text-ink-950">
            {p.numText}
            <small className="mt-1 block text-xs font-normal leading-normal text-ink-500">
              {withPart(p.source, p.sourceTitle, (s) => (
                <i>{s}</i>
              ))}
            </small>
          </span>
        </div>

        <h2 className="mb-4 mt-10 text-[1.375rem] font-semibold tracking-[-0.02em] text-ink-950 sm:text-2xl">Sound familiar?</h2>
        <ul className="flex flex-col gap-3">
          {p.signs.map((s) => (
            <li key={s} className="relative pl-8 text-[17px] leading-[1.5] text-ink-800">
              <CircleAlert aria-hidden className="absolute left-0 top-[3px] h-[18px] w-[18px] text-flag" strokeWidth={2} />
              {s}
            </li>
          ))}
        </ul>

        {/* The rest is only in the PDF: a fading hint, then the locked card. */}
        <p className="mt-10 text-[1.125rem] leading-relaxed text-ink-400 [-webkit-mask-image:linear-gradient(to_bottom,#000_15%,transparent)] [mask-image:linear-gradient(to_bottom,#000_15%,transparent)] sm:text-[1.1875rem]">
          Next in this section: why it happens, the short-term and long-term fix, the recurring effort, and how the build works…
        </p>

        <div className="mt-6">
          <GuideGate getHref={getHref} page={p.page}>
            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_24px_60px_-40px_rgba(31,42,97,0.35)] sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-950 text-white">
                  <Lock aria-hidden className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </span>
                <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink-950 sm:text-[1.375rem]">
                  Keep reading: get the full guide by email
                </h2>
              </div>
              <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-600">
                The rest of this section, and all 10 sections, arrive as one PDF in your inbox.
              </p>

              <p className="zx-eyebrow mt-6">In the free guide, for this problem</p>
              <ul className="mt-4 flex flex-col gap-3">
                {p.inside.map((s) => (
                  <li key={s} className="relative pl-8 text-[1.0625rem] leading-[1.45] text-ink-800">
                    <Lock aria-hidden className="absolute left-0 top-[4px] h-[17px] w-[17px] text-navy-600" strokeWidth={2.25} />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink-500">Plus the other 9 problems. 25 pages, free, by email.</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <CtaButton cta={{ label: "Continue reading", href: getHref }} />
                <span className="text-sm text-ink-500">Free · takes 30 seconds</span>
              </div>
            </div>
          </GuideGate>
        </div>

        <div className="zx-card !rounded-[20px] mt-5 flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <span className="min-w-[16rem] flex-1 leading-relaxed text-ink-700">
            <b className="font-semibold text-ink-950">Want to know where your Salesforce stands?</b> A health check scores all 10 areas.
          </span>
          <CtaButton cta={{ label: "See the health check", href: "/partners/salesforce#sf-offer" }} />
        </div>

        <nav aria-label="More problems" className="mt-10 flex justify-between gap-4 border-t border-line pt-7">
          {prev ? (
            <Link href={guideSectionRoute(prev.id)} className={navLink}>
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
              Previous problem
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={guideSectionRoute(next.id)} className={navLink}>
              Next problem
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <p className="mt-8 text-sm leading-relaxed text-ink-500">
          Salesforce is a trademark of Salesforce, Inc. The guide is independent and is not endorsed by Salesforce.
        </p>
      </div>
    </article>
  )
}
