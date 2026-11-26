"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { CONTACT_TOPICS } from "@/lib/site/content/company"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* --------------------------------------------------------------------------
   Contact form: the doc's fields (Name · Work email · Company · Role · What
   would you like to improve? · Message), posted to /api/contact. The hidden
   `company_website` field is the API's honeypot.
   -------------------------------------------------------------------------- */
type Status = "idle" | "sending" | "sent" | "error"

const EASE = [0.22, 1, 0.36, 1] as const

const fieldCls =
  "mt-2 block w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-ink-950 placeholder:text-ink-400 transition-[border-color,box-shadow] duration-200 focus:border-navy-600 focus:outline-none focus:ring-4 focus:ring-navy-600/10 aria-[invalid=true]:border-flag"

function Field({
  label,
  name,
  error,
  required = false,
  children,
}: {
  label: string
  name: string
  error?: string
  /** Shows the required mark (*) after the label. */
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink-800">
        {label}
        {required && (
          <span className="ml-0.5 text-flag" aria-hidden>
            *
          </span>
        )}
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

export function ContactForm() {
  const reduce = useReducedMotionSafe()
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const topicRef = useRef<HTMLSelectElement>(null)

  // Links like /contact?topic=Salesforce%20health%20check preselect the topic.
  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get("topic")
    if (topic && topicRef.current && (CONTACT_TOPICS as readonly string[]).includes(topic)) topicRef.current.value = topic
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    setStatus("sending")
    setErrors({})
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          business: data.company,
          role: data.role,
          topic: data.topic,
          message: data.message,
          company_website: data.company_website,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const issues = (json.issues ?? {}) as Record<string, string[] | undefined>
        const mapped: Record<string, string> = {}
        for (const [k, v] of Object.entries(issues)) if (v?.[0]) mapped[k === "business" ? "company" : k] = v[0]
        setErrors(mapped)
        setMessage(json.error ?? "We could not send your message. Please try again.")
        setStatus("error")
        return
      }
      form.reset()
      setStatus("sent")
    } catch {
      setMessage("We could not send your message. Please check your connection and try again.")
      setStatus("error")
    }
  }

  const invalid = (name: string) => (errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {})

  return (
    <div className="relative rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_24px_60px_-34px_rgba(31,42,97,0.35)] [backdrop-filter:blur(20px)_saturate(1.5)] [-webkit-backdrop-filter:blur(20px)_saturate(1.5)]">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, transform: reduce ? "none" : "translateY(8px)" }}
            animate={{ opacity: 1, transform: "none" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex min-h-[22rem] flex-col items-start justify-center"
            role="status"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 text-signal">
              <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden />
            </span>
            <h2 className="zx-display-sm mt-6 text-[1.75rem] text-ink-950 sm:text-[2rem]">Thank you.</h2>
            <p className="mt-3 max-w-md text-[1.0625rem] leading-relaxed text-ink-600">
              We will get back to you within one business day.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-8 text-sm font-semibold text-ink-900 underline-offset-4 hover:text-navy-600 hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="grid gap-5 sm:grid-cols-2"
          >
            <Field label="Name" name="name" required error={errors.name}>
              <input id="name" name="name" required autoComplete="name" maxLength={120} placeholder="Your full name" className={fieldCls} {...invalid("name")} />
            </Field>
            <Field label="Work email" name="email" required error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={200}
                placeholder="you@company.com"
                className={fieldCls}
                {...invalid("email")}
              />
            </Field>
            <Field label="Company" name="company" error={errors.company}>
              <input
                id="company"
                name="company"
                autoComplete="organization"
                maxLength={160}
                placeholder="Your company"
                className={fieldCls}
                {...invalid("company")}
              />
            </Field>
            <Field label="Role" name="role" error={errors.role}>
              <input id="role" name="role" autoComplete="organization-title" maxLength={120} placeholder="e.g. Head of Sales" className={fieldCls} {...invalid("role")} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="What would you like to improve?" name="topic" error={errors.topic}>
                <select ref={topicRef} id="topic" name="topic" defaultValue="" className={`${fieldCls} appearance-none`} {...invalid("topic")}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {CONTACT_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Message" name="message" error={errors.message}>
                <textarea id="message" name="message" rows={5} maxLength={4000} placeholder="Where does work slip today? Orders, collections, renewals, quotes…" className={`${fieldCls} resize-y`} {...invalid("message")} />
              </Field>
            </div>

            {/* Honeypot: hidden from people and assistive tech. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="company_website">Website</label>
              <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className={`text-sm ${status === "error" ? "text-flag" : "text-ink-500"}`}>
                {status === "error" ? (
                  message
                ) : (
                  <>
                    <span className="text-flag" aria-hidden>*</span> Required. We will get back to you within one business day.
                  </>
                )}
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
                    Send message
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
