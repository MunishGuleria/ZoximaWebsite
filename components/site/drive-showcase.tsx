"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { DRIVES } from "@/components/home/drive-visuals"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   /solutions hero visual: the home page's seven "What we drive" cards, one at
   a time. Each card shows its title, line and live UI visual (white or ink,
   as on the home page). They cross-fade every few seconds; the bars under the
   card show where you are, fill until the next card, and can be clicked.
   Paused while pointed at or focused; still under reduced motion.
   -------------------------------------------------------------------------- */
const INTERVAL = 5000

export function DriveShowcase() {
  const [active, setActive] = useState(0)
  const [hold, setHold] = useState(false)
  const reduce = useReducedMotionSafe()
  const n = DRIVES.length
  const running = !hold && !reduce

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % n), INTERVAL)
    return () => window.clearTimeout(id)
  }, [active, running, n])

  return (
    <div
      className="w-full"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <div className="relative h-[30rem] sm:h-[31rem]" aria-live="polite">
        {DRIVES.map((d, i) => {
          const on = i === active
          return (
            <article
              key={d.title}
              aria-hidden={!on}
              className={cn(
                "absolute inset-0 flex flex-col rounded-[28px] p-6 shadow-[0_30px_70px_-40px_rgba(19,23,32,0.5)] transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-7",
                d.dark ? "bg-ink-950" : "border border-line bg-white",
                on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
              )}
            >
              <h3 className={cn("text-xl font-bold leading-tight tracking-tight sm:text-[1.375rem]", d.dark ? "text-white" : "text-ink-950")}>
                {d.title}
              </h3>
              <p className={cn("mt-2 text-sm leading-relaxed", d.dark ? "text-white/65" : "text-ink-600")}>{d.body}</p>
              <div className="mt-5 flex min-h-0 flex-1 items-center overflow-hidden">{d.visual}</div>
            </article>
          )
        })}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="grid flex-1 grid-cols-7 gap-1.5" role="tablist" aria-label="What we drive">
          {DRIVES.map((d, i) => {
            const on = i === active
            return (
              <button
                key={d.title}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={d.title}
                onClick={() => setActive(i)}
                className="group py-3"
              >
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-ink-950/10">
                  <span
                    key={on ? `on-${active}-${running}` : `off-${i}`}
                    className={cn(
                      "absolute inset-0 origin-left rounded-full bg-navy-600",
                      on && running ? "sx-scene-fill" : "",
                      !on && "scale-x-0 group-hover:scale-x-100 group-hover:bg-ink-300"
                    )}
                    style={on && running ? { animationDuration: `${INTERVAL}ms` } : undefined}
                  />
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={() => setActive((a) => (a + 1) % n)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-white text-ink-700 transition-[border-color,color,translate] duration-300 hover:translate-x-0.5 hover:border-ink-950 hover:text-ink-950"
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
