import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { AccentTitle } from "@/components/site/accent"
import { CtaButton } from "@/components/site/page-hero"
import { GuideSentTo } from "@/components/site/guide-request-form"
import { SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"

/* --------------------------------------------------------------------------
   After a guide request (prototype screen 6): "Check your inbox", the address
   the guide went to (remembered in this browser, never in the URL), then one next step: talk to
   us. Kept out of search results. White, ink and one navy accent.
   -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: { absolute: "Check your inbox | Zoxima" },
  description: "The full Salesforce guide is on its way to your inbox.",
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <>
      <main id="main" className="zx overflow-x-clip">
        <section className="bg-paper">
          <div className="zx-container pb-16 pt-[7.5rem] sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-40">
            <div className="max-w-2xl">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-line bg-white text-navy-600">
                <Mail className="h-6 w-6" aria-hidden />
              </span>
              <h1 className="zx-display mt-8 text-[2.5rem] leading-[1.04] tracking-[-0.04em] text-ink-950 sm:text-[3.25rem] lg:text-[3.5rem]">
                <AccentTitle text="Check your inbox" accent="inbox" />
              </h1>
              <p role="status" className="mt-6 text-lg leading-relaxed text-ink-600">
                <GuideSentTo />
              </p>
            </div>

            <div className="zx-card mt-12 max-w-2xl p-6 sm:p-8 lg:p-10">
              <h2 className="text-[1.5rem] font-semibold leading-snug tracking-[-0.02em] text-ink-950 sm:text-[1.75rem]">
                Want to know which problems cost you most?
              </h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-600">
                Tell us what you’re seeing in your Salesforce. We’ll tell you what we’d fix first.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <CtaButton cta={{ label: "Talk to us", href: "/contact?topic=Salesforce" }} />
                <Link
                  href={SF_GUIDE_ROUTE}
                  className="group inline-flex min-h-11 items-center justify-center gap-1.5 text-[0.9375rem] font-medium text-ink-800 hover:text-navy-600 sm:justify-start"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden />
                  Back to the 10 problems
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
