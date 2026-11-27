"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, ChevronDown, Loader2 } from "lucide-react"
import { SF_GUIDE_HUB, SF_GUIDE_PROBLEMS, SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"
import { SF_GUIDE_EMAIL_KEY, WORK_EMAIL_MESSAGE } from "@/lib/site/content/salesforce-guide-email"

/* --------------------------------------------------------------------------
   The Salesforce guide request (/partners/salesforce/guide/get, prototype
   screen 5), posted to /api/guide, which emails the visitor the PDF link and
   alerts the team. ?from=<problem id> preselects the problem and sets the
   Back link; ?source=<channel> is passed through for the leads sheet. On
   success the email is remembered in this browser (SF_GUIDE_EMAIL_KEY, read by
   the section pages) and the visitor goes to the thank-you page.

   The hidden `zx_check` field is the API's honeypot, named so browsers never
   autofill it (as on the contact form). White, ink and navy only.
   -------------------------------------------------------------------------- */

type Status = "idle" | "sending" | "error"
type Values = GuideValues
export type GuideValues = {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  problem: string
  consent: boolean
}

const EMPTY: Values = { firstName: "", lastName: "", email: "", company: "", jobTitle: "", problem: "", consent: false }
export const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldCls =
  "mt-2 block w-full min-w-0 rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-ink-950 placeholder:text-ink-400 transition-[border-color,box-shadow] duration-200 focus:border-navy-600 focus:outline-none focus:ring-4 focus:ring-navy-600/10 aria-[invalid=true]:border-flag"

/** A valid problem id from ?from=, else null. */
function fromParam() {
  const from = new URLSearchParams(window.location.search).get("from")
  return SF_GUIDE_PROBLEMS.some((p) => p.id === from) ? from : null
}

/** Client checks, the same rules as /api/guide. */
export function validate(v: Values) {
  const e: Record<string, string> = {}
  if (!v.firstName.trim()) e.firstName = "Please enter your first name."
  const email = v.email.trim()
  if (!email) e.email = "Please enter your email."
  else if (!EMAIL_SHAPE.test(email)) e.email = WORK_EMAIL_MESSAGE
  if (!v.consent) e.consent = "Please tick the box to receive the guide."
  return e
}

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string
  name: string
  error?: string
  /** Shows the red * (only first name, email and consent are required). */
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0">
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

/** "← Back": to the section the visitor came from (?from=), else the hub. */
export function GuideBackLink() {
  const [href, setHref] = useState<string>(SF_GUIDE_HUB)
  useEffect(() => {
    const from = fromParam()
    if (from) setHref(`${SF_GUIDE_ROUTE}/${from}`)
  }, [])
  return (
    <Link
      href={href}
      className="group -ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-[0.9375rem] font-medium text-ink-700 hover:text-navy-600"
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden />
      Back
    </Link>
  )
}

/** Thank-you line: the address remembered in this browser (never in the URL,
 *  so it stays out of history and analytics), in bold, else "your inbox". */
export function GuideSentTo() {
  const [email, setEmail] = useState<string | null>(null)
  useEffect(() => {
    let e: string | undefined
    try {
      e = localStorage.getItem(SF_GUIDE_EMAIL_KEY)?.trim()
    } catch {
      // Storage blocked: fall back to "your inbox".
    }
    if (e && EMAIL_SHAPE.test(e) && e.length <= 200) setEmail(e)
  }, [])
  return (
    <>
      We’ve emailed the full guide to{" "}
      {email ? <strong className="font-semibold text-ink-950 [overflow-wrap:anywhere]">{email}</strong> : "your inbox"}. It should
      arrive within a few minutes. If you don’t see it, check your spam or promotions folder.
    </>
  )
}

export function GuideRequestForm() {
  const router = useRouter()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const [meta, setMeta] = useState({ from: "", source: "" })

  // ?from=<id> preselects the problem; ?source= is the channel for the leads sheet.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const from = fromParam()
    setMeta({ from: from ?? "", source: (params.get("source") ?? "").slice(0, 100) })
    if (from) setValues((v) => (v.problem ? v : { ...v, problem: from }))
  }, [])

  const set = (name: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors(({ [name]: _, ...rest }) => rest)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus("idle")
      // Focus the first field with a problem.
      const first = Object.keys(found)[0]
      ;(form.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }
    const honeypot = (form.elements.namedItem("zx_check") as HTMLInputElement | null)?.value ?? ""
    const email = values.email.trim()
    setStatus("sending")
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, email, from: meta.from, source: meta.source, zx_check: honeypot }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const issues = (json.issues ?? {}) as Record<string, string[] | undefined>
        const mapped: Record<string, string> = {}
        for (const [k, v] of Object.entries(issues)) if (v?.[0]) mapped[k] = v[0]
        setErrors(mapped)
        setMessage(json.error ?? "We could not send the guide. Please try again, or email info@zoxima.com.")
        setStatus("error")
        return
      }
      try {
        localStorage.setItem(SF_GUIDE_EMAIL_KEY, email)
      } catch {}
      router.push(`${SF_GUIDE_ROUTE}/thank-you?p=${encodeURIComponent(values.problem)}`)
    } catch {
      setMessage("We could not send the guide. Please check your connection and try again.")
      setStatus("error")
    }
  }

  const invalid = (name: string) => (errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {})

  return (
    <form onSubmit={onSubmit} noValidate className="zx-card relative grid gap-5 p-6 sm:grid-cols-2 sm:p-8 lg:p-10">
      <Field label="First name" name="firstName" required error={errors.firstName}>
        <input id="firstName" name="firstName" autoComplete="given-name" maxLength={80} placeholder="Your first name" value={values.firstName} onChange={set("firstName")} className={fieldCls} {...invalid("firstName")} />
      </Field>
      <Field label="Last name" name="lastName" error={errors.lastName}>
        <input id="lastName" name="lastName" autoComplete="family-name" maxLength={80} placeholder="Your last name" value={values.lastName} onChange={set("lastName")} className={fieldCls} {...invalid("lastName")} />
      </Field>
      <div className="min-w-0 sm:col-span-2">
        <Field label="Email" name="email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={200}
            placeholder="you@company.com"
            value={values.email}
            onChange={set("email")}
            className={fieldCls}
            {...invalid("email")}
          />
        </Field>
      </div>
      <Field label="Company" name="company" error={errors.company}>
        <input id="company" name="company" autoComplete="organization" maxLength={160} placeholder="Your company" value={values.company} onChange={set("company")} className={fieldCls} {...invalid("company")} />
      </Field>
      <Field label="Job title" name="jobTitle" error={errors.jobTitle}>
        <input id="jobTitle" name="jobTitle" autoComplete="organization-title" maxLength={120} placeholder="e.g. Head of Sales" value={values.jobTitle} onChange={set("jobTitle")} className={fieldCls} {...invalid("jobTitle")} />
      </Field>
      <div className="min-w-0 sm:col-span-2">
        <Field label="Which problem matters most to you right now?" name="problem" error={errors.problem}>
          <div className="relative">
            <select id="problem" name="problem" value={values.problem} onChange={set("problem")} className={`${fieldCls} appearance-none truncate pr-11`} {...invalid("problem")}>
              <option value="">
                Choose one (optional)
              </option>
              {SF_GUIDE_PROBLEMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.n}. {p.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden />
          </div>
        </Field>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-700">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={set("consent")}
            className="mt-[0.2rem] h-5 w-5 shrink-0 cursor-pointer accent-navy-600"
            {...invalid("consent")}
          />
          <span>
            I agree to receive the guide and occasional emails from Zoxima. Unsubscribe anytime.
            <span className="ml-0.5 text-flag" aria-hidden>
              *
            </span>
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 pl-8 text-sm text-flag">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="zx_check">Leave this field empty</label>
        <input id="zx_check" name="zx_check" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="zx-sheen group inline-flex h-12 w-full select-none items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 text-[0.9375rem] font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-wait disabled:hover:scale-100 disabled:opacity-80"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            <>
              Email me the full guide
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
        <p aria-live="polite" className={`text-sm text-flag ${status === "error" ? "mt-3" : ""}`}>
          {status === "error" ? message : ""}
        </p>
        <p className="mt-3 text-sm text-ink-500">
          We never share your details.{" "}
          <Link href="/privacy" className="font-medium text-navy-600 underline decoration-navy-600/30 underline-offset-4 hover:decoration-navy-600">
            Privacy policy
          </Link>
        </p>
      </div>
    </form>
  )
}
