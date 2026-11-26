"use client"

import { motion } from "framer-motion"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

const EASE = [0.22, 1, 0.36, 1] as const
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const

/**
 * The engagement progress track, in both of its forms.
 *
 * Below `sm` the phases stack, so the track is a vertical rail that draws
 * downward past each marker. At `sm` and above the phases sit side by side and
 * the track is a horizontal segment per phase, filling left to right.
 *
 * Both live here rather than being split between this file and the section, so
 * the timing (a 0.18s stagger by index, marker landing 0.1s behind its own
 * line) stays in one place.
 *
 * A border cannot be animated, hence a scaled element rather than a border-top:
 * `scaleX`/`scaleY` from a pinned origin interpolates to the natural length
 * without measuring anything.
 */
export function TimelineTrack({
  index,
  last = false,
}: {
  index: number
  last?: boolean
}) {
  const reduced = useReducedMotionSafe()
  const delay = index * 0.18

  const marker = (
    <motion.span
      className={[
        "block h-3 w-3 rounded-full sm:h-2 sm:w-2",
        last ? "border-2 border-navy-600 bg-paper-sunken" : "bg-navy-600",
      ].join(" ")}
      initial={reduced ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.4, delay: delay + 0.1, ease: EASE }}
    />
  )

  return (
    <>
      {/* ---------- mobile: vertical rail ---------- */}
      <span className="sm:hidden" aria-hidden="true">
        {!last && (
          <motion.span
            className="absolute bottom-0 left-[5px] top-4 w-px origin-top bg-line"
            initial={reduced ? { scaleY: 1 } : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, delay, ease: EASE }}
          />
        )}
        <span className="absolute left-0 top-1.5">{marker}</span>
      </span>

      {/* ---------- sm and up: horizontal segment ---------- */}
      <span className="relative hidden h-2 sm:block" aria-hidden="true">
        <span className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-line" />
        <motion.span
          className="absolute inset-x-0 top-0 h-[2px] origin-left rounded-full bg-navy-600"
          initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.75, delay, ease: EASE }}
        />
        <span className="absolute -top-[3px] left-0">{marker}</span>
      </span>
    </>
  )
}
