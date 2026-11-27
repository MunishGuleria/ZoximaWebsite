import Image from "next/image"
import Link from "next/link"
import { AccentTitle, CtaButton } from "@/components/site/page-hero"
import { ProblemCardHighlight } from "@/components/site/problem-card-highlight"
import { Reveal } from "@/components/site/reveal"
import { SF_GUIDE_INTRO, SF_GUIDE_PAGE, SF_GUIDE_PDF, SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"

/* --------------------------------------------------------------------------
   The Salesforce guide, as a section of the Salesforce page (#guide; the old
   /partners/salesforce/guide address forwards here). Title and line, then
   the ten problems as cards
   (picture, number, title, one-line teaser), each opening its problem page
   (/partners/salesforce/guide/<id>). The fixes are in the emailed PDF only.
   Each card has the id problem-<id>, so the "Ten areas" list can jump to it.
   -------------------------------------------------------------------------- */

/** The free guide in a card: what it is, who it is for, and the download.
 *  Sits beside the Salesforce page hero. */
export function GuideCard() {
  return (
    <div className="rounded-[28px] border border-line bg-white p-7 shadow-[0_24px_60px_-40px_rgba(31,42,97,0.35)] sm:p-9">
      <p className="zx-eyebrow">Free guide · {SF_GUIDE_PDF.facts}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink-950">{SF_GUIDE_PDF.name}</p>
      <p className="mt-2 text-[1.0625rem] leading-snug text-ink-800">{SF_GUIDE_PAGE.h1}</p>
      <span aria-hidden className="mt-5 block h-0.5 w-12 rounded-full bg-navy-600" />
      <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-600">{SF_GUIDE_PDF.audience}</p>
      <div className="mt-7 [&>a]:w-full sm:[&>a]:w-auto">
        <CtaButton cta={{ label: "Download full guide", href: `${SF_GUIDE_ROUTE}/get` }} />
      </div>
    </div>
  )
}

export function GuideSection() {
  return (
    <section id="guide" className="zx-section scroll-mt-28">
      <div className="zx-container">
        <ProblemCardHighlight />
        <Reveal className="max-w-3xl">
          <p className="zx-eyebrow">Free guide for Salesforce users</p>
          <h2 className="zx-display mt-4 text-[2rem] leading-[1.1] tracking-[-0.035em] text-ink-950 sm:text-[2.5rem] lg:text-[2.875rem]">
            <AccentTitle text={SF_GUIDE_PAGE.h1} accent={SF_GUIDE_PAGE.h1Accent ?? ""} />
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            {SF_GUIDE_PAGE.sub} {SF_GUIDE_INTRO.join(" ")} Each card opens a one-page brief; the full guide comes by email.
          </p>
        </Reveal>

        {/* Cards as in the prototype: the whole problem picture on top (fitted,
            never cropped), then number, title and teaser.
            The whole card is the link (no separate button); as many 280px+ columns as fit. */}
        <ol className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {SF_GUIDE_PROBLEMS.map((p) => (
            <Reveal as="li" key={p.id} id={`problem-${p.id}`} index={(p.n - 1) % 3} className="group/card min-w-0 scroll-mt-28">
              <Link
                href={`${SF_GUIDE_ROUTE}/${p.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white ring-0 ring-navy-600/20 group-data-[highlight]/card:border-navy-600 group-data-[highlight]/card:ring-[6px] shadow-[0_24px_48px_-32px_rgba(31,42,97,0.22),0_2px_6px_-2px_rgba(31,42,97,0.05)] transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-ink-950"
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
