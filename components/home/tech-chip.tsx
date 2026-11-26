"use client"

import type { PointerEvent as ReactPointerEvent } from "react"
import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

/**
 * A stack chip you can nudge and throw.
 *
 * Two transforms are in play, so they live on two elements — framer's `drag`
 * owns the inner element's x/y, and putting the magnetic springs on the same
 * node would have the two fighting for the same motion values every frame.
 *
 *   outer <li>   magnetic lean toward the cursor (spring-damped, ±6px / ±4px)
 *   inner <div>  drag, with elastic constraints and snap-back to origin
 *
 * Drag is pointer-fine only. On touch, framer sets `touch-action: none` to
 * claim the gesture, which would eat vertical scrolling on a phone — the grid
 * is 27 chips tall, so that is most of the screen.
 */
export function TechChip({ label }: { label: string }) {
  const reduced = useReducedMotionSafe()
  const [canDrag, setCanDrag] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)")
    const decide = () => setCanDrag(fine.matches)
    decide()
    fine.addEventListener("change", decide)
    return () => fine.removeEventListener("change", decide)
  }, [])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 280, damping: 18, mass: 0.4 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)

  const onMove = (e: ReactPointerEvent<HTMLLIElement>) => {
    if (reduced || e.pointerType === "touch") return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * 0.4, -6, 6))
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * 0.6, -4, 4))
  }

  const settle = () => {
    x.set(0)
    y.set(0)
  }

  const draggable = canDrag && !reduced

  return (
    <motion.li
      style={reduced ? undefined : { x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={settle}
      onPointerCancel={settle}
      className="list-none"
    >
      <motion.div
        drag={draggable}
        dragSnapToOrigin
        dragElastic={0.28}
        dragConstraints={{ left: -70, right: 70, top: -45, bottom: 45 }}
        dragTransition={{ bounceStiffness: 320, bounceDamping: 24 }}
        whileHover={reduced ? undefined : { scale: 1.06 }}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        whileDrag={{ scale: 1.12, zIndex: 50 }}
        transition={{ type: "spring", ...spring }}
        className={[
          "relative select-none rounded-md border border-line bg-paper-raised px-2.5 py-1.5",
          "text-[0.8125rem] text-ink-700 shadow-sm transition-colors duration-200",
          "hover:border-navy-border hover:bg-navy-soft hover:text-navy-600",
          draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default",
        ].join(" ")}
      >
        {label}
      </motion.div>
    </motion.li>
  )
}
