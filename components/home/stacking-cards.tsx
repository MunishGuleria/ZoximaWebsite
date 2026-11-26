"use client"

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Calculator,
  Layers,
  BarChart3,
  Check,
  AlertCircle,
  Truck,
  ShieldCheck,
  FileCheck2,
  RefreshCw,
  Coins,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/motion/reveal"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

export type CardAccentColor = "blue" | "green" | "purple"

export interface StackingCardItem {
  title: string
  accentColor: CardAccentColor
  items: string[]
  image?: string
  eyebrow?: string
  summary?: string
  /** Short quote under the title. */
  subtitle?: string
  /** Optional button under the chips, e.g. "Explore applications". */
  cta?: { label: string; href: string }
  /** Right-hand mock cards; Coverage falls back to its built-in clusters. */
  cluster?: React.ReactNode
}

export interface StackingCardsProps {
  cards: StackingCardItem[]
  /** Navbar height on desktop (default: 104px) */
  navHeight?: number
  /** Gap between navbar and top card on desktop (default: 20px) */
  offsetGap?: number
  /** Top offset step (px) per card index on desktop (default: 24px) */
  cardStackStep?: number
  scaleFactor?: number
  dimOpacity?: number
  className?: string
  /** Prefix for title ids, so two stacks on one page stay unique. */
  idPrefix?: string
}

/** Title-id prefix for the stack being rendered (see StackingCardsProps). */
const IdPrefix = createContext("pillar")

const THEMES: Record<
  CardAccentColor,
  {
    gradientOverlay: string
    dotColor: string
    barColor: string
    mockIconBg: string
    mockBadge: string
  }
> = {
  blue: {
    gradientOverlay: "bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-blue-950/35",
    dotColor: "bg-blue-400",
    barColor: "bg-blue-500",
    mockIconBg: "bg-blue-50 text-blue-600 border border-blue-200/80",
    mockBadge: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  green: {
    gradientOverlay: "bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-emerald-950/35",
    dotColor: "bg-emerald-400",
    barColor: "bg-emerald-500",
    mockIconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/80",
    mockBadge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  purple: {
    gradientOverlay: "bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-purple-950/35",
    dotColor: "bg-purple-400",
    barColor: "bg-purple-500",
    mockIconBg: "bg-purple-50 text-purple-600 border border-purple-200/80",
    mockBadge: "bg-purple-50 text-purple-700 border border-purple-200",
  },
}

function useStackEnabled() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 600px)")
    const update = () => setOn(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return on
}

// Measures the tallest card efficiently using scrollHeight without forced layout thrashing
function useEqualHeight(rootRef: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setHeight(null)
      return
    }
    const root = rootRef.current
    if (!root) return

    const measure = () => {
      const arts = Array.from(root.querySelectorAll<HTMLElement>("[data-stack-article]"))
      if (!arts.length) return
      let max = 0
      arts.forEach((a) => {
        max = Math.max(max, a.scrollHeight)
      })
      if (max > 0) {
        setHeight((prev) => (prev !== max ? max : prev))
      }
    }

    measure()
    ;(document as any).fonts?.ready?.then(measure)

    let timeoutId: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(measure, 150)
    }
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", onResize)
    }
  }, [enabled, rootRef])

  return height
}

/* --------------------------------------------------------------------------
   Reusable UI Mock Card Component - completely contained, clean padding
   -------------------------------------------------------------------------- */
interface MockCardProps {
  title: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeVariant?: "default" | "success" | "warning"
  accentColor: CardAccentColor
  children: React.ReactNode
  className?: string
}

export function MockCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeVariant = "default",
  accentColor,
  children,
  className,
}: MockCardProps) {
  const theme = THEMES[accentColor] || THEMES.blue
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/90 bg-white/95 p-3.5 sm:p-4 text-ink-950 shadow-[0_16px_36px_-10px_rgba(15,23,42,0.22),0_2px_8px_rgba(15,23,42,0.06)] transition-[translate,box-shadow] duration-300 hover:shadow-2xl hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg shrink-0",
              theme.mockIconBg
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-ink-950 truncate leading-snug">
              {title}
            </h4>
            {subtitle && (
              <p className="text-[10px] text-ink-500 font-medium truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {badge && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 shadow-2xs",
              badgeVariant === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : badgeVariant === "warning"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : theme.mockBadge
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                badgeVariant === "success"
                  ? "bg-emerald-500"
                  : badgeVariant === "warning"
                  ? "bg-amber-500"
                  : theme.dotColor
              )}
            />
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Pillar 1: Sales Mock UI Cluster
   Directly represents what Zoxima builds from Zoxima_Website_Content_v2.docx:
   1. Pricing, quotes and CPQ (The right price, every time)
   2. Order to invoice (Every order tracked from booking to invoice)
   3. Reviews that end in actions (Decisions turned into actions with owners & dates)
   -------------------------------------------------------------------------- */
function SalesMockCluster({ accentColor }: { accentColor: CardAccentColor }) {
  const theme = THEMES[accentColor]
  return (
    <div className="relative w-full h-[530px] rounded-r-[2rem]">
      {/* 1. Pricing, quotes and CPQ */}
      <Reveal delay={0.06} direction="left" distance={16} className="absolute top-2 left-2 right-8 z-10">
        <MockCard
          title="Pricing, quotes and CPQ"
          subtitle="The right price, every time"
          icon={Calculator}
          badge="Configured"
          badgeVariant="success"
          accentColor={accentColor}
        >
          <div className="flex items-center justify-between text-[11px] text-ink-700">
            <span>Quotes built from price lists & rate cards</span>
            <span className="font-semibold text-emerald-600">Active ✓</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-ink-500">
            <span>Discounts based on what actually wins</span>
            <span className="font-medium text-ink-700">Guided</span>
          </div>
          <div className="pt-0.5">
            <div className="flex justify-between text-[10px] text-ink-400 mb-1">
              <span>Approvals routed by limits without chasing</span>
              <span className="font-semibold text-ink-700">Complete</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
              <div className={cn("h-full rounded-full w-full", theme.barColor)} />
            </div>
          </div>
        </MockCard>
      </Reveal>

      {/* 2. Order to invoice - completely visible, NOT half cut */}
      <Reveal delay={0.14} direction="left" distance={20} className="absolute top-[170px] left-8 right-2 z-20">
        <MockCard
          title="Order to invoice"
          subtitle="Every order tracked from booking to invoice"
          icon={Layers}
          badge="In Progress"
          accentColor={accentColor}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Booked order checked & committed
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Done</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Direct Store Delivery routing
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Done</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-blue-50/70 border border-blue-200/60 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-blue-900 font-semibold truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" /> Invoice matched against order
              </span>
              <span className="text-[9px] text-blue-700 font-semibold shrink-0">Active</span>
            </div>
          </div>
          <div className="pt-0.5">
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
              <div className={cn("h-full rounded-full w-[67%]", theme.barColor)} />
            </div>
          </div>
        </MockCard>
      </Reveal>

      {/* 3. Reviews that end in actions - clearly represents doc solution */}
      <Reveal delay={0.22} direction="up" distance={16} className="absolute top-[340px] left-3 right-6 z-30">
        <MockCard
          title="Reviews that end in actions"
          subtitle="Live numbers in the room & decisions into actions"
          icon={BarChart3}
          badge="Live Actions"
          accentColor={accentColor}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Pre-read before review from all systems
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Ready</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Decisions turned into actions with owners & dates
              </span>
              <span className="text-[9px] text-blue-700 font-semibold shrink-0">Assigned</span>
            </div>
          </div>
          <div className="pt-0.5">
            <div className="flex justify-between text-[10px] text-ink-400 mb-1">
              <span>Actions tracked and chased all week</span>
              <span className="font-semibold text-emerald-600">On Schedule ✓</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
              <div className={cn("h-full rounded-full w-full", theme.barColor)} />
            </div>
          </div>
        </MockCard>
      </Reveal>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Pillar 2: Service Mock UI Cluster
   Directly represents what Zoxima builds from Zoxima_Website_Content_v2.docx:
   1. Service CRM and case management (Every customer answered across voice, chat, email)
   2. Field service (Technicians with asset and history on mobile, spare parts linked)
   3. Service contracts and warranty (Renewals owned & tracked before they lapse)
   -------------------------------------------------------------------------- */
function ServiceMockCluster({ accentColor }: { accentColor: CardAccentColor }) {
  const theme = THEMES[accentColor]
  return (
    <div className="relative w-full h-[530px] rounded-r-[2rem]">
      {/* 1. Service CRM and case management */}
      <Reveal delay={0.06} direction="left" distance={16} className="absolute top-2 left-2 right-8 z-10">
        <MockCard
          title="Service CRM and cases"
          subtitle="Every request owned, every customer answered"
          icon={AlertCircle}
          badge="Monitored"
          badgeVariant="warning"
          accentColor={accentColor}
        >
          <div className="flex items-center justify-between text-[11px] text-ink-700">
            <span>Customer support across voice, chat and email</span>
            <span className="font-semibold text-emerald-600">Answered ✓</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-ink-500">
            <span>Case routing, SLA tracking and escalation</span>
            <span className="font-medium text-ink-700">On Target</span>
          </div>
          <div className="pt-0.5">
            <div className="flex justify-between text-[10px] text-ink-400 mb-1">
              <span>SLA response window</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
              <div className={cn("h-full rounded-full w-[85%]", theme.barColor)} />
            </div>
          </div>
        </MockCard>
      </Reveal>

      {/* 2. Field service - completely visible, NOT half cut */}
      <Reveal delay={0.14} direction="left" distance={20} className="absolute top-[170px] left-8 right-2 z-20">
        <MockCard
          title="Field service dispatch"
          subtitle="Technicians with customer & asset history on mobile"
          icon={Truck}
          badge="Dispatched"
          badgeVariant="success"
          accentColor={accentColor}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Field technician assigned with mobile history
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Done</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Spare parts and service orders linked
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Allocated</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-emerald-50/70 border border-emerald-200/60 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-emerald-900 font-semibold truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Installed base asset verified on site
              </span>
              <span className="text-[9px] text-emerald-700 font-semibold shrink-0">Verified</span>
            </div>
          </div>
          <div className="pt-0.5">
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
              <div className={cn("h-full rounded-full w-[80%]", theme.barColor)} />
            </div>
          </div>
        </MockCard>
      </Reveal>

      {/* 3. Service contracts and warranty */}
      <Reveal delay={0.22} direction="up" distance={16} className="absolute top-[340px] left-3 right-6 z-30">
        <MockCard
          title="Service contracts and warranty"
          subtitle="Renewals owned and tracked before they lapse"
          icon={ShieldCheck}
          badge="Active"
          badgeVariant="success"
          accentColor={accentColor}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Installed base asset warranty & AMC
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Covered</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Contract renewal tracked to a decision
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Active</span>
            </div>
          </div>
          <div className="pt-0.5">
            <div className="flex justify-between text-[10px] text-ink-400 mb-1">
              <span>Installed base protection</span>
              <span className="font-semibold text-emerald-600">100% Covered ✓</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
              <div className={cn("h-full rounded-full w-full", theme.barColor)} />
            </div>
          </div>
        </MockCard>
      </Reveal>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Pillar 3: Operations & Finance Mock UI Cluster
   Directly represents what Zoxima builds from Zoxima_Website_Content_v2.docx:
   1. Invoice processing (Invoices read, matched & validated across ERP & CRM)
   2. Approvals (Capex & spend approvals routed by limits and tracked)
   3. Reconciliation and payouts (Commissions calculated & payouts tracked)
   -------------------------------------------------------------------------- */
function OperationsMockCluster({ accentColor }: { accentColor: CardAccentColor }) {
  const theme = THEMES[accentColor]
  return (
    <div className="relative w-full h-[530px] rounded-r-[2rem]">
      {/* 1. Invoice processing */}
      <Reveal delay={0.06} direction="left" distance={16} className="absolute top-2 left-2 right-8 z-10">
        <MockCard
          title="Invoice processing"
          subtitle="Invoices read, matched & validated across systems"
          icon={FileCheck2}
          badge="Validated"
          badgeVariant="success"
          accentColor={accentColor}
        >
          <div className="flex items-center justify-between text-[11px] text-ink-700">
            <span>Invoices read and matched across ERP and CRM</span>
            <span className="font-semibold text-emerald-600">Matched ✓</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-ink-500">
            <span>Exception routing sent to the right person</span>
            <span className="font-medium text-ink-700">Cleared</span>
          </div>
          <div className="pt-0.5">
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
              <div className={cn("h-full rounded-full w-full", theme.barColor)} />
            </div>
          </div>
        </MockCard>
      </Reveal>

      {/* 2. Approvals - completely visible, NOT half cut */}
      <Reveal delay={0.14} direction="left" distance={20} className="absolute top-[170px] left-8 right-2 z-20">
        <MockCard
          title="Approvals and governance"
          subtitle="Capex and spend approvals routed by limits"
          icon={RefreshCw}
          badge="Approved"
          badgeVariant="success"
          accentColor={accentColor}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Capex and spend approvals routed by limits
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Done</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Finance controller review and sign-off
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Done</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-purple-50/70 border border-purple-200/60 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-purple-900 font-semibold truncate">
                <Check className="h-3 w-3 text-purple-600 shrink-0" /> Audit trail logged and traceable
              </span>
              <span className="text-[9px] text-purple-700 font-semibold shrink-0">Cleared</span>
            </div>
          </div>
          <div className="pt-0.5">
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
              <div className={cn("h-full rounded-full w-full", theme.barColor)} />
            </div>
          </div>
        </MockCard>
      </Reveal>

      {/* 3. Reconciliation and commissions */}
      <Reveal delay={0.22} direction="up" distance={16} className="absolute top-[340px] left-3 right-6 z-30">
        <MockCard
          title="Reconciliation and payouts"
          subtitle="Commissions calculated and payouts tracked"
          icon={Coins}
          badge="Reconciled"
          accentColor={accentColor}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-purple-600 shrink-0" /> Multi-tier ledger reconciliation across systems
              </span>
              <span className="text-[9px] text-purple-700 font-semibold shrink-0">98% Matched</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-ink-50/80 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1.5 text-ink-700 font-medium truncate">
                <Check className="h-3 w-3 text-emerald-600 shrink-0" /> Commissions calculated and payouts tracked
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold shrink-0">Calculated</span>
            </div>
          </div>
          <div className="pt-0.5">
            <div className="flex justify-between text-[10px] text-ink-400 mb-1">
              <span>Audit and payout readiness</span>
              <span className="font-semibold text-emerald-600">Ready ✓</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden mt-1">
              <div className={cn("h-full rounded-full w-[98%]", theme.barColor)} />
            </div>
          </div>
        </MockCard>
      </Reveal>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Card Inner Content - Left text/chips + Right 3-card example cluster
   -------------------------------------------------------------------------- */
function CardInner({
  card,
  index,
  compact = false,
  titleId,
}: {
  card: StackingCardItem
  index: number
  /** Drop the tall desktop minimum height (used by the phone carousel). */
  compact?: boolean
  /** Id for the card title; the phone carousel passes its own so ids stay unique. */
  titleId?: string
}) {
  const theme = THEMES[card.accentColor] || THEMES.blue
  const prefix = useContext(IdPrefix)
  const bgImage =
    card.image ||
    (card.accentColor === "purple"
      ? "/operations.webp"
      : card.accentColor === "green"
      ? "/service.webp"
      : "/sales.webp")

  return (
    <>
      {/* Background Image Layer (absolute, rounded-[2rem] overflow-hidden on this layer only) */}
      <div className="pointer-events-none absolute inset-0 z-0 rounded-[2rem] overflow-hidden">
        <Image
          src={bgImage}
          alt={`${card.title} background`}
          fill
          sizes="(min-width: 1280px) 72rem, 100vw"
          className="object-cover object-center"
        />
        {/* Dark & Tinted Gradient Overlays for High Text Contrast */}
        <div className={cn("absolute inset-0", theme.gradientOverlay)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* Main Card Content */}
      <div
        className={cn(
          "relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center h-full",
          !compact && "min-h-[520px]"
        )}
      >
        {/* Left Column: Title, quote and Capability Chips */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between h-full z-10 py-2">
          <div>
            {/* Title from Zoxima_Website_Content_v2.docx */}
            <h3
              id={titleId ?? `${prefix}-${index}-title`}
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.65rem] leading-tight"
            >
              {card.title}
            </h3>

            {/* Short quote under the title */}
            {card.subtitle && (
              <p className="zx-serif mt-3 text-xl leading-snug text-white/85 sm:text-[1.375rem]">{card.subtitle}</p>
            )}

            {/* All Capability Chips from Zoxima_Website_Content_v2.docx */}
            <div className="mt-6 flex flex-wrap gap-2 empty:hidden">
              {card.items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium text-white border border-white/20 shadow-2xs transition-colors hover:bg-white/25"
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", theme.dotColor)} />
                  <span>{item}</span>
                </span>
              ))}
            </div>

            {card.cta && (
              <Link
                href={card.cta.href}
                className="zx-glass-btn-dark group mt-8 inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white"
              >
                {card.cta.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: 3 Floating UI Example Cards (Hidden below lg) */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-full">
          {card.cluster ?? (
            <>
              {index === 0 && <SalesMockCluster accentColor={card.accentColor} />}
              {index === 1 && <ServiceMockCluster accentColor={card.accentColor} />}
              {index === 2 && <OperationsMockCluster accentColor={card.accentColor} />}
            </>
          )}
        </div>
      </div>
    </>
  )
}

function AnimatedStackCard({
  card,
  index,
  total,
  myRef,
  nextRef,
  top,
  nextTop,
  stack,
  cardHeight,
  gap,
  scaleFactor,
  dimOpacity,
}: {
  card: StackingCardItem
  index: number
  total: number
  myRef: React.RefObject<HTMLDivElement | null>
  nextRef: React.RefObject<HTMLDivElement | null>
  top: number
  nextTop: number
  stack: boolean
  cardHeight: number | null
  gap: number
  scaleFactor: number
  dimOpacity: number
}) {
  const reduce = useReducedMotionSafe()
  const prefix = useContext(IdPrefix)
  const h = cardHeight ?? 600
  const { scrollYProgress } = useScroll({
    target: nextRef,
    offset: [`start ${top + h + gap}px`, `start ${nextTop}px`],
  })

  // Driven straight off scroll position (no spring): the sticky movement is
  // applied by the browser instantly, so a smoothed scale would trail it and
  // read as wobble on a fast scroll. GPU-friendly transforms/opacity only.
  const scale = useTransform(scrollYProgress, [0, 1], [1, scaleFactor])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, dimOpacity])
  const shadowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const animate = stack && !reduce

  return (
    <div
      ref={myRef}
      data-stack-card
      style={
        stack
          ? { position: "sticky", top, zIndex: index + 1, marginBottom: gap }
          : { marginBottom: 24 }
      }
    >
      <motion.article
        data-stack-article
        aria-labelledby={`${prefix}-${index}-title`}
        style={{
          height: stack && cardHeight ? cardHeight : undefined,
          ...(animate
            ? {
                scale,
                opacity,
                transformOrigin: "top center",
                willChange: "transform, opacity",
              }
            : {}),
        }}
        className={cn(
          "isolate relative flex w-full flex-col justify-between rounded-[2rem] border border-white/20 p-6 sm:p-8 lg:p-10",
          "min-h-[580px] lg:min-h-[610px]",
          "bg-slate-950 text-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* GPU-composited shadow fadeout: fades shadow cleanly without repainting the card */}
        {animate && (
          <motion.div
            // Own layer, so the fade composites instead of repainting the card.
            style={{ opacity: shadowOpacity, willChange: "opacity" }}
            className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] shadow-[0_28px_70px_-15px_rgba(0,0,0,0.6)]"
          />
        )}
        {!animate && (
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] shadow-[0_28px_70px_-15px_rgba(0,0,0,0.6)]" />
        )}

        <CardInner card={card} index={index} />
      </motion.article>
    </div>
  )
}

function StaticFinalCard({
  card,
  index,
  myRef,
  top,
  stack,
  cardHeight,
}: {
  card: StackingCardItem
  index: number
  myRef: React.RefObject<HTMLDivElement | null>
  top: number
  stack: boolean
  cardHeight: number | null
}) {
  const prefix = useContext(IdPrefix)
  return (
    <div
      ref={myRef}
      data-stack-card
      style={
        stack
          ? { position: "sticky", top, zIndex: index + 1, marginBottom: 0 }
          : { marginBottom: 24 }
      }
    >
      <article
        data-stack-article
        aria-labelledby={`${prefix}-${index}-title`}
        style={{
          height: stack && cardHeight ? cardHeight : undefined,
        }}
        className={cn(
          "isolate relative flex w-full flex-col justify-between rounded-[2rem] border border-white/20 p-6 sm:p-8 lg:p-10",
          "min-h-[580px] lg:min-h-[610px]",
          "bg-slate-950 text-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardInner card={card} index={index} />
      </article>
    </div>
  )
}

export function StackingCards({
  cards,
  navHeight = 104,
  offsetGap = 20,
  cardStackStep = 24,
  scaleFactor = 0.96,
  dimOpacity = 0.9,
  className,
  idPrefix = "pillar",
}: StackingCardsProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stack = useStackEnabled()
  const cardHeight = useEqualHeight(rootRef, stack)
  const refs = useMemo(
    () => cards.map(() => React.createRef<HTMLDivElement>()),
    [cards.length]
  )
  const topFor = (i: number) => navHeight + offsetGap + i * cardStackStep

  return (
    <IdPrefix.Provider value={idPrefix}>
      {/* Phones and tablets: circular carousel. */}
      <MobileCardCarousel cards={cards} className={cn("lg:hidden", className)} />

      {/* Desktop: the sticky scroll stack, unchanged. */}
      <div ref={rootRef} className={cn("relative mx-auto hidden w-full max-w-6xl lg:block", className)}>
      {cards.map((card, i) => {
        const isLast = i === cards.length - 1
        if (isLast) {
          return (
            <StaticFinalCard
              key={card.title}
              card={card}
              index={i}
              myRef={refs[i]}
              top={topFor(i)}
              stack={stack}
              cardHeight={cardHeight}
            />
          )
        }

        return (
          <AnimatedStackCard
            key={card.title}
            card={card}
            index={i}
            total={cards.length}
            myRef={refs[i]}
            nextRef={refs[i + 1]}
            top={topFor(i)}
            nextTop={topFor(i + 1)}
            stack={stack}
            cardHeight={cardHeight}
            gap={32}
            scaleFactor={scaleFactor}
            dimOpacity={dimOpacity}
          />
        )
      })}
      </div>
    </IdPrefix.Provider>
  )
}

/* --------------------------------------------------------------------------
   Phone/tablet carousel (< lg)

   The current card sits centred and upright; the previous one peeks in from
   the left, tilted left, and the next from the right, tilted right — smaller
   and dimmer. Every card pivots around a point below it, so changing card
   swings all of them along an arc, like cards on a wheel; it wraps round.
   Swipe, tap a side card, or use the dots. Transform + opacity only, so the
   browser runs it off the main thread. Reduced motion: instant.
   -------------------------------------------------------------------------- */
const WHEEL_TILT = 22 // degrees a side card sits round the wheel
const WHEEL_EASE = [0.22, 1, 0.36, 1] as const

function MobileCardCarousel({
  cards,
  className,
}: {
  cards: StackingCardItem[]
  className?: string
}) {
  const reduce = useReducedMotionSafe()
  const prefix = useContext(IdPrefix)
  const [active, setActive] = useState(0)
  const n = cards.length
  const go = (i: number) => setActive(((i % n) + n) % n)

  return (
    <div className={className} aria-roledescription="carousel" aria-label="Coverage">
      {/* Full-bleed and clipped sideways, so the side cards can run off the
          screen edges without making the page scroll horizontally. */}
      <div className="-mx-5 overflow-x-clip px-5 pb-8 pt-2 md:-mx-8 md:px-8">
        <motion.div
          className="relative grid"
          style={{ touchAction: "pan-y" }}
          onPanEnd={(_, info) => {
            if (Math.abs(info.offset.x) < 40 || Math.abs(info.offset.x) < Math.abs(info.offset.y)) return
            go(active + (info.offset.x < 0 ? 1 : -1))
          }}
        >
          {cards.map((card, i) => {
            // Position round the wheel relative to the active card: -1, 0, +1.
            let offset = (i - active + n) % n
            if (offset > n / 2) offset -= n
            const isActive = offset === 0
            const side = Math.sign(offset)
            const visible = Math.abs(offset) <= 1

            return (
              <motion.article
                key={card.title}
                aria-labelledby={`${prefix}-m-${i}-title`}
                aria-hidden={!isActive}
                inert={!isActive}
                onClick={() => !isActive && go(i)}
                initial={false}
                animate={{
                  transform: isActive
                    ? "rotate(0deg) scale(1)"
                    : `rotate(${side * WHEEL_TILT}deg) scale(0.88)`,
                  opacity: isActive ? 1 : visible ? 0.55 : 0,
                }}
                transition={{ duration: reduce ? 0 : 0.65, ease: WHEEL_EASE }}
                style={{
                  // Pivot well below the card: rotating swings it along an arc.
                  transformOrigin: "50% 125%",
                  zIndex: isActive ? 3 : visible ? 2 : 1,
                }}
                className={cn(
                  "relative isolate col-start-1 row-start-1 mx-auto flex w-[80%] flex-col justify-between rounded-[2rem] border border-white/20 p-6 sm:w-[70%]",
                  "bg-slate-950 text-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)]",
                  !isActive && "cursor-pointer"
                )}
              >
                <CardInner card={card} index={i} compact titleId={`${prefix}-m-${i}-title`} />
              </motion.article>
            )
          })}
        </motion.div>
      </div>

      {/* Dots */}
      {/* Each dot sits in a 44px tap area; the visible dot stays small. */}
      <div className="flex items-center justify-center" role="tablist" aria-label="Choose a card">
        {cards.map((card, i) => (
          <button
            key={card.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={card.title}
            onClick={() => go(i)}
            className="group grid h-11 min-w-11 place-items-center px-1"
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-[width,background-color] duration-300",
                i === active ? "w-6 bg-ink-900" : "w-2 bg-ink-300 group-hover:bg-ink-400"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
