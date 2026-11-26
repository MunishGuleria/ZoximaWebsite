import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SF_GUIDE_BAND } from "@/lib/site/content/salesforce-guide"
import type { Cta } from "@/lib/site/types"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   Free guide band: a dark ink strip that points to a guide page.

   Eyebrow, title, subline, a white button and an optional quieter text
   link. Wide: text left, actions right. `compact` keeps it stacked (for a narrow column). Phones:
   always stacked, button full width.

   Used on the home page's Salesforce section and in the problems section of
   /partners/salesforce. Content defaults to SF_GUIDE_BAND.
   Colours: the site's dark ink surface (same as the AppExchange rating card),
   white text, white button with ink text. No navy fill, tints or gradients.
   -------------------------------------------------------------------------- */

export type GuideBandContent = {
  eyebrow: string
  title: string
  body: string
  /** The white button. */
  cta: Cta
  /** Optional quieter text link beside the button. */
  secondary?: Cta
}

export function GuideBand({
  band = SF_GUIDE_BAND,
  compact = false,
  className,
}: {
  band?: GuideBandContent
  compact?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] bg-ink-950 text-white shadow-[0_24px_50px_-28px_rgba(19,23,32,0.6)]",
        compact ? "p-6 sm:p-8" : "p-6 sm:px-9 sm:py-8 lg:px-11 lg:py-9",
        className
      )}
    >
      <div className={cn("flex flex-col gap-6", !compact && "lg:flex-row lg:items-center lg:justify-between lg:gap-10")}>
        <div className={cn(!compact && "max-w-[56rem]")}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">{band.eyebrow}</p>
          <h3
            className={cn(
              "mt-3 font-semibold tracking-[-0.025em] text-white",
              compact ? "text-[1.5rem] sm:text-[1.625rem]" : "text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem]",
              /* After the size classes: tailwind-merge drops a leading-* that
                 comes before a text-* size. */
              "leading-tight"
            )}
          >
            {band.title}
          </h3>
          <p className="mt-2.5 text-[1rem] leading-relaxed text-white/75 sm:text-[1.0625rem]">{band.body}</p>
        </div>
        <div
          className={cn(
            "flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6",
            !compact && "lg:flex-col lg:items-stretch lg:gap-2"
          )}
        >
          <Link
            href={band.cta.href}
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[0.9375rem] font-semibold text-ink-950 transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:bg-ink-50"
          >
            {band.cta.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
          {band.secondary && (
            <Link
              href={band.secondary.href}
              className="inline-flex min-h-11 items-center justify-center text-[0.9375rem] font-semibold text-white/75 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline"
            >
              {band.secondary.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
