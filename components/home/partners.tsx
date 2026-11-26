"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Star } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { GuideBand } from "@/components/site/guide-band"

/* --------------------------------------------------------------------------
   Partner work: two homepage sections, Microsoft and Salesforce.

   Not in Zoxima_Website_Content_v2.docx — added at Zoxima's request. Every
   fact comes from an official listing (checked 2026-10-08):
   - Microsoft: the partner directory profile and Zoxima's AppSource
     listings (app names and summaries as published there).
   - Salesforce: Zoxima's AppExchange consulting listing (rating, reviews,
     clouds) and zoxima.com's Salesforce page (SFA / DMS work).
   Deliberately left out until confirmed: Microsoft designation names,
   the Salesforce tier, certified-expert counts and project counts (the
   sources disagree). Customers are never named.
   -------------------------------------------------------------------------- */

const MS_PARTNER_URL =
  "https://appsource.microsoft.com/en-us/marketplace/partner-dir/923bb7ae-3d80-46c7-b4b1-dd832ab44683/overview"
const APPSOURCE = "https://appsource.microsoft.com/en-us/product"
const SF_LISTING_URL = "https://appexchange.salesforce.com/appxConsultingListingDetail?listingId=a0N3A00000FnDXAUA3"

/* Salesforce band (Zoxima's guide-flow prototype, screen 1). */
const SF_STATS = [
  { value: "4.97 / 5", label: "AppExchange rating, 41 ratings", href: SF_LISTING_URL },
  { value: "26", label: "Salesforce certifications held by the team" },
  { value: "90+", label: "Enterprise projects across CRM, automation and AI" },
]

/* Real AppExchange reviews ONLY, copied word for word from the listing (with
   permission where needed). Nothing renders until at least one is added. */
const SF_REVIEWS: { quote: string; by: string }[] = [
  // AppExchange, Project Review, 5 stars, 02/13/2026.
  { quote: "Excellent service provided.", by: "Verified Customer · Feb 13, 2026" },
]

const MS_APPS = [
  {
    name: "Building Material App",
    body: "Visit planning, product catalog, offers and schemes, on-the-spot orders and an AI assistant for field teams.",
    href: `${APPSOURCE}/web-apps/zoximasolutuionspvtltd1654840932298.building_material_app`,
  },
  {
    name: "Field Sales",
    body: "Orders, visit planning, complaints, expenses and dashboards for sales teams in manufacturing and distribution.",
    href: `${APPSOURCE}/dynamics-365/zoximasolutuionspvtltd1654840932298.fieldsales`,
  },
  {
    name: "Sales Team Application",
    body: "One app for trade, non-trade, quality and technical-service teams: orders, complaints, events and visits.",
    href: `${APPSOURCE}/dynamics-365/zoximasolutuionspvtltd1654840932298.sales_team_application`,
  },
  {
    name: "Inspection App",
    body: "Digital inspection forms, scheduling, templates and reports, synced in real time.",
    href: `${APPSOURCE}/web-apps/zoximasolutuionspvtltd1654840932298.inspection_app`,
  },
  {
    name: "Employee Onboarding",
    body: "Paperwork, training and first steps for new hires in one guided flow.",
    href: `${APPSOURCE}/dynamics-365/zoximasolutuionspvtltd1654840932298.employee_onboarding`,
  },
]

const MS_PLATFORMS = [
  "Dynamics 365 Sales",
  "Dynamics 365 Customer Service",
  "Dynamics 365 Field Service",
  "Power Apps",
  "Power Automate",
  "Power BI",
  "Copilot",
  "Azure AI",
  "SharePoint",
  "Teams",
]

const MS_ACCELERATORS = [
  "Field Sales",
  "Field Services",
  "Van Sales",
  "B2B Commerce",
  "Vendor Portal",
  "Customer Onboarding",
  "Employee Helpdesk",
  "Raw Material Planning",
]



function Chip({ label }: { label: string }) {
  return (
    <span className="zx-glass-chip inline-flex items-center rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-950">
      {label}
    </span>
  )
}


/* --------------------------------------------------------------------------
   Phone layouts (below 640px). Same copy, built for a small screen: bigger
   text, a tap-to-open list for the apps, chips that glide on their own
   instead of a wall of tags, and 2-up tiles. Desktop layouts unchanged.
   -------------------------------------------------------------------------- */

/** A row of chips that drifts sideways on its own (no swipe, pauses on touch). */
function ChipDrift({ items, duration = 30 }: { items: string[]; duration?: number }) {
  const loop = [...items, ...items]
  return (
    <div className="zx-marquee zx-fade-x -mx-5 overflow-hidden py-1">
      <ul className="sr-only">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div aria-hidden className="zx-marquee-track gap-2 pr-2" style={{ animationDuration: `${duration}s` }}>
        {loop.map((s, i) => (
          <span
            key={i}
            className="zx-glass-chip inline-flex shrink-0 items-center whitespace-nowrap rounded-lg border border-line bg-white px-3 py-1.5 text-[0.8125rem] font-medium text-ink-700"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

function MicrosoftMobile() {
  const [open, setOpen] = useState(0)
  return (
    <div className="mt-8 space-y-6 sm:hidden">
      <Reveal>
        <p className="mb-3 text-sm font-semibold text-ink-900">Published on Microsoft AppSource</p>
        <ul className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-[0_20px_44px_-30px_rgba(15,27,45,0.4)] backdrop-blur-md">
          {MS_APPS.map((app, i) => {
            const on = open === i
            return (
              <li key={app.name} className="border-b border-line/80 last:border-b-0">
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? -1 : i)}
                  className="flex min-h-14 w-full items-center gap-3 px-4 text-left"
                >
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-navy-600" : "bg-ink-300"}`}
                  />
                  <span className="flex-1 text-base font-semibold text-ink-950">{app.name}</span>
                  <ChevronDown className={`h-4 w-4 text-ink-500 transition-transform duration-300 ${on ? "rotate-180" : ""}`} aria-hidden />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 pl-[3.75rem]">
                      <p className="text-[0.9375rem] leading-relaxed text-ink-600">{app.body}</p>
                      <a
                        href={app.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-950 underline decoration-ink-300 underline-offset-4"
                      >
                        AppSource
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Reveal>

      <Reveal>
        <p className="mb-3 text-sm font-semibold text-ink-900">What we work with</p>
        <ChipDrift items={MS_PLATFORMS} duration={34} />
      </Reveal>

      <Reveal className="rounded-3xl border border-white/80 bg-white/80 shadow-[0_20px_44px_-30px_rgba(15,27,45,0.35)] backdrop-blur-md p-5">
        <p className="text-sm font-semibold text-ink-900">Power Platform and Copilot accelerators</p>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          {MS_ACCELERATORS.map((a) => (
            <li key={a} className="flex items-start gap-2 py-1 text-sm leading-snug text-ink-800">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-600" strokeWidth={3} />
              {a}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}


/* ----------------------------------------------------------- Microsoft */
export function MicrosoftWork() {
  return (
    <section id="microsoft" className="relative isolate overflow-hidden border-t border-line py-16 lg:py-24">
      <div className="zx-container">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink-700">
                <span className="h-2 w-2 rounded-full bg-navy-600" aria-hidden />
                Microsoft Solutions Partner
              </span>
              <h2 className="zx-display-sm mt-4 text-[2.25rem] text-ink-950 sm:text-[2.75rem] lg:text-[3rem]">
                What we build on <span className="zx-serif text-navy-600">Microsoft</span>
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-600 sm:text-[1.0625rem]">
                Dynamics 365, Power Platform and Copilot apps for sales, service and operations, with our own apps
                published on Microsoft AppSource.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 max-sm:w-full sm:items-end">
              <Link
                href="/partners/microsoft"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03] max-sm:w-full"
              >
                Our Microsoft practice
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={MS_PARTNER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-navy-600"
              >
                Microsoft partner profile
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </Reveal>

        <MicrosoftMobile />

        <div className="mt-10 grid gap-5 max-sm:hidden lg:mt-12 lg:grid-cols-12">
          {/* AppSource apps */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="mb-3 text-sm font-semibold text-ink-900">
                Published on Microsoft AppSource
              </p>
            </Reveal>
            <RevealGroup as="ul" className="divide-y divide-line overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_20px_44px_-30px_rgba(15,27,45,0.35)] backdrop-blur-md" stagger={0.06}>
              {MS_APPS.map((app, i) => (
                <RevealItem as="li" key={app.name}>
                  <a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white sm:px-6"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-semibold text-ink-950 transition-colors group-hover:text-navy-600">
                        {app.name}
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-ink-600">{app.body}</span>
                    </span>
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-400 transition-[translate,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-600" />
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* Platforms + accelerators */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Reveal delay={0.08} className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_20px_44px_-30px_rgba(15,27,45,0.3)] backdrop-blur-md">
              <p className="text-sm font-semibold text-ink-900">What we work with</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {MS_PLATFORMS.map((p) => (
                  <Chip key={p} label={p} />
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.14} className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_20px_44px_-30px_rgba(15,27,45,0.3)] backdrop-blur-md">
              <p className="text-sm font-semibold text-ink-900">
                Power Platform and Copilot accelerators
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {MS_ACCELERATORS.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-ink-800">
                    <Check className="h-3.5 w-3.5 shrink-0 text-navy-600" strokeWidth={3} />
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- Salesforce */
export function SalesforceWork() {
  return (
    <section id="salesforce" className="relative isolate overflow-hidden border-t border-line py-16 lg:py-24">
      <div className="zx-container">
        <Reveal className="rounded-[28px] border border-line bg-white p-6 shadow-[0_24px_60px_-44px_rgba(19,23,32,0.35)] sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-600">Salesforce services</p>
              <h2 className="mt-3 text-[1.875rem] font-bold leading-[1.15] tracking-[-0.025em] text-ink-950 sm:text-[2.25rem] lg:text-[2.5rem]">
                Salesforce work our customers rate 4.97 out of 5
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-[1.0625rem]">
                A Salesforce-certified team that fixes reports, data, automation, integrations and adoption for mid-size companies, at fixed prices.
              </p>
            </div>
            <Link
              href="/partners/salesforce"
              className="group inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl bg-ink-950 px-6 py-3 text-[0.9375rem] font-semibold text-white transition-transform duration-300 hover:scale-[1.03] max-sm:w-full lg:self-center"
            >
              See Salesforce services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-3 lg:max-w-4xl">
            {SF_STATS.map((st) => (
              <div key={st.label}>
                <dt className="text-[2rem] font-bold leading-none tracking-tight text-ink-950 sm:text-[2.5rem]">{st.value}</dt>
                <dd className="mt-2 text-sm leading-snug text-ink-600">
                  {st.href ? (
                    <a href={st.href} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-4 transition-colors hover:text-ink-950 hover:decoration-ink-950">
                      {st.label}
                    </a>
                  ) : (
                    st.label
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {SF_REVIEWS.length > 0 && (
            <div className={`mt-8 grid gap-4 ${SF_REVIEWS.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {SF_REVIEWS.map((r) => (
                <figure key={r.quote} className="flex h-full flex-col justify-between rounded-2xl border border-line bg-paper-sunken/60 p-6">
                  <div>
                    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-ink-950 text-ink-950" aria-hidden />
                      ))}
                    </div>
                    <blockquote className="mt-3 text-[0.9875rem] leading-relaxed text-ink-800">“{r.quote}”</blockquote>
                  </div>
                  <figcaption className="mt-4 text-sm text-ink-500">{r.by} · on AppExchange</figcaption>
                </figure>
              ))}
            </div>
          )}
        </Reveal>

        {/* Free guide band, straight under the card (prototype screen 1). */}
        <Reveal className="mt-6 lg:mt-8">
          <GuideBand />
        </Reveal>
      </div>
    </section>
  )
}
