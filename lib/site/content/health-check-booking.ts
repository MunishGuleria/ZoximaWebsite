/* --------------------------------------------------------------------------
   Health check call booking: the card on /partners/salesforce (#book) and its
   API (app/api/book/route.ts) share these. Times are in the visitor's own
   time zone, which the form sends along.
   -------------------------------------------------------------------------- */

export const BOOK_ANCHOR = "book"

/** Remembers, in this browser, the call the visitor asked for ({ when, email }). */
export const BOOK_STORAGE_KEY = "zx-health-check-booking"
/** Window event fired after a booking, so the page can show it as done. */
export const BOOK_EVENT = "zx-booked"

/** The time slots offered (start of a 20-minute call). */
export const BOOK_SLOTS = [
  "9:00 am",
  "10:00 am",
  "11:00 am",
  "12:00 pm",
  "1:00 pm",
  "2:00 pm",
  "3:00 pm",
  "4:00 pm",
  "5:00 pm",
] as const

/** How far ahead a call can be booked, in days. */
export const BOOK_MAX_DAYS = 60

/** A YYYY-MM-DD date as "Wednesday, December 3, 2026". */
export function formatBookDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** Saturday or Sunday (for a YYYY-MM-DD date). */
export function isWeekend(date: string) {
  const d = new Date(`${date}T12:00:00Z`).getUTCDay()
  return d === 0 || d === 6
}
