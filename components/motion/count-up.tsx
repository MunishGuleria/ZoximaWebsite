"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/**
 * Counts from 0 to `value` once, the first time it scrolls into view.
 *
 * SSR (and reduced-motion) render the final figure, so crawlers and users
 * without JS read the real number.
 *
 * Smoothness:
 * - Each frame writes the digits straight to the DOM (textContent) — no React
 *   state, so a row of counters doesn't re-render React 60 times a second.
 * - Tabular figures keep every digit the same width, so the number doesn't
 *   change width while counting and nothing around it shifts.
 * - It triggers on the same viewport margin as <Reveal>, so it starts at 0 as
 *   the stat fades in, instead of showing the final number and snapping back.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1500,
  className,
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  // Matches Reveal's VIEWPORT_MARGIN.
  const inView = useInView(ref, { once: true, margin: "0px 0px 40px 0px" })
  const reduced = useReducedMotionSafe()

  useEffect(() => {
    const el = ref.current
    if (!inView || reduced || !el) return

    // Update React's own text node in place (rather than replacing it via
    // textContent), so React's view of the DOM stays valid.
    const node = el.firstChild
    if (!node || node.nodeType !== Node.TEXT_NODE) return
    const write = (n: number) => {
      node.nodeValue = `${prefix}${n.toLocaleString("en-US")}${suffix}`
    }

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // easeOutExpo — fast start, long settle
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      write(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    write(0)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      write(value)
    }
  }, [inView, reduced, value, duration, prefix, suffix])

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {/* One text node, so the animation can update it in place. */}
      {`${prefix}${value.toLocaleString("en-US")}${suffix}`}
    </span>
  )
}
