"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const ARTICLES = [
  {
    number: "01",
    title: "Where manufacturers lose money between order and cash",
    href: "/insights",
  },
  {
    number: "02",
    title: "Why most sales AI pilots never reach production",
    href: "/insights",
  },
  {
    number: "03",
    title: "Multi-agent systems in sales operations: what actually works",
    href: "/insights",
  },
]

export function Insights() {
  return (
    <section
      id="insights"
      className="border-t border-line py-16 lg:py-24"
    >

      <div className="zx-container">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="zx-display-sm text-[2.25rem] text-ink-950 sm:text-[2.75rem] lg:text-[3rem]">
                Ideas from the{" "}
                <span className="zx-serif text-navy-600">work</span>
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Magazine-grade Open Editorial List - Zero Card Boxes */}
        <div className="mt-8 border-t border-line/80 sm:mt-12">
          <RevealGroup className="divide-y divide-line/70" stagger={0.06}>
            {ARTICLES.map((article) => (
              <RevealItem key={article.title}>
                <Link
                  href={article.href}
                  className="zx-glass-row group relative flex flex-col justify-between py-6 transition-colors duration-200 hover:bg-ink-50/40 sm:flex-row sm:items-center sm:py-9 sm:px-4 rounded-xl"
                >
                  {/* Left: Number & Article Details. Phones: the number sits
                      inline with the category, so the title uses full width. */}
                  <div className="flex items-start gap-6 sm:items-center sm:gap-8">
                    <span className="hidden font-mono text-3xl font-bold text-ink-400 transition-colors group-hover:text-navy-600 sm:inline">
                      {article.number}
                    </span>

                    <div className="max-w-2xl">
                      <span className="font-mono text-xs font-semibold text-ink-400 sm:hidden">{article.number}</span>
                      <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-tight text-ink-950 transition-colors group-hover:text-navy-600 sm:mt-2 sm:text-2xl">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  {/* Right: Reading Tag & Arrow (phones: tag left, arrow at the far right) */}
                  <div className="mt-3 flex items-center justify-end gap-3 sm:mt-0 sm:shrink-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100/60 text-ink-700 transition-[translate,background-color,color] duration-300 group-hover:translate-x-1 group-hover:bg-ink-950 group-hover:text-white">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
