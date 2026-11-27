"use client"

import { useCallback, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { BookCallForm } from "@/components/site/book-call-form"
import { BOOK_ANCHOR } from "@/lib/site/content/health-check-booking"

/* --------------------------------------------------------------------------
   The health check booking form as a pop-up card. Any link to #book opens it
   (the hero and offer buttons on /partners/salesforce, and the "Book a
   20-minute call" link in the guide email). Native <dialog>: Esc closes it,
   focus stays inside, the page behind is inert. Closing clears the #book
   hash, so the same button can open it again.
   -------------------------------------------------------------------------- */

export function BookCallDialog({ title, body }: { title: string; body: string }) {
  const ref = useRef<HTMLDialogElement>(null)

  const openIfHash = useCallback(() => {
    const d = ref.current
    if (d && window.location.hash === `#${BOOK_ANCHOR}` && !d.open) d.showModal()
  }, [])

  useEffect(() => {
    openIfHash()
    // Next's <Link> changes the hash with pushState (no hashchange event), so
    // catch clicks on any #book link directly.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a")
      const href = a?.getAttribute("href") ?? ""
      if (!href.endsWith(`#${BOOK_ANCHOR}`)) return
      const url = new URL(href, window.location.href)
      if (url.pathname !== window.location.pathname) return
      e.preventDefault()
      e.stopPropagation()
      if (ref.current && !ref.current.open) ref.current.showModal()
    }
    document.addEventListener("click", onClick, true)
    window.addEventListener("hashchange", openIfHash)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("hashchange", openIfHash)
    }
  }, [openIfHash])

  const onClose = () => {
    if (window.location.hash === `#${BOOK_ANCHOR}`) {
      history.replaceState(null, "", window.location.pathname + window.location.search)
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="book-title"
      onClose={onClose}
      // Click on the backdrop (the dialog element itself, outside the card) closes it.
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl overflow-visible rounded-[28px] bg-transparent p-0 backdrop:bg-ink-950/50 backdrop:backdrop-blur-sm"
    >
      <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[28px] border border-line bg-white p-6 sm:p-10">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-950"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <h2 id="book-title" className="zx-display pr-10 text-[1.625rem] leading-[1.15] tracking-[-0.03em] text-ink-950 sm:text-[2rem]">
          {title}
        </h2>
        <p className="mb-7 mt-3 text-[1.0625rem] leading-relaxed text-ink-600">{body}</p>
        <BookCallForm />
      </div>
    </dialog>
  )
}
