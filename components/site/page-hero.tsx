import type { CSSProperties, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { iconFor } from "@/components/site/icons"
import { BackButton } from "@/components/site/back-button"
import { DriveShowcase } from "@/components/site/drive-showcase"
import { HeroDesks } from "@/components/site/hero-desks"
import { AccentTitle, accentFor } from "@/components/site/accent"
import type { Cta, PageContent, Visual } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   Inner-page hero, in the Salezx inner-page template: a soft blue-white wash
   (gradients only), a large heading whose closing words are set in the serif
   accent, one lede, the page's buttons, and a right-hand card only where it
   shows something real — the product screens (Products, Solutions) or the
   capability chain as a numbered diagram. Everything else is text-only and
   runs wider. Copy rises in from first paint (CSS, no hydration wait).
   -------------------------------------------------------------------------- */

const rise = (delay: number) => ({ "--zx-rise-delay": `${delay}s`, "--zx-rise-y": "18px", "--zx-rise-dur": "0.8s" }) as CSSProperties

export { AccentTitle, accentFor }

export function CtaButton({ cta, variant = "primary" }: { cta: Cta; variant?: "primary" | "secondary" | "light" }) {
  const Icon = cta.external ? ArrowUpRight : ArrowRight
  const base =
    "group inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 text-[0.9375rem] font-semibold transition-[background-color,border-color,color,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98]"
  const className =
    variant === "primary"
      ? `${base} zx-sheen bg-ink-950 text-white`
      : variant === "light"
        ? `${base} zx-glass-btn text-ink-950`
        : `${base} zx-glass-btn text-ink-950`
  const icon = <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
  return cta.external ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
      {cta.label}
      {icon}
    </a>
  ) : (
    <Link href={cta.href} className={className}>
      {cta.label}
      {icon}
    </Link>
  )
}

/* ---------------------------------------------------------------- visuals */

/** Pillars as a numbered diagram read top to bottom, on a frosted card. */
function ChainCard({ items }: { items: { title: string; icon: string }[] }) {
  return (
    <div className="zx-glass p-5 sm:p-7">
      <div className="relative">
        <span aria-hidden className="absolute bottom-6 left-4 top-6 w-px bg-ink-950/10">
          <span className="zx-draw-y absolute inset-0 bg-navy-600" style={{ "--zx-rise-delay": "0.5s" } as CSSProperties} />
        </span>
        <ol className="space-y-4">
          {items.map((it, i) => {
            const Icon = iconFor(it.icon)
            return (
              <li key={it.title} className="zx-rise flex items-center gap-4" style={rise(0.35 + i * 0.18)}>
                <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-950 text-[0.8125rem] font-semibold text-white ring-4 ring-white/80">
                  {i + 1}
                </span>
                <span className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_10px_24px_-18px_rgba(31,42,97,0.4)]">
                  {Icon && <Icon className="h-5 w-5 shrink-0 text-navy-600" />}
                  <span className="text-[1.0625rem] font-semibold text-ink-950">{it.title}</span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function asideFor(visual: Visual, page: PageContent): ReactNode {
  if (visual.kind === "chain") return <ChainCard items={visual.items} />
  // Products: the live salezx.com hero deck, a week of desk cards at work.
  if (page.route === "/products") return <SalezxDeck />
  // Solutions: the home page's "What we drive" cards, one at a time.
  if (page.route === "/solutions") return <DriveShowcase />
  if (visual.kind === "photo") return <PhotoCard src={visual.src} alt={visual.alt} position={visual.position} />
  return null
}

/** The Salezx desk deck from salezx.com. */
function SalezxDeck() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[540px] lg:mx-0 lg:justify-self-end">
      <div className="relative">
        <HeroDesks />
      </div>
    </div>
  )
}

/** The page's photo on a large rounded card. */
function PhotoCard({ src, alt, position }: { src: string; alt: string; position?: string }) {
  return (
    <div className="relative">
      <div className="rounded-[34px] p-2 border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_24px_60px_-34px_rgba(31,42,97,0.35)] [backdrop-filter:blur(20px)_saturate(1.5)] [-webkit-backdrop-filter:blur(20px)_saturate(1.5)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] lg:aspect-[5/4]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 42vw, 92vw"
          className="object-cover"
          style={position ? { objectPosition: position } : undefined}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0d1426]/25 via-transparent to-transparent" />
      </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- hero */

export function PageHero({
  page,
  visual,
  children,
  aside: asideProp,
  eyebrow,
}: {
  page: PageContent
  label?: string
  visual: Visual
  /** Extra content under the buttons (e.g. a case study's tags). */
  children?: ReactNode
  /** Right-hand column, overriding the page's visual (e.g. the contact form). */
  aside?: ReactNode
  /** Optional small line above the H1 (only where a page asks for one). */
  eyebrow?: string
}) {
  const aside = asideProp ?? asideFor(visual, page)
  const back = page.crumbs?.[page.crumbs.length - 1]
  return (
    <section className="zx-backdrop-ribbon relative isolate overflow-hidden">
      <div className="zx-container relative pb-14 pt-[7.5rem] sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-[10.5rem]">
        <div className={aside ? "grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16" : ""}>
          <div>
            {/* Phones only: Back to the previous page (parent section, else
                home, when you arrived from outside the site). */}
            <div className="zx-rise mb-6 lg:hidden" style={rise(0)}>
              <BackButton fallback={back?.href ?? "/"} />
            </div>
            {eyebrow && (
              <p className="zx-rise zx-eyebrow mb-5" style={rise(0.03)}>
                {eyebrow}
              </p>
            )}
            <h1
              className={`zx-rise zx-display text-[2.5rem] leading-[1.04] tracking-[-0.04em] text-ink-950 sm:text-[3.5rem] lg:text-[3.6rem] xl:text-[4rem] ${
                aside ? "max-w-[18ch]" : "max-w-[22ch]"
              }`}
              style={rise(0.06)}
            >
              <AccentTitle text={page.h1} accent={accentFor(page.h1, page.h1Accent)} />
            </h1>
            <p
              className="zx-rise mt-6 max-w-[38em] text-lg leading-relaxed text-ink-600 sm:text-xl"
              style={rise(0.16)}
            >
              {page.sub}
            </p>
            {page.heroCtas && page.heroCtas.length > 0 && (
              <div className="zx-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={rise(0.24)}>
                {page.heroCtas.map((cta, i) => (
                  <CtaButton key={cta.label} cta={cta} variant={i === 0 ? "primary" : "secondary"} />
                ))}
              </div>
            )}
            {children && (
              <div className="zx-rise mt-8" style={rise(0.3)}>
                {children}
              </div>
            )}
          </div>
          {aside && (
            <div className="zx-settle" style={{ "--zx-rise-delay": "0.28s" } as CSSProperties}>
              {aside}
            </div>
          )}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-paper" />
    </section>
  )
}
