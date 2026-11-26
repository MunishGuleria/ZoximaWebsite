"use client"

import { motion } from "framer-motion"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/** A tiny line that draws itself the first time it scrolls into view. */
export function Sparkline({
  points = "0,26 12,22 24,24 36,16 48,18 60,9 72,11 80,4",
  className = "h-6 w-16 text-navy-600",
  delay = 0,
}: {
  points?: string
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotionSafe()
  return (
    <svg viewBox="0 0 80 32" className={className} aria-hidden="true">
      <motion.polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}
