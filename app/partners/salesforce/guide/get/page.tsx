import type { Metadata } from "next"
import { Check } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { AccentTitle } from "@/components/site/accent"
import { GuideBackLink, GuideRequestForm } from "@/components/site/guide-request-form"
import { SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"

/* --------------------------------------------------------------------------
   Get the full Salesforce guide by email (prototype screen 5): the promise on
   the left, the form on the right (stacked on phones). A form step, so it is
   kept out of search results (noindex, follow) and carries no structured
   data. White, ink and one navy accent.
   -------------------------------------------------------------------------- */

const TITLE = "Get the full Salesforce guide by email | Zoxima"
const DESCRIPTION =
  "Get 10 Salesforce Problems That Cost Mid-Size Companies in your inbox: all 10 problems, why they happen, how to fix them, and how the build works."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SF_GUIDE_ROUTE}/get` },
  robots: { index: false, follow: true },
}

const POINTS = [
  "All 10 sections, 27 pages, PDF",
  "Short-term and long-term fixes for each problem",
  "A checklist your admin or partner can work from",
]

export default function Page() {
  return (
    <>
      <main id="main" className="zx overflow-x-clip">
        <section className="bg-paper">
          <div className="zx-container pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-[8.5rem]">
            <GuideBackLink />
            <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
              <div className="min-w-0">
                <p className="zx-eyebrow">The rest of this guide is sent by email</p>
                <h1 className="zx-display mt-4 max-w-[14ch] text-[2.5rem] leading-[1.04] tracking-[-0.04em] text-ink-950 sm:text-[3.25rem] lg:text-[3.5rem]">
                  <AccentTitle text="Get the full guide in your inbox" accent="inbox" />
                </h1>
                <p className="mt-6 max-w-[34em] text-lg leading-relaxed text-ink-600">
                  Enter your details and we’ll email you the complete guide: all 10 problems, why they happen, how to fix
                  them, and how the build works.
                </p>
                <ul className="mt-8 space-y-3.5 border-t border-line pt-8">
                  {POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[1.0625rem] leading-relaxed text-ink-800">
                      <Check className="mt-[0.3rem] h-4 w-4 shrink-0 text-navy-600" strokeWidth={2.5} aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0">
                <GuideRequestForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
