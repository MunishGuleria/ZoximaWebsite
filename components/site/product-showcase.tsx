"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PRODUCT_SCREENS } from "@/lib/site/product-screens"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   Product showcase — the real product, as a layered deck.

   Four product screens sit stacked in depth: one in front, the next two
   stepping back up and to the right. Every few seconds the front screen eases
   to the back and the next one comes forward. Under the deck, a caption names
   the screen (doc copy: the solution's card line and name) and links to its
   solution page; four segment bars show where you are, fill until the next
   change, and can be clicked. On touch screens the deck also swipes.

   Transform and opacity only. Paused while hovered, focused or off screen;
   reduced motion shows the first screen still. The stage is padded top-right
   so the screens stepping back never leave the box (nothing gets clipped).
   -------------------------------------------------------------------------- */

const INTERVAL = 5600

/* Depth slots: 0 = front … 3 = hidden behind slot 2. Scaled about the centre. */
const SLOTS: { t: string; o: number }[] = [
  { t: "translate3d(0,0,0) scale(1)", o: 1 },
  { t: "translate3d(8%,-9%,0) scale(0.92)", o: 0.72 },
  { t: "translate3d(15%,-17%,0) scale(0.84)", o: 0.4 },
  { t: "translate3d(15%,-17%,0) scale(0.84)", o: 0 },
]

export function ProductShowcase({
  className,
  priority = false,
}: {
  className?: string
  /** Load the screens with the page (true in a hero). */
  priority?: boolean
}) {
  const screens = PRODUCT_SCREENS
  const n = screens.length
  const [front, setFront] = useState(0)
  const [hold, setHold] = useState(false)
  const [inView, setInView] = useState(true)
  const [still, setStill] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setStill(mq.matches)
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const running = !hold && inView && !still

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => setFront((f) => (f + 1) % n), INTERVAL)
    return () => window.clearTimeout(id)
  }, [front, running, n])

  const go = (i: number) => setFront(((i % n) + n) % n)

  // Horizontal swipe on touch: left = next, right = previous.
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return
    swipe.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s) return
    const dx = e.clientX - s.x
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(front + (dx < 0 ? 1 : -1))
  }

  const current = screens[front]

  return (
    <div
      ref={root}
      className={cn("relative", className)}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >

      {/* Stage: the front screen fills 93% of the width at the bottom-left;
          the rest of the box is room for the screens stepping back. */}
      <div
        className="relative touch-pan-y select-none"
        style={{ aspectRatio: "1 / 0.83" }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        <div className="absolute bottom-0 left-0 w-[93%]" style={{ aspectRatio: "1060 / 860" }}>
          {screens.map((s, i) => {
            const slot = (i - front + n) % n
            const pose = SLOTS[Math.min(slot, SLOTS.length - 1)]
            return (
              <div
                key={s.src}
                aria-hidden={slot !== 0}
                className="absolute inset-0 transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                style={{ transform: pose.t, opacity: pose.o, zIndex: n - slot, transformOrigin: "center" } as CSSProperties}
              >
                <div
                  className={cn(
                    "relative h-full overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#F1F4FD] to-[#DCE6FB] ring-1 ring-ink-950/[0.06] sm:rounded-[1.625rem]",
                    slot === 0
                      ? "shadow-[0_44px_90px_-38px_rgba(31,42,97,0.5),0_12px_28px_-18px_rgba(31,42,97,0.25)]"
                      : "shadow-[0_24px_50px_-34px_rgba(31,42,97,0.4)]"
                  )}
                >
                  <Image
                    src={s.src}
                    alt={slot === 0 ? s.alt : ""}
                    fill
                    priority={priority && i < 2}
                    loading={priority ? "eager" : undefined}
                    sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 92vw"
                    draggable={false}
                    className="object-contain"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Caption */}
      <div className="relative mt-5 sm:mt-6">
        <div className="flex items-center gap-4">
          <div key={front} className="zx-rise min-w-0 flex-1" style={{ "--zx-rise-y": "6px", "--zx-rise-dur": "0.5s" } as CSSProperties}>
            <p className="truncate text-[0.9375rem] font-semibold leading-snug text-ink-950 sm:text-base">{current.title}</p>
            <p className="truncate text-[0.8125rem] text-ink-500">{current.name}</p>
          </div>
          <Link
            href={current.href}
            aria-label={current.name}
            className="zx-glass-btn group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white text-ink-800 transition-[background-color,border-color,color] duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-white"
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <div role="tablist" aria-label="Product screens" className="mt-3 grid grid-cols-4 gap-2">
          {screens.map((s, i) => {
            const on = i === front
            return (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={s.name}
                title={s.name}
                onClick={() => go(i)}
                className="group -my-2.5 py-2.5"
              >
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-ink-950/10 transition-colors group-hover:bg-ink-950/20">
                  <span
                    key={on ? `${front}-${running}` : "off"}
                    className={cn(
                      "absolute inset-0 origin-left rounded-full bg-navy-600",
                      on ? (running ? "zx-progress" : "") : i < front ? "opacity-30" : "scale-x-0"
                    )}
                    style={on && running ? ({ animationDuration: `${INTERVAL}ms` } as CSSProperties) : undefined}
                  />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
