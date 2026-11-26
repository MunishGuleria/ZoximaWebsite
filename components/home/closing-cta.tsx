import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"

export function ClosingCta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line py-12 lg:py-16">

      <div className="zx-container">
        <div className="relative mx-auto max-w-3xl rounded-[32px] px-6 py-10 text-center sm:px-12 sm:py-14 border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_24px_60px_-34px_rgba(31,42,97,0.35)] [backdrop-filter:blur(20px)_saturate(1.5)] [-webkit-backdrop-filter:blur(20px)_saturate(1.5)]">
          <Reveal>
            <h2 className="zx-display-sm text-[2.25rem] text-ink-950 sm:text-[2.75rem] lg:text-[3.25rem]">
              Let’s talk about your{" "}
              <span className="zx-serif text-navy-600">sales operation</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="zx-lead mt-6 text-[1.0625rem] text-ink-600">
              Tell us where work slips today. We’ll show you what we’d build, and how fast.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contact"
                className="zx-sheen inline-flex h-11 items-center justify-center rounded-xl bg-ink-950 px-7 text-[0.9375rem] font-medium text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98]"
              >
                Contact us
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-12 text-[0.9375rem] font-medium text-ink-500">
              Week after week, the small things get done, and the big numbers follow.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
