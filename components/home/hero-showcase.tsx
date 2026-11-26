"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   Home hero visual — the industries Zoxima serves, as a card carousel.

   All six industries are cards on one track: the current card sits large in
   the middle, its neighbours peek in on the left and right, smaller and
   tilted back. Every few seconds the track turns to the next card (it wraps
   round). Every card links to its industry page; the chips underneath name
   all six and bring one to the front. Swipe on touch.
   Card copy is doc copy (Industries overview cards).

   Transform and opacity only. Runs on every screen, phones included; paused
   only by a mouse hover, keyboard focus or being off screen. Under reduced
   motion it still advances, instantly and at half the pace.
   -------------------------------------------------------------------------- */

const CARDS = [
  {
    industry: "Manufacturing",
    line: "Distributors, projects, field teams and service contracts.",
    href: "/industries/manufacturing",
    src: "/images/pages/manufacturing.webp",
  },
  {
    industry: "Appliances manufacturing",
    line: "Channel sales, installation, warranty and service at scale.",
    href: "/industries/appliances-manufacturing",
    src: "/images/pages/appliances.webp",
  },
  {
    industry: "Building materials",
    line: "Partner networks, schemes, credit and project sales.",
    href: "/industries/building-materials",
    src: "/images/pages/construction.webp",
  },
  {
    industry: "Consumer goods",
    line: "Direct Store Delivery, distributors, schemes and loyalty.",
    href: "/industries/consumer-goods",
    src: "/images/pages/consumer-goods.webp",
  },
  {
    industry: "Education",
    line: "Admissions, counseling and placements.",
    href: "/industries/education",
    src: "/images/pages/education.webp",
  },
  {
    industry: "Digital natives",
    line: "Inside sales, customer success, renewals and support.",
    href: "/industries/digital-natives",
    src: "/images/pages/digital-natives.webp",
  },
]

const INTERVAL = 4200
/** Time between steps when turning several cards to reach a clicked one. */
const STEP = 260

/** Where a card sits relative to the front one: 0 front, ±1 sides, further = tucked behind. */
function pose(offset: number): CSSProperties {
  const d = Math.abs(offset)
  const x = offset * 42 // % of the card's own width
  const scale = d === 0 ? 1 : d === 1 ? 0.8 : 0.64
  const rot = offset === 0 ? 0 : offset < 0 ? 10 : -10
  return {
    transform: `perspective(1200px) translateX(${x}%) scale(${scale}) rotateY(${rot}deg)`,
    opacity: d === 0 ? 1 : d === 1 ? 0.85 : 0,
    zIndex: 10 - d,
    pointerEvents: d > 1 ? "none" : "auto",
  }
}

export function HeroShowcase() {
  const n = CARDS.length
  const [active, setActive] = useState(0)
  // Where a click asked to go; the track turns towards it one card at a time,
  // so a far jump never sends every card flying through the others at once.
  const [target, setTarget] = useState(0)
  const [hold, setHold] = useState(false)
  const [inView, setInView] = useState(true)
  const [still, setStill] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ x: number; y: number; moved: boolean } | null>(null)

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Reduced motion still advances (the global rule makes the change instant
  // instead of a slide), just more slowly.
  const running = !hold && inView
  useEffect(() => {
    if (!running) return
    if (active !== target) return
    const id = window.setTimeout(() => {
      const next = (active + 1) % n
      setActive(next)
      setTarget(next)
    }, still ? INTERVAL * 2 : INTERVAL)
    return () => window.clearTimeout(id)
  }, [active, target, running, n, still])

  // Step towards the clicked card by the shorter way round.
  useEffect(() => {
    if (active === target) return
    let d = target - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    const id = window.setTimeout(() => setActive((a) => (((a + Math.sign(d)) % n) + n) % n), STEP)
    return () => window.clearTimeout(id)
  }, [active, target, n])

  const go = (i: number) => {
    const t = ((i % n) + n) % n
    let d = t - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    // The first step happens straight away; the rest follow every STEP ms.
    setActive((((active + Math.sign(d)) % n) + n) % n)
    setTarget(t)
  }

  // Touch swipe: left = next, right = previous. A swipe never opens a link.
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY, moved: false }
  }
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current
    if (!s) return
    const dx = e.clientX - s.x
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
      s.moved = true
      go(active + (dx < 0 ? 1 : -1))
    }
  }

  return (
    <div
      ref={root}
      className="relative"
      // Only a mouse hover on a desktop-sized screen, or keyboard focus,
      // pauses it (a phone-width preview with a mouse keeps scrolling). A tap on a phone
      // fires a fake mouseenter and focuses the element, and neither is ever
      // undone, so touch never pauses.
      onPointerEnter={(e) =>
        e.pointerType === "mouse" &&
        window.matchMedia("(min-width: 1024px) and (hover: hover)").matches &&
        setHold(true)
      }
      onPointerLeave={(e) => e.pointerType === "mouse" && setHold(false)}
      onFocus={(e) => (e.target as HTMLElement).matches(":focus-visible") && setHold(true)}
      onBlur={() => setHold(false)}
    >
      {/* Track */}
      <div
        className="relative mx-auto aspect-square w-[70%] touch-pan-y select-none sm:w-[66%]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {CARDS.map((c, i) => {
          let offset = i - active
          if (offset > n / 2) offset -= n
          if (offset < -n / 2) offset += n
          const front = offset === 0
          return (
            <div
              key={c.industry}
              className="absolute inset-0 transition-[transform,opacity,z-index] duration-[1000ms] ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
              style={pose(offset)}
            >
              <Link
                href={c.href}
                tabIndex={Math.abs(offset) > 1 ? -1 : 0}
                onClick={(e) => {
                  if (swipe.current?.moved) e.preventDefault()
                  swipe.current = null
                }}
                className={cn(
                  "group relative block h-full overflow-hidden rounded-[1.75rem] bg-ink-950 ring-1 ring-ink-950/10 outline-offset-4",
                  front
                    ? "shadow-[0_44px_90px_-36px_rgba(15,27,45,0.65)]"
                    : "shadow-[0_24px_50px_-30px_rgba(15,27,45,0.5)]"
                )}
              >
                <Image
                  src={c.src}
                  alt=""
                  fill
                  priority={Math.abs(offset) <= 1}
                  sizes="(min-width: 1024px) 400px, 70vw"
                  draggable={false}
                  className="object-cover transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0d1426]/55 via-transparent to-transparent" />
                <div className={cn("absolute inset-x-3 bottom-3 rounded-2xl p-4 text-white transition-opacity duration-500 sm:inset-x-4 sm:bottom-4 sm:p-5 border border-white/25 bg-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] [backdrop-filter:blur(14px)_saturate(1.4)] [-webkit-backdrop-filter:blur(14px)_saturate(1.4)]", front ? "opacity-100" : "opacity-0")}>
                  <p className="text-lg font-semibold leading-snug sm:text-xl">{c.industry}</p>
                  <p
                    className={cn(
                      "mt-1.5 text-[0.8125rem] leading-snug text-white/80 transition-opacity duration-500 sm:text-sm",
                      front ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {c.line}
                  </p>
                  <span
                    className={cn(
                      "mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[0.8125rem] font-semibold text-ink-950 transition-[opacity,translate] duration-500",
                      front ? "opacity-100" : "translate-y-2 opacity-0"
                    )}
                  >
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {/* All six industries; the one in front fills until the next turn. */}
      <ul aria-label="Industries" className="mt-6 flex flex-wrap justify-center gap-2">
        {CARDS.map((c, i) => {
          // The pill goes straight to the chosen chip while the cards step there.
          const on = i === target
          return (
            <li key={c.industry}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => go(i)}
                className={cn(
                  "relative min-h-9 rounded-full border px-3.5 text-[0.8125rem] font-medium transition-[border-color,color,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98]",
                  on ? "z-10 border-transparent text-white" : "zx-glass-chip text-ink-600 hover:text-ink-950"
                )}
              >
                {/* One black pill glides from chip to chip; the glass sweep
                    rides inside it and fills until the next turn. */}
                {on && (
                  <motion.span
                    layoutId="hero-industry-pill"
                    aria-hidden
                    className="absolute inset-0 overflow-hidden rounded-full bg-ink-950 shadow-[0_8px_20px_-10px_rgba(15,27,45,0.6)]"
                    transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
                  >
                    {running && active === target && (
                      <span
                        key={`${active}-${running}`}
                        className="zx-progress absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-white/5 via-white/15 to-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_-1px_0_0_rgba(255,255,255,0.55)]"
                        style={{ animationDuration: `${still ? INTERVAL * 2 : INTERVAL}ms` } as CSSProperties}
                      />
                    )}
                  </motion.span>
                )}
                <span className="relative">{c.industry}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
