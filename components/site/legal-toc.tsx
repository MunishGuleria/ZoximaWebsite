"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/* Contents list for a legal document that follows the reader: the section
   currently being read (the last heading that has passed the upper third of
   the screen) is marked with a navy rule and dark text, and the list keeps
   that entry in view when it is taller than the screen. */
export function LegalToc({ items }: { items: { id: string; heading: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter((el): el is HTMLElement => !!el)
    if (!els.length) return
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.33
      let current = els[0].id
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id
        else break
      }
      // At the very bottom, the last section is the one being read.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = els[els.length - 1].id
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  // Keep the active entry visible inside the (scrollable) list.
  useEffect(() => {
    const list = listRef.current
    const el = list?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!list || !el) return
    const { offsetTop, offsetHeight } = el
    if (offsetTop < list.scrollTop || offsetTop + offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: offsetTop - list.clientHeight / 3, behavior: "smooth" })
    }
  }, [active])

  return (
    <nav aria-label="Contents" className="sticky top-28">
      <p className="zx-eyebrow">Contents</p>
      <ol ref={listRef} className="relative mt-4 max-h-[calc(100svh-11rem)] space-y-0.5 overflow-y-auto border-l border-line pr-2">
        {items.map((it) => {
          const on = it.id === active
          return (
            <li key={it.id} data-id={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? "location" : undefined}
                onClick={() => setActive(it.id)}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors duration-200",
                  on ? "border-navy-600 font-medium text-ink-950" : "border-transparent text-ink-500 hover:text-ink-950"
                )}
              >
                {it.heading}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
