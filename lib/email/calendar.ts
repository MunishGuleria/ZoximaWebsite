/* --------------------------------------------------------------------------
   Calendar helpers for the health check booking email (app/api/book). The
   team's email gets "Add to Google Calendar" / "Add to Outlook" links that
   open a pre-filled event with the visitor as the guest; saving it sends
   them the invite. Server-only, no dependencies.
   -------------------------------------------------------------------------- */

/** Offset (ms) of `timeZone` from UTC at the instant `ts`. Unknown zone: 0. */
function zoneOffset(ts: number, timeZone: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(new Date(ts))
    const n = (type: string) => Number(parts.find((p) => p.type === type)?.value)
    return Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second")) - ts
  } catch {
    return 0
  }
}

/** "2026-12-03" + "9:00 am" in `timeZone` → the UTC instant. */
export function slotToUtc(date: string, slot: string, timeZone: string) {
  const [y, mo, d] = date.split("-").map(Number)
  const m = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(slot.trim())
  let h = m ? Number(m[1]) % 12 : 0
  if (m && m[3].toLowerCase() === "pm") h += 12
  const wall = Date.UTC(y, mo - 1, d, h, m ? Number(m[2]) : 0)
  if (!timeZone) return new Date(wall)
  // Two passes so a daylight-saving change on that day lands right.
  let ts = wall - zoneOffset(wall, timeZone)
  ts = wall - zoneOffset(ts, timeZone)
  return new Date(ts)
}

/** The instant as "Wed, Dec 3, 9:00 AM" in a time zone. */
export function formatIn(at: Date, timeZone: string) {
  try {
    return at.toLocaleString("en-US", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return at.toISOString()
  }
}

type CalendarEvent = { title: string; start: Date; end: Date; details: string; guest: string }

/** Query string with spaces as %20 (Outlook shows "+" literally). */
const query = (params: Record<string, string>) => new URLSearchParams(params).toString().replace(/\+/g, "%20")

/** 20261203T170000Z */
const gcalStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")

export function googleCalendarUrl(e: CalendarEvent) {
  const q = query({
    action: "TEMPLATE",
    text: e.title,
    dates: `${gcalStamp(e.start)}/${gcalStamp(e.end)}`,
    details: e.details,
    add: e.guest,
  })
  return `https://calendar.google.com/calendar/render?${q}`
}

/** Outlook on the web (Microsoft 365 work accounts). */
export function outlookCalendarUrl(e: CalendarEvent) {
  const q = query({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: e.title,
    startdt: e.start.toISOString(),
    enddt: e.end.toISOString(),
    body: e.details,
    to: e.guest,
  })
  return `https://outlook.office.com/calendar/0/deeplink/compose?${q}`
}
