"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useInView,
  useSpring,
  type Variants,
} from "framer-motion"
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  Info,
  Mail,
  Search,
  Users,
} from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* --------------------------------------------------------------------------
   "One request. Five safeguards."

   One customer request followed from inbox to audit log. Left: five steps as
   plain text beside a thin line; the active step's line is indigo and its
   explanation opens beneath it. Right: one soft-grey panel showing the
   product at that step.

   The section scrolls like any other — it never pins or reacts to scroll.
   The story moves only when the visitor uses a control: a step in the list,
   the panel's arrows, the numbered dots (phone), or a swipe on the panel.

   Autoplay (~6s per step while on screen, paused on hover, stopped for good
   by any click or key press) is built in but off: flip AUTOPLAY to enable it.
   -------------------------------------------------------------------------- */
const AUTOPLAY = false

const STEPS = [
  {
    title: "Multi-agent systems",
    body: "Specialized agents for orders, collections, renewals and service, coordinating the work between them.",
  },
  {
    title: "MCP connections",
    body: "A standard, secure way for agents to reach your ERP, CRM, email and documents.",
  },
  {
    title: "Grounded answers",
    body: "Retrieval over your own price lists, contracts and records, not guesses.",
  },
  {
    title: "Human in the loop",
    body: "Every customer-facing action approved by your team.",
  },
  {
    title: "Observable by design",
    body: "Every agent action logged and traceable.",
  },
] as const

const COUNT = STEPS.length
const AUTOPLAY_MS = 6000
const EASE = [0.22, 1, 0.36, 1] as const

/** How many of `marks` (ms after mount) have passed. Reduced motion: all. */
function useMarks(marks: number[], reduced: boolean) {
  const [reached, setReached] = useState(reduced ? marks.length : 0)
  const key = marks.join(",")
  useEffect(() => {
    if (reduced) {
      setReached(marks.length)
      return
    }
    const timers = marks.map((ms, i) => setTimeout(() => setReached((r) => Math.max(r, i + 1)), ms))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reduced])
  return reached
}

/** Fade (and, unless reduced, a small rise) for items that appear in turn. */
function appear(on: boolean, reduced: boolean, y = 8) {
  return {
    initial: false as const,
    animate: on
      ? { opacity: 1, transform: "translateY(0px)" }
      : { opacity: 0, transform: reduced ? "translateY(0px)" : `translateY(${y}px)` },
    transition: { duration: reduced ? 0.2 : 0.5, ease: EASE },
  }
}

export function McpAdvantage() {
  const reduced = useReducedMotionSafe()
  const stageRef = useRef<HTMLDivElement>(null)

  const [step, setStep] = useState(0)
  const [stopped, setStopped] = useState(false)
  const [hovering, setHovering] = useState(false)
  const inView = useInView(stageRef, { amount: 0.5 })

  const goTo = useCallback((next: number) => {
    setStep(Math.max(0, Math.min(COUNT - 1, next)))
  }, [])

  /* ---------------- Autoplay (off unless AUTOPLAY) ---------------- */
  useEffect(() => {
    if (!AUTOPLAY || stopped || hovering || !inView || step >= COUNT - 1) return
    const t = setTimeout(() => goTo(step + 1), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [step, stopped, hovering, inView, goTo])

  const userGoTo = (i: number) => {
    setStopped(true)
    goTo(i)
  }

  /* ---------------- Entrance ---------------- */
  const listItem: Variants = {
    hidden: { opacity: 0, transform: reduced ? "none" : "translateY(10px)" },
    show: { opacity: 1, transform: "none", transition: { duration: 0.6, ease: EASE } },
  }
  const panelIn: Variants = {
    hidden: { opacity: 0, transform: reduced ? "none" : "translateY(18px)" },
    show: { opacity: 1, transform: "none", transition: { duration: 0.8, ease: EASE, delay: 0.2 } },
  }

  return (
    <section id="how-our-ai-works" className="border-t border-line py-16 lg:py-24">
      <div className="zx-container">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              {/* H2 from the doc's Home §6 */}
              <h2 className="zx-display-sm text-[2.25rem] text-ink-950 sm:text-[2.75rem] lg:text-[3rem]">
                AI that works inside your business, <span className="zx-serif text-navy-600">not beside it</span>
              </h2>
            </div>
            <Link
              href="/capabilities/ai/how-it-works"
              className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-700 transition-colors hover:text-navy-600"
            >
              How our AI works
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="mt-10 lg:mt-12">
        <div
          ref={stageRef}
          onPointerDown={() => setStopped(true)}
          // Fast clicks anywhere in the stage (not just on the arrows) become
          // a double/triple-click that selects into the sections below.
          // Block multi-click selection here; drag-to-select still works.
          onMouseDown={(e) => e.detail > 1 && e.preventDefault()}
          onKeyDown={() => setStopped(true)}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
          onPointerLeave={() => setHovering(false)}
        >
          <motion.div
            className="zx-container w-full"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            // The step texts start as the backdrop shape is settling.
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } } }}
          >
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
              {/* Desktop step list, on its soft backdrop: from the screen's
                  left edge to just past the longest step, a clear gap before
                  the card. The list is vertically centred on the card (grid
                  items-center) and the shape extends equally above and below
                  it, so the shape is centred on the card too. */}
              <div className="relative isolate hidden lg:block">
                <StepBackdrop
                  reduced={reduced}
                  // Left offset = distance from the screen edge to the container's
                  // content: half the space outside the 80rem container, plus
                  // its padding (2rem, 2.5rem from xl).
                  className="-right-6 -inset-y-8 -left-[calc(max(0px,(100vw_-_80rem)/2)_+_2rem)] rounded-r-[2.5rem] xl:-left-[calc(max(0px,(100vw_-_80rem)/2)_+_2.5rem)]"
                />
                <StepList step={step} onSelect={userGoTo} itemVariants={listItem} />
              </div>

              {/* Phone/tablet: numbered dots + the active step's text, on a
                  backdrop spanning the screen width (square on the left edge,
                  rounded on the right). */}
              <div className="relative isolate lg:hidden">
                <StepBackdrop
                  reduced={reduced}
                  // Below lg the container is full width, so its padding is the
                  // whole distance to each screen edge.
                  className="-left-5 -right-5 -inset-y-5 rounded-r-[1.75rem] md:-left-8 md:-right-8"
                />
                {/* The dots live in the panel's footer. */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className="text-xl font-semibold leading-snug text-ink-950">{STEPS[step].title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{STEPS[step].body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div variants={panelIn}>
                <StoryPanel step={step} reduced={reduced} onSelect={userGoTo} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   Step backdrop: a quiet, flat half-pill behind the steps. It runs off the
   screen's left edge (so its left side is square and flush with the edge —
   overflow to the left never scrolls) and ends in a big rounded tip. Slides
   in from the left with a fade once, as the section enters; never moves on
   step changes. Reduced motion: fade only. Sizing comes from `className`.
   -------------------------------------------------------------------------- */
function StepBackdrop({ reduced, className }: { reduced: boolean; className: string }) {
  return (
    <motion.div
      aria-hidden
      // A white card in the site's own style (hairline border, soft shadow) on
      // the paper ground. The shape starts exactly at the screen's left edge
      // (see the call sites), so it has no border on that side.
      className={`pointer-events-none absolute -z-10 border border-l-0 border-line bg-white shadow-[0_24px_60px_-40px_rgba(19,23,32,0.35)] ${className}`}
      initial={{ opacity: 0, transform: reduced ? "none" : "translateX(-120px)" }}
      whileInView={{ opacity: 1, transform: "none" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduced ? 0.4 : 0.8, ease: EASE }}
    />
  )
}

/* --------------------------------------------------------------------------
   Step list: plain text beside a thin line. The indigo segment follows the
   active step (spring), tracking it while the explanations expand/collapse.
   -------------------------------------------------------------------------- */
function StepList({
  step,
  onSelect,
  itemVariants,
  className,
}: {
  step: number
  onSelect: (i: number) => void
  itemVariants: Variants
  className?: string
}) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const barY = useSpring(0, { stiffness: 260, damping: 34, mass: 0.6 })
  const barH = useSpring(0, { stiffness: 260, damping: 34, mass: 0.6 })
  const placed = useRef(false)

  useEffect(() => {
    let raf = 0
    // Follow the active item for the length of the expand/collapse, so the
    // line lands exactly as the list settles.
    const until = performance.now() + 700
    const follow = () => {
      const el = itemRefs.current[step]
      if (el) {
        if (!placed.current) {
          barY.jump(el.offsetTop)
          barH.jump(el.offsetHeight)
          placed.current = true
        } else {
          barY.set(el.offsetTop)
          barH.set(el.offsetHeight)
        }
      }
      if (performance.now() < until) raf = requestAnimationFrame(follow)
    }
    follow()
    return () => cancelAnimationFrame(raf)
  }, [step, barY, barH])

  return (
    <ol className={`relative ${className ?? ""}`} aria-label="Five safeguards">
      <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-line" />
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 w-0.5 -translate-x-[0.5px] rounded-full bg-navy-600"
        style={{ y: barY, height: barH }}
      />
      {STEPS.map((s, i) => {
        const active = i === step
        return (
          <motion.li
            key={s.title}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            variants={itemVariants}
            className="pl-7"
          >
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active ? "step" : undefined}
              className={`block w-full select-none py-3.5 text-left text-lg font-semibold leading-snug transition-colors duration-300 xl:text-xl ${
                active ? "text-ink-950" : "text-ink-600 hover:text-ink-800"
              }`}
            >
              {/* The selected title zooms in from its left edge. A scale (not a
                  font-size change) so the list never re-flows or jumps. */}
              <span
                className={`inline-block origin-left transition-[scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active ? "scale-[1.15]" : "scale-100"
                }`}
              >
                {s.title}
              </span>
            </button>
            {/* Soft expand: grid rows 0fr → 1fr animates to the text's own height. */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-md pb-4 text-[15px] leading-relaxed text-ink-600">{s.body}</p>
              </div>
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}

function StepDots({
  step,
  onSelect,
  className = "",
}: {
  step: number
  onSelect: (i: number) => void
  className?: string
}) {
  return (
    <ol className={`flex items-center gap-1.5 ${className}`} aria-label="Five safeguards">
      {STEPS.map((s, i) => {
        const active = i === step
        return (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active ? "step" : undefined}
              aria-label={`Step ${i + 1}: ${s.title}`}
              className="group flex h-8 min-w-8 select-none items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${
                  active ? "w-6 bg-navy-600" : "w-2 bg-ink-300 group-hover:bg-ink-500"
                }`}
              />
            </button>
          </li>
        )
      })}
    </ol>
  )
}

/* --------------------------------------------------------------------------
   The panel: a soft-grey surface holding one product window. The window's
   chrome (app bar) stays put; only its view changes — the old view floats up
   and out, the new one rises in. Swipe on touch; counter and arrows below.
   -------------------------------------------------------------------------- */
const VIEWS = ["Agents", "Connections", "Answer", "Approvals", "Audit log"] as const

function StoryPanel({
  step,
  reduced,
  onSelect,
}: {
  step: number
  reduced: boolean
  onSelect: (i: number) => void
}) {
  const lift = reduced ? 0 : 14
  return (
    <div
      role="region"
      aria-label={`Step ${step + 1} of ${COUNT}: ${STEPS[step].title}`}
      className="flex h-[520px] flex-col rounded-3xl border border-line bg-ink-50/70 p-3 sm:p-5 lg:h-[33rem]"
    >
      {/* Product window */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_14px_34px_-18px_rgba(15,23,42,0.22)]">
        <AppBar view={VIEWS[step]} reduced={reduced} />
        <motion.div
          className="relative min-h-0 flex-1"
          style={{ touchAction: "pan-y" }}
          onPanEnd={(_, info) => {
            if (Math.abs(info.offset.x) < 50 || Math.abs(info.offset.x) < Math.abs(info.offset.y)) return
            onSelect(step + (info.offset.x < 0 ? 1 : -1))
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={step}
              className="absolute inset-0 overflow-hidden p-3.5 sm:p-5"
              initial={{ opacity: 0, transform: `translateY(${lift}px)` }}
              animate={{
                opacity: 1,
                transform: "translateY(0px)",
                transition: { duration: 0.6, ease: EASE, delay: 0.12 },
              }}
              exit={{
                opacity: 0,
                transform: `translateY(${-lift}px)`,
                transition: { duration: 0.4, ease: EASE },
              }}
            >
              {step === 0 && <AgentsScene reduced={reduced} />}
              {step === 1 && <SystemsScene reduced={reduced} />}
              {step === 2 && <SourcesScene reduced={reduced} />}
              {step === 3 && <ApprovalScene reduced={reduced} />}
              {step === 4 && <AuditScene reduced={reduced} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-3 flex select-none items-center justify-between px-1 sm:mt-4">
        <StepDots step={step} onSelect={onSelect} />
        <div className="flex items-center gap-2">
          <PanelArrow label="Previous step" disabled={step === 0} onClick={() => onSelect(step - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </PanelArrow>
          <PanelArrow label="Next step" disabled={step === COUNT - 1} onClick={() => onSelect(step + 1)}>
            <ChevronRight className="h-4 w-4" />
          </PanelArrow>
        </div>
      </div>
    </div>
  )
}

/** The window's top bar: app mark, the case, the current view, the agents. */
function AppBar({ view, reduced }: { view: string; reduced: boolean }) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-line px-4">
      <div className="flex min-w-0 items-center gap-2.5 text-[13px]">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink-950 text-[11px] font-bold text-white">
          Z
        </span>
        <span className="truncate font-medium text-ink-900">AMC renewal</span>
        <span className="hidden text-ink-300 sm:inline">/</span>
        <span className="relative hidden h-5 overflow-hidden sm:block">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={view}
              className="block whitespace-nowrap text-ink-500"
              initial={{ opacity: 0, transform: reduced ? "none" : "translateY(8px)" }}
              animate={{ opacity: 1, transform: "none" }}
              exit={{ opacity: 0, transform: reduced ? "none" : "translateY(-8px)" }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {view}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
      <div className="flex shrink-0 items-center -space-x-1.5" aria-hidden>
        {["R", "C", "S"].map((m) => (
          <Monogram key={m} letter={m} size="sm" ring />
        ))}
      </div>
    </div>
  )
}

function PanelArrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      // Disabled arrows keep catching clicks (no pointer-events-none): rapid
      // clicks at 1/5 or 5/5 must not fall through to the page, where they
      // become a double/triple-click that selects the sections around it.
      className="zx-glass-btn flex h-9 w-9 select-none items-center justify-center rounded-full border border-line bg-white text-ink-700 transition-[translate,color,border-color] duration-200 hover:-translate-y-px hover:border-ink-300 hover:text-ink-950 disabled:cursor-default disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-line disabled:hover:text-ink-700"
    >
      {children}
    </button>
  )
}

/* --------------------------------------------------------------------------
   Shared UI atoms for the product views
   -------------------------------------------------------------------------- */
function Monogram({
  letter,
  size = "md",
  ring = false,
  tone = "ink",
}: {
  letter: string
  size?: "sm" | "md"
  ring?: boolean
  tone?: "ink" | "accent"
}) {
  const dims = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs"
  const colors = tone === "accent" ? "bg-navy-600 text-white" : "bg-ink-100 text-ink-700"
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${dims} ${colors} ${
        ring ? "ring-2 ring-white" : ""
      }`}
    >
      {letter}
    </span>
  )
}

/** Small status chip in the accent tint. */
function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-navy-600/[0.07] px-2.5 py-0.5 text-xs font-medium text-navy-700">
      {children}
    </span>
  )
}

/** Three softly pulsing dots — the agent is working. */
function Working() {
  return (
    <span className="inline-flex items-center gap-1 px-1" aria-label="Working">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy-600/70"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  )
}

/* --------------------------------------------------------------------------
   1 — Specialist agents share the work: an activity thread with hand-offs
   -------------------------------------------------------------------------- */
const AGENTS = [
  { letter: "R", name: "Renewals agent", task: "Prepares the renewal quote", status: "Drafted quote" },
  { letter: "C", name: "Collections agent", task: "Checks the account balance", status: "No dues" },
  { letter: "S", name: "Service agent", task: "Reviews open service work", status: "2 open tickets" },
]

function AgentsScene({ reduced }: { reduced: boolean }) {
  const shown = useMarks([350, 950, 1550], reduced)
  const done = useMarks([1650, 2250, 2850], reduced)
  return (
    <div className="flex h-full flex-col">
      {/* Incoming request */}
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-950 text-white">
          <Mail className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-ink-500">
            <span className="font-medium text-ink-800">Inbox</span> · 09:40
          </p>
          <p className="mt-1 text-[15px] font-medium leading-snug text-ink-950">
            A customer’s AMC expires in 7 days. Prepare a renewal.
          </p>
        </div>
      </div>

      {/* Hand-offs */}
      <p className="mt-5 text-xs font-medium text-ink-500">Handed off to</p>
      <ol className="relative mt-2">
        <span aria-hidden className="absolute bottom-5 left-4 top-5 w-px bg-line" />
        {AGENTS.map((a, i) => (
          <motion.li
            key={a.name}
            {...appear(shown > i, reduced)}
            className="relative flex items-center justify-between gap-3 py-2"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="relative z-10 rounded-full bg-white p-0.5">
                <Monogram letter={a.letter} tone={done > i ? "accent" : "ink"} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink-950">{a.name}</span>
                <span className="block truncate text-xs text-ink-500">{a.task}</span>
              </span>
            </span>
            <span className="grid shrink-0 justify-items-end">
              <AnimatePresence initial={false} mode="wait">
                {done > i ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Chip>
                      <Check className="h-3 w-3" strokeWidth={3} />
                      {a.status}
                    </Chip>
                  </motion.span>
                ) : (
                  <motion.span key="working" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Working />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

/* --------------------------------------------------------------------------
   2 — They reach your systems through MCP: an integrations settings table
   -------------------------------------------------------------------------- */
const SYSTEMS = [
  { icon: Database, name: "ERP", detail: "Orders and invoices", access: "Read" },
  { icon: Users, name: "CRM", detail: "Accounts and contacts", access: "Read and write" },
  { icon: Mail, name: "Email", detail: "Customer mailbox", access: "Draft only" },
  { icon: FileText, name: "Contracts", detail: "Signed agreements", access: "Read" },
]

function SystemsScene({ reduced }: { reduced: boolean }) {
  const connected = useMarks([500, 1000, 1500, 2000], reduced)
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[15px] font-semibold text-ink-950">MCP connections</p>
        <p className="text-xs text-ink-500">
          <span className="tabular-nums">{connected}</span> of {SYSTEMS.length} connected
        </p>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-4 border-b border-line bg-ink-50/80 px-3.5 py-2 text-xs font-medium text-ink-500">
          <span>System</span>
          <span>Access</span>
          <span className="w-20 text-right">Status</span>
        </div>
        <ul className="divide-y divide-line">
          {SYSTEMS.map((s, i) => {
            const Icon = s.icon
            const on = connected > i
            return (
              <li
                key={s.name}
                className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-4 px-3.5 py-2.5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-ink-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink-950">{s.name}</span>
                    <span className="block truncate text-xs text-ink-500">{s.detail}</span>
                  </span>
                </span>
                <span className="whitespace-nowrap rounded-md border border-line px-2 py-0.5 text-xs font-medium text-ink-600">
                  {s.access}
                </span>
                <span className="flex w-20 items-center justify-end gap-1.5 text-xs font-medium">
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    {/* Soft glow, once, as the system connects */}
                    {on && !reduced && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-navy-600/25"
                        initial={{ opacity: 0.9, transform: "scale(0.6)" }}
                        animate={{ opacity: 0, transform: "scale(2.2)" }}
                        transition={{ duration: 0.9, ease: EASE }}
                      />
                    )}
                    <span
                      className={`relative flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-300 ${
                        on ? "bg-navy-600 text-white" : "border border-dashed border-ink-300"
                      }`}
                    >
                      {on && <Check className="h-2.5 w-2.5" strokeWidth={3.5} />}
                    </span>
                  </span>
                  <span className={`transition-colors duration-300 ${on ? "text-ink-900" : "text-ink-400"}`}>
                    {on ? "Connected" : "Connecting"}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   3 — Every answer cites a record: a chat answer with numbered citations
   -------------------------------------------------------------------------- */
const SOURCES = ["Contract C-2291, clause 4.2", "Price list, current quarter", "Ledger, 0 overdue"]

function Cite({ n }: { n: number }) {
  return (
    <sup className="mx-0.5 inline-flex h-4 min-w-4 -translate-y-0.5 items-center justify-center rounded bg-navy-600/10 px-1 align-baseline text-[10px] font-semibold text-navy-700">
      {n}
    </sup>
  )
}

function SourcesScene({ reduced }: { reduced: boolean }) {
  const answer = useMarks([450], reduced)
  const sources = useMarks([1000, 1300, 1600], reduced)
  const note = useMarks([2100], reduced)
  return (
    <div className="flex h-full flex-col">
      {/* Question */}
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink-100 px-3.5 py-2 text-sm text-ink-900">
          Can this customer renew at the same rate?
        </p>
      </div>

      {/* Answer with citations */}
      <motion.div {...appear(answer > 0, reduced)} className="mt-3 flex items-start gap-3">
        <Monogram letter="R" tone="accent" />
        <div className="min-w-0">
          <p className="text-xs text-ink-500">
            <span className="font-medium text-ink-800">Renewals agent</span> · cited answer
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-900">
            Yes. Clause 4.2 holds the contracted rate for one more term
            <Cite n={1} />, the current price list confirms it
            <Cite n={2} />, and the account has no overdue invoices
            <Cite n={3} />.
          </p>
        </div>
      </motion.div>

      {/* Sources */}
      <div className="mt-4 rounded-xl border border-line">
        <p className="border-b border-line px-3.5 py-2 text-xs font-medium text-ink-500">Sources</p>
        <ol className="divide-y divide-line">
          {SOURCES.map((s, i) => (
            <motion.li
              key={s}
              {...appear(sources > i, reduced, 6)}
              className="flex items-center gap-3 px-3.5 py-2 text-sm"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-navy-600/10 text-[11px] font-semibold text-navy-700">
                {i + 1}
              </span>
              <FileText className="h-3.5 w-3.5 shrink-0 text-ink-400" />
              <span className="truncate text-ink-800">{s}</span>
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.p
        {...appear(note > 0, reduced, 6)}
        className="mt-auto flex items-start gap-2 pt-3 text-xs leading-relaxed text-ink-500"
      >
        <Info className="mt-px h-3.5 w-3.5 shrink-0" />
        No matching record? The agent flags the gap and asks your team.
      </motion.p>
    </div>
  )
}

/* --------------------------------------------------------------------------
   4 — Your team approves what customers see: a mail-client compose view
   -------------------------------------------------------------------------- */
function ApprovalScene({ reduced }: { reduced: boolean }) {
  const [approved, setApproved] = useState(false)
  const fields = [
    { label: "From", value: "Renewals agent" },
    { label: "To", value: "Customer procurement team" },
    { label: "Subject", value: "Your AMC renewal is ready", strong: true },
  ]
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line">
      <dl className="divide-y divide-line text-sm">
        {fields.map((f) => (
          <div key={f.label} className="flex gap-3 px-3.5 py-2">
            <dt className="w-14 shrink-0 text-ink-500">{f.label}</dt>
            <dd className={`min-w-0 truncate ${f.strong ? "font-semibold text-ink-950" : "text-ink-800"}`}>
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-line px-3.5 py-3 text-sm leading-relaxed text-ink-700">
        <p>Hello,</p>
        <p className="mt-1.5">
          Your annual maintenance contract renews on the 14th at your contracted rate. The renewal quote is
          attached for your review.
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-ink-700">
          <FileText className="h-3.5 w-3.5 text-ink-400" />
          Renewal quote.pdf
        </span>
      </div>

      {/* Approval bar */}
      <div className="mt-auto flex min-h-[3.25rem] items-center justify-between gap-3 border-t border-line bg-ink-50/80 px-3.5 py-2.5">
        <AnimatePresence mode="wait" initial={false}>
          {approved ? (
            <motion.div
              key="approved"
              initial={{ opacity: 0, transform: reduced ? "none" : "translateY(6px)" }}
              animate={{ opacity: 1, transform: "none" }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex flex-wrap items-center gap-3"
              role="status"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-3 py-1 text-sm font-semibold text-signal-strong">
                <Check className="h-4 w-4" strokeWidth={2.5} />
                Approved
              </span>
              <span className="text-sm text-ink-500">Sent and logged</span>
            </motion.div>
          ) : (
            <motion.div
              key="actions"
              exit={{ opacity: 0, transform: reduced ? "none" : "translateY(-6px)" }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex w-full flex-wrap items-center justify-end gap-2 sm:justify-between"
            >
              {/* Hidden on phones so the three buttons fit on one line. */}
              <span className="hidden text-xs font-medium text-ink-500 sm:inline">Waiting for your approval</span>
              <span className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-500 transition-[translate,color] duration-200 hover:-translate-y-px hover:text-ink-900"
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="zx-glass-btn rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink-700 transition-[translate,border-color] duration-200 hover:-translate-y-px hover:border-ink-300"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setApproved(true)}
                  className="rounded-lg bg-navy-600 px-3 py-1.5 text-sm font-semibold text-white transition-[translate,background-color] duration-200 hover:-translate-y-px hover:bg-navy-700"
                >
                  Approve and send
                </button>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   5 — Every step is logged: an events table that fills in line by line
   -------------------------------------------------------------------------- */
const LOG = [
  { time: "09:41:02", actor: "R", who: "Renewals agent", text: "Read contract", record: "C-2291" },
  { time: "09:41:05", actor: "C", who: "Collections agent", text: "Checked ledger", record: "AR-1042" },
  { time: "09:41:09", actor: "R", who: "Renewals agent", text: "Created draft email" },
  { time: "09:52:30", actor: "AM", who: "Account manager", text: "Approved" },
  { time: "09:52:31", actor: "R", who: "Renewals agent", text: "Sent email" },
]

function AuditScene({ reduced }: { reduced: boolean }) {
  const lines = useMarks([400, 900, 1400, 1900, 2400], reduced)
  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <span className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-line px-2.5 text-sm text-ink-400">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Search events</span>
        </span>
        <span className="flex h-8 shrink-0 items-center rounded-lg border border-line px-2.5 text-xs font-medium text-ink-600">
          Today
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 border-b border-line bg-ink-50/80 px-3.5 py-2 text-xs font-medium text-ink-500 sm:grid-cols-[4.5rem_10rem_minmax(0,1fr)]">
          <span>Time</span>
          <span className="hidden sm:block">Actor</span>
          <span>Event</span>
        </div>
        <ol className="divide-y divide-line">
          {LOG.map((l, i) => {
            const on = lines > i
            // "Typing in": each row is revealed left to right.
            return (
              <motion.li
                key={l.time}
                initial={false}
                animate={
                  on
                    ? { opacity: 1, clipPath: "inset(0 0% 0 0)" }
                    : {
                        opacity: reduced ? 0 : 1,
                        clipPath: reduced ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                      }
                }
                transition={{ duration: reduced ? 0.2 : 0.55, ease: "easeOut" }}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-3 px-3.5 py-2 text-sm sm:grid-cols-[4.5rem_10rem_minmax(0,1fr)]"
              >
                <span className="font-mono text-xs tabular-nums text-ink-400">{l.time}</span>
                <span className="hidden min-w-0 items-center gap-2 sm:flex">
                  <Monogram letter={l.actor} size="sm" tone={l.actor === "AM" ? "accent" : "ink"} />
                  <span className="truncate text-ink-700">{l.who}</span>
                </span>
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-ink-950">
                    <span className="text-ink-500 sm:hidden">{l.who} · </span>
                    {l.text}
                  </span>
                  {l.record && (
                    <span className="hidden shrink-0 rounded border border-line px-1.5 font-mono text-[11px] text-ink-500 sm:inline">
                      {l.record}
                    </span>
                  )}
                </span>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
