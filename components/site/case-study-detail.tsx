import type { CSSProperties, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react"
import { CountUp } from "@/components/motion/count-up"
import { Reveal } from "@/components/site/reveal"
import { parseStat } from "@/components/site/sections"
import { caseImage } from "@/lib/site/media"
import { cn } from "@/lib/utils"
import type { CaseStudy, Item } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   Case study page, its own layout rather than the generic inner-page kit.

   Hero: one of three treatments, picked by the study's place in the list,
   so neighbouring case studies never look alike:
     panel  — a dark rounded panel, copy left, photo bleeding off the right
     cinema — headline and summary over a wide photo, facts on glass
     split  — tall photo left, copy right
   Then the story: an "At a glance" card (sticky beside the story on
   desktop, after it on phones), the challenge, what we built, a dark results
   band where there are real figures, and the related + next case studies.
   The nav is transparent at the top, so every hero starts on paper.
   -------------------------------------------------------------------------- */

const rise = (delay: number) => ({ "--zx-rise-delay": `${delay}s`, "--zx-rise-y": "18px", "--zx-rise-dur": "0.8s" }) as CSSProperties

type Variant = "panel" | "cinema" | "split"
const VARIANTS: Variant[] = ["panel", "cinema", "split"]

/** "Product name: what it does" → a titled item; anything else stays a plain line. */
function toItem(line: string): Item {
  const m = line.match(/^([^:.]{3,48}):\s+(.+)$/)
  return m ? { title: m[1], body: m[2].charAt(0).toUpperCase() + m[2].slice(1) } : { body: line }
}

/* ------------------------------------------------------------ small parts */

function Eyebrow({ study, light = false }: { study: CaseStudy; light?: boolean }) {
  return (
    <p className={cn("zx-eyebrow", light && "!text-white/60")}>
      Case study{study.industry ? ` · ${study.industry}` : ""}
    </p>
  )
}

function BackLink({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/case-studies"
      className={cn(
        "group -my-3 inline-flex min-h-11 items-center gap-1.5 py-3 text-sm font-medium transition-colors",
        light ? "text-white/70 hover:text-white" : "text-ink-500 hover:text-ink-950"
      )}
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden />
      All case studies
    </Link>
  )
}

function Chips({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li
          key={t}
          className={cn(
            "rounded-full px-3 py-1 text-[13px] font-medium",
            light ? "border border-white/20 bg-white/10 text-white" : "bg-navy-600/[0.08] text-navy-700"
          )}
        >
          {t}
        </li>
      ))}
    </ul>
  )
}

/** Industry · capabilities · platform, as a row of labelled facts. */
function Facts({ study, light = false }: { study: CaseStudy; light?: boolean }) {
  const facts = [
    study.industry && { label: "Industry", value: study.industry },
    { label: "Capabilities", value: study.capabilities.join(", ") },
    study.platform && { label: "Built on", value: study.platform.split(/,\s*/).slice(0, 3).join(", ") },
  ].filter(Boolean) as { label: string; value: string }[]
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-flow-col sm:auto-cols-fr">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className={cn("text-[12px] font-medium uppercase tracking-[0.08em]", light ? "text-white/50" : "text-ink-500")}>{f.label}</dt>
          <dd className={cn("mt-1 text-[15px] font-medium leading-snug", light ? "text-white" : "text-ink-950")}>{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Title({ study, light = false }: { study: CaseStudy; light?: boolean }) {
  return (
    <h1
      className={cn(
        "zx-rise zx-display mt-4 max-w-[18ch] text-[2.375rem] leading-[1.05] tracking-[-0.04em] sm:text-[3.25rem] lg:text-[3.5rem]",
        light ? "text-white" : "text-ink-950"
      )}
      style={rise(0.06)}
    >
      {study.name}
    </h1>
  )
}

function Summary({ study, light = false }: { study: CaseStudy; light?: boolean }) {
  return (
    <p
      className={cn("zx-rise mt-5 max-w-[38em] text-lg leading-relaxed sm:text-xl", light ? "text-white/75" : "text-ink-600")}
      style={rise(0.14)}
    >
      {study.summary ?? study.who}
    </p>
  )
}

function Photo({ study, className, sizes, priority = true }: { study: CaseStudy; className?: string; sizes: string; priority?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={caseImage(study.slug)} alt="" fill priority={priority} sizes={sizes} className="object-cover" />
    </div>
  )
}

/* ------------------------------------------------------------------ heros */

function PanelHero({ study }: { study: CaseStudy }) {
  return (
    <section className="zx-container pt-24 sm:pt-28 lg:pt-32">
      <div className="zx-rise relative isolate overflow-hidden rounded-[2rem] bg-ink-950 text-white lg:rounded-[2.5rem]" style={rise(0)}>
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-10 lg:p-14">
            <BackLink light />
            <div className="mt-8">
              <Eyebrow study={study} light />
              <Title study={study} light />
              <Summary study={study} light />
              <div className="zx-rise mt-7" style={rise(0.22)}>
                <Chips items={study.results_tags} light />
              </div>
            </div>
          </div>
          <Photo study={study} className="min-h-64 lg:min-h-full" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
        <div className="border-t border-white/10 p-6 sm:px-10 lg:px-14">
          <Facts study={study} light />
        </div>
      </div>
    </section>
  )
}

function CinemaHero({ study }: { study: CaseStudy }) {
  return (
    <section className="zx-backdrop-ribbon relative isolate overflow-hidden">
      <div className="zx-container pb-6 pt-28 sm:pt-32 lg:pt-40">
        <BackLink />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow study={study} />
            <Title study={study} />
          </div>
          <div>
            <Summary study={study} />
            <div className="zx-rise mt-6" style={rise(0.22)}>
              <Chips items={study.results_tags} />
            </div>
          </div>
        </div>
        <div className="zx-settle relative mt-10 lg:mt-14" style={{ "--zx-rise-delay": "0.25s" } as CSSProperties}>
          <Photo
            study={study}
            className="aspect-[4/3] rounded-[1.75rem] sm:aspect-[16/8] lg:aspect-[21/9] lg:rounded-[2.25rem]"
            sizes="(min-width: 1280px) 76rem, 100vw"
          />
          <div className="relative -mt-12 mx-3 rounded-2xl border border-line bg-white p-5 shadow-[0_24px_50px_-30px_rgba(19,23,32,0.45)] sm:mx-8 sm:p-6 lg:absolute lg:inset-x-auto lg:bottom-6 lg:left-6 lg:mx-0 lg:mt-0 lg:w-[min(46rem,70%)]">
            <Facts study={study} />
          </div>
        </div>
      </div>
    </section>
  )
}

function SplitHero({ study }: { study: CaseStudy }) {
  return (
    <section className="zx-backdrop-ribbon relative isolate overflow-hidden">
      <div className="zx-container pb-6 pt-28 sm:pt-32 lg:pt-40">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div className="zx-settle order-2 lg:order-1" style={{ "--zx-rise-delay": "0.2s" } as CSSProperties}>
            <Photo study={study} className="aspect-[4/3] rounded-[1.75rem] lg:aspect-[4/5] lg:rounded-[2.25rem]" sizes="(min-width: 1024px) 34vw, 100vw" />
          </div>
          <div className="order-1 lg:order-2">
            <BackLink />
            <div className="mt-8">
              <Eyebrow study={study} />
              <Title study={study} />
              <Summary study={study} />
              <div className="zx-rise mt-6" style={rise(0.22)}>
                <Chips items={study.results_tags} />
              </div>
              <div className="zx-rise mt-10 border-t border-line pt-6" style={rise(0.3)}>
                <Facts study={study} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ story */

/** In a two-column list, an odd last card takes the whole row. */
const ODD_LAST = "sm:[&:last-child:nth-child(odd)]:col-span-2"

function SectionHead({ children }: { children: ReactNode }) {
  return <h2 className="zx-display-sm text-[1.75rem] text-ink-950 sm:text-[2.125rem]">{children}</h2>
}

function AtAGlance({ study, links }: { study: CaseStudy; links: Item[] }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_20px_44px_-34px_rgba(19,23,32,0.45)] sm:p-7">
      <p className="zx-eyebrow">At a glance</p>
      <dl className="mt-5 space-y-5">
        <div>
          <dt className="text-[13px] font-semibold text-ink-950">Who they are</dt>
          <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-600">{study.who}</dd>
        </div>
        <div>
          <dt className="text-[13px] font-semibold text-ink-950">Capabilities</dt>
          <dd className="mt-2">
            <Chips items={study.capabilities} />
          </dd>
        </div>
        {study.platform && (
          <div>
            <dt className="text-[13px] font-semibold text-ink-950">Platform</dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-1.5">
                {study.platform.split(/,\s*/).map((p) => (
                  <li key={p} className="rounded-lg border border-line bg-paper px-2.5 py-1 text-[13px] text-ink-700">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
      {links.length > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <p className="text-[13px] font-semibold text-ink-950">Related</p>
          <ul className="mt-2 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href!}
                  className="group flex items-center justify-between gap-3 rounded-lg py-1.5 text-[15px] text-ink-700 transition-colors hover:text-navy-600"
                >
                  {l.title}
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-300 transition-colors group-hover:text-navy-600" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Challenge({ study }: { study: CaseStudy }) {
  return (
    <section aria-labelledby="cs-challenge">
      <SectionHead>
        <span id="cs-challenge">
          The <span className="zx-serif text-navy-600">challenge</span>
        </span>
      </SectionHead>
      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
        {study.challenge.map((c, i) => (
          <Reveal as="li" key={c} index={i} className={cn("rounded-2xl border border-line bg-white p-5 sm:p-6", ODD_LAST)}>
            <span aria-hidden className="block h-1 w-8 rounded-full bg-navy-600" />
            <p className="mt-4 text-[15px] leading-relaxed text-ink-800">{c}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

function Built({ study }: { study: CaseStudy }) {
  const items = study.built.map(toItem)
  return (
    <section aria-labelledby="cs-built">
      <SectionHead>
        <span id="cs-built">
          What we <span className="zx-serif text-navy-600">built</span>
        </span>
      </SectionHead>
      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
        {items.map((it, i) => (
          <Reveal
            as="li"
            key={it.body}
            index={i}
            className={cn(
              "flex gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6",
              ODD_LAST,
              // A long titled item gets the full row.
              it.title && it.body.length > 150 && "sm:col-span-2"
            )}
          >
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-600 text-white">
              <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
            </span>
            <div className="min-w-0">
              {it.title && <h3 className="text-[1.0625rem] font-semibold leading-snug text-ink-950">{it.title}</h3>}
              <p className={cn("text-[15px] leading-relaxed", it.title ? "mt-1.5 text-ink-600" : "text-ink-800")}>{it.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

function Results({ results }: { results: string[] }) {
  return (
    <section className="zx-container mt-20 lg:mt-28" aria-labelledby="cs-results">
      {/* Heading left, figures right, so one result makes a compact band
          rather than a big empty panel; two or three sit side by side. */}
      <div className="relative isolate grid gap-8 overflow-hidden rounded-[2rem] bg-ink-950 p-7 text-white sm:p-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:items-center lg:gap-14 lg:rounded-[2.5rem] lg:px-14 lg:py-12">
        <h2 id="cs-results" className="zx-display-sm text-[1.75rem] text-white sm:text-[2.125rem]">
          The <span className="zx-serif text-navy-border">results</span>
        </h2>
        <ul className={cn("grid gap-8 sm:gap-10", results.length > 1 && "sm:grid-cols-2", results.length > 2 && "lg:grid-cols-3")}>
          {results.map((r, i) => {
            const stat = parseStat(r)
            return (
              <Reveal as="li" key={r} index={i} className="border-t border-white/15 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                {stat ? (
                  <>
                    <p className="text-[3rem] font-light leading-none tracking-[-0.04em] tabular-nums sm:text-[4rem]">
                      <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </p>
                    <p className="mt-3 max-w-[28ch] text-[17px] leading-snug text-white/75">{stat.label}</p>
                  </>
                ) : (
                  <p className="max-w-[30ch] text-[1.375rem] font-medium leading-snug text-white sm:text-[1.625rem]">{r}</p>
                )}
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function StoryCard({ study, label }: { study: CaseStudy; label: string }) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-[translate,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-navy-border sm:flex-row"
    >
      <Photo study={study} priority={false} className="h-44 shrink-0 sm:h-auto sm:w-[42%]" sizes="(min-width: 640px) 22rem, 100vw" />
      <div className="flex flex-1 flex-col p-6">
        <p className="zx-eyebrow">{label}</p>
        <h3 className="mt-3 text-[1.25rem] font-semibold leading-snug tracking-tight text-ink-950">{study.name}</h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink-600">{study.who}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-ink-950">
          Read the case study
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------- page */

export function CaseStudyDetail({
  study,
  index,
  related,
  next,
  links,
}: {
  study: CaseStudy
  /** Place in the case study list; picks the hero treatment. */
  index: number
  related?: CaseStudy
  next: CaseStudy
  links: Item[]
}) {
  const variant = VARIANTS[index % VARIANTS.length]
  const results = study.results.filter((r) => !r.includes("["))
  const more = [related && { s: related, label: "Related case study" }, next.slug !== related?.slug && { s: next, label: "Next case study" }].filter(
    Boolean
  ) as { s: CaseStudy; label: string }[]

  return (
    <>
      {variant === "panel" && <PanelHero study={study} />}
      {variant === "cinema" && <CinemaHero study={study} />}
      {variant === "split" && <SplitHero study={study} />}

      {/* The story, with the facts card beside it (desktop) or after it (phones,
          where the hero already carries industry, capabilities and platform). */}
      <div className="zx-container mt-14 grid gap-10 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <aside className="order-2">
          <div className="lg:sticky lg:top-28">
            <AtAGlance study={study} links={links} />
          </div>
        </aside>
        <div className="order-1 space-y-16 lg:space-y-20">
          <Challenge study={study} />
          <Built study={study} />
        </div>
      </div>

      {results.length > 0 && <Results results={results} />}

      {more.length > 0 && (
        <section className="zx-container mt-20 lg:mt-28" aria-label="More case studies">
          <div className="flex items-end justify-between gap-4">
            <SectionHead>
              More <span className="zx-serif text-navy-600">stories</span>
            </SectionHead>
            <Link href="/case-studies" className="hidden text-sm font-semibold text-ink-700 hover:text-ink-950 sm:inline-flex sm:items-center sm:gap-1.5">
              All case studies
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className={cn("mt-7 grid gap-4", more.length > 1 && "lg:grid-cols-2")}>
            {more.map((m) => (
              <StoryCard key={m.s.slug} study={m.s} label={m.label} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
