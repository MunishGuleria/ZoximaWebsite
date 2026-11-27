import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   Zoxima's AppExchange reviews, shared by the home page's Salesforce band
   (components/home/partners.tsx) and /partners/salesforce.

   Real AppExchange reviews ONLY, copied word for word from the listing (with
   permission where needed). Nothing renders until at least one is added.
   -------------------------------------------------------------------------- */

export const SF_LISTING_URL = "https://appexchange.salesforce.com/appxConsultingListingDetail?listingId=a0N3A00000FnDXAUA3"

export const SF_REVIEWS: { quote: string; by: string }[] = [
  // AppExchange, Project Review, 5 stars, 02/13/2026.
  { quote: "Excellent service provided.", by: "Verified Customer · Feb 13, 2026" },
  // AppExchange, Project Review, 5 stars, 07/13/2021.
  { quote: "working with zoxima is really a great experience", by: "Verified Customer · Jul 13, 2021" },
]

/** The review cards: stars, the quote word for word, who and when.
 *  `tone="site"` (the Salesforce page): white cards on the site's hairline
 *  border; the default keeps the home page band's look. */
export function SalesforceReviewCards({ className, tone = "band" }: { className?: string; tone?: "band" | "site" }) {
  if (SF_REVIEWS.length === 0) return null
  const site = tone === "site"
  return (
    <div className={cn("grid gap-3 sm:gap-4", SF_REVIEWS.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2", className)}>
      {SF_REVIEWS.map((r, i) => (
        <figure
          key={i}
          className={cn(
            "flex h-full flex-col justify-between",
            site ? "rounded-[28px] border border-line bg-white p-7 sm:p-8" : "rounded-2xl border border-[#DCE3EA] bg-[#F6F8FA] p-4 sm:p-6"
          )}
        >
          <div>
            <div className="flex gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-ink-950 text-ink-950" aria-hidden />
              ))}
            </div>
            <blockquote className={cn("mt-3 leading-relaxed text-ink-800", site ? "text-[1.0625rem]" : "text-[0.9875rem]")}>“{r.quote}”</blockquote>
          </div>
          <figcaption className="mt-4 text-sm text-ink-500">{r.by} · on AppExchange</figcaption>
        </figure>
      ))}
    </div>
  )
}
