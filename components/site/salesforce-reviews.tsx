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

/** The review cards: stars, the quote word for word, who and when. */
export function SalesforceReviewCards({ className }: { className?: string }) {
  if (SF_REVIEWS.length === 0) return null
  return (
    <div className={cn("grid gap-3 sm:gap-4", SF_REVIEWS.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2", className)}>
      {SF_REVIEWS.map((r, i) => (
        <figure key={i} className="flex h-full flex-col justify-between rounded-2xl border border-[#DCE3EA] bg-[#F6F8FA] p-4 sm:p-6">
          <div>
            <div className="flex gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-ink-950 text-ink-950" aria-hidden />
              ))}
            </div>
            <blockquote className="mt-3 text-[0.9875rem] leading-relaxed text-ink-800">“{r.quote}”</blockquote>
          </div>
          <figcaption className="mt-4 text-sm text-ink-500">{r.by} · on AppExchange</figcaption>
        </figure>
      ))}
    </div>
  )
}
