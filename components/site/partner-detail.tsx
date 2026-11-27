import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check, Star } from "lucide-react"
import { GuideBand, type GuideBandContent } from "@/components/site/guide-band"
import { AccentTitle, CtaButton, accentFor } from "@/components/site/page-hero"
import { Reveal } from "@/components/site/reveal"
import type { Cta, PageContent } from "@/lib/site/types"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   Partner practice page (/partners/microsoft, /partners/salesforce).

   One layout, filled from a PartnerPractice data object
   (lib/site/content/partner-*.ts). Sections render only when the data has
   them, in this order:

     hero        eyebrow chip, headline (serif accent), subline, buttons,
                 optional badge row, then the proof strip on ink
     problems    what we fix: heading + intro, a card grid (each card can
                 link, e.g. to a guide section), then an optional ink guide band
     who         split: heading left, paragraphs right
     offer       bento: the first card on ink, the rest white
     work        selected work cards, results as check rows
     healthCheck "Start here" offer card under the problems (prototype colours)
     apps        ready-made apps, rows that invert to ink on hover
     steps       how we work, a numbered rail
     why         why Zoxima, label left and line right

   The closing CTA comes from page.closing (SitePage renders it).
   Colours: white, ink and navy only (site rule).
   -------------------------------------------------------------------------- */

export type PartnerPractice = {
  /** Route, SEO, H1 (+ h1Accent), sub, heroCtas and closing live here. */
  page: PageContent
  /** Small chip above the headline, e.g. "Salesforce Partner". */
  eyebrow: string
  /** The proof strip under the hero. `stars` shows five stars before the text. */
  proof: { text: string; stars?: boolean }[]
  /** Optional row of designation badges (each may link out). */
  badges?: { label: string; href?: string }[]
  who?: { title: string; body: string[] }
  offer?: { title: string; items: { name: string; body?: string; points?: string[] }[] }
  work?: {
    title: string
    items: { title: string; body: string; results?: string[]; caseStudy?: string }[]
    /** e.g. "Read what our customers say on our AppExchange listing". */
    footer?: Cta
  }
  problems?: {
    title: string
    intro?: string
    /** Cards: small label (e.g. "Problem 1"), title, teaser; `href` makes the card a link. */
    items: { label?: string; title: string; body?: string; href?: string }[]
    /** Optional dark guide band under the cards. */
    guide?: GuideBandContent
  }
  healthCheck?: { eyebrow?: string; title: string; body: string; cta?: Cta }
  apps?: { title: string; intro?: string; items: { name: string; body: string; href: string }[]; cta?: Cta }
  steps?: { title: string; items: { title: string; body: string }[] }
  why?: { title: string; items: { title: string; body: string }[] }
}

const rise = (delay: number) => ({ "--zx-rise-delay": `${delay}s`, "--zx-rise-y": "18px", "--zx-rise-dur": "0.8s" }) as CSSProperties
const isExternal = (href: string) => /^https?:\/\//.test(href)

function SmartLink({ cta, className, children }: { cta: Cta; className: string; children: React.ReactNode }) {
  return isExternal(cta.href) ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={cta.href} className={className}>
      {children}
    </Link>
  )
}

function Heading({ title, dark = false, className }: { title: string; dark?: boolean; className?: string }) {
  return (
    <h2
      className={cn(
        "zx-display text-[2rem] leading-[1.1] tracking-[-0.035em] sm:text-[2.5rem] lg:text-[2.875rem]",
        dark ? "text-white [&_.zx-serif]:!text-navy-border" : "text-ink-950",
        className
      )}
    >
      <AccentTitle text={title} accent={accentFor(title)} />
    </h2>
  )
}

function Section({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("zx-section scroll-mt-28", className)}>
      <div className="zx-container">{children}</div>
    </section>
  )
}

/* -------------------------------------------------------------------- hero */

function Hero({ data }: { data: PartnerPractice }) {
  const { page } = data
  return (
    <section className="relative isolate overflow-hidden">
      <div className="zx-container pb-10 pt-[7.5rem] sm:pt-32 lg:pb-14 lg:pt-[10.5rem]">
        <p
          className="zx-rise inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink-700"
          style={rise(0)}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-navy-600" aria-hidden />
          {data.eyebrow}
        </p>
        <h1
          className="zx-rise zx-display mt-6 max-w-[20ch] text-[2.5rem] leading-[1.04] tracking-[-0.04em] text-ink-950 sm:text-[3.5rem] lg:text-[4rem]"
          style={rise(0.06)}
        >
          <AccentTitle text={page.h1} accent={accentFor(page.h1, page.h1Accent)} />
        </h1>
        <p className="zx-rise mt-6 max-w-[42em] text-lg leading-relaxed text-ink-600 sm:text-xl" style={rise(0.14)}>
          {page.sub}
        </p>
        {page.heroCtas && page.heroCtas.length > 0 && (
          <div className="zx-rise mt-8 flex flex-col gap-3 sm:flex-row" style={rise(0.22)}>
            {page.heroCtas.map((cta, i) => (
              <CtaButton key={cta.label} cta={cta} variant={i === 0 ? "primary" : "secondary"} />
            ))}
          </div>
        )}
        {data.badges && data.badges.length > 0 && (
          <ul className="zx-rise mt-8 flex flex-wrap gap-2" style={rise(0.28)} aria-label="Microsoft designations">
            {data.badges.map((b) => {
              const inner = (
                <>
                  <Check className="h-3.5 w-3.5 text-navy-600" strokeWidth={3} aria-hidden />
                  {b.label}
                </>
              )
              const cls =
                "inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink-900 transition-[border-color,color] duration-300 hover:border-navy-600 hover:text-navy-600"
              return (
                <li key={b.label}>
                  {b.href ? (
                    <a href={b.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <span className={cls}>{inner}</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {/* Proof strip on ink. */}
        <div className="zx-settle mt-10 lg:mt-14" style={{ "--zx-rise-delay": "0.3s" } as CSSProperties}>
          <ul
            className={cn(
              "grid overflow-hidden rounded-[1.75rem] bg-ink-950 text-white sm:grid-cols-2",
              data.proof.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            )}
          >
            {data.proof.map((p, i) => (
              <li
                key={p.text}
                className={cn(
                  "flex flex-col justify-center gap-2 border-white/10 px-6 py-6 sm:px-7",
                  i > 0 && "border-t sm:border-t-0",
                  i % 2 === 1 && "sm:border-l",
                  i >= 2 && "sm:border-t lg:border-t-0",
                  i > 0 && "lg:border-l"
                )}
              >
                {p.stars && (
                  <span className="flex gap-0.5" aria-label="Five stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-white text-white" aria-hidden />
                    ))}
                  </span>
                )}
                <span className="text-[1rem] font-medium leading-snug text-white/90">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- sections */

function Who({ who }: { who: NonNullable<PartnerPractice["who"]> }) {
  return (
    <Section id="who">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <Heading title={who.title} />
        </Reveal>
        <div className="space-y-5">
          {who.body.map((p, i) => (
            <Reveal as="p" key={p} index={i} className="text-[1.0625rem] leading-relaxed text-ink-700 sm:text-lg">
              {p}
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Offer({ offer }: { offer: NonNullable<PartnerPractice["offer"]> }) {
  const n = offer.items.length
  return (
    <Section id="what-we-do">
      <Reveal>
        <Heading title={offer.title} className="mb-8 lg:mb-12" />
      </Reveal>
      {/* Six columns on wide screens, cards two wide: a short last row
          stretches (two cards three wide each, or one card full width), so
          no row ends with an empty slot. Two columns below that. */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {offer.items.map((it, i) => {
          const dark = i === 0
          const lastRow = n % 3
          const span = cn(
            "lg:col-span-2",
            lastRow === 2 && i >= n - 2 && "lg:col-span-3",
            lastRow === 1 && i === n - 1 && "lg:col-span-6",
            n % 2 === 1 && i === n - 1 && "md:col-span-2"
          )
          return (
            <Reveal
              key={it.name}
              variant="scale"
              index={i}
              className={cn(
                "group flex h-full flex-col rounded-[28px] p-7 transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_28px_56px_-30px_rgba(31,42,97,0.4)] sm:p-8",
                dark ? "bg-ink-950 text-white" : "border border-line bg-white hover:border-navy-border",
                span
              )}
            >
              <h3 className={cn("text-xl font-semibold tracking-[-0.02em]", dark ? "text-white" : "text-ink-950")}>{it.name}</h3>
              {it.body && <p className={cn("mt-3 leading-relaxed", dark ? "text-white/75" : "text-ink-600")}>{it.body}</p>}
              {it.points && (
                <ul className="mt-4 space-y-2.5">
                  {it.points.map((pt) => (
                    <li key={pt} className={cn("flex gap-3 text-[0.9875rem] leading-relaxed", dark ? "text-white/80" : "text-ink-700")}>
                      <Check className={cn("mt-1 h-4 w-4 shrink-0", dark ? "text-navy-border" : "text-navy-600")} strokeWidth={3} aria-hidden />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}

function Work({ work }: { work: NonNullable<PartnerPractice["work"]> }) {
  return (
    <Section id="selected-work">
      <Reveal>
        <Heading title={work.title} className="mb-8 lg:mb-12" />
      </Reveal>
      <div className={cn("grid gap-4", work.items.length > 1 && "md:grid-cols-2", work.items.length > 4 && "lg:grid-cols-3")}>
        {work.items.map((w, i) => {
          const body = (
            <>
              <h3 className="text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-ink-950">{w.title}</h3>
              <p className="mt-3 text-[0.9875rem] leading-relaxed text-ink-600">{w.body}</p>
              {w.results && w.results.length > 0 && (
                <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                  {w.results.map((r) => (
                    <li key={r} className="flex gap-3 text-[0.9375rem] font-medium leading-snug text-ink-900">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-600 text-white">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              )}
              {w.caseStudy && (
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-ink-950 transition-colors group-hover:text-navy-600">
                  Read the case study
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              )}
            </>
          )
          const cls =
            "group flex h-full flex-col rounded-[28px] border border-line bg-white p-7 transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-navy-border hover:shadow-[0_28px_56px_-30px_rgba(31,42,97,0.4)] sm:p-8"
          return (
            <Reveal key={w.title} variant="scale" index={i}>
              {w.caseStudy ? (
                <Link href={`/case-studies/${w.caseStudy}`} className={cls}>
                  {body}
                </Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </Reveal>
          )
        })}
      </div>
      {work.footer && (
        <Reveal className="mt-8">
          <SmartLink
            cta={work.footer}
            className="group inline-flex min-h-11 items-center gap-2 text-[0.9875rem] font-semibold text-ink-950 transition-colors hover:text-navy-600"
          >
            {work.footer.label}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </SmartLink>
        </Reveal>
      )}
    </Section>
  )
}

function Problems({ problems }: { problems: NonNullable<PartnerPractice["problems"]> }) {
  const cardCls =
    "group flex h-full flex-col rounded-[24px] border border-line bg-white p-6 transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-7"
  const linkCls = "hover:-translate-y-1 hover:border-ink-950 hover:shadow-[0_28px_56px_-30px_rgba(19,23,32,0.45)]"
  return (
    <Section id="problems">
      <Reveal>
        <Heading title={problems.title} />
      </Reveal>
      {problems.intro && (
        <Reveal as="p" index={1} className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-600 sm:text-lg">
          {problems.intro}
        </Reveal>
      )}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
        {problems.items.map((p, i) => {
          const body = (
            <>
              {p.label && (
                <span className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy-600">
                  {p.label}
                  {p.href && (
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-ink-300 transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:text-ink-950"
                      aria-hidden
                    />
                  )}
                </span>
              )}
              <h3 className="mt-3 text-[1.125rem] font-semibold leading-snug tracking-[-0.015em] text-ink-950">{p.title}</h3>
              {p.body && <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{p.body}</p>}
            </>
          )
          return (
            <Reveal as="li" key={p.title} variant="scale" index={i % 3}>
              {p.href ? (
                <Link href={p.href} className={cn(cardCls, linkCls)}>
                  {body}
                </Link>
              ) : (
                <div className={cardCls}>{body}</div>
              )}
            </Reveal>
          )
        })}
      </ul>
      {problems.guide && (
        <Reveal className="mt-8 lg:mt-10">
          <GuideBand band={problems.guide} />
        </Reveal>
      )}
    </Section>
  )
}

function HealthCheck({ hc }: { hc: NonNullable<PartnerPractice["healthCheck"]> }) {
  // As in Zoxima's guide-flow prototype (screen 2): a white "Start here" card,
  // navy title, orange button. Prototype colours, at the client's request.
  return (
    <Section id="health-check" className="!pt-0">
      <Reveal className="flex flex-col gap-6 rounded-2xl border border-[#DCE3EA] bg-white p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-[44rem]">
          {hc.eyebrow && (
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-[#2E7D9A]">{hc.eyebrow}</p>
          )}
          <h2 className="mt-2 text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] text-[#1F3A5F] sm:text-[1.875rem]">
            {hc.title}
          </h2>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-[#4A5868]">{hc.body}</p>
        </div>
        {hc.cta && (
          <SmartLink
            cta={hc.cta}
            className="inline-flex min-h-12 shrink-0 items-center justify-center self-start rounded-lg bg-[#F2A541] px-6 text-[1rem] font-semibold text-[#17212B] transition-colors hover:bg-[#E8962A] lg:self-center"
          >
            {hc.cta.label}
          </SmartLink>
        )}
      </Reveal>
    </Section>
  )
}

function Apps({ apps }: { apps: NonNullable<PartnerPractice["apps"]> }) {
  return (
    <Section id="apps">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <Reveal>
            <Heading title={apps.title} />
          </Reveal>
          {apps.intro && (
            <Reveal as="p" index={1} className="mt-5 max-w-md text-lg leading-relaxed text-ink-500">
              {apps.intro}
            </Reveal>
          )}
          {apps.cta && (
            <Reveal index={2} className="mt-6">
              <SmartLink
                cta={apps.cta}
                className="group inline-flex min-h-11 items-center gap-2 text-[0.9875rem] font-semibold text-navy-600"
              >
                {apps.cta.label}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </SmartLink>
            </Reveal>
          )}
        </div>
        <ul className="grid gap-3">
          {apps.items.map((a, i) => (
            <Reveal as="li" key={a.name} index={i}>
              <a
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 rounded-2xl border border-line bg-white p-5 transition-[background-color,border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-ink-950 hover:bg-ink-950 sm:p-6"
              >
                <span>
                  <span className="block text-[1.0625rem] font-semibold text-ink-950 transition-colors duration-300 group-hover:text-white">{a.name}</span>
                  <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink-600 transition-colors duration-300 group-hover:text-white/70">{a.body}</span>
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition-[background-color,border-color] duration-300 group-hover:border-white group-hover:bg-white">
                  <ArrowUpRight className="h-4 w-4 text-ink-700 transition-colors duration-300 group-hover:text-ink-950" aria-hidden />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function Steps({ steps }: { steps: NonNullable<PartnerPractice["steps"]> }) {
  return (
    <Section id="how-we-work">
      <Reveal>
        <Heading title={steps.title} className="mb-8 lg:mb-12" />
      </Reveal>
      <ol className={cn("grid gap-4 sm:grid-cols-2", steps.items.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4")}>
        {steps.items.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            index={i}
            className="group relative flex flex-col rounded-[24px] border border-line bg-white p-6 transition-[background-color,border-color,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-ink-950 hover:bg-ink-950"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-950 text-sm font-semibold tabular-nums text-white transition-colors duration-300 group-hover:bg-white group-hover:text-ink-950">
              {i + 1}
            </span>
            <h3 className="mt-5 text-lg font-semibold text-ink-950 transition-colors duration-300 group-hover:text-white">{s.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600 transition-colors duration-300 group-hover:text-white/75">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}

function Why({ why }: { why: NonNullable<PartnerPractice["why"]> }) {
  return (
    <Section id="why-zoxima">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-[30vh] lg:self-start">
          <Heading title={why.title} />
        </Reveal>
        <dl className="border-t border-ink-950/[0.08]">
          {why.items.map((w, i) => (
            <Reveal
              key={w.title}
              index={i}
              className="group grid gap-1 border-b border-ink-950/[0.08] py-5 transition-[padding] duration-300 hover:pl-2 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.6fr)] sm:gap-8"
            >
              <dt className="text-[1.0625rem] font-semibold text-ink-950 transition-colors duration-300 group-hover:text-navy-600">{w.title}</dt>
              <dd className="text-[1.0rem] leading-relaxed text-ink-700">{w.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------------- page */

export function PartnerDetail({ data }: { data: PartnerPractice }) {
  return (
    <>
      <Hero data={data} />
      {data.problems && <Problems problems={data.problems} />}
      {data.healthCheck && <HealthCheck hc={data.healthCheck} />}
      {data.who && <Who who={data.who} />}
      {data.offer && <Offer offer={data.offer} />}
      {data.work && <Work work={data.work} />}
      {data.apps && <Apps apps={data.apps} />}
      {data.steps && <Steps steps={data.steps} />}
      {data.why && <Why why={data.why} />}
    </>
  )
}
