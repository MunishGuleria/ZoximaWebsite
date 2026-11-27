"use client"

import { useEffect, useState } from "react"
import { ArrowRight, CalendarCheck, Loader2 } from "lucide-react"
import { BOOK_MAX_DAYS, BOOK_SLOTS, formatBookDate } from "@/lib/site/content/health-check-booking"

/* --------------------------------------------------------------------------
   "Book your health check call": name, work email, a weekday and a time slot
   in the visitor's own time zone, posted to /api/book. The team gets the
   request and the visitor gets a confirmation email. One button only.
   The hidden `zx_check` field is the API's honeypot.
   -------------------------------------------------------------------------- */

type Status = "idle" | "sending" | "sent" | "error"

const fieldCls =
  "mt-2 block w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-ink-950 placeholder:text-ink-400 transition-[border-color,box-shadow] duration-200 focus:border-navy-600 focus:outline-none focus:ring-4 focus:ring-navy-600/10 aria-[invalid=true]:border-flag"

/** A local date as YYYY-MM-DD. */
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink-800">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-flag">
          {error}
        </p>
      )}
    </div>
  )
}

export function BookCallForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState<{ email: string; when: string; confirmed: boolean } | null>(null)
  // Filled in after mount, so server and client render the same HTML.
  const [timeZone, setTimeZone] = useState("")
  const [range, setRange] = useState<{ min: string; max: string } | null>(null)

  useEffect(() => {
    try {
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "")
    } catch {
      /* unknown time zone: the team still gets the request */
    }
    const start = new Date()
    start.setDate(start.getDate() + 1)
    const end = new Date()
    end.setDate(end.getDate() + BOOK_MAX_DAYS)
    setRange({ min: ymd(start), max: ymd(end) })
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    setStatus("sending")
    setErrors({})
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          date: data.date,
          slot: data.slot,
          timeZone,
          zx_check: data.zx_check,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const issues = (json.issues ?? {}) as Record<string, string[] | undefined>
        const mapped: Record<string, string> = {}
        for (const [k, v] of Object.entries(issues)) if (v?.[0]) mapped[k] = v[0]
        setErrors(mapped)
        setMessage(json.error ?? "We could not send your booking. Please try again.")
        setStatus("error")
        return
      }
      setSent({ email: data.email, when: `${formatBookDate(data.date)} at ${data.slot}`, confirmed: json.confirmationSent !== false })
      form.reset()
      setStatus("sent")
    } catch {
      setMessage("We could not send your booking. Please check your connection and try again.")
      setStatus("error")
    }
  }

  const invalid = (name: string) => (errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {})

  if (status === "sent" && sent) {
    return (
      <div role="status" className="flex flex-col items-start">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-ink-950 text-white">
          <CalendarCheck className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="mt-5 text-xl font-semibold tracking-[-0.015em] text-ink-950 sm:text-[1.375rem]">Your call request is in</h3>
        <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-600">
          You asked for <b className="font-semibold text-ink-950">{sent.when}</b>.{" "}
          {sent.confirmed ? (
            <>
              We sent a confirmation to <b className="font-semibold text-ink-950">{sent.email}</b> and will send a calendar invite within
              one business day.
            </>
          ) : (
            <>
              We could not email a confirmation to <b className="font-semibold text-ink-950">{sent.email}</b>, but your request reached
              us and we will send a calendar invite within one business day.
            </>
          )}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Name" name="name" error={errors.name}>
        <input id="name" name="name" required autoComplete="name" maxLength={120} placeholder="Your full name" className={fieldCls} {...invalid("name")} />
      </Field>
      <Field label="Work email" name="email" error={errors.email}>
        <input id="email" name="email" type="email" required autoComplete="email" maxLength={200} placeholder="you@company.com" className={fieldCls} {...invalid("email")} />
      </Field>
      <Field label="Day" name="date" error={errors.date}>
        <input id="date" name="date" type="date" required min={range?.min} max={range?.max} className={fieldCls} {...invalid("date")} />
      </Field>
      <Field label="Time" name="slot" error={errors.slot}>
        <select id="slot" name="slot" required defaultValue="" className={`${fieldCls} appearance-none`} {...invalid("slot")}>
          <option value="" disabled>
            Choose a time
          </option>
          {BOOK_SLOTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="book_zx_check">Leave this field empty</label>
        <input id="book_zx_check" name="zx_check" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-sm ${status === "error" ? "text-flag" : "text-ink-500"}`}>
          {status === "error"
            ? message
            : `Weekdays, 20 minutes. Times are in your time zone${timeZone ? ` (${timeZone.replace(/_/g, " ")})` : ""}.`}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="zx-sheen group inline-flex h-12 shrink-0 select-none items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 text-[0.9375rem] font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98] disabled:cursor-wait disabled:hover:scale-100 disabled:opacity-80"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            <>
              Book the call
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
