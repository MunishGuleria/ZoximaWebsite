"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Check, ChevronDown } from "lucide-react"
import { CASE_STUDIES, CASE_STUDY_FILTERS } from "@/lib/site/content/case-studies"
import { caseImage } from "@/lib/site/media"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* --------------------------------------------------------------------------
   Case studies library: the doc's three filters (by capability, by result,
   by industry) above a grid of case-study cards. One choice per filter
   group; choosing it again clears it. Cards fade/settle as the set changes
   (layout animations on transform only).
   -------------------------------------------------------------------------- */
type Group = "capabilities" | "results" | "industries"

const GROUP_LABELS: Record<Group, string> = {
  capabilities: "By capability",
  results: "By result",
  industries: "By industry",
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Phone filter: a button that opens a styled option list under it (the
 *  browser's native select popup can't be styled). Closes on pick, outside
 *  tap or Escape. */
function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly string[]
  value: string | null
  onChange: (v: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const pick = (v: string | null) => {
    onChange(v)
    setOpen(false)
  }
  const all = [null, ...options]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left text-[0.9375rem] transition-colors ${
          open || value ? "border-ink-950" : "border-line"
        }`}
      >
        <span className="min-w-0 truncate">
          <span className="text-ink-500">{label}: </span>
          <span className="font-semibold text-ink-950">{value ?? "All"}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-ink-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <ul
          id={id}
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-line bg-white p-1.5 shadow-[0_24px_48px_-20px_rgba(31,42,97,0.35)]"
        >
          {all.map((v) => {
            const on = v === value
            return (
              <li key={v ?? "all"} role="option" aria-selected={on}>
                <button
                  type="button"
                  onClick={() => pick(v)}
                  className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3.5 text-left text-[0.9375rem] ${
                    on ? "bg-navy-soft font-semibold text-ink-950" : "text-ink-700 active:bg-ink-50"
                  }`}
                >
                  {v ?? "All"}
                  {on && <Check className="h-4 w-4 text-navy-600" strokeWidth={3} aria-hidden />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function CaseStudyLibrary() {
  const reduce = useReducedMotionSafe()
  const [picked, setPicked] = useState<Record<Group, string | null>>({
    capabilities: null,
    results: null,
    industries: null,
  })

  const shown = useMemo(
    () =>
      CASE_STUDIES.filter(
        (c) =>
          (!picked.capabilities || c.capabilities.includes(picked.capabilities as never)) &&
          (!picked.results || c.results_tags.includes(picked.results)) &&
          (!picked.industries || c.industry === picked.industries)
      ),
    [picked]
  )

  const toggle = (group: Group, value: string) =>
    setPicked((p) => ({ ...p, [group]: p[group] === value ? null : value }))
  const anyPicked = Object.values(picked).some(Boolean)

  return (
    <section className="zx-section !pt-4 sm:!pt-6">
      <div className="zx-container">
        {/* Filters */}
        {/* Phones: one dropdown per filter group. */}
        <div className="zx-card relative z-30 grid gap-3 p-4 sm:hidden">
          {(Object.keys(GROUP_LABELS) as Group[]).map((group) => (
            <FilterSelect
              key={group}
              label={GROUP_LABELS[group]}
              options={CASE_STUDY_FILTERS[group]}
              value={picked[group]}
              onChange={(v) => setPicked((p) => ({ ...p, [group]: v }))}
            />
          ))}
          <div className="flex items-center justify-between px-1 pt-1 text-sm text-ink-500">
            <span aria-live="polite">
              {shown.length} {shown.length === 1 ? "case study" : "case studies"}
            </span>
            {anyPicked && (
              <button
                type="button"
                onClick={() => setPicked({ capabilities: null, results: null, industries: null })}
                className="min-h-10 font-medium text-ink-800 underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Larger screens: the chips. */}
        <div className="zx-card hidden space-y-4 p-7 sm:block">
          {(Object.keys(GROUP_LABELS) as Group[]).map((group) => (
            <div key={group} className="flex flex-row items-start gap-6">
              <p className="w-28 shrink-0 pt-1.5 text-sm font-medium text-ink-500">{GROUP_LABELS[group]}</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={GROUP_LABELS[group]}>
                {CASE_STUDY_FILTERS[group].map((value) => {
                  const on = picked[group] === value
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(group, value)}
                      className={`min-h-9 shrink-0 whitespace-nowrap select-none rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                        on
                          ? "border-ink-950 bg-ink-950 text-white"
                          : "zx-glass-chip text-ink-700 hover:text-ink-950"
                      }`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1 text-sm text-ink-500">
            <span aria-live="polite">
              {shown.length} {shown.length === 1 ? "case study" : "case studies"}
            </span>
            {anyPicked && (
              <button
                type="button"
                onClick={() => setPicked({ capabilities: null, results: null, industries: null })}
                className="font-medium text-ink-700 underline-offset-4 hover:text-ink-950 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <motion.ul layout={!reduce} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((c) => (
              <motion.li
                key={c.slug}
                layout={!reduce}
                initial={{ opacity: 0, transform: reduce ? "none" : "translateY(10px)" }}
                animate={{ opacity: 1, transform: "none" }}
                exit={{ opacity: 0, transform: reduce ? "none" : "scale(0.97)" }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Link
                  href={`/case-studies/${c.slug}`}
                  className="zx-card group flex h-full flex-col overflow-hidden p-7 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_28px_56px_-30px_rgba(31,42,97,0.4)] sm:p-8"
                >
                  <div className="relative -mx-7 -mt-7 mb-6 h-44 overflow-hidden sm:-mx-8 sm:-mt-8 sm:h-48">
                    <Image
                      src={caseImage(c.slug)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 92vw"
                      className="object-cover transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <span className="text-sm font-medium text-ink-500">Case study</span>
                  <h2 className="mt-3 text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-ink-950">{c.name}</h2>
                  {c.industry && <span className="mt-1 text-sm font-medium text-navy-600">{c.industry}</span>}
                  <span aria-hidden className="my-5 block h-px bg-ink-950/[0.08]" />
                  <p className="text-[0.9375rem] leading-relaxed text-ink-600">{c.who}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {c.capabilities.map((cap) => (
                      <span key={cap} className="rounded-full bg-navy-600/[0.08] px-2.5 py-1 text-xs font-medium text-navy-700">
                        {cap}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-ink-950 transition-colors group-hover:text-navy-600">
                    Read the case study
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {shown.length === 0 && (
          <p className="mt-8 text-[0.9375rem] text-ink-600">
            No case study matches all of these filters yet.{" "}
            <button
              type="button"
              onClick={() => setPicked({ capabilities: null, results: null, industries: null })}
              className="font-medium text-ink-900 underline underline-offset-4"
            >
              Clear filters
            </button>
          </p>
        )}
      </div>
    </section>
  )
}
