import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { BackButton } from "@/components/site/back-button"

export const metadata: Metadata = {
  title: { absolute: "Page not found | Zoxima" },
  robots: { index: false, follow: true },
}

/* --------------------------------------------------------------------------
   404. Same language as the content pages: the soft blue-white wash, a large
   heading with the serif accent, the two site buttons, then the four main
   sections as cards (their own page titles from the content doc) so a lost
   visitor has somewhere useful to go. CSS entrance only; no client JS.
   -------------------------------------------------------------------------- */

const rise = (delay: number) =>
  ({ "--zx-rise-delay": `${delay}s`, "--zx-rise-y": "18px", "--zx-rise-dur": "0.8s" }) as CSSProperties

const PLACES = [
  { name: "Capabilities", line: "Applications, automations and AI, built to work together", href: "/capabilities", src: "/images/pages/applications.webp" },
  { name: "Industries", line: "Deep in manufacturing. Proven beyond it.", href: "/industries", src: "/images/pages/manufacturing.webp" },
  { name: "Products", line: "Salezx: your strongest sales ops team", href: "/products", src: "/images/pages/dashboard.webp" },
  { name: "Case studies", line: "Work that runs every day", href: "/case-studies", src: "/images/pages/construction.webp" },
]

export default function NotFound() {
  return (
    <>
      <main id="main" className="zx overflow-x-clip">
        <section className="zx-backdrop-ribbon relative isolate overflow-hidden">
          {/* The large 404, set behind the copy as a soft watermark. */}
          <span
            aria-hidden
            className="zx-rise pointer-events-none absolute -right-6 top-24 select-none text-[11rem] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(47,63,143,0.14)] sm:-right-4 sm:top-20 sm:text-[18rem] lg:right-[4%] lg:top-1/2 lg:-translate-y-1/2 lg:text-[24rem]"
            style={rise(0.2)}
          >
            404
          </span>

          <div className="zx-container relative pb-16 pt-[8.5rem] sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-[11.5rem]">
            <div className="zx-rise mb-6 lg:hidden" style={rise(0)}>
              <BackButton />
            </div>
            <p className="zx-rise inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-ink-600 backdrop-blur-sm" style={rise(0)}>
              <span className="h-1.5 w-1.5 rounded-full bg-flag" aria-hidden />
              Error 404
            </p>
            <h1
              className="zx-rise zx-display mt-6 max-w-[16ch] text-[2.75rem] leading-[1.04] tracking-[-0.04em] text-ink-950 sm:text-[3.75rem] lg:text-[4.5rem]"
              style={rise(0.08)}
            >
              This page is <span className="zx-serif text-navy-600">not here.</span>
            </h1>
            <p className="zx-rise mt-6 max-w-xl text-lg leading-relaxed text-ink-600 sm:text-xl" style={rise(0.16)}>
              The link may be old, or the page may have moved. Start from the home page, or tell us what you were
              looking for.
            </p>
            <div className="zx-rise mt-9 flex flex-col gap-3 sm:flex-row" style={rise(0.24)}>
              <Link
                href="/"
                className="zx-sheen group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink-950 px-6 text-[0.9375rem] font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98]"
              >
                Back to home
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="zx-glass-btn inline-flex min-h-12 items-center justify-center rounded-xl border border-ink-950/15 bg-white/70 px-6 text-[0.9375rem] font-semibold text-ink-950 transition-[border-color,background-color,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] hover:border-ink-950/40 hover:bg-white active:scale-[0.98]"
              >
                Contact us
              </Link>
            </div>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-paper" />
        </section>

        <section className="zx-section !pt-6">
          <div className="zx-container">
            <h2 className="zx-rise text-sm font-medium text-ink-500" style={rise(0.3)}>
              Or go straight to
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PLACES.map((p, i) => (
                <li key={p.href} className="zx-rise" style={rise(0.34 + i * 0.07)}>
                  <Link
                    href={p.href}
                    className="group relative isolate flex h-full min-h-[15rem] flex-col justify-end overflow-hidden rounded-[24px] bg-ink-950 p-3 text-white shadow-[0_24px_48px_-30px_rgba(15,27,45,0.6)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,27,45,0.7)]"
                  >
                    <Image
                      src={p.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
                      className="-z-10 object-cover transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                    <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d1426]/60 via-[#0d1426]/10 to-transparent" />
                    <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-[background-color,color] duration-300 group-hover:bg-white group-hover:text-ink-950">
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="flex flex-col rounded-2xl border border-white/25 bg-white/[0.12] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] [backdrop-filter:blur(14px)_saturate(1.4)] [-webkit-backdrop-filter:blur(14px)_saturate(1.4)]">
                      <span className="text-xl font-semibold tracking-[-0.02em]">{p.name}</span>
                      <span className="mt-1 text-[0.9375rem] leading-relaxed text-white/85">{p.line}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
