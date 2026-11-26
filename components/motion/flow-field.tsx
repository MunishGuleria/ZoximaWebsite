"use client"

import { useEffect, useRef } from "react"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/**
 * Streamlines drifting through a slowly-shifting vector field, deflected by
 * the pointer.
 *
 * Reads as computation and flow — the thing an orchestration layer does —
 * without the node-and-edge "neural network" cliché. Plain canvas, no library.
 *
 * Rendering: each frame the existing pixels are faded toward transparent with
 * `destination-out`, then one short segment per particle is drawn. Long,
 * smooth, fading trails at one stroke per particle per frame, on a transparent
 * canvas so the orb behind still shows through.
 *
 * Field: summed sines plus a constant rightward drift. The drift matters — a
 * pure sine field has "sink lines" where x-velocity is zero and particles pile
 * up into vertical streaks.
 *
 * Pointer: within `POINTER_RADIUS` the flow gains a tangential (swirl)
 * component plus gentle outward push, so the cursor carves a visible wake.
 * Strength falls off smoothly to zero at the edge of the radius, and the
 * target is lerped so the effect trails the cursor rather than snapping.
 *
 * Pauses off-screen and when the tab is hidden, caps DPR at 1.5, renders one
 * static settled pass under prefers-reduced-motion.
 */
export function FlowField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotionSafe()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // The hero already carries the aurora and the masked brand mark. Running a
    // canvas rAF loop alongside them is the third heavy layer on a phone, and
    // the one a reader is least likely to notice. Desktop keeps it in full.
    const isMobile = window.matchMedia("(max-width: 1023px)").matches
    if (isMobile) return
    const COUNT = 230
    const SPEED = 1.15
    const FADE = 0.035 // per-frame alpha decay → roughly one-second trails
    const POINTER_RADIUS = 190
    const SWIRL = 3.4
    const PUSH = 1.5
    // Approximations of --zx-navy-600 and --zx-green-500 in sRGB.
    const NAVY = "58, 64, 190"
    const GREEN = "44, 132, 76"

    type Particle = { x: number; y: number; rgb: string; life: number; w: number; a: number }
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    let particles: Particle[] = []

    // Pointer: raw target, and the lerped position actually used by the field.
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, active: false }

    const reset = (p: Particle) => {
      // Mostly spawn in the left band so the drift carries them across.
      p.x = Math.random() < 0.65 ? -10 + Math.random() * w * 0.2 : Math.random() * w
      p.y = Math.random() * h
      p.life = 220 + Math.random() * 420
      p.rgb = Math.random() < 0.72 ? NAVY : GREEN
      p.w = 0.8 + Math.random() * 0.8
      p.a = 0.16 + Math.random() * 0.16
      return p
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = r.width
      h = r.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from({ length: COUNT }, () =>
        reset({ x: 0, y: 0, rgb: NAVY, life: 0, w: 1, a: 0.2 })
      )
      // Scatter initial x across the width so the first frames aren't empty.
      for (const p of particles) p.x = Math.random() * w
    }

    // Cheap smooth field: a few summed sines. No noise library needed.
    const angle = (x: number, y: number, t: number) => {
      const s = 0.0016
      return (
        Math.sin(x * s + t * 0.00028) * 1.2 +
        Math.cos(y * s * 1.4 - t * 0.00041) * 1.0 +
        Math.sin((x + y) * s * 0.5 + t * 0.00019) * 0.8
      )
    }

    const advance = (p: Particle, t: number) => {
      const a = angle(p.x, p.y, t)
      // Constant drift keeps x-velocity positive → no sink lines.
      let vx = Math.cos(a) * 0.7 + 0.6
      let vy = Math.sin(a) * 0.95

      if (ptr.active) {
        const dx = p.x - ptr.x
        const dy = p.y - ptr.y
        const d2 = dx * dx + dy * dy
        if (d2 < POINTER_RADIUS * POINTER_RADIUS && d2 > 1) {
          const d = Math.sqrt(d2)
          // smootherstep falloff → no hard edge at the radius
          const f = 1 - d / POINTER_RADIUS
          const fall = f * f * (3 - 2 * f)
          const nx = dx / d
          const ny = dy / d
          // tangential swirl (perpendicular) + gentle outward push
          vx += -ny * SWIRL * fall + nx * PUSH * fall
          vy += nx * SWIRL * fall + ny * PUSH * fall
        }
      }

      return { nx: p.x + vx * SPEED, ny: p.y + vy * SPEED }
    }

    const frame = (t: number) => {
      // Ease the field's pointer toward the real one so the wake trails.
      ptr.x += (ptr.tx - ptr.x) * 0.12
      ptr.y += (ptr.ty - ptr.y) * 0.12

      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = `rgba(0, 0, 0, ${FADE})`
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = "source-over"
      ctx.lineCap = "round"

      for (const p of particles) {
        const { nx, ny } = advance(p, t)
        ctx.strokeStyle = `rgba(${p.rgb}, ${p.a})`
        ctx.lineWidth = p.w
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(nx, ny)
        ctx.stroke()
        p.x = nx
        p.y = ny
        if (--p.life <= 0 || p.x > w + 20 || p.y < -20 || p.y > h + 20) reset(p)
      }
    }

    const loop = (t: number) => {
      if (!visible || document.hidden) {
        raf = 0
        return
      }
      frame(t)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }

    resize()

    if (reduced) {
      // One static pass: let the field settle into a texture, no fading.
      ctx.lineCap = "round"
      for (let k = 0; k < 260; k++) {
        for (const p of particles) {
          const { nx, ny } = advance(p, k * 16)
          ctx.strokeStyle = `rgba(${p.rgb}, 0.06)`
          ctx.lineWidth = p.w
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(nx, ny)
          ctx.stroke()
          p.x = nx
          p.y = ny
          if (p.x > w || p.y < 0 || p.y > h) reset(p)
        }
      }
      return
    }

    // --- pointer ------------------------------------------------------------
    // Listen on the hero container (the canvas is pointer-events:none) so the
    // wake tracks the cursor anywhere over the hero, not just the canvas box.
    const host = canvas.parentElement ?? canvas

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (!ptr.active) {
        // First entry: place it directly so it doesn't sweep in from 0,0.
        ptr.x = x
        ptr.y = y
      }
      ptr.tx = x
      ptr.ty = y
      ptr.active = true
      start()
    }
    const onLeave = () => {
      ptr.active = false
    }

    host.addEventListener("pointermove", onMove, { passive: true })
    host.addEventListener("pointerleave", onLeave, { passive: true })

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVisibility = () => {
      if (!document.hidden && visible) start()
    }
    document.addEventListener("visibilitychange", onVisibility)

    const ro = new ResizeObserver(() => resize())
    ro.observe(canvas)

    start()

    return () => {
      cancelAnimationFrame(raf)
      raf = 0
      io.disconnect()
      ro.disconnect()
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [reduced])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
