"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Check,
  FileText,
  Handshake,
  Headset,
  Percent,
  ReceiptText,
  RefreshCw,
  Sunrise,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { AccentTitle, accentFor } from "@/components/site/accent"
import { Reveal } from "@/components/site/reveal"
import { CASE_STUDIES } from "@/lib/site/content/case-studies"
import type { PageContent, Section } from "@/lib/site/types"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   Solutions, all on one page, in the Salezx industries layout: a pill rail
   sticky under the nav jumps to each solution's panel and lights the one in
   view; each panel holds the solution's doc copy in three columns — where it
   slips today, how we drive it, what we build — then its case studies and the
   Salezx line. The old /solutions/<slug> routes redirect to ?s=<slug>, which
   scrolls to that panel. Copy: the page data only.
   -------------------------------------------------------------------------- */

export type SolutionEntry = { slug: string; name: string; page: PageContent; desk: string }

const ICONS: Record<string, LucideIcon> = {
  "lead-to-quote": FileText,
  pricing: Percent,
  "order-to-invoice": Truck,
  collections: Wallet,
  "service-renewals": RefreshCw,
  "sales-productivity": Sunrise,
  "sales-reviews": BarChart3,
  "field-service": Headset,
  "distributor-channel": Handshake,
  "finance-operations": ReceiptText,
}

const list = (sections: Section[], title: string) =>
  sections.find((s) => s.kind === "list" && s.title === title) as Extract<Section, { kind: "list" }> | undefined

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-medium text-ink-500">{children}</h3>
}

/* --------------------------------------------------------------- panel */

function SolutionPanel({ entry, index }: { entry: SolutionEntry; index: number }) {
  const { page, slug } = entry
  const Icon = ICONS[slug] ?? FileText
  const slips = list(page.sections, "Where it slips today")
  const drive = list(page.sections, "How we drive it")
  const build = list(page.sections, "What we build")
  const cases = page.sections.find((s) => s.kind === "cases") as Extract<Section, { kind: "cases" }> | undefined
  const texts = page.sections.filter((s) => s.kind === "text") as Extract<Section, { kind: "text" }>[]
  const salezx = page.sections.find((s) => s.kind === "salezx") as Extract<Section, { kind: "salezx" }> | undefined
  // Phones: the panel opens on demand; desktop always shows everything.
  const [open, setOpen] = useState(false)

  return (
    <Reveal as="article" id={slug} variant="scale" className="zx-card scroll-mt-44 overflow-hidden" style={{ zIndex: 1 }} index={index === 0 ? 1 : 0}>
      {/* Header: the solution's headline and line */}
      <header className="flex items-start gap-4 px-6 pb-2 pt-6 sm:items-center sm:px-8 lg:border-b lg:border-ink-950/[0.08] lg:py-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-white text-navy-600">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="zx-display text-[1.5rem] leading-[1.15] tracking-[-0.03em] text-ink-950 sm:text-[1.875rem]">
            <AccentTitle text={page.h1} accent={accentFor(page.h1, page.h1Accent)} />
          </h2>
          <p className="mt-1.5 text-[0.9875rem] leading-relaxed text-ink-500">{page.sub}</p>
        </div>
      </header>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${slug}-details`}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 w-full items-center justify-between px-6 text-[0.9375rem] font-semibold text-ink-950 lg:hidden"
      >
        {open ? "Hide details" : "Show details"}
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} aria-hidden />
      </button>

      <div
        id={`${slug}-details`}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[1fr]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
      <div className="min-h-0 overflow-hidden">
      {/* Three columns: the friction, the fix, what we build */}
      <div className="grid gap-8 border-t border-ink-950/[0.08] lg:border-t-0 px-6 py-7 sm:px-8 lg:grid-cols-[1fr_1.15fr_1fr] lg:gap-10">
        {slips && (
          <div>
            <ColumnLabel>{slips.title}</ColumnLabel>
            <ul className="mt-3 border-t border-ink-950/[0.08]">
              {slips.items.map((it) => (
                <li key={it.body} className="flex gap-3 border-b border-ink-950/[0.08] py-3.5 text-[0.9875rem] leading-relaxed text-ink-800">
                  <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-flag" aria-hidden />
                  {it.body}
                </li>
              ))}
            </ul>
          </div>
        )}
        {drive && (
          <div>
            <ColumnLabel>{drive.title}</ColumnLabel>
            <ul className="mt-3 border-t border-ink-950/[0.08]">
              {drive.items.map((it) => (
                <li key={it.body} className="flex gap-3 border-b border-ink-950/[0.08] py-3.5 text-[0.9875rem] leading-relaxed text-ink-800">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-600/10">
                    <Check className="h-3 w-3 text-navy-600" strokeWidth={3} aria-hidden />
                  </span>
                  {it.body}
                </li>
              ))}
            </ul>
          </div>
        )}
        {build && (
          <div>
            <ColumnLabel>{build.title}</ColumnLabel>
            <ul className="mt-3 space-y-2.5">
              {build.items.map((it) => (
                <li key={it.title ?? it.body}>
                  <Link
                    href={it.href ?? "#"}
                    className="zx-glass-row group flex items-start justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 transition-colors duration-300 hover:border-navy-border"
                  >
                    <span>
                      <span className="block text-[0.9875rem] font-semibold text-ink-950">{it.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-ink-600">{it.body}</span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-500 transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-ink-950" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Other doc notes (e.g. a reference line) */}
      {texts.map((t) => (
        <div key={t.title} className="mx-6 mb-6 rounded-2xl border border-line bg-white px-5 py-4 sm:mx-8">
          <p className="text-sm font-medium text-ink-500">{t.title}</p>
          {t.body.map((p) => (
            <p key={p} className="mt-1 text-[0.9875rem] leading-relaxed text-ink-800">
              {p}
            </p>
          ))}
        </div>
      ))}

      {/* Case studies and the Salezx line */}
      {((cases && cases.items.length > 0) || salezx) && (
        <footer className="flex flex-col gap-3 border-t border-ink-950/[0.08] bg-paper/70 px-6 py-5 sm:px-8 xl:flex-row xl:items-center xl:justify-between">
          {cases && cases.items.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-sm font-medium text-ink-500">{cases.title}</span>
              {cases.items.map(({ slug: cs }) => {
                const study = CASE_STUDIES.find((c) => c.slug === cs)
                return (
                  <Link key={cs} href={`/case-studies/${cs}`} className="group inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-ink-950 transition-colors hover:text-navy-600">
                    {study?.name ?? cs}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </Link>
                )
              })}
            </div>
          )}
          {salezx && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 xl:justify-end">
              <span className="text-[0.9375rem] text-ink-600">{salezx.body}</span>
              {salezx.cta && (
                <a
                  href={salezx.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-navy-600"
                >
                  {salezx.cta.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </a>
              )}
            </div>
          )}
        </footer>
      )}
      </div>
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------ jump rail */

function JumpRail({ entries }: { entries: SolutionEntry[] }) {
  const [active, setActive] = useState(entries[0]?.slug)
  const rowRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const params = useSearchParams()

  // ?s=<slug> (from the old routes): bring that panel into view.
  useEffect(() => {
    const s = params.get("s")
    if (!s) return
    const el = document.getElementById(s)
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }))
  }, [params])

  // Light the pill for the panel mostly on screen.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const barBottom = navRef.current?.getBoundingClientRect().bottom ?? 0
      const line = barBottom + (window.innerHeight - barBottom) * 0.4
      let current = entries[0]?.slug
      for (const e of entries) {
        const el = document.getElementById(e.slug)
        if (el && el.getBoundingClientRect().top <= line) current = e.slug
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        // At the very bottom the last panel may never reach the line.
        const last = entries[entries.length - 1]
        const el = last && document.getElementById(last.slug)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.6) current = last.slug
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [entries])

  // Phones: keep the active pill in view in the sideways row.
  useEffect(() => {
    const row = rowRef.current
    const pill = row?.querySelector<HTMLElement>(`[data-slug="${active}"]`)
    if (row && pill) row.scrollTo({ left: pill.offsetLeft - (row.clientWidth - pill.offsetWidth) / 2, behavior: "smooth" })
  }, [active])

  return (
    <nav
      ref={navRef}
      aria-label="Solutions"
      className="sticky top-20 z-30 border-y border-line/70 bg-paper/85 [-webkit-backdrop-filter:blur(14px)_saturate(1.4)] [backdrop-filter:blur(14px)_saturate(1.4)] lg:top-[104px]"
    >
      <div ref={rowRef} className="zx-swipe zx-fade-x mx-auto flex max-w-[80rem] gap-2 overflow-x-auto px-6 py-3 sm:px-10">
        {entries.map((e) => {
          const on = e.slug === active
          return (
            <a
              key={e.slug}
              href={`#${e.slug}`}
              data-slug={e.slug}
              aria-current={on ? "true" : undefined}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors duration-300",
                on ? "bg-ink-950 text-white" : "zx-glass-chip bg-white text-ink-600 shadow-[0_4px_12px_-8px_rgba(31,42,97,0.35)] hover:text-ink-950"
              )}
            >
              {e.name}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

/* ------------------------------------------------------------ explorer */

export function SolutionsExplorer({ entries }: { entries: SolutionEntry[] }) {
  return (
    <>
      {/* useSearchParams needs a Suspense boundary on a static page. */}
      <Suspense fallback={null}>
        <JumpRail entries={entries} />
      </Suspense>
      <section className="zx-section">
        <div className="zx-container space-y-5 lg:space-y-6">
          {entries.map((e, i) => (
            <SolutionPanel key={e.slug} entry={e} index={i} />
          ))}
        </div>
      </section>
    </>
  )
}
