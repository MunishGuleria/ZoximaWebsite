"use client"

import { useEffect, useState } from "react"
import { ArrowRight, CalendarCheck } from "lucide-react"
import { BOOK_ANCHOR, BOOK_EVENT, BOOK_STORAGE_KEY } from "@/lib/site/content/health-check-booking"

/* --------------------------------------------------------------------------
   The offer's booking action on /partners/salesforce. Before booking: the
   "Book your health check" button (opens the booking card, #book). After a
   booking in this browser: a "Call requested" mark with the day and time,
   and a small link to pick another time.
   -------------------------------------------------------------------------- */

type Booking = { when: string; email: string }

function readBooking(): Booking | null {
  try {
    const raw = localStorage.getItem(BOOK_STORAGE_KEY)
    const b = raw ? (JSON.parse(raw) as Partial<Booking>) : null
    return b?.when && b.email ? { when: b.when, email: b.email } : null
  } catch {
    return null
  }
}

/* Same look as the site's primary CtaButton. */
const buttonCls =
  "zx-sheen group inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-ink-950 px-6 text-[0.9375rem] font-semibold text-white transition-[scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98] max-sm:w-full"

export function BookCallAction({ label }: { label: string }) {
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const update = () => setBooking(readBooking())
    update()
    window.addEventListener(BOOK_EVENT, update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener(BOOK_EVENT, update)
      window.removeEventListener("storage", update)
    }
  }, [])

  if (booking) {
    return (
      <div role="status" className="flex items-center gap-3.5 rounded-2xl border border-line bg-white px-5 py-3.5 max-sm:w-full">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-950 text-white">
          <CalendarCheck className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-[0.9375rem] font-semibold text-ink-950">Call requested: {booking.when}</span>
          <span className="block text-sm text-ink-600">
            Invite on its way to {booking.email} ·{" "}
            <a href={`#${BOOK_ANCHOR}`} className="font-semibold text-navy-600 underline-offset-4 hover:underline">
              Change time
            </a>
          </span>
        </span>
      </div>
    )
  }

  return (
    <a href={`#${BOOK_ANCHOR}`} className={buttonCls}>
      {label}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </a>
  )
}
