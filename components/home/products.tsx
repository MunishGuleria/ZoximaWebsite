"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { HeroDesks } from "@/components/site/hero-desks"

/* --------------------------------------------------------------------------
   Products ("Our products"): a dark photo card, copy on the left, and on the
   right the live salezx.com hero deck ("A week with Salezx", the same one as
   on /products) on a white panel, so the desks, names and wording always
   match salezx.com. Copy follows salezx.com's own wording.
   -------------------------------------------------------------------------- */

const SALEZX_URL = "https://salezx.com"

export function Products() {
  return (
    <section id="products" className="border-t border-line py-16 lg:py-24">
      <div className="zx-container">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950 p-5 text-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] sm:p-10 lg:p-14">
            {/* Photo backdrop with the stacking cards' overlays */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <Image src="/images/pages/dashboard.webp" alt="" fill sizes="100vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/85 to-ink-950/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            </div>

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Copy */}
              <div className="min-w-0 lg:col-span-5">
                <h2 className="zx-display-sm text-[2.25rem] text-white sm:text-[2.75rem] lg:text-[3rem]">
                  Our <span className="zx-serif text-navy-border">products</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
                  Salezx is your strongest sales ops team, on the CRM, ERP reports and email you already use. Start
                  with the desk where your money slips. Live in about a week. It is built from the same work we do for
                  large enterprises.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/products"
                    className="group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-4 text-sm font-semibold text-ink-950 transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:bg-ink-50 sm:px-7"
                  >
                    Explore Salezx
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={SALEZX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="zx-glass-btn-dark group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/30 bg-white/5 px-4 text-sm font-semibold text-white transition-[background-color,border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 sm:px-7"
                  >
                    Visit salezx.com
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>

              {/* The live salezx.com deck ("A week with Salezx"), on a white panel. */}
              <Reveal delay={0.12} direction="left" distance={20} className="min-w-0 lg:col-span-7">
                <div className="min-w-0 rounded-[1.75rem] bg-white p-4 sm:p-6">
                  <HeroDesks />
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
