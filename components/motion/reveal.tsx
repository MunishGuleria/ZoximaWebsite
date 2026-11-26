"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

/* --------------------------------------------------------------------------
   Scroll-reveal primitives.

   House rules for motion on this site:
   - Short (0.5–0.7s), single-axis, small distance. Nothing bounces or scales.
   - Everything is opt-out under `prefers-reduced-motion`: the element is
     shown at rest straight away. The markup is the same either way (the
     server cannot know the setting), so the page hydrates without a
     mismatch; only the animation is skipped.
   - `once: true` — content never re-animates when you scroll back up.
   -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const

/* Percentage-based so it scales with the viewport. A fixed -80px inset is a
   reasonable delay on a 900px desktop window and far too much on a 700px
   phone, where elements were fully on screen before they animated. Only the
   bottom edge is inset, so things start moving just before they arrive. */
const VIEWPORT_MARGIN = "0px 0px 40px 0px"

type Direction = "up" | "down" | "left" | "right" | "none"

/* Offsets are animated as a full `transform` string rather than framer's
   `x`/`y`. framer-motion can only hand opacity and whole-`transform`
   animations to the browser's animation engine (off the main thread);
   independent x/y run in a JS loop every frame, and many reveals starting
   together during a fast scroll then compete with scroll-linked sections.
   The resting value is `none` (the browser interpolates a translate to
   `none` natively), so a revealed element ends with no transform at all —
   exactly as before — and doesn't become a containing block for anything
   fixed inside it. */
const translate = (x: number, y: number) => `translateX(${x}px) translateY(${y}px)`
const AT_REST = "none"

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return translate(0, distance)
    case "down":
      return translate(0, -distance)
    case "left":
      return translate(distance, 0)
    case "right":
      return translate(-distance, 0)
    default:
      return AT_REST
  }
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.62,
  direction = "up",
  distance = 18,
  as = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: Direction
  distance?: number
  as?: "div" | "section" | "li" | "span" | "header"
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div
  const rest = { opacity: 1, transform: AT_REST }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, transform: offsetFor(direction, distance) }}
      animate={reduced ? rest : undefined}
      whileInView={reduced ? undefined : rest}
      viewport={{ once: true, margin: VIEWPORT_MARGIN }}
      transition={reduced ? { duration: 0 } : { duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Staggers direct `RevealItem` children as the group scrolls into view.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.075,
  delay = 0,
  as = "div",
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  as?: "div" | "ul" | "ol" | "section"
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  const container: Variants = {
    hidden: {},
    show: {
      transition: reduced ? { staggerChildren: 0 } : { staggerChildren: stagger, delayChildren: delay },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      animate={reduced ? "show" : undefined}
      whileInView={reduced ? undefined : "show"}
      viewport={{ once: true, margin: VIEWPORT_MARGIN }}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  children,
  className,
  distance = 16,
  as = "div",
}: {
  children: ReactNode
  className?: string
  distance?: number
  as?: "div" | "li" | "article"
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  const item: Variants = {
    hidden: { opacity: 0, transform: translate(0, distance) },
    show: {
      opacity: 1,
      transform: AT_REST,
      transition: reduced ? { duration: 0 } : { duration: 0.58, ease: EASE },
    },
  }

  return (
    <MotionTag className={className} variants={item}>
      {children}
    </MotionTag>
  )
}
