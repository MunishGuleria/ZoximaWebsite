import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HeroShowcase } from "@/components/home/hero-showcase"

/* The entrance is a CSS animation (`.zx-rise` in globals.css) rather than
   framer-motion: it starts with the first paint instead of after hydration,
   runs on the compositor. Fade up on cubic-bezier(0.22, 1, 0.36, 1), staggered. */
const rise = (delay: number, y = 14, duration = 0.65) =>
  ({
    "--zx-rise-delay": `${delay}s`,
    "--zx-rise-y": `${y}px`,
    "--zx-rise-dur": `${duration}s`,
  }) as CSSProperties

/* Customer scale, from the case studies (lib/site/content/case-studies.ts).
   Only figures confirmed there; the others are still [X] in the doc. */
const CUSTOMERS = [
  { figure: "$9B", who: "Building materials manufacturer" },
  { figure: "Fortune 500", who: "Corporate services company" },
  { figure: "10M liters/day", who: "Bottled-water company" },
]

/* --------------------------------------------------------------------------
   Home hero. Doc copy only (Home §1): the H1, the sub and both buttons
   (Contact us, See case studies). The visual is Zoxima's work industry by
   industry (components/home/hero-showcase.tsx): a real photo, the outcome
   driven there, and Applications / Automations / AI, all doc copy.

   Everything sits above the fold on a laptop: the H1 and the showcase are
   sized to the screen's height as well as its width, so a short 1366×650 or
   1536×700 window still shows the headline, the sub, both buttons and the
   product without scrolling.
   -------------------------------------------------------------------------- */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-12 pt-[6.5rem] lg:flex lg:min-h-[min(100svh,880px)] lg:items-center lg:pb-10 lg:pt-[112px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-paper" />
      </div>

      <div className="zx-container w-full">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          {/* Copy */}
          <div>
            <h1
              style={rise(0.06)}
              className="zx-rise zx-display text-[2.375rem] text-ink-950 sm:text-[3.25rem] lg:text-[clamp(2.5rem,min(4.2vw,7.6svh),3.5rem)]"
            >
              Large enterprises run their sales and service on{" "}
              <span className="zx-serif text-navy-600">systems we build.</span>
            </h1>

            <p
              style={rise(0.14)}
              className="zx-rise zx-lead mt-5 max-w-xl text-[1.0625rem] leading-relaxed sm:text-[1.1875rem] lg:mt-[clamp(1rem,2.6svh,1.75rem)]"
            >
              90+ enterprise projects across revenue operations, CRM, automation and AI.
            </p>

            <div
              style={rise(0.22)}
              className="zx-rise mt-7 flex flex-col gap-3 sm:flex-row lg:mt-[clamp(1.25rem,3.4svh,2.25rem)]"
            >
              <Link
                href="/contact"
                className="zx-sheen group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink-950 px-6 text-[0.9375rem] font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98]"
              >
                Contact us
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="/case-studies"
                className="zx-glass-btn inline-flex min-h-12 items-center justify-center rounded-xl border border-ink-950/15 bg-white/70 px-6 text-[0.9375rem] font-semibold text-ink-950 transition-[border-color,background-color,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] hover:border-ink-950/40 hover:bg-white active:scale-[0.98]"
              >
                See case studies
              </Link>
            </div>

            {/* Who the customers are, by size rather than name. */}
            <div style={rise(0.3)} className="zx-rise mt-8 border-t border-line pt-5 lg:mt-[clamp(1.25rem,3.6svh,2.25rem)]">
              <p className="zx-eyebrow">Customers include</p>
              <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-4 sm:grid sm:grid-cols-3 sm:gap-6">
                {CUSTOMERS.map((c) => (
                  <div key={c.figure}>
                    <dt className="text-lg font-semibold tracking-tight text-ink-950 sm:text-xl">{c.figure}</dt>
                    <dd className="mt-1 text-[0.8125rem] leading-snug text-ink-600">{c.who}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* The product. Width capped by the screen's height so the stage
              plus its caption always fit under the nav. */}
          <div
            style={rise(0.18, 24, 0.9)}
            className="zx-rise mx-auto w-full max-w-[34rem] lg:max-w-[min(100%,calc((100svh-112px-6rem)/0.83))]"
          >
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  )
}
