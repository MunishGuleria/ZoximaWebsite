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

        {/* Compact cards, the whole card is the link: five across on wide
            screens (two even rows of five), two on tablets, one on phones. */}
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SF_GUIDE_PROBLEMS.map((p) => (
            <Reveal as="li" key={p.id} index={(p.n - 1) % 5} className="min-w-0">
              <Link
                href={`${SF_GUIDE_ROUTE}/${p.id}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-[border-color,translate,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-ink-950 hover:shadow-[0_20px_40px_-32px_rgba(31,42,97,0.45)]"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-navy-600">Problem {p.n}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:text-ink-950" aria-hidden />
                </span>
                <span className="mt-2.5 text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-ink-950">{p.title}</span>
                <span className="mt-1.5 text-sm leading-relaxed text-ink-600">{p.short}</span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
