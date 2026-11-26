"use client"

import { motion } from "framer-motion"

import { CountUp } from "@/components/motion/count-up"
import { cn } from "@/lib/utils"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { DRIVES } from "@/components/home/drive-visuals"
import { WhatWeDriveMobile } from "@/components/home/what-we-drive-mobile"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* Same facts and sources as Salezx (EvidenceSection). 43% is the share of
   invoice value that went overdue, not the share of invoices. */
const STATS = [
  {
    value: 43,
    suffix: "%",
    label: "of the total value of US B2B invoices went overdue.",
    source: "Atradius Payment Practices Barometer, US, 2025",
  },
  {
    value: 8,
    suffix: "%",
    label: "more operating profit from a 1% better price.",
    source: "McKinsey Quarterly, “The Power of Pricing,” 2003",
  },
  {
    value: 2,
    suffix: "×",
    label: "the margin on service compared with new equipment.",
    source: "BCG, Aftermarket Services, 2025",
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

/** Grid spans for the seven cards, in DRIVES order. */
const SPANS = [
  "lg:col-span-3",
  "lg:col-span-4",
  "sm:col-span-2 lg:col-span-5",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
]

export function WhatWeDrive() {
  const reduce = useReducedMotionSafe()
  return (
    <section id="what-we-drive" className="border-t border-line py-16 lg:py-24">
      {/* Top Part, on its own full-bleed band: the ribbon backdrop covers the
          heading and research stats only. The band reaches up into the
          section's top padding so the image starts at the section edge, and
          its bottom fades into the page rather than ending on a hard line. */}
      <div className="relative isolate -mt-16 overflow-hidden pt-16 pb-12 lg:-mt-24 lg:pt-24">

      <div className="zx-container">
        {/* Heading on the left, "Most companies know this" on the right (Salezx layout). */}
        <div className="grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="zx-display-sm text-[2.25rem] text-ink-950 sm:text-[2.75rem] lg:text-[3rem]">
              Great sales operations is the{" "}
              <span className="zx-serif text-navy-600">difference.</span>
            </h2>
            <p className="zx-lead mt-4 max-w-xl text-[1rem] leading-relaxed text-ink-600 sm:text-[1.125rem]">
              Sales operations is where every customer hears from you on time, every order and payment is tracked until it’s done, and nothing waits on someone’s memory. We build the systems that make that happen.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="lg:max-w-md lg:justify-self-end">
            <p className="zx-lead text-[1.0625rem] sm:text-[1.25rem]">
              <span className="font-medium text-ink-950">Most companies know this.</span> The gap is doing it every
              week, for every invoice, every quote and every contract. That’s what we build.
            </p>
          </Reveal>
        </div>

        {/* Editorial stats on plain paper, no card: each fact under a hairline
            that draws left to right, its source top right, the figure counting
            up. Phones: one column, a hairline under each fact too. */}
        <ul className="mt-10 grid sm:mt-14 sm:grid-cols-3 sm:gap-x-10 lg:gap-x-14">
          {STATS.map((stat, i) => (
            <li key={stat.source} className="relative border-b border-line pb-6 pt-4 sm:border-b-0 sm:pb-0">
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left bg-ink-950/25"
                initial={{ scaleX: 0 }}
                animate={reduce ? { scaleX: 1 } : undefined}
                whileInView={reduce ? undefined : { scaleX: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={reduce ? { duration: 0 } : { duration: 1.1, delay: i * 0.12, ease: EASE }}
              />
              <Reveal delay={0.15 + i * 0.12}>
                <p className="ml-auto max-w-[75%] text-right text-[12px] font-medium uppercase leading-snug tracking-[0.06em] text-ink-500 sm:min-h-[2.8em]">
                  <span className="sr-only">Source: </span>
                  {stat.source}
                </p>
                <p className="mt-2 whitespace-nowrap text-[2.75rem] font-light leading-none tracking-[-0.05em] text-ink-950 tabular-nums sm:text-5xl xl:text-6xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 max-w-[26ch] text-[17px] font-medium leading-snug text-ink-900 sm:mt-5">{stat.label}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
      </div>

      {/* ========================================================
          The doc's seven "What we drive" cards (Home §3), bento grid
         ======================================================== */}
      {/* mt-8 + the band's pb-12 keep the original 80px (mt-20) gap. */}
      <div className="zx-container mt-8">

          {/* Seven cards: three on the first row, four on the second (lg). */}
          {/* Phones: the seven cards as a scroll stack (what-we-drive-mobile). */}
          <WhatWeDriveMobile className="sm:hidden" />

          <RevealGroup
            className="mt-2 grid grid-cols-1 gap-4 max-sm:hidden sm:mt-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5"
            stagger={0.06}
          >
            {DRIVES.map((d, i) => (
              <RevealItem key={d.title} className={cn("flex", SPANS[i])}>
                <article
                  className={cn(
                    "group flex w-full flex-col rounded-3xl border p-6 transition-[translate,border-color] duration-300 hover:-translate-y-1",
                    d.dark ? "border-ink-950 bg-ink-950 hover:border-ink-800" : "border-line bg-white hover:border-navy-border"
                  )}
                >
                  <h3
                    className={cn(
                      "text-xl font-bold leading-tight tracking-tight lg:text-[1.375rem]",
                      d.dark ? "text-white" : "text-ink-950"
                    )}
                  >
                    {d.title}
                  </h3>
                  <p className={cn("mt-2 text-sm leading-relaxed", d.dark ? "text-white/65" : "text-ink-600")}>{d.body}</p>
                  {/* Centred in the space under the copy, so cards in a row with
                      a taller neighbour share the extra space above and below. */}
                  <div className="mt-6 flex flex-1 items-center">{d.visual}</div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

        {/* Closing Line */}
        <Reveal delay={0.15}>
          <div className="mt-16 text-center">
            <p className="text-base font-medium text-ink-600 sm:text-lg">
              Week after week, the small things get done, and the big numbers follow.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
