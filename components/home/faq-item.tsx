"use client"

import { useId, useState } from "react"
import { Plus } from "lucide-react"

/**
 * An accordion row that actually animates.
 *
 * Native <details> gives free semantics but snaps open with no transition —
 * the content box simply appears. This uses the grid-rows trick instead:
 * the panel is a grid animating `grid-template-rows` from `0fr` to `1fr`,
 * which interpolates to the content's natural height without anyone having
 * to measure it or hardcode a max-height.
 *
 * The answer stays in the DOM in both states — only its row collapses — so
 * it remains crawlable and quotable by answer engines, which is the whole
 * point of the FAQPage schema this section feeds.
 *
 * Accessibility: a real <button> inside the heading, wired to the panel with
 * aria-expanded / aria-controls. Reduced motion is handled by the global rule
 * that flattens transition durations.
 */
export function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string
  answer: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left"
        >
          <span
            className={[
              "text-[1.0625rem] font-medium tracking-tight transition-colors duration-200",
              open ? "text-navy-600" : "text-ink-950 group-hover:text-navy-600",
            ].join(" ")}
          >
            {question}
          </span>
          <Plus
            className={[
              "mt-1 h-4 w-4 shrink-0 transition-transform duration-300 ease-out",
              open ? "rotate-45 text-navy-600" : "text-ink-400 group-hover:text-navy-600",
            ].join(" ")}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        className="grid transition-[grid-template-rows] duration-400 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className={[
              "pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-600",
              "transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}
