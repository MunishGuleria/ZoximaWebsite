import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/site/reveal"
import { SectionTitle } from "@/components/site/sections"
import { SF_GUIDE_INTRO, SF_GUIDE_PDF, SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"

/* --------------------------------------------------------------------------
   The Salesforce guide hub (/partners/salesforce/guide), open to all. The
   hero carries the two offers (get the PDF by email, browse the problems);
   GuideCard sits beside it and says what the guide is. Below, the ten
   problems as cards (number, title, one-line teaser), each opening its
   section page (/partners/salesforce/guide/<id>). The fixes are in the
   emailed PDF only.
   White, ink and navy only.
   -------------------------------------------------------------------------- */

/** Hero aside: what the guide is and who it is for. */
export function GuideCard() {
  return (
    <div className="rounded-[28px] border border-line bg-white p-7 shadow-[0_24px_60px_-40px_rgba(31,42,97,0.35)] sm:p-9">
      <p className="zx-eyebrow">{SF_GUIDE_PDF.facts}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink-950">{SF_GUIDE_PDF.name}</p>
      <span aria-hidden className="mt-5 block h-0.5 w-12 rounded-full bg-navy-600" />
      <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-600">{SF_GUIDE_PDF.audience}</p>
    </div>
  )
}

export function GuideHub() {
  return (
    <section id="problems" className="zx-section scroll-mt-28 !pt-6 sm:!pt-8">
      <div className="zx-container">
        <Reveal className="max-w-2xl">
          <SectionTitle title="The 10 problems at a glance" size="md" />
          {SF_GUIDE_INTRO.map((t) => (
            <p key={t} className="mt-4 text-lg leading-relaxed text-ink-600">
              {t}
            </p>
          ))}
        </Reveal>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SF_GUIDE_PROBLEMS.map((p) => (
            <Reveal as="li" key={p.id} index={(p.n - 1) % 3} className="min-w-0">
              <Link
                href={`${SF_GUIDE_ROUTE}/${p.id}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-[border-color,translate,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-ink-950 hover:shadow-[0_24px_50px_-36px_rgba(31,42,97,0.45)] sm:p-7"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-600">Problem {p.n}</span>
                <span className="mt-3 text-[1.1875rem] font-semibold leading-snug tracking-[-0.015em] text-ink-950">{p.title}</span>
                <span className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{p.short}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-navy-600">
                  Read the section
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
