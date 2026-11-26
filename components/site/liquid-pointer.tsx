"use client"

import { useEffect } from "react"

/**
 * Makes the liquid-glass highlight follow the pointer: one passive listener
 * for the whole page writes the pointer position into --mx / --my on the
 * glass element under it (.zx-glass-btn, -chip, -btn-dark, -row; see
 * globals.css). Mouse and pen only; on touch the highlight stays at rest.
 */
const SELECTOR = ".zx-glass-btn, .zx-glass-chip, .zx-glass-btn-dark, .zx-glass-row"

export function LiquidPointer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    let last: PointerEvent | null = null
    let current: HTMLElement | null = null

    const apply = () => {
      frame = 0
      const e = last
      if (!e) return
      const el = (e.target as Element | null)?.closest?.(SELECTOR) as HTMLElement | null
      if (current && current !== el) {
        current.style.removeProperty("--mx")
        current.style.removeProperty("--my")
      }
      current = el
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty("--mx", `${e.clientX - r.left}px`)
      el.style.setProperty("--my", `${e.clientY - r.top}px`)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      last = e
      if (!frame) frame = requestAnimationFrame(apply)
    }

    document.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      document.removeEventListener("pointermove", onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
