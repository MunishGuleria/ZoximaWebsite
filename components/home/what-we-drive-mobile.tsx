"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"
import { DRIVES, type Drive } from "@/components/home/drive-visuals"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* --------------------------------------------------------------------------
   "What we drive" on phones: the seven cards as a scroll stack. Each card
   pins a little below the nav; the next one slides up over it and the ones
   underneath ease back (a little smaller), leaving their top edges
   showing like a deck. Every card keeps its title, line and visual.
   Doc copy (Home §3). Transform/opacity only; reduced motion = plain stack.
   Shown below 640px; the bento grid takes over from there.
   -------------------------------------------------------------------------- */

const NAV = 80 // mobile nav height (h-20)
const STEP = 14 // how much of each card underneath stays visible

function StackCard({
  card,
  i,
  progress,
  still,
}: {
  card: Drive
  i: number
  progress: MotionValue<number>
  still: boolean
}) {
  const n = DRIVES.length
  // Ease back as the cards after it arrive: the earlier, the further.
  const start = i / n
  // Reduced motion: the scale stays at 1. The style is passed either way so
  // the server and the browser render the same markup.
  const scale = useTransform(progress, [start, 1], [1, still ? 1 : 1 - (n - 1 - i) * 0.035])

  return (
    <div className="sticky" style={{ top: NAV + 16 + i * STEP }}>
      <motion.article
        style={{ scale, transformOrigin: "top center" }}
        className={cn(
          "flex flex-col rounded-3xl border p-5 shadow-[0_18px_40px_-26px_rgba(15,27,45,0.45)]",
          card.dark ? "border-ink-950 bg-ink-950" : "border-line bg-white"
        )}
      >
        <h3 className={cn("text-lg font-bold leading-snug", card.dark ? "text-white" : "text-ink-950")}>{card.title}</h3>
        <p className={cn("mt-1.5 text-sm leading-relaxed", card.dark ? "text-white/65" : "text-ink-600")}>{card.body}</p>
        <div className="mt-5 flex">{card.visual}</div>
      </motion.article>
    </div>
  )
}

export function WhatWeDriveMobile({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const still = !!useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end end"] })

  return (
    <div ref={ref} className={cn("relative mt-2 space-y-3 pb-6", className)}>
      {DRIVES.map((c, i) => (
        <StackCard key={c.title} card={c} i={i} progress={scrollYProgress} still={still} />
      ))}
    </div>
  )
}
