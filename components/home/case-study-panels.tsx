"use client"

import React, { useState, useRef, useId } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
export interface CaseStudyStat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export type VisualType = "network" | "route" | "flow"
export type PanelAccentColor = "blue" | "green" | "purple"

export interface CaseStudyItem {
  /** Optional labels; the homepage shows only the doc's title + description. */
  industry?: string
  title: string
  description: string
  chips?: string[]
  stat?: CaseStudyStat
  accentColor: PanelAccentColor
  icon: React.ComponentType<{ className?: string }>
  href: string
  visual: VisualType
  /** Optional background picture for the card (path under /public). A light
      wash is laid over it so text stays readable. */
  image?: string
  /** CSS object-position for the picture, to keep its subject in view when
      the card is narrow (e.g. "40% center"). Defaults to centre. */
  imagePosition?: string
}

interface CaseStudyPanelsProps {
  cases: CaseStudyItem[]
  className?: string
}

/* --------------------------------------------------------------------------
   Themes
   -------------------------------------------------------------------------- */
type Theme = {
  accent: string
  stat: string
  surface: string
  border: string
  borderActive: string
  icon: string
  chip: string
  soft: string
}

const THEMES: Record<PanelAccentColor, Theme> = {
  blue: {
    accent: "#2563eb",
    stat: "text-blue-700",
    surface: "bg-gradient-to-b from-[#EEF4FF] to-[#E2ECFF]",
    border: "border-blue-200/80",
    borderActive: "border-blue-300 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.35)]",
    icon: "bg-white text-blue-700 border border-blue-200",
    chip: "bg-white/85 text-blue-800 border-blue-200",
    soft: "bg-blue-50 text-blue-700 border-blue-200",
  },
  green: {
    accent: "#059669",
    stat: "text-emerald-700",
    surface: "bg-gradient-to-b from-[#E9F8F0] to-[#DAF2E6]",
    border: "border-emerald-200/80",
    borderActive: "border-emerald-300 shadow-[0_10px_24px_-16px_rgba(5,150,105,0.35)]",
    icon: "bg-white text-emerald-700 border border-emerald-200",
    chip: "bg-white/85 text-emerald-800 border-emerald-200",
    soft: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  purple: {
    accent: "#7c3aed",
    stat: "text-violet-700",
    surface: "bg-gradient-to-b from-[#F2EEFF] to-[#E7DFFF]",
    border: "border-violet-200/80",
    borderActive: "border-violet-300 shadow-[0_10px_24px_-16px_rgba(124,58,237,0.35)]",
    icon: "bg-white text-violet-700 border border-violet-200",
    chip: "bg-white/85 text-violet-800 border-violet-200",
    soft: "bg-violet-50 text-violet-700 border-violet-200",
  },
}

const EASE = [0.22, 1, 0.36, 1] as const

/* Desktop panel proportions: the open panel takes OPEN shares of the row,
   each closed one takes 1. Content inside a panel is laid out at its final
   width (see DesktopPanel), so text never re-wraps while a panel resizes. */
const OPEN = 3.2
const ROW_GAP = "1rem"

function StatValue({ stat }: { stat: CaseStudyStat }) {
  return (
    <>
      {stat.prefix}
      {stat.value}
      {stat.suffix}
    </>
  )
}

/* --------------------------------------------------------------------------
   Visuals — one-shot, labelled diagrams. Each draws in when its panel opens
   (and is on screen), resets when it closes, and never loops.
   -------------------------------------------------------------------------- */
function useOn(active: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.4 })
  return { ref, on: active && seen }
}

function VisualFrame({
  title,
  status,
  theme,
  children,
}: {
  title: string
  status: string
  theme: Theme
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
          {title}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
            theme.soft
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent }} />
          {status}
        </span>
      </div>
      {/* Grows to fill the frame on desktop and centres the diagram in it. */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col justify-center">{children}</div>
    </div>
  )
}

/** Building materials: a manufacturer at the centre of its partner network. */
function NetworkVisual({ active, theme }: { active: boolean; theme: Theme }) {
  const reduce = useReducedMotionSafe()
  const { ref, on } = useOn(active)
  const hub = { x: 180, y: 62 }
  const nodes = [
    { x: 52, y: 22, label: "Distributors", anchor: "start" as const, tx: 66 },
    { x: 52, y: 102, label: "Dealers", anchor: "start" as const, tx: 66 },
    { x: 308, y: 22, label: "Depots", anchor: "end" as const, tx: 294 },
    { x: 308, y: 102, label: "Field sales", anchor: "end" as const, tx: 294 },
  ]

  return (
    <div ref={ref} className="h-full">
      <VisualFrame title="Partner network" status="Ordering live" theme={theme}>
        <svg
          viewBox="0 0 360 124"
          className="h-full max-h-[200px] min-h-[124px] w-full"
          fill="none"
          aria-hidden="true"
        >
          {nodes.map((n, i) => (
            <motion.path
              key={`spoke-${n.label}`}
              d={`M ${hub.x} ${hub.y} L ${n.x} ${n.y}`}
              stroke={theme.accent}
              strokeWidth="1.5"
              strokeOpacity="0.55"
              initial={false}
              animate={{ pathLength: on || reduce ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: on ? 0.1 + i * 0.08 : 0, ease: EASE }}
            />
          ))}

          {nodes.map((n, i) => (
            <g key={n.label}>
              <circle cx={n.x} cy={n.y} r="9" fill="#fff" stroke={theme.accent} strokeWidth="1.75" />
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="3.5"
                fill={theme.accent}
                initial={false}
                animate={{ scale: on || reduce ? 1 : 0 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                transition={{ duration: reduce ? 0 : 0.3, delay: on ? 0.45 + i * 0.08 : 0, ease: EASE }}
              />
              <text
                x={n.tx}
                y={n.y + 3.5}
                textAnchor={n.anchor}
                className="fill-ink-700 text-[10.5px] font-semibold"
              >
                {n.label}
              </text>
            </g>
          ))}

          <circle cx={hub.x} cy={hub.y} r="20" fill={theme.accent} />
          <circle cx={hub.x} cy={hub.y} r="26" fill="none" stroke={theme.accent} strokeOpacity="0.2" />
          <text
            x={hub.x}
            y={hub.y + 3.5}
            textAnchor="middle"
            className="fill-white text-[9px] font-bold uppercase tracking-wider"
          >
            Hub
          </text>
          <text
            x={hub.x}
            y={hub.y + 44}
            textAnchor="middle"
            className="fill-ink-500 text-[10px] font-medium"
          >
            Manufacturer
          </text>
        </svg>
      </VisualFrame>
    </div>
  )
}

/** A horizontal track of steps that fills and checks off in order. */
function StepTrack({
  steps,
  active,
  theme,
}: {
  steps: { label: string; meta: string }[]
  active: boolean
  theme: Theme
}) {
  const reduce = useReducedMotionSafe()
  const { ref, on } = useOn(active)
  const n = steps.length
  const inset = `calc(100% / ${n * 2})`
  const stepDelay = (i: number) => 0.15 + i * 0.22

  return (
    <div ref={ref} className="relative">
      {/* Track between the first and last step centres */}
      <div className="absolute top-4 h-0.5 rounded-full bg-ink-100" style={{ left: inset, right: inset }}>
        <motion.div
          className="h-full origin-left rounded-full"
          style={{ background: theme.accent }}
          initial={false}
          animate={{ scaleX: on || reduce ? 1 : 0 }}
          transition={{
            duration: reduce ? 0 : stepDelay(n - 1) - stepDelay(0) + 0.2,
            delay: on ? stepDelay(0) : 0,
            ease: "linear",
          }}
        />
      </div>

      <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => (
          <li key={s.label} className="flex min-w-0 flex-col items-center px-1 text-center">
            <span
              className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white"
              style={{ borderColor: theme.accent }}
            >
              <motion.span
                className="absolute inset-[3px] flex items-center justify-center rounded-full"
                style={{ background: theme.accent }}
                initial={false}
                animate={on || reduce ? { scale: 1, opacity: 1 } : { scale: 0.3, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.28, delay: on ? stepDelay(i) : 0, ease: EASE }}
              >
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </motion.span>
            </span>
            <span className="mt-2 text-xs font-semibold text-ink-950">{s.label}</span>
            <span className="mt-0.5 text-[11px] leading-tight text-ink-500">{s.meta}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Bottled water: direct store delivery, plant to shelf. */
function RouteVisual({ active, theme }: { active: boolean; theme: Theme }) {
  return (
    <VisualFrame title="Direct store delivery" status="On schedule" theme={theme}>
      <StepTrack
        active={active}
        theme={theme}
        steps={[
          { label: "Plant", meta: "Loaded" },
          { label: "Depot", meta: "Dispatched" },
          { label: "Route", meta: "In transit" },
          { label: "Store", meta: "Delivered" },
        ]}
      />
    </VisualFrame>
  )
}

/** Corporate services: invoices received, approved and paid. */
function FlowVisual({ active, theme }: { active: boolean; theme: Theme }) {
  return (
    <VisualFrame title="Invoice pipeline" status="Governed & audited" theme={theme}>
      <StepTrack
        active={active}
        theme={theme}
        steps={[
          { label: "Received", meta: "OCR & cross-check" },
          { label: "Approved", meta: "Limits & policy" },
          { label: "Paid", meta: "ERP matched" },
        ]}
      />
    </VisualFrame>
  )
}

function CaseVisual({ item, active }: { item: CaseStudyItem; active: boolean }) {
  const theme = THEMES[item.accentColor]
  if (item.visual === "network") return <NetworkVisual active={active} theme={theme} />
  if (item.visual === "route") return <RouteVisual active={active} theme={theme} />
  return <FlowVisual active={active} theme={theme} />
}

/** Optional background picture behind a card's content: lightly blurred,
    under a white wash that is heaviest only where text sits. The closed and
    open washes cross-fade (rather than stack) as a card opens.

    The blur is baked into the image file — a live CSS blur would be redone
    on every frame while the card resizes. On desktop, pass `width` (the open
    card's width): the layer then keeps that size, centred in the card and
    clipped by it, so while the card animates the layer only slides on its
    own GPU layer and nothing inside it is redrawn. */
function CardBackdrop({
  image,
  position,
  active,
  width,
}: {
  image?: string
  position?: string
  active: boolean
  width?: string
}) {
  if (!image) return null
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -z-10",
        width ? "inset-y-0 left-1/2 -translate-x-1/2 will-change-transform" : "inset-0"
      )}
      style={width ? { width } : undefined}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
      {/* Closed. Desktop: light through the middle; firmer at the top
          (industry, title) and bottom (stat, View). Mobile (no `width`): the
          closed card is a short header whose text sits mid-card, so the wash
          is an even, firmer white to keep it readable. */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b transition-opacity duration-500",
          width ? "from-white/80 via-white/40 to-white/75" : "from-white/85 via-white/85 to-white/85",
          active ? "opacity-0" : "opacity-100"
        )}
      />
      {/* Open: firmer behind the title and copy at the top, lighter lower
          down where the chart sits on its own white frame. Mobile is firmer
          throughout, since the copy runs the full height of the card. */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b transition-opacity duration-500",
          width ? "from-white/85 via-white/55 to-white/35" : "from-white/90 via-white/80 to-white/70",
          active ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}

function ReadLink({ href, tabbable = true }: { href: string; tabbable?: boolean }) {
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      tabIndex={tabbable ? undefined : -1}
      className="group/link inline-flex items-center gap-2 text-sm font-semibold text-ink-950"
    >
      <span className="relative">
        Read
        <span className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-ink-950 transition-[scale] duration-300 group-hover/link:scale-x-100" />
      </span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
    </Link>
  )
}

/* --------------------------------------------------------------------------
   Desktop panel (>= 1024px)

   Same behaviour as before: hovering (with a short intent delay), clicking or
   focusing a panel opens it, and it widens to OPEN shares of the row over
   0.55s. For smoothness, the open and closed contents are each laid out at
   their own final width and cross-fade: while the panel resizes only its
   edge moves, nothing inside re-wraps.
   -------------------------------------------------------------------------- */
function DesktopPanel({
  caseItem,
  index,
  total,
  isActive,
  onActivate,
  panelId,
}: {
  caseItem: CaseStudyItem
  index: number
  total: number
  isActive: boolean
  onActivate: () => void
  panelId: string
}) {
  const theme = THEMES[caseItem.accentColor]
  const Icon = caseItem.icon
  const cardRef = useRef<HTMLElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Row width minus the gaps, shared out by flex weight.
  const shares = OPEN + (total - 1)
  const openWidth = `calc((100cqw - ${ROW_GAP} * ${total - 1}) * ${OPEN} / ${shares})`
  const closedWidth = `calc((100cqw - ${ROW_GAP} * ${total - 1}) / ${shares})`

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    // Small hover-intent delay so sweeping the mouse across doesn't flicker
    hoverTimeoutRef.current = setTimeout(onActivate, 110)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onActivate()
    }
  }

  return (
    <article
      ref={cardRef}
      id={panelId}
      role="region"
      aria-expanded={isActive}
      aria-label={caseItem.industry ? `${caseItem.industry}: ${caseItem.title}` : caseItem.title}
      tabIndex={0}
      onClick={onActivate}
      onFocus={onActivate}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        flex: isActive ? `${OPEN} 1 0%` : "1 1 0%",
        transition: "flex 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={cn(
        "group relative isolate min-w-0 cursor-pointer select-none overflow-hidden rounded-[1.75rem] border",
        "transition-[border-color] duration-500 [contain:layout_paint]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2",
        theme.surface,
        isActive ? theme.borderActive : theme.border
      )}
    >
      <CardBackdrop
        image={caseItem.image}
        position={caseItem.imagePosition}
        active={isActive}
        width={openWidth}
      />

      {/* ---------- Open view ---------- */}
      <div
        inert={!isActive}
        style={{ width: openWidth }}
        className={cn(
          "absolute inset-y-0 left-0 flex flex-col p-7",
          // Tailwind v4's translate-y-* sets `translate`, not `transform`.
          "transition-[opacity,translate] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isActive
            ? "translate-y-0 opacity-100 delay-150 duration-500"
            : "pointer-events-none translate-y-2 opacity-0 duration-200"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", theme.icon)}>
              <Icon className="h-5 w-5" />
            </span>
            {(caseItem.industry || caseItem.stat) && (
              <div className="min-w-0">
                {caseItem.industry && (
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                    {caseItem.industry}
                  </p>
                )}
                {caseItem.stat && <p className="text-xs text-ink-500">{caseItem.stat.label}</p>}
              </div>
            )}
          </div>
          {caseItem.stat && (
            <p className={cn("shrink-0 text-5xl font-bold leading-none tracking-tight", theme.stat)}>
              <StatValue stat={caseItem.stat} />
            </p>
          )}
        </div>

        <h3 className="mt-6 max-w-[34rem] text-2xl font-bold leading-snug tracking-tight text-ink-950">
          {caseItem.title}
        </h3>
        <p className="mt-2 max-w-[34rem] text-[15px] leading-relaxed text-ink-700">
          {caseItem.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 empty:hidden">
          {(caseItem.chips ?? []).map((chip) => (
            <span
              key={chip}
              className={cn("rounded-lg border px-2.5 py-1 text-xs font-semibold", theme.chip)}
            >
              {chip}
            </span>
          ))}
        </div>

        {/* The chart fills the space between the chips and the footer. */}
        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <CaseVisual item={caseItem} active={isActive} />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-ink-950/10 pt-4">
          <ReadLink href={caseItem.href} tabbable={isActive} />
        </div>
      </div>

      {/* ---------- Closed view ---------- */}
      <div
        aria-hidden={isActive}
        style={{ width: closedWidth }}
        className={cn(
          "absolute inset-y-0 left-0 flex flex-col p-6",
          "transition-opacity",
          isActive ? "pointer-events-none opacity-0 duration-150" : "opacity-100 delay-200 duration-400"
        )}
      >
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", theme.icon)}>
          <Icon className="h-5 w-5" />
        </span>
        {caseItem.industry && (
          <p className="mt-4 font-mono text-[11px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-ink-500">
            {caseItem.industry}
          </p>
        )}

        <h4 className="mt-4 line-clamp-4 text-lg font-semibold leading-snug text-ink-950">
          {caseItem.title}
        </h4>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">
          {caseItem.description}
        </p>

        <div className="mt-auto pt-6">
          {caseItem.stat && (
            <>
              <p className={cn("text-5xl font-bold leading-none tracking-tight", theme.stat)}>
                <StatValue stat={caseItem.stat} />
              </p>
              <p className="mt-2 text-sm font-medium text-ink-600">{caseItem.stat.label}</p>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-ink-950/10 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 transition-colors group-hover:text-ink-950">
            <ArrowRight className="h-4 w-4" aria-label="Open" />
          </span>
        </div>
      </div>
    </article>
  )
}

/* --------------------------------------------------------------------------
   Mobile accordion item (< 1024px) — same height animation as before.
   -------------------------------------------------------------------------- */
function MobileAccordionItem({
  caseItem,
  index,
  isOpen,
  onToggle,
}: {
  caseItem: CaseStudyItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const theme = THEMES[caseItem.accentColor]
  const Icon = caseItem.icon
  const reduceMotion = useReducedMotionSafe()

  return (
    <article
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border p-5 transition-colors duration-300",
        theme.surface,
        isOpen ? theme.borderActive : theme.border
      )}
    >
      <CardBackdrop image={caseItem.image} position={caseItem.imagePosition} active={isOpen} />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", theme.icon)}>
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            {caseItem.industry && (
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                {caseItem.industry}
              </span>
            )}
            {caseItem.stat ? (
              <span className="mt-0.5 flex items-baseline gap-2">
                <span className={cn("text-2xl font-bold tracking-tight", theme.stat)}>
                  <StatValue stat={caseItem.stat} />
                </span>
                <span className="truncate text-xs font-medium text-ink-500">{caseItem.stat.label}</span>
              </span>
            ) : (
              <span className="block text-[15px] font-bold leading-snug text-ink-950">{caseItem.title}</span>
            )}
          </span>
        </span>

        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white/80 transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        >
          <ChevronDown className="h-4 w-4 text-ink-700" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-ink-950/10 pt-4">
              {caseItem.stat && <h3 className="text-lg font-bold leading-snug text-ink-950">{caseItem.title}</h3>}
              <p className={cn("text-sm leading-relaxed text-ink-700", caseItem.stat && "mt-2")}>{caseItem.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5 empty:hidden">
                {(caseItem.chips ?? []).map((chip) => (
                  <span
                    key={chip}
                    className={cn("rounded-lg border px-2 py-0.5 text-[11px] font-semibold", theme.chip)}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <CaseVisual item={caseItem} active={isOpen} />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-ink-950/10 pt-3">
                <ReadLink href={caseItem.href} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

/* --------------------------------------------------------------------------
   CaseStudyPanels
   -------------------------------------------------------------------------- */
export function CaseStudyPanels({ cases, className }: CaseStudyPanelsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const baseId = useId()

  // Keyboard navigation for desktop panels (ArrowLeft / ArrowRight)
  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % cases.length)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + cases.length) % cases.length)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop (>= 1024px): expanding panels side by side. The row is a
          size container, so panels can lay their content out at final width. */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleContainerKeyDown}
        className="hidden h-[500px] w-full min-w-0 flex-row items-stretch gap-4 [container-type:inline-size] lg:flex"
      >
        {cases.map((item, index) => (
          <DesktopPanel
            key={item.title}
            caseItem={item}
            index={index}
            total={cases.length}
            isActive={activeIndex === index}
            onActivate={() => setActiveIndex(index)}
            panelId={`${baseId}-panel-${index}`}
          />
        ))}
      </div>

      {/* Mobile & tablet (< 1024px): vertical accordion */}
      <div className="flex w-full flex-col gap-3.5 lg:hidden">
        {cases.map((item, index) => (
          <MobileAccordionItem
            key={item.title}
            caseItem={item}
            index={index}
            isOpen={activeIndex === index}
            onToggle={() => setActiveIndex((prev) => (prev === index ? -1 : index))}
          />
        ))}
      </div>
    </div>
  )
}
