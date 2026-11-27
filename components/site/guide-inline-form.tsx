"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { EMAIL_SHAPE, validate, type GuideValues } from "@/components/site/guide-request-form"
import { SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"
import { SF_GUIDE_EMAIL_KEY } from "@/lib/site/content/salesforce-guide-email"

/* --------------------------------------------------------------------------
   "Get the free guide": the inline form in the navy block of each problem
   page (/partners/salesforce/guide/<id>). It posts to /api/guide exactly as
   the full form does (guide-request-form.tsx): the same payload, checks,
   honeypot (zx_check) and remembered email. Last name is not asked here, so
   it goes as "" (optional in the API); the problem, and the page it came
   from, is this problem; ?source= is passed through for the leads sheet.

   On success the email is remembered in this browser (SF_GUIDE_EMAIL_KEY)
   and the visitor goes to the thank-you page, as from the full form. When
   this browser already asked for the guide, the green "It's in your inbox"
   box shows instead of the form.
   -------------------------------------------------------------------------- */

type Status = "idle" | "sending" | "error"

const label = "flex min-w-0 flex-col gap-1.5 text-[13px] font-medium text-[#17212B]"
const input =
  "h-10 w-full min-w-0 rounded-lg border border-[#B8C4D0] bg-white px-3 text-[15px] text-[#17212B] placeholder:text-[#8593A3] focus:border-[#2E7D9A] focus:outline-none focus:ring-2 focus:ring-[#2E7D9A]/25 aria-[invalid=true]:border-[#C0392B]"
const errorCls = "text-[13px] font-normal text-[#C0392B]"

export function GuideInlineForm({ problemId, page }: { problemId: string; /** PDF page this problem starts on. */ page: number }) {
  const router = useRouter()
  const [values, setValues] = useState<GuideValues>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    problem: problemId,
    consent: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [source, setSource] = useState("")

  // Already asked for the guide in this browser? Show the sent box.
  useEffect(() => {
    setSource((new URLSearchParams(window.location.search).get("source") ?? "").slice(0, 100))
    let saved: string | undefined
    try {
      saved = window.localStorage.getItem(SF_GUIDE_EMAIL_KEY)?.trim()
    } catch {
      // Storage blocked: keep the form.
    }
    if (saved && EMAIL_SHAPE.test(saved) && saved.length <= 200) setSentTo(saved)
  }, [])

  const set = (name: keyof GuideValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
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
        body: JSON.stringify({ ...values, email, from: problemId, source, zx_check: honeypot }),
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
      setSentTo(email)
      router.push(`${SF_GUIDE_ROUTE}/thank-you?p=${encodeURIComponent(problemId)}`)
    } catch {
      setMessage("We could not send the guide. Please check your connection and try again.")
      setStatus("error")
    }
  }

  const invalid = (name: string) => (errors[name] ? { "aria-invalid": true, "aria-describedby": `gf-${name}-error` } : {})
  const err = (name: string) =>
    errors[name] ? (
      <span id={`gf-${name}-error`} className={errorCls}>
        {errors[name]}
      </span>
    ) : null

  if (sentTo) {
    return (
      <div role="status" className="flex flex-col gap-2.5 rounded-xl border border-[#B9DEC6] bg-[#EAF5EE] p-[18px] text-[#17212B]">
        <b className="text-lg font-bold text-[#1F6E43]">It&rsquo;s in your inbox</b>
        <p className="m-0 leading-[1.55]">
          We sent the full guide to <b className="[overflow-wrap:anywhere]">{sentTo}</b>. This problem starts on page <b>{page}</b>.
        </p>
        <Link href={`${SF_GUIDE_ROUTE}/get?from=${problemId}`} className="text-sm text-[#1F5E7A] underline underline-offset-2 hover:text-[#123F54]">
          Use another email
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="gf-title"
      className="relative flex flex-col gap-2.5 rounded-xl border border-[#DCE3EA] bg-white p-[18px] text-[#17212B]"
    >
      <b id="gf-title" className="text-lg font-bold text-[#1F3A5F]">
        Get the free guide
      </b>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className={label}>
          First name
          <input name="firstName" autoComplete="given-name" maxLength={80} value={values.firstName} onChange={set("firstName")} className={input} {...invalid("firstName")} />
          {err("firstName")}
        </label>
        <label className={label}>
          Company
          <input name="company" autoComplete="organization" maxLength={160} value={values.company} onChange={set("company")} className={input} {...invalid("company")} />
          {err("company")}
        </label>
      </div>
      <label className={label}>
        Work email
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={200}
          placeholder="you@company.com"
          value={values.email}
          onChange={set("email")}
          className={input}
          {...invalid("email")}
        />
        {err("email")}
      </label>
      <label className={label}>
        Job title
        <input name="jobTitle" autoComplete="organization-title" maxLength={120} value={values.jobTitle} onChange={set("jobTitle")} className={input} {...invalid("jobTitle")} />
        {err("jobTitle")}
      </label>
      <label className="flex cursor-pointer items-start gap-2 text-xs leading-normal text-[#4A5868]">
        <input
          name="consent"
          type="checkbox"
          checked={values.consent}
          onChange={set("consent")}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#1F3A5F]"
          {...invalid("consent")}
        />
        Send me the guide and occasional emails from Zoxima. Unsubscribe anytime.
      </label>
      {err("consent")}

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="gf-zx-check">Leave this field empty</label>
        <input id="gf-zx-check" name="zx_check" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#F2A541] px-[22px] py-[13px] font-semibold text-[#17212B] transition-colors hover:bg-[#E8962A] disabled:cursor-wait disabled:opacity-80"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending
          </>
        ) : (
          "Email me the guide"
        )}
      </button>
      <p aria-live="polite" className={status === "error" ? errorCls : "sr-only"}>
        {status === "error" ? message : ""}
      </p>
    </form>
  )
}
