import Image from "next/image"
import Link from "next/link"
import { GuideInlineForm } from "@/components/site/guide-inline-form"
import { SF_GUIDE_PAGE, SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE, type GuideProblem } from "@/lib/site/content/salesforce-guide"
import type { PageContent } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   One problem of the Salesforce guide (/partners/salesforce/guide/<id>), as
   in the guide prototype's problem page: the same message as the problem's
   ad (tagline, headline, first line, picture), then a short story, one
   sourced fact and "Sound familiar?". The answers are only in the PDF: the
   navy block lists what the guide covers for this problem beside an inline
   form that emails it (guide-inline-form.tsx). Then the health-check strip
   and previous / next problem. One reading column, about 860px.
   -------------------------------------------------------------------------- */

export const guideSectionRoute = (id: string) => `${SF_GUIDE_ROUTE}/${id}`

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

const eyebrow = "text-xs font-bold uppercase tracking-[0.08em]"
const navLink = "text-[#1F5E7A] underline decoration-[#1F5E7A]/30 underline-offset-4 hover:text-[#123F54] hover:decoration-[#123F54]"

export function GuideSection({ problem: p }: { problem: GuideProblem }) {
  const i = SF_GUIDE_PROBLEMS.indexOf(p)
  const prev = SF_GUIDE_PROBLEMS[i - 1]
  const next = SF_GUIDE_PROBLEMS[i + 1]

  return (
    <article className="zx-container pb-5 pt-24 text-[#17212B] sm:pt-28 lg:pt-32">
      <div className="mx-auto max-w-[812px]">
        <Link href={`${SF_GUIDE_ROUTE}#problems`} className={`mb-2 mt-6 inline-block text-sm ${navLink}`}>
          &larr; All {SF_GUIDE_PROBLEMS.length} problems
        </Link>

        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className={`${eyebrow} text-[#2E7D9A]`}>
            Problem {p.n} of {SF_GUIDE_PROBLEMS.length}
          </p>
          <p className={`${eyebrow} text-[#4A5868]`}>{p.tag}</p>
        </div>

        <h1 className="mb-4 mt-2.5 text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1F3A5F] min-[721px]:text-[46px]">
          {withPart(p.h1, p.h1Accent, (s) => (
            <span className="text-[#C8452B]">{s}</span>
          ))}
        </h1>

        <p className="mb-[22px] text-xl font-medium leading-[1.55]">{p.body}</p>

        <figure className="mb-[30px] overflow-hidden rounded-[14px] border border-[#DCE3EA] bg-white">
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

        <p className="mb-[30px] text-xl leading-[1.7] first-letter:float-left first-letter:pr-2.5 first-letter:pt-1.5 first-letter:text-[58px] first-letter:font-bold first-letter:leading-[0.9] first-letter:text-[#1F3A5F]">
          {p.open}
        </p>

        <div className="mb-1.5 mt-1 flex flex-wrap items-center gap-x-[18px] gap-y-1.5 rounded-md border-l-4 border-[#2E7D9A] bg-[#EEF3F8] px-[18px] py-3.5">
          <b className="whitespace-nowrap text-[38px] font-bold leading-tight text-[#1F3A5F]">{p.num}</b>
          <span className="min-w-[14rem] flex-1 font-semibold leading-[1.4]">
            {p.numText}
            <small className="mt-[3px] block text-xs font-normal text-[#4A5868]">
              {withPart(p.source, p.sourceTitle, (s) => (
                <i>{s}</i>
              ))}
            </small>
          </span>
        </div>

        <h2 className="mb-2.5 mt-[30px] text-[22px] font-bold text-[#1F3A5F]">Sound familiar?</h2>
        <ul className="flex flex-col gap-2.5">
          {p.signs.map((s) => (
            <li key={s} className="relative pl-7 text-[17px] leading-[1.5]">
              <span
                aria-hidden
                className="absolute left-0 top-[3px] h-[18px] w-[18px] rounded-full bg-[#FDECEA] text-center text-xs font-bold leading-[18px] text-[#C8402F]"
              >
                !
              </span>
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-[34px] grid grid-cols-1 gap-[22px] rounded-2xl bg-[#1F3A5F] p-[22px] text-white sm:p-[26px] min-[721px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="min-w-0">
            <p className={`${eyebrow} text-[#A9D3E3]`}>In the free guide, for this problem</p>
            <ul className="mt-3 flex flex-col gap-3">
              {p.inside.map((s) => (
                <li key={s} className="relative pl-[30px] text-[17px] leading-[1.45]">
                  <span aria-hidden className="absolute left-0 top-[3px] h-[18px] w-[18px] rounded bg-[#F2A541]">
                    <span className="absolute left-1.5 top-[3px] h-[9px] w-[5px] rotate-45 border-b-2 border-r-2 border-[#17212B]" />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-2.5 text-sm text-[#C9D7E3]">Plus the other 9 problems. 25 pages, free, by email.</p>
          </div>
          <div className="min-w-0">
            <GuideInlineForm problemId={p.id} page={p.page} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3.5 rounded-xl bg-[#EEF3F8] px-[22px] py-[18px]">
          <span className="min-w-[16rem] flex-1">
            <b>Want to know where your Salesforce stands?</b> A health check scores all 10 areas.
          </span>
          <Link
            href="/partners/salesforce#sf-offer"
            className="inline-flex min-h-11 items-center rounded-lg bg-[#1F3A5F] px-[22px] py-[13px] font-semibold text-white transition-colors hover:bg-[#163050]"
          >
            See the health check
          </Link>
        </div>

        <nav aria-label="More problems" className="my-7 flex justify-between gap-4 text-[15px]">
          {prev ? (
            <Link href={guideSectionRoute(prev.id)} className={navLink}>
              &larr; Previous problem
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={guideSectionRoute(next.id)} className={navLink}>
              Next problem &rarr;
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <p className="text-sm leading-relaxed text-[#4A5868]">
          Salesforce is a trademark of Salesforce, Inc. The guide is independent and is not endorsed by Salesforce.
        </p>
      </div>
    </article>
  )
}
