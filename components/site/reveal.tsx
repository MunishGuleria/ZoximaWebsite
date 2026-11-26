"use client"

import { createElement, useEffect, useRef, type CSSProperties, type JSX, type ReactNode } from "react"

/* --------------------------------------------------------------------------
   Scroll reveal for the content pages. Content rises 32px into place as it
   enters; once fully off screen it resets and plays again next time, coming
   from above when you scroll back up. The hidden state lives in globals.css
   under `.zx-js [data-zx-reveal]`, so without JS everything simply shows.
   One IntersectionObserver is shared by every reveal on the page. The shown
   state is a data attribute (data-in), not a class: React rewrites className
   when a parent re-renders, which would hide the element again.
   (The home page keeps its own motion: components/motion/reveal.tsx.)
   -------------------------------------------------------------------------- */

type Variant = "up" | "fade" | "scale" | "line-y"

let observer: IntersectionObserver | null = null

function getObserver() {
  if (observer || typeof window === "undefined") return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        if (entry.intersectionRatio >= 0.12) {
          el.dataset.in = ""
        } else if (!entry.isIntersecting) {
          delete el.dataset.in
          const rootTop = entry.rootBounds?.top ?? 0
          el.dataset.from = entry.boundingClientRect.bottom <= rootTop ? "above" : "below"
        }
      }
    },
    { threshold: [0, 0.12] }
  )
  return observer
}

export function Reveal({
  children,
  index = 0,
  delay = 0,
  variant = "up",
  as = "div",
  className,
  style,
  id,
}: {
  children?: ReactNode
  /** Position in a staggered group; each step adds 90ms. */
  index?: number
  /** Extra delay in ms. */
  delay?: number
  variant?: Variant
  as?: keyof JSX.IntrinsicElements
  className?: string
  style?: CSSProperties
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    const io = getObserver()
    if (!el || !io) return
    io.observe(el)
    return () => io.unobserve(el)
  }, [])
  return createElement(
    as,
    {
      ref,
      id,
      className,
      "data-zx-reveal": variant === "up" ? "" : variant,
      style: { ...style, "--zx-reveal-delay": `${Math.min(index, 8) * 90 + delay}ms` } as CSSProperties,
    },
    children
  )
}
