"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { ArrowRight, Check, LayoutGrid, MessagesSquare, Workflow } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { MockCard } from "@/components/home/stacking-cards"
import { cn } from "@/lib/utils"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* --------------------------------------------------------------------------
   Capabilities (doc Home §5): "Applications. Automations. AI." — three
   pillars, each one line and an Explore link. With that little copy the
   section is compact: on desktop the three sit in one row of expanding
   panels (dark photo cards, same family as Coverage); the active one —
   hovered, focused or clicked — widens and reveals a small floating preview,
   the others narrow to their title and line. Phones: three compact cards.
   Motion: width eases via flex-grow on three elements; the preview and copy
   fade/rise with transform + opacity. Reduced motion: no transitions.
   -------------------------------------------------------------------------- */

type Pillar = {
  title: string
  body: string
  cta: string
  href: string
  image: string
  tint: string
  preview: React.ReactNode
}

const ROW = "flex items-center justify-between rounded-md bg-ink-50/80 px-2 py-1 text-[10px]"

const PILLARS: Pillar[] = [
  {
    title: "Applications",
    body: "The enterprise apps your sales, service and partner teams use every day.",
    cta: "Explore applications",
    href: "/capabilities/applications",
    image: "/images/pages/applications.webp",
    tint: "to-blue-950/40",
    preview: (
      <MockCard title="Enterprise Portal" icon={LayoutGrid} badge="Live" badgeVariant="success" accentColor="blue">
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ["Leads", "248"],
            ["Opportunities", "$1.4M"],
            ["Accounts", "186"],
            ["Partners", "24"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md bg-ink-50/80 px-2 py-1.5">
              <p className="text-[9px] text-ink-500">{k}</p>
              <p className="text-[13px] font-bold text-ink-950">{v}</p>
            </div>
          ))}
        </div>
      </MockCard>
    ),
  },
  {
    title: "Automations",
    body: "Workflows that move work between people and systems, without chasing.",
    cta: "Explore automations",
    href: "/capabilities/automations",
    image: "/images/pages/automations.webp",
    tint: "to-emerald-950/40",
    preview: (
      <MockCard title="Lead to quote" icon={Workflow} badge="Active" badgeVariant="success" accentColor="green">
        <div className="space-y-1">
          {[
            ["New lead", "0.1s"],
            ["Assign owner", "0.3s"],
            ["Send quote", "1.2s"],
          ].map(([k, t]) => (
            <div key={k} className={ROW}>
              <span className="flex items-center gap-1.5 font-medium text-ink-700">
                <Check className="h-3 w-3 text-emerald-600" /> {k}
              </span>
              <span className="font-mono text-[9px] font-semibold text-ink-500">{t}</span>
            </div>
          ))}
        </div>
      </MockCard>
    ),
  },
  {
    title: "AI",
    body: "Agents that read, decide and act inside your processes, with your people in control.",
    cta: "Explore AI",
    href: "/capabilities/ai",
    image: "/images/pages/ai.webp",
    tint: "to-purple-950/40",
    preview: (
      <MockCard title="Sales Agent" icon={MessagesSquare} badge="Online" badgeVariant="success" accentColor="purple">
        <div className="flex justify-end">
          <p className="max-w-[90%] rounded-xl rounded-br-sm bg-ink-950 px-3 py-1.5 text-[11px] font-medium text-white">
            Which partners are behind on this month’s target?
          </p>
        </div>
        <p className="text-[11px] text-ink-700">
          <span className="font-semibold text-ink-950">3 partners</span> are under 70% of this month’s target.
        </p>
      </MockCard>
    ),
  },
]

function Backdrop({ p }: { p: Pillar }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[1.75rem]">
      <Image
        src={p.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover transition-[scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <div className={cn("absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75", p.tint)} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
    </div>
  )
}

function ExploreLink({ p, tabbable = true }: { p: Pillar; tabbable?: boolean }) {
  return (
    <Link
      href={p.href}
      tabIndex={tabbable ? undefined : -1}
      onClick={(e) => e.stopPropagation()}
      className="zx-glass-btn-dark group/cta inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white"
    >
      {p.cta}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
    </Link>
  )
}

/* Desktop: one row of expanding panels */
function Panels() {
  const reduce = useReducedMotionSafe()
  const [active, setActive] = useState(0)

  return (
    <div className="hidden h-[440px] gap-4 lg:flex">
      {PILLARS.map((p, i) => {
        const on = i === active
        return (
          <article
            key={p.title}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-label={p.title}
            className={cn(
              "group relative isolate flex min-w-0 cursor-pointer flex-col justify-end overflow-hidden rounded-[1.75rem] border border-white/15 p-7 text-white shadow-[0_24px_50px_-24px_rgba(0,0,0,0.55)]",
              !reduce && "transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            )}
            style={{ flexGrow: on ? 2.3 : 1, flexBasis: 0 }}
          >
            <Backdrop p={p} />

            {/* Preview: shown only in the open panel. Always mounted and
                faded with CSS (like the Explore link) — mounting/unmounting it
                left it stuck invisible when the pointer came back mid-exit. */}
            <div
              aria-hidden={!on}
              className={cn(
                "pointer-events-none absolute right-7 top-24 w-[17rem]",
                !reduce && "transition-[opacity,translate,scale] ease-[cubic-bezier(0.22,1,0.36,1)]",
                on
                  ? "translate-y-0 scale-100 opacity-100 duration-500 delay-250"
                  : "translate-y-2 scale-[0.97] opacity-0 duration-200"
              )}
            >
              {p.preview}
            </div>

            <div className="relative max-w-[26rem]">
              <h3 className="text-3xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{p.body}</p>
              <div
                className={cn(
                  "mt-5 transition-[opacity,translate] duration-500",
                  on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                )}
              >
                <ExploreLink p={p} tabbable={on} />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/* Phones and tablets: three compact cards */
function Cards() {
  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-3 lg:hidden" stagger={0.08}>
      {PILLARS.map((p, i) => {
        return (
          <RevealItem key={p.title}>
            <article className="group relative isolate flex h-full min-h-[15rem] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-white/15 p-5 text-white">
              <Backdrop p={p} />
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">{p.body}</p>
                <div className="mt-4">
                  <ExploreLink p={p} />
                </div>
              </div>
            </article>
          </RevealItem>
        )
      })}
    </RevealGroup>
  )
}

export function CapabilitiesStack() {
  return (
    <section id="capabilities" className="relative border-t border-line py-16 lg:py-24">
      <div className="zx-container">
        <Reveal>
          {/* H2 from the doc's Home §5 */}
          <h2 className="zx-display-sm mb-10 text-[2.25rem] text-ink-950 sm:text-[2.75rem] lg:mb-12 lg:text-[3rem]">
            Applications. Automations. <span className="zx-serif text-navy-600">AI.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Panels />
        </Reveal>
        <Cards />
      </div>
    </section>
  )
}
