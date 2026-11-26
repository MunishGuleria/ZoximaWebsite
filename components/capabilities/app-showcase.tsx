"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { Reveal } from "@/components/motion/reveal"
import { iconFor } from "@/components/site/icons"
import type { Item } from "@/lib/site/types"
import { cn } from "@/lib/utils"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* --------------------------------------------------------------------------
   Applications · "What we build" as an app showcase.

   Left: the six doc items as a selectable list. Right: a device that shows
   the chosen app — a laptop for desk apps, a phone for field and consumer
   apps. The app's menu is made only of the words in that item's doc line
   (e.g. "Accounts, opportunities, quotes and forecasts" → four menu items);
   everything else on screen is shape, not text. The current menu item steps
   through on its own while the section is on screen.
   Click-driven; transform/opacity; reduced motion = static.
   -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const

type Spec = { device: "laptop" | "phone"; modules: string[]; tint: string; accent: string }

/* Menu words come from each item's doc line. */
const SPECS: Record<string, Spec> = {
  "CRM and sales systems": {
    device: "laptop",
    modules: ["Accounts", "Opportunities", "Quotes", "Forecasts"],
    tint: "from-white to-white ring-1 ring-inset ring-line",
    accent: "bg-navy-600",
  },
  "Field sales and field service apps": {
    device: "phone",
    modules: ["Visits", "Orders", "Collections", "Service jobs"],
    tint: "from-white to-white ring-1 ring-inset ring-line",
    accent: "bg-navy-600",
  },
  "Distributor and partner portals": {
    device: "laptop",
    modules: ["Onboarding", "Orders", "Schemes", "Claims", "Statements"],
    tint: "from-white to-white ring-1 ring-inset ring-line",
    accent: "bg-navy-600",
  },
  "Direct Store Delivery": {
    device: "phone",
    modules: ["Routes", "Loads", "Deliveries", "Returns", "Cash"],
    tint: "from-white to-white ring-1 ring-inset ring-line",
    accent: "bg-navy-600",
  },
  "Loyalty and customer apps": {
    device: "phone",
    modules: [],
    tint: "from-white to-white ring-1 ring-inset ring-line",
    accent: "bg-navy-600",
  },
  "Service and contract management": {
    device: "laptop",
    modules: ["Installed base", "Contracts", "Warranty", "Renewals"],
    tint: "from-white to-white ring-1 ring-inset ring-line",
    accent: "bg-navy-600",
  },
}

const FALLBACK: Spec = { device: "laptop", modules: [], tint: "from-white to-white ring-1 ring-inset ring-line", accent: "bg-navy-600" }

/* ------------------------------------------------------------- shapes */

function Bar({ w, className }: { w: string; className?: string }) {
  return <span className={cn("block h-2 rounded-full bg-ink-200/80", className)} style={{ width: w }} />
}

/* --------------------------------------------------------------- laptop */

function LaptopScreen({ title, spec, step }: { title: string; spec: Spec; step: number }) {
  const mods = spec.modules.length ? spec.modules : [title]
  const activeMod = step % mods.length
  return (
    <div className="flex h-full">
      {/* sidebar: the doc's words */}
      <div className="w-[34%] shrink-0 border-r border-line bg-paper-sunken/70 p-3">
        <div className="mb-3 flex items-center gap-2 px-1">
          <span className={cn("h-5 w-5 rounded-md", spec.accent)} />
          <Bar w="55%" className="bg-ink-300/70" />
        </div>
        <ul className="space-y-1">
          {mods.map((m, i) => (
            <li
              key={m}
              className={cn(
                "relative rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors duration-500",
                i === activeMod ? "text-ink-950" : "text-ink-500"
              )}
            >
              {i === activeMod && (
                <motion.span
                  layoutId="laptop-mod"
                  className="absolute inset-0 rounded-lg bg-white shadow-2xs"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative">{m}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* main: shape-only content that re-lays out per module */}
      <div className="flex-1 p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeMod}
            initial={{ opacity: 0, transform: "translateY(6px)" }}
            animate={{ opacity: 1, transform: "none" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-ink-950">{mods[activeMod]}</p>
              <span className={cn("h-5 w-14 rounded-md opacity-90", spec.accent)} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((k) => (
                <div key={k} className="rounded-lg border border-line bg-white p-2">
                  <Bar w="60%" />
                  <Bar w="40%" className="mt-2 h-3 bg-ink-300/70" />
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-line bg-white p-2.5">
              <div className="flex h-16 items-end gap-1.5">
                {[40, 65, 50, 80, 58, 90, 70, 95].map((h, k) => (
                  <span
                    key={k}
                    className={cn("flex-1 rounded-t-sm", k === 7 ? spec.accent : "bg-ink-200")}
                    style={{ height: `${(h + activeMod * 7) % 100 || 30}%` }}
                  />
                ))}
              </div>
            </div>
            {[0, 1, 2].map((k) => (
              <div key={k} className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-ink-200" />
                <Bar w={`${55 - k * 10}%`} />
                <span className="ml-auto h-3 w-10 rounded-full bg-ink-100" />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Laptop({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[38rem]">
      <div className="rounded-[1.25rem] border border-ink-900/80 bg-ink-950 p-2.5 shadow-[0_40px_80px_-40px_rgba(15,27,45,0.65)]">
        <div className="aspect-[16/10] overflow-hidden rounded-[0.6rem] bg-white">{children}</div>
      </div>
      <div className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-2xl bg-gradient-to-b from-ink-300 to-ink-400 shadow-[0_18px_30px_-18px_rgba(15,27,45,0.6)]" />
    </div>
  )
}

/* ---------------------------------------------------------------- phone */

function PhoneScreen({ title, spec, step }: { title: string; spec: Spec; step: number }) {
  const mods = spec.modules
  const activeMod = mods.length ? step % mods.length : 0
  return (
    <div className="flex h-full flex-col">
      <div className={cn("px-4 pb-4 pt-7 text-white", spec.accent)}>
        <p className="text-[13px] font-bold leading-snug">{title}</p>
        <div className="mt-3 h-14 rounded-xl bg-white/20" />
      </div>
      <div className="flex-1 space-y-2 p-3">
        {mods.length > 0
          ? mods.map((m, i) => (
              <div
                key={m}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-[background-color,border-color] duration-500",
                  i === activeMod ? "border-ink-950/10 bg-paper-sunken" : "border-line bg-white"
                )}
              >
                <span className={cn("h-6 w-6 shrink-0 rounded-lg", i === activeMod ? spec.accent : "bg-ink-100")} />
                <span className="text-[11px] font-semibold text-ink-900">{m}</span>
                <span className="ml-auto h-2 w-8 rounded-full bg-ink-100" />
              </div>
            ))
          : /* Loyalty: rewards-card shapes, no invented text */
            [0, 1, 2].map((k) => (
              <div key={k} className="rounded-xl border border-line bg-white p-3">
                <div className="flex items-center gap-2">
                  <span className={cn("h-7 w-7 rounded-full", k === step % 3 ? spec.accent : "bg-ink-100")} />
                  <Bar w="50%" />
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                  <span className={cn("block h-full rounded-full", spec.accent)} style={{ width: `${40 + k * 20}%` }} />
                </div>
              </div>
            ))}
      </div>
      <div className="flex justify-around border-t border-line px-4 py-2.5">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} className={cn("h-4 w-4 rounded-md", k === 0 ? spec.accent : "bg-ink-200")} />
        ))}
      </div>
    </div>
  )
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[15.5rem]">
      <div className="relative rounded-[2.4rem] border border-ink-900/80 bg-ink-950 p-2.5 shadow-[0_40px_80px_-36px_rgba(15,27,45,0.65)]">
        <span className="absolute left-1/2 top-3.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-ink-950" />
        <div className="aspect-[9/19] overflow-hidden rounded-[1.9rem] bg-white">{children}</div>
      </div>
    </div>
  )
}

/** The device for one app (laptop or phone), with its doc-word menu. */
function Device({ title, step, compact = false }: { title: string; step: number; compact?: boolean }) {
  const spec = SPECS[title] ?? FALLBACK
  // Narrow screens: every app as a phone, which reads at that width.
  return spec.device === "laptop" && !compact ? (
    <Laptop>
      <LaptopScreen title={title} spec={spec} step={step} />
    </Laptop>
  ) : (
    <Phone>
      <PhoneScreen title={title} spec={spec} step={step} />
    </Phone>
  )
}

/* ------------------------------------------------------------- section */

export function AppShowcase({ title, items }: { title: string; items: Item[] }) {
  const reduce = useReducedMotionSafe()
  const [active, setActive] = useState(0)
  const [step, setStep] = useState(0)
  const stageRef = useRef<HTMLElement>(null)
  const inView = useInView(stageRef, { amount: 0.25 })

  // Step through the active app's menu while it is on screen.
  useEffect(() => {
    if (reduce || !inView) return
    const id = setInterval(() => setStep((s) => s + 1), 1800)
    return () => clearInterval(id)
  }, [reduce, inView])

  const choose = (i: number) => {
    setActive(i)
    setStep(0)
  }

  const item = items[active]
  const spec = SPECS[item.title ?? ""] ?? FALLBACK

  return (
    <section ref={stageRef} className="relative isolate overflow-hidden py-16 lg:py-24">

      <div className="zx-container">
        <Reveal>
          <h2 className="zx-display-sm text-[2rem] text-ink-950 sm:text-[2.5rem] lg:text-[2.75rem]">{title}</h2>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
          {/* The six apps */}
          <Reveal className="lg:col-span-5">
            <ul role="tablist" aria-label={title} className="space-y-2">
              {items.map((it, i) => {
                const on = i === active
                const Icon = iconFor(it.icon)
                const sp = SPECS[it.title ?? ""] ?? FALLBACK
                return (
                  <li key={it.title}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => choose(i)}
                      onMouseEnter={() => choose(i)}
                      className={cn(
                        "group relative flex w-full select-none items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-[border-color,background-color,box-shadow] duration-500 sm:p-5",
                        on
                          ? "border-white bg-white shadow-[0_22px_48px_-30px_rgba(15,27,45,0.45)]"
                          : "border-transparent hover:border-line hover:bg-white/60"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-ink-800 transition-[scale] duration-500",
                          sp.tint,
                          on && "scale-105"
                        )}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-[1.0625rem] font-bold transition-colors", on ? "text-ink-950" : "text-ink-700")}>
                          {it.title}
                        </span>
                        <span
                          className={cn(
                            "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          )}
                        >
                          <span className="overflow-hidden">
                            <span className="block pt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">{it.body}</span>
                            {on && (
                              <span className={cn("mt-4 block rounded-2xl bg-gradient-to-br p-4 lg:hidden", sp.tint)}>
                                <Device title={it.title ?? ""} step={step} compact />
                              </span>
                            )}
                          </span>
                        </span>
                      </span>
                      {on && (
                        <motion.span
                          layoutId="app-active-bar"
                          className={cn("absolute inset-y-3 left-0 w-1 rounded-full", sp.accent)}
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </Reveal>

          {/* The device */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="lg:sticky lg:top-32">
              <div className={cn("relative flex min-h-[26rem] items-center justify-center rounded-[2rem] bg-gradient-to-br p-6 sm:min-h-[30rem] sm:p-10", spec.tint)}>
                <div aria-hidden className="absolute inset-[15%] rounded-full bg-white/40 blur-3xl" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={item.title}
                    className="relative w-full"
                    // Same transform functions at both ends: framer won't tween a
                    // scale() to "none" (the device would stay hidden).
                    initial={{ opacity: 0, transform: reduce ? "translateY(0px) scale(1)" : "translateY(18px) scale(0.98)" }}
                    animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
                    exit={{ opacity: 0, transform: reduce ? "translateY(0px) scale(1)" : "translateY(-10px) scale(0.99)" }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <Device title={item.title ?? ""} step={step} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
