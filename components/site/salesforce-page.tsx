import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check, FileText, Search, Star, Target } from "lucide-react"
import { AccentTitle, CtaButton } from "@/components/site/page-hero"
import { Hero as PartnerHero } from "@/components/site/partner-detail"
import { Reveal } from "@/components/site/reveal"
import { BookCallDialog } from "@/components/site/book-call-dialog"
import { BOOK_ANCHOR } from "@/lib/site/content/health-check-booking"
import { SF_LISTING_URL, SalesforceReviewCards } from "@/components/site/salesforce-reviews"
import type { AreaStatus, SalesforcePageContent } from "@/lib/site/content/partner-salesforce"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   /partners/salesforce: the Salesforce partner page and health check offer.

     hero      the partner-page hero, as on /partners/microsoft (chip,
               headline with the serif accent, subline, buttons, proof strip
               on ink), from components/site/partner-detail.tsx
     areas     "What we check": ten areas in a bordered two-column list, each
               with an example scorecard dot, linking to its guide page
     steps     "How it works": three cards
     next      "What happens next": an ink card and a white card
     offer     #sf-offer: two price cards, two notes, rating + booking button;
               every link to #book opens the booking card (book-call-dialog.tsx)
     reviews   the AppExchange reviews (shared with the home page)
     guide     white band pointing to the free guide

   Section order and copy follow Zoxima's clickable prototype (screen 2); the
   styling is the site's own (white, ink and one navy accent, the serif
   accent on headings). The scorecard dots keep red, amber and green: they
   carry meaning, not theme.
   -------------------------------------------------------------------------- */

/** The accent phrase in the site's serif. At the end of the text this is
 *  AccentTitle itself; mid-sentence it is the same span. */
function Accent({ text, accent }: { text: string; accent: string }) {
  if (text.endsWith(accent)) return <AccentTitle text={text} accent={accent} />
  const i = text.indexOf(accent)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <span className="zx-serif text-navy-600">{accent}</span>
      {text.slice(i + accent.length)}
    </>
  )
}

function Section({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={cn("zx-section scroll-mt-28", className)}>
      <div className="zx-container">{children}</div>
    </section>
  )
}

/** Eyebrow and heading, sized as the partner pages' section headings. */
function Head({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <Reveal className="mb-8 lg:mb-12">
      <p className="zx-eyebrow">{eyebrow}</p>
      <h2 className="zx-display mt-4 text-[2rem] leading-[1.1] tracking-[-0.035em] text-ink-950 sm:text-[2.5rem] lg:text-[2.875rem]">
        <Accent text={title} accent={accent} />
      </h2>
    </Reveal>
  )
}

/** The 4.97 AppExchange rating; links to the listing. */
function Rating({ rating }: { rating: SalesforcePageContent["rating"] }) {
  return (
    <a
      href={SF_LISTING_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${rating.value} out of 5, ${rating.label.join(" ")} (opens AppExchange)`}
      className="inline-flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-2.5 transition-colors duration-300 hover:border-navy-border"
    >
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} className="h-3.5 w-3.5 fill-ink-950 text-ink-950" />
        ))}
      </span>
      <b className="zx-display text-[1.625rem] leading-none text-ink-950">{rating.value}</b>
      <small className="whitespace-nowrap text-[11px] leading-[1.3] text-ink-500">
        {rating.label[0]}
        <br />
        {rating.label[1]}
      </small>
    </a>
  )
}

/* Scorecard status colours (meaning, not theme). */
const DOT: Record<AreaStatus, string> = { r: "bg-[#C8452B]", a: "bg-[#E0A030]", g: "bg-[#3F8F5B]" }
const DOT_LABEL: Record<AreaStatus, string> = { r: "red", a: "amber", g: "green" }

const STEP_ICON = { target: Target, search: Search, doc: FileText } as const

/** White card, or the ink card the site uses for emphasis. */
const card = (dark: boolean) =>
  cn("h-full rounded-[28px] p-7 sm:p-10", dark ? "bg-ink-950 text-white" : "border border-line bg-white text-ink-950")

const cardEyebrow = (dark: boolean) => cn("zx-eyebrow", dark && "!text-white/60")

export function SalesforcePage({ data }: { data: SalesforcePageContent }) {
  const { page, hero, rating, areas, steps, next, offer, reviews, guide } = data
  return (
    <>
      <PartnerHero data={{ page, eyebrow: hero.eyebrow, proof: hero.proof }} />

      {/* What we check */}
      <Section id="what-we-check">
        <Head eyebrow={areas.eyebrow} title={areas.title} accent={areas.accent} />
        <Reveal variant="scale">
          <ul className="grid rounded-[28px] border border-line bg-white px-5 py-2 sm:px-8 sm:py-3 md:grid-cols-2 md:gap-x-12">
            {areas.items.map((a) => (
              <li
                key={a.name}
                className="border-b border-ink-950/[0.08] last:border-b-0 md:[&:nth-last-child(2)]:border-b-0"
              >
                <Link href={a.href} className="group flex items-start gap-3.5 py-4">
                  <span className={cn("mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full", DOT[a.status])} aria-hidden />
                  <span className="sr-only">Example score: {DOT_LABEL[a.status]}. </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.0625rem] font-semibold text-ink-950 transition-colors duration-300 group-hover:text-navy-600">
                      {a.name}
                    </span>
                    <span className="mt-0.5 block text-[0.9375rem] leading-relaxed text-ink-600">{a.sub}</span>
                  </span>
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-ink-300 transition-[color,translate] duration-300 group-hover:translate-x-1 group-hover:text-navy-600"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[1.0625rem] leading-relaxed text-ink-700">
            {areas.note} <span className="text-sm text-ink-500">{areas.noteSmall}</span>
          </p>
          <div className="shrink-0 max-sm:[&>a]:w-full">
            <CtaButton cta={areas.cta} variant="secondary" />
          </div>
        </Reveal>
      </Section>

      {/* How it works */}
      <Section id="how-it-works">
        <Head eyebrow={steps.eyebrow} title={steps.title} accent={steps.accent} />
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.items.map((s, i) => {
            const Icon = STEP_ICON[s.icon]
            return (
              <Reveal
                as="li"
                key={s.title}
                index={i}
                className="group flex flex-col rounded-[24px] border border-line bg-white p-6 transition-[background-color,border-color,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-ink-950 hover:bg-ink-950 sm:p-7"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink-950 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-ink-950">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-950 transition-colors duration-300 group-hover:text-white">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600 transition-colors duration-300 group-hover:text-white/75">{s.body}</p>
              </Reveal>
            )
          })}
        </ol>
        <Reveal as="p" className="mt-6 text-[1.0625rem] font-semibold text-ink-950">
          <span className="text-navy-600" aria-hidden>
            ✦
          </span>{" "}
          {steps.footer}
        </Reveal>
      </Section>

      {/* What happens next */}
      <Section id="what-happens-next">
        <Head eyebrow={next.eyebrow} title={next.title} accent={next.accent} />
        <div className="grid gap-4 md:grid-cols-2">
          {next.cards.map((c, i) => {
            const dark = i === 0
            return (
              <Reveal key={c.label} variant="scale" index={i} className={cn(card(dark), "flex flex-col")}>
                <p className={cardEyebrow(dark)}>{c.label}</p>
                <ul className="my-6 flex flex-col gap-3.5">
                  {c.items.map((it) => (
                    <li key={it} className="zx-display-sm flex items-start gap-3 text-xl sm:text-2xl">
                      <Check
                        className={cn("mt-1.5 h-4 w-4 shrink-0 sm:mt-2", dark ? "text-navy-border" : "text-navy-600")}
                        strokeWidth={3}
                        aria-hidden
                      />
                      {it}
                    </li>
                  ))}
                </ul>
                <p
                  className={cn(
                    "mt-auto border-t pt-4 text-[0.9375rem] font-semibold",
                    dark ? "border-white/10 text-white/80" : "border-line text-ink-700"
                  )}
                >
                  {c.footer}
                </p>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* The offer */}
      <Section id="sf-offer">
        <Head eyebrow={offer.eyebrow} title={offer.title} accent={offer.accent} />
        <div className="grid gap-4 md:grid-cols-2">
          {offer.prices.map((p, i) => {
            const dark = i === 0
            return (
              <Reveal key={p.label} variant="scale" index={i} className={card(dark)}>
                <p className={cardEyebrow(dark)}>{p.label}</p>
                <p className="zx-display mb-3 mt-5 text-[3rem] leading-none tracking-[-0.04em] sm:text-[3.75rem]">
                  {p.from && <span className="mr-2 align-baseline text-lg font-medium tracking-normal">{p.from}</span>}
                  {p.price}
                </p>
                <p className={cn("text-[0.9875rem] leading-relaxed", dark ? "text-white/75" : "text-ink-600")}>{p.body}</p>
              </Reveal>
            )
          })}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {offer.notes.map((n, i) => (
            <Reveal key={n.accent} index={i} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <p className="text-[1.0625rem] font-semibold text-ink-950">
                <span className="zx-serif text-[1.125em] text-navy-600">{n.accent}</span>
                {n.rest}
              </p>
              <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-600">{n.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <Rating rating={rating} />
          <div className="max-sm:w-full max-sm:[&>a]:w-full">
            {/* Opens the booking card (BookCallDialog listens for #book). */}
            <CtaButton cta={{ label: offer.book.button, href: `#${BOOK_ANCHOR}` }} />
          </div>
        </Reveal>
        <BookCallDialog title={offer.book.title} body={offer.book.body} />
      </Section>

      {/* Customer reviews (AppExchange, shared with the home page) */}
      <Section id="reviews">
        <Head eyebrow={reviews.eyebrow} title={reviews.title} accent={reviews.accent} />
        <Reveal variant="scale">
          <SalesforceReviewCards tone="site" />
        </Reveal>
        <Reveal className="mt-8">
          <a
            href={SF_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-2 text-[0.9875rem] font-semibold text-ink-950 transition-colors hover:text-navy-600"
          >
            Read all reviews on AppExchange
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </Reveal>
      </Section>

      {/* Guide band */}
      <Section id="free-guide" className="!pt-0">
        <Reveal className="zx-card flex flex-col gap-6 p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="zx-eyebrow">{guide.eyebrow}</p>
            <h3 className="zx-display-sm mt-3 text-[1.5rem] text-ink-950 sm:text-[1.875rem]">{guide.title}</h3>
          </div>
          <div className="shrink-0 max-sm:[&>a]:w-full">
            <CtaButton cta={guide.cta} />
          </div>
        </Reveal>
      </Section>
    </>
  )
}
