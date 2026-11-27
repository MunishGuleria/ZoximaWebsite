"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { SF_GUIDE_EMAIL_KEY } from "@/lib/site/content/salesforce-guide-email"

/* --------------------------------------------------------------------------
   The gate at the end of a Salesforce guide section. The rest of the section
   is never on the website: it arrives as a PDF by email. The server renders
   the "Continue reading" box (children); after mount, if this browser has
   already asked for the guide (localStorage "zx-guide-email", saved by the
   form at /partners/salesforce/guide/get), it shows "The full guide is in
   your inbox" instead. White card, ink text, navy check; no tints.
   -------------------------------------------------------------------------- */

const KEY = SF_GUIDE_EMAIL_KEY

export function GuideGate({ getHref, page, children }: { getHref: string; /** PDF page this section starts on. */ page?: number; children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY)
      if (saved) setEmail(saved)
    } catch {
      /* storage blocked: keep the button */
    }
  }, [])

  if (!email) return <>{children}</>

  return (
    <div role="status" className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span aria-hidden className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-navy-600 text-navy-600">
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink-950 sm:text-[1.375rem]">The full guide is in your inbox</h2>
          <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-700">
            We sent it to <strong className="font-semibold text-ink-950 [overflow-wrap:anywhere]">{email}</strong>.
            {page ? <> This section starts on page {page}.</> : null}
          </p>
          <Link
            href={getHref}
            className="mt-4 inline-block text-[0.9375rem] font-semibold text-navy-600 underline decoration-navy-600/30 underline-offset-4 hover:decoration-navy-600"
          >
            Send it again or use another email
          </Link>
        </div>
      </div>
    </div>
  )
}
