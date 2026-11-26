"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { iconFor } from "@/components/site/icons"
import { Reveal } from "@/components/site/reveal"
import { PageSections, SectionTitle } from "@/components/site/sections"
import type { Item, PageContent, Section } from "@/lib/site/types"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   Capabilities pages. Most sections use the shared content-page template
   (components/site/sections.tsx); three keep a purpose-built layout in the
   same language:
     overview      → the three pillars as photo / text rows
     how it works  → the six layers as a lit stack beside their descriptions
     platforms     → one column per platform
   Copy is the doc's only, from the page data.
   -------------------------------------------------------------------------- */

/* ------------------------------------------------- overview: pillar rows */

const PILLAR_IMAGES = ["/images/pages/applications.webp", "/images/pages/automations.webp", "/images/pages/ai.webp"]
const PILLAR_ICONS = ["apps", "flow", "ai"]

export function PillarRows({
  pillars,
}: {
  pillars: { title: string; body: string; cta: string; href: string }[]
}) {
  return (
    <section className="zx-section zx-plain">
      <div className="zx-container space-y-14 lg:space-y-20">
        {pillars.map((p, i) => {
          const Icon = iconFor(PILLAR_ICONS[i])
          const flip = i % 2 === 1
          return (
            <div key={p.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <Reveal variant="scale" className={cn(flip && "lg:order-2")}>
                <Link
                  href={p.href}
                  aria-label={p.cta}
                  className="group relative block aspect-[16/11] overflow-hidden rounded-[28px] bg-ink-950 shadow-[0_30px_60px_-32px_rgba(31,42,97,0.55)]"
                >
                  <Image
                    src={PILLAR_IMAGES[i]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover opacity-90 transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0d1426]/70 via-[#0d1426]/15 to-transparent" />
                </Link>
              </Reveal>
              <div className={cn(flip && "lg:order-1")}>
                <Reveal>
                  <SectionTitle title={p.title} />
                </Reveal>
                <Reveal as="p" index={1} className="mt-5 max-w-lg text-lg leading-relaxed text-ink-600">
                  {p.body}
                </Reveal>
                <Reveal index={2} className="mt-8">
                  <Link
                    href={p.href}
                    className="zx-sheen group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-6 text-[0.9375rem] font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98] sm:w-auto"
                  >
                    {p.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Reveal>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------------------------------- how it works: layer stack */

function LayerStack({ title, items }: { title: string; items: Item[] }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="zx-section zx-plain">
      <div className="zx-container">
        <Reveal className="mb-8 lg:mb-12">
          <SectionTitle title={title} className="max-w-3xl" />
        </Reveal>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* The stack, held a third of the way down: the current layer lit. */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[30vh]">
              <ol className="space-y-2.5">
                {items.map((it, i) => {
                  const on = i === active
                  return (
                    <li
                      key={it.title}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border px-5 py-4 transition-[background-color,border-color,color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        on
                          ? "translate-x-2 border-ink-950 bg-ink-950 text-white shadow-[0_18px_40px_-20px_rgba(31,42,97,0.6)]"
                          : "border-line bg-white text-ink-500"
                      )}
                      style={{ marginLeft: `${(items.length - 1 - i) * 10}px`, marginRight: `${(items.length - 1 - i) * 10}px` }}
                    >
                      <span className={cn("text-sm font-semibold tabular-nums", on ? "text-white/60" : "text-ink-300")}>{i + 1}</span>
                      <span className="text-base font-semibold">{it.title}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>

          <ol className="space-y-4 lg:col-span-7">
            {items.map((it, i) => (
              <li
                key={it.title}
                ref={(el) => {
                  refs.current[i] = el
                }}
                data-i={i}
              >
                <Reveal
                  className={cn(
                    "zx-card p-7 transition-[border-color,box-shadow] duration-500 sm:p-8 lg:min-h-[12rem]",
                    i === active && "lg:border-navy-600/30"
                  )}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-950 text-[0.8125rem] font-semibold text-white">{i + 1}</span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-ink-950">{it.title}</h3>
                  <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-700">{it.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------- platforms: three columns */

/** Platform columns: white panels, the middle one on ink (site colours only). */
function PlatformColumns({ groups }: { groups: { name: string; items: string[] }[] }) {
  return (
    <section className="zx-section zx-plain">
      <div className="zx-container">
        <div className="grid gap-4 lg:grid-cols-3">
          {groups.map((g, gi) => {
            const dark = gi === 1
            return (
              <Reveal
                key={g.name}
                variant="scale"
                index={gi}
                className={cn("h-full rounded-[28px] p-7 sm:p-9", dark ? "bg-ink-950 text-white" : "border border-line bg-white")}
              >
                <SectionTitle title={g.name} size="md" dark={dark} />
                <ul className="mt-5">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className={cn(
                        "group flex gap-3 border-b py-3.5 text-[0.9875rem] leading-relaxed transition-colors duration-300 last:border-b-0",
                        dark ? "border-white/10 text-white/75 hover:text-white" : "border-ink-950/[0.08] text-ink-800 hover:text-ink-950"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors duration-300",
                          dark ? "bg-white/10 group-hover:bg-white" : "bg-navy-600/10 group-hover:bg-navy-600"
                        )}
                      >
                        <Check
                          className={cn("h-3 w-3 transition-colors duration-300", dark ? "text-white group-hover:text-ink-950" : "text-navy-600 group-hover:text-white")}
                          strokeWidth={3}
                        />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- the page */

/** A capability page's doc sections: the special layouts where they apply,
 *  everything between them through the shared template. */
export function CapabilitySections({ page }: { page: PageContent }) {
  const isHow = page.route.endsWith("/how-it-works")
  const out: React.ReactNode[] = []
  let run: Section[] = []
  const flush = () => {
    if (run.length) out.push(<PageSections key={`run-${out.length}`} sections={run} />)
    run = []
  }
  page.sections.forEach((s, i) => {
    if (s.kind === "list" && s.style === "numbered" && isHow) {
      flush()
      out.push(<LayerStack key={`layers-${i}`} title={s.title} items={s.items} />)
    } else if (s.kind === "stack" && s.groups.length > 1) {
      flush()
      out.push(<PlatformColumns key={`cols-${i}`} groups={s.groups} />)
    } else {
      run.push(s)
    }
  })
  flush()
  return <>{out}</>
}
