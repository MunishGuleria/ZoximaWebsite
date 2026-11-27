import Image from "next/image"
import Link from "next/link"
import { Reveal } from "@/components/site/reveal"
import { SectionTitle } from "@/components/site/sections"
import { SF_GUIDE_INTRO, SF_GUIDE_PDF, SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"

/* --------------------------------------------------------------------------
   The Salesforce guide hub (/partners/salesforce/guide), open to all. The
   hero carries the two offers (get the PDF by email, browse the problems);
   GuideCard sits beside it and says what the guide is. Below, the ten
   problems as cards (picture, number, title, one-line teaser), each opening
   its problem page (/partners/salesforce/guide/<id>). The fixes are in the
   emailed PDF only.
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

        {/* Cards as in the prototype: the whole problem picture on top (fitted,
            never cropped), then number, title and teaser.
            The whole card is the link (no separate button); as many 280px+ columns as fit. */}
        <ol className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {SF_GUIDE_PROBLEMS.map((p) => (
            <Reveal as="li" key={p.id} index={(p.n - 1) % 3} className="min-w-0">
              <Link
                href={`${SF_GUIDE_ROUTE}/${p.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_24px_48px_-32px_rgba(31,42,97,0.22),0_2px_6px_-2px_rgba(31,42,97,0.05)] transition-[border-color,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-ink-950"
              >
                <span className="relative block aspect-[2.3/1] shrink-0 overflow-hidden border-b border-line bg-white">
                  <Image
                    src={p.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-2"
                  />
                </span>
                <span className="flex flex-1 flex-col gap-2 px-6 pb-6 pt-5">
                  <span className="zx-eyebrow">Problem {p.n}</span>
                  <span className="text-[1.1875rem] font-semibold leading-snug tracking-[-0.015em] text-ink-950">{p.cardTitle}</span>
                  <span className="text-sm leading-[1.5] text-ink-600">{p.short}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
