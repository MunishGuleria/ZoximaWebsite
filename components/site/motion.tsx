"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import Image from "next/image"
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion"
import type { Item } from "@/lib/site/types"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* --------------------------------------------------------------------------
   Motion pieces for the content pages. Same house rules as the home page:
   transform/opacity only (compositor), `once` reveals, nothing bouncy, and
   every piece settles to its final state under prefers-reduced-motion.
   -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const

/** Thin indigo bar under the nav that tracks how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotionSafe()
  if (reduced) return null
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-navy-600 to-[#7c8cff]"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

/** A rule that draws itself left → right (or top → bottom) as it enters. */
export function DrawLine({
  className,
  delay = 0,
  vertical = false,
  duration = 0.9,
}: {
  className?: string
  delay?: number
  vertical?: boolean
  duration?: number
}) {
  const reduced = useReducedMotionSafe()
  // Explicit scale keyframes at both ends: framer won't tween a zero scale
  // to "none" (the element stays collapsed), so the end is "scaleX(1)".
  const axis = vertical ? "scaleY" : "scaleX"
  return (
    <motion.span
      aria-hidden
      className={`block ${vertical ? "origin-top" : "origin-left"} ${className ?? ""}`}
      initial={{ transform: `${axis}(${reduced ? 1 : 0.001})` }}
      whileInView={{ transform: `${axis}(1)` }}
      viewport={{ once: true, margin: "0px 0px 40px 0px" }}
      transition={{ duration, delay, ease: EASE }}
    />
  )
}

/* --------------------------------------------------------------------------
   Statement: large prose whose words light up as you scroll through it.
   One scroll listener writes a single CSS variable (--p); each word's
   opacity is a CSS clamp() of --p against its own index (see .zx-word), so a
   frame costs one style write, not one per word.
   -------------------------------------------------------------------------- */
export function Statement({ body, size = "lg" }: { body: string[]; size?: "lg" | "md" }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.68"] })

  const write = (v: number) => ref.current?.style.setProperty("--p", reduced ? "1" : v.toFixed(4))
  useMotionValueEvent(scrollYProgress, "change", write)
  useEffect(() => write(scrollYProgress.get()))

  const paragraphs = body.map((p) => p.split(/\s+/))
  const total = paragraphs.reduce((n, w) => n + w.length, 0)
  let i = 0

  return (
    <div ref={ref} style={{ "--p": 1, "--n": total } as CSSProperties} className="space-y-6">
      {paragraphs.map((words, pi) => (
        <p
          key={pi}
          className={`font-medium tracking-tight text-ink-950 ${
            size === "lg"
              ? "text-[1.5rem] leading-[1.35] sm:text-[1.875rem] lg:text-[2.125rem]"
              : "text-[1.25rem] leading-[1.45] sm:text-[1.5rem]"
          }`}
        >
          {words.map((w, wi) => {
            const idx = i++
            return (
              <span key={wi} className="zx-word" style={{ "--i": idx } as CSSProperties}>
                {w}{" "}
              </span>
            )
          })}
        </p>
      ))}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Timeline: numbered steps on a track that draws itself, each node filling
   as the line reaches it. Horizontal on desktop for up to five steps,
   vertical otherwise.
   -------------------------------------------------------------------------- */
const COLS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
}

export function Timeline({ items }: { items: Item[] }) {
  const reduced = useReducedMotionSafe()
  const horizontal = items.length >= 2 && items.length <= 5
  const step = 0.28
  const lineDur = Math.max(0.8, step * items.length)

  const node = (i: number) => ({
    hidden: { opacity: reduced ? 1 : 0, transform: reduced ? "none" : "translateY(12px)" },
    show: { opacity: 1, transform: "none", transition: { duration: 0.55, delay: i * step, ease: EASE } },
  })
  const fill = (i: number) => ({
    hidden: { transform: `scale(${reduced ? 1 : 0.001})` },
    show: { transform: "scale(1)", transition: { duration: 0.45, delay: i * step + 0.15, ease: EASE } },
  })

  return (
    <motion.ol
      className={`relative grid gap-y-10 ${horizontal ? `lg:gap-x-8 ${COLS[items.length]}` : ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Vertical track (always below lg; at every size when vertical). */}
      <span aria-hidden className={`absolute bottom-6 left-[1.375rem] top-6 w-px bg-navy-600/15 ${horizontal ? "lg:hidden" : ""}`}>
        <motion.span
          className="block h-full w-full origin-top bg-navy-600"
          variants={{ hidden: { transform: `scaleY(${reduced ? 1 : 0.001})` }, show: { transform: "scaleY(1)" } }}
          transition={{ duration: lineDur, ease: "linear" }}
        />
      </span>
      {/* Horizontal track through the node centres (desktop). */}
      {horizontal && (
        <span aria-hidden className="absolute left-[1.375rem] right-8 top-[1.375rem] hidden h-px bg-navy-600/15 lg:block">
          <motion.span
            className="block h-full w-full origin-left bg-navy-600"
            variants={{ hidden: { transform: `scaleX(${reduced ? 1 : 0.001})` }, show: { transform: "scaleX(1)" } }}
            transition={{ duration: lineDur, ease: "linear" }}
          />
        </span>
      )}

      {items.map((item, i) => (
        <motion.li
          key={`${i}-${item.title ?? item.body}`}
          variants={node(i)}
          className={`relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-5 ${horizontal ? "lg:grid-cols-1 lg:gap-6" : ""}`}
        >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-navy-600/25 bg-white text-sm font-semibold tabular-nums text-navy-600">
            {String(i + 1).padStart(2, "0")}
            {/* The filled node grows in over the outlined one as the line arrives. */}
            <motion.span
              aria-hidden
              variants={fill(i)}
              className="absolute -inset-px flex items-center justify-center rounded-full bg-navy-600 text-white shadow-[0_8px_20px_-8px_rgba(37,56,200,0.6)]"
            >
              {String(i + 1).padStart(2, "0")}
            </motion.span>
          </span>
          <div className="pt-1.5 lg:pt-0">
            {item.title && <h3 className="text-lg font-semibold text-ink-950">{item.title}</h3>}
            <p className={`text-[0.9375rem] leading-relaxed text-ink-600 ${item.title ? "mt-1.5" : ""}`}>{item.body}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  )
}

/** Photo that drifts slightly against the scroll (hero and case pages). */
export function ParallaxPhoto({
  src,
  alt,
  position,
  priority = false,
  sizes = "(min-width: 1024px) 42vw, 100vw",
  className,
}: {
  src: string
  alt: string
  position?: string
  priority?: boolean
  sizes?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const transform = useTransform(scrollYProgress, [0, 1], ["translateY(-5%)", "translateY(5%)"])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div className="absolute inset-x-0 -inset-y-[7%]" style={reduced ? undefined : { transform }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={position ? { objectPosition: position } : undefined}
        />
      </motion.div>
    </div>
  )
}
