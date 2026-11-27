import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/site/reveal"
import { SF_LISTING_URL, SalesforceReviewCards } from "@/components/site/salesforce-reviews"
import type { AreaStatus, SalesforcePageContent } from "@/lib/site/content/partner-salesforce"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   /partners/salesforce: the Salesforce health check page.

   Built to Zoxima's clickable prototype (screen 2), in its order:
     hero      cream panel, eyebrow, H1 with a red accent, teal-ruled subline,
               orange CTA (scrolls to the offer) and the AppExchange rating pill
     areas     "What we check": ten areas in a bordered two-column list, each
               with an example scorecard dot, linking to its guide page
     steps     "How it works": three rows with icon tiles
     next      "What happens next": navy and cream cards
     offer     #sf-offer: two price cards, two notes, rating + booking button
     reviews   the AppExchange reviews (shared with the home page)
     guide     cream band pointing to the free guide

   Colours are the prototype's (navy, teal, cream, light blue, red accent,
   orange CTA), at the client's explicit request for this page.
   -------------------------------------------------------------------------- */

const NAVY = "text-[#1F3A5F]"
const EYEBROW = "text-xs font-bold uppercase tracking-[0.08em] text-[#2E7D9A]"
const CTA_BTN =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#F2A541] px-[22px] py-[13px] text-base font-semibold leading-tight text-[#17212B] transition-colors hover:bg-[#E8962A] hover:text-[#17212B]"

/** Text with its accent phrase in the prototype's red. */
function Accent({ text, accent }: { text: string; accent: string }) {
  const i = text.indexOf(accent)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <span className="text-[#C8452B]">{accent}</span>
      {text.slice(i + accent.length)}
    </>
  )
}

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn(EYEBROW, className)}>{children}</p>
}

function H2({ text, accent }: { text: string; accent: string }) {
  return (
    <h2 className={cn("zx-display mb-[22px] mt-2 text-[1.75rem] leading-[1.12] tracking-[-0.025em] sm:text-[2.375rem]", NAVY)}>
      <Accent text={text} accent={accent} />
    </h2>
  )
}

/** The 4.97 AppExchange rating pill; links to the listing. */
function Rating({ rating, onWhite = false }: { rating: SalesforcePageContent["rating"]; onWhite?: boolean }) {
  return (
    <a
      href={SF_LISTING_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${rating.value} out of 5, ${rating.label.join(" ")} (opens AppExchange)`}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg border border-[#DCE3EA] px-3.5 py-2 transition-colors hover:border-[#2E7D9A]",
        onWhite ? "bg-white" : "bg-[#EEF3F8]"
      )}
    >
      <span className="tracking-[2px] text-[#F2A541]" aria-hidden>
        ★★★★★
      </span>
      <b className={cn("zx-display text-[1.625rem] leading-none tracking-[-0.02em]", NAVY)}>{rating.value}</b>
      <small className="whitespace-nowrap text-[11px] leading-[1.3] text-[#4A5868]">
        {rating.label[0]}
        <br />
        {rating.label[1]}
      </small>
    </a>
  )
}

const DOT: Record<AreaStatus, string> = { r: "bg-[#C8452B]", a: "bg-[#E0A030]", g: "bg-[#3F8F5B]" }
const DOT_LABEL: Record<AreaStatus, string> = { r: "red", a: "amber", g: "green" }

/* The prototype's step icons (target, magnifier, document), teal strokes. */
function StepIcon({ icon }: { icon: "target" | "search" | "doc" }) {
  const common = { viewBox: "0 0 24 24", width: 22, height: 22, fill: "none", stroke: "#2E7D9A", strokeWidth: 2, "aria-hidden": true } as const
  if (icon === "target")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="7" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    )
  if (icon === "search")
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-5-5" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M14 2v6h6M9 13h8M9 17h8" />
    </svg>
  )
}

/** Navy (dark) or cream card, as in the prototype's .dcard / .ccard. */
function Card({ dark, className, children }: { dark: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl p-[22px] sm:p-[26px]",
        dark ? "bg-[#1F3A5F] text-white" : "border border-[#DCE3EA] bg-[#EEF3F8] text-[#17212B]",
        className
      )}
    >
      {children}
    </div>
  )
}

const cardEyebrow = (dark: boolean) => (dark ? "text-[#A9D3E3]" : undefined)

function Block({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <Reveal id={id} className={cn("mt-14 scroll-mt-28 sm:mt-[72px]", className)}>
      {children}
    </Reveal>
  )
}

export function SalesforcePage({ data }: { data: SalesforcePageContent }) {
  const { hero, rating, areas, steps, next, offer, reviews, guide } = data
  return (
    <div className="zx-container max-w-[1200px] pb-16 pt-24 text-[#17212B] sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
      {/* Hero */}
      <section className="rounded-[18px] bg-[#EEF3F8] px-[22px] py-8 sm:px-12 sm:py-14">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1
          className={cn(
            "zx-display mb-[18px] mt-3 max-w-[900px] text-[2.25rem] leading-[1.08] tracking-[-0.03em] sm:text-[2.875rem] lg:text-[3.375rem]",
            NAVY
          )}
        >
          <Accent text={hero.h1} accent={hero.accent} />
        </h1>
        <p className="border-l-4 border-[#2E7D9A] pl-4 text-xl leading-snug sm:text-2xl">{hero.sub}</p>
        <div className="mt-[26px] flex flex-wrap items-center gap-4">
          <a href={hero.cta.href} className={CTA_BTN}>
            {hero.cta.label}
          </a>
          <Rating rating={rating} onWhite />
        </div>
      </section>

      {/* What we check */}
      <Block>
        <Eyebrow>{areas.eyebrow}</Eyebrow>
        <H2 text={areas.title} accent={areas.accent} />
        <ul className="grid rounded-[14px] border border-[#DCE3EA] bg-white px-[18px] py-1.5 sm:px-[26px] sm:py-2.5 md:grid-cols-2 md:gap-x-8">
          {areas.items.map((a) => (
            <li
              key={a.name}
              className="border-b border-[#DCE3EA] last:border-b-0 md:[&:nth-last-child(2)]:border-b-0"
            >
              <Link href={a.href} className="group flex items-start gap-3 py-3.5 text-[#17212B]">
                <span className={cn("mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full", DOT[a.status])} aria-hidden />
                <span className="sr-only">Example score: {DOT_LABEL[a.status]}. </span>
                <span className="min-w-0">
                  <b className="block text-[17px] font-semibold transition-colors group-hover:text-[#C8452B]">{a.name}</b>
                  <small className="mt-0.5 block text-[13px] text-[#4A5868]">{a.sub}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3.5 text-[#4A5868]">
          {areas.note} <span className="text-[13px]">{areas.noteSmall}</span>
        </p>
      </Block>

      {/* How it works */}
      <Block>
        <Eyebrow>{steps.eyebrow}</Eyebrow>
        <H2 text={steps.title} accent={steps.accent} />
        <ol className="flex flex-col gap-3">
          {steps.items.map((s) => (
            <li key={s.title} className="flex items-center gap-4 rounded-xl border border-[#DCE3EA] bg-white px-[18px] py-4 sm:gap-[18px] sm:px-[22px] sm:py-5">
              <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[10px] bg-[#E3F1F6]">
                <StepIcon icon={s.icon} />
              </span>
              <div className="min-w-0">
                <b className={cn("zx-display-sm block text-lg font-semibold sm:text-[22px]", NAVY)}>{s.title}</b>
                <small className="mt-0.5 block text-sm text-[#4A5868]">{s.body}</small>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-3.5 font-semibold">
          <span className="text-[#2E7D9A]" aria-hidden>
            ✦
          </span>{" "}
          {steps.footer}
        </p>
      </Block>

      {/* What happens next */}
      <Block>
        <Eyebrow>{next.eyebrow}</Eyebrow>
        <H2 text={next.title} accent={next.accent} />
        <div className="grid gap-3 md:grid-cols-2">
          {next.cards.map((c, i) => {
            const dark = i === 0
            return (
              <Card key={c.label} dark={dark}>
                <Eyebrow className={cardEyebrow(dark)}>{c.label}</Eyebrow>
                <ul className="my-[18px] flex flex-col gap-3.5">
                  {c.items.map((it) => (
                    <li key={it} className="zx-display-sm relative pl-[22px] text-xl sm:text-2xl">
                      <span className="absolute left-0 text-[#2E7D9A]" aria-hidden>
                        –
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
                <p className="border-t border-[rgba(128,128,128,0.35)] pt-3 text-sm font-semibold">{c.footer}</p>
              </Card>
            )
          })}
        </div>
      </Block>

      {/* The offer */}
      <Block id="sf-offer">
        <Eyebrow>{offer.eyebrow}</Eyebrow>
        <H2 text={offer.title} accent={offer.accent} />
        <div className="grid gap-3 md:grid-cols-2">
          {offer.prices.map((p, i) => {
            const dark = i === 0
            return (
              <Card key={p.label} dark={dark}>
                <Eyebrow className={cardEyebrow(dark)}>{p.label}</Eyebrow>
                <p className={cn("zx-display mb-2 mt-3.5 text-[2.75rem] font-bold leading-none tracking-[-0.03em] sm:text-[3.5rem]", !dark && NAVY)}>
                  {p.from && <span className="mr-1.5 align-baseline font-sans text-lg font-medium tracking-normal">{p.from}</span>}
                  {p.price}
                </p>
                <p className="text-sm opacity-85">{p.body}</p>
              </Card>
            )
          })}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {offer.notes.map((n) => (
            <div key={n.accent} className="rounded-[10px] border border-[#DCE3EA] bg-white px-4 py-3.5">
              <b className="block font-semibold">
                <span className="text-[#C8452B]">{n.accent}</span>
                {n.rest}
              </b>
              <small className="text-sm text-[#4A5868]">{n.body}</small>
            </div>
          ))}
        </div>
        <div className="mt-[22px] flex flex-wrap items-center justify-between gap-4 border-t border-[#DCE3EA] pt-[18px]">
          <Rating rating={rating} />
          <Link href={offer.cta.href} className={cn(CTA_BTN, "max-sm:w-full")}>
            {offer.cta.label}
          </Link>
        </div>
      </Block>

      {/* Customer reviews (AppExchange, shared with the home page) */}
      <Block>
        <Eyebrow>{reviews.eyebrow}</Eyebrow>
        <H2 text={reviews.title} accent={reviews.accent} />
        <SalesforceReviewCards />
        <a
          href={SF_LISTING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-5 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-[#1F5E7A] transition-colors hover:text-[#123F54]"
        >
          Read all reviews on AppExchange
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </a>
      </Block>

      {/* Guide band */}
      <Block className="flex flex-wrap items-center justify-between gap-[18px] rounded-[14px] bg-[#EEF3F8] p-[22px] sm:p-7">
        <div className="min-w-0">
          <Eyebrow>{guide.eyebrow}</Eyebrow>
          <h3 className={cn("zx-display-sm mt-1.5 text-[1.375rem] sm:text-2xl", NAVY)}>{guide.title}</h3>
        </div>
        <Link
          href={guide.cta.href}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1F3A5F] px-[22px] py-[13px] text-base font-semibold leading-tight text-white transition-colors hover:bg-[#163050] hover:text-white max-sm:w-full"
        >
          {guide.cta.label}
        </Link>
      </Block>
    </div>
  )
}
