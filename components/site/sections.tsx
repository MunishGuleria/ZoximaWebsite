import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"
import { CountUp } from "@/components/motion/count-up"
import { FaqItem } from "@/components/home/faq-item"
import { iconFor } from "@/components/site/icons"
import { AccentTitle, accentFor } from "@/components/site/accent"
import { Reveal } from "@/components/site/reveal"
import { sectionIds } from "@/lib/site/anchors"
import { CASE_STUDIES } from "@/lib/site/content/case-studies"
import { caseImage, photoForHref } from "@/lib/site/media"
import type { Cta, Item, Section } from "@/lib/site/types"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   Section renderer for every content page, in the Salezx inner-page
   template. Each kind of doc section maps to one of its patterns:

     list · checks    → heading left (centred against the points), ruled
                        check rows right
     list · rows      → the same split: a ledger (label · line) when items
                        have titles, otherwise ruled dot rows
     two short lists  → a pair: one white panel, one dark ink panel
     list · cards     → a bento: the lead card dark ink, then white cards
     list · numbered  → a numbered rail, read top to bottom, on a dark card
     text             → split heading + prose; runs of short notes → cards
     links            → white rows that turn ink on hover
     cases            → white case cards (name, sector, line, link)
     proof            → one white strip of figures that count up
     stack            → chips (one group) or a ledger (several)
     faq              → split heading + accordion
     salezx           → the page's one dark band

   Colour: white, ink and one navy accent (no tints). Interaction: cards
   lift and their border turns navy; rows highlight; link rows invert.
   Plain sections follow each other with one gap, not two (.zx-plain).
   Motion: reveals that replay from the side you scroll in from.
   -------------------------------------------------------------------------- */

const words = (s: string) => s.split(/\s+/).length
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())

/* ------------------------------------------------------------- headings */

export function SectionTitle({
  title,
  size = "lg",
  dark = false,
  className,
  as: Tag = "h2",
}: {
  title: string
  size?: "lg" | "md"
  dark?: boolean
  className?: string
  as?: "h2" | "h3"
}) {
  return (
    <Tag
      className={cn(
        "zx-display",
        size === "lg"
          ? "text-[2rem] leading-[1.1] tracking-[-0.035em] sm:text-[2.75rem] lg:text-[3.25rem]"
          : "text-2xl leading-[1.15] tracking-[-0.03em] sm:text-3xl lg:text-[2.25rem]",
        dark ? "text-white [&_.zx-serif]:!text-[#c2caea]" : "text-ink-950",
        className
      )}
    >
      <AccentTitle text={title} accent={accentFor(title)} />
    </Tag>
  )
}

/** Plain paper section; consecutive ones share one gap. */
function Plain({ id, className, children }: { id?: string | null; className?: string; children: React.ReactNode }) {
  return (
    <section id={id ?? undefined} className={cn("zx-section zx-plain scroll-mt-28", className)}>
      <div className="zx-container">{children}</div>
    </section>
  )
}

/** Heading on the left, centred against the content (or held a third of the
 *  way down the screen when the content runs long); content on the right. */
function Split({
  id,
  title,
  intro,
  long = false,
  children,
}: {
  id?: string | null
  title: string
  intro?: string
  long?: boolean
  children: React.ReactNode
}) {
  return (
    <Plain id={id}>
      <div className={cn("grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16", !long && "lg:items-center")}>
        <div className={cn(long && "lg:sticky lg:top-[30vh] lg:self-start")}>
          <Reveal>
            <SectionTitle title={title} />
          </Reveal>
          {intro && (
            <Reveal as="p" index={1} className="mt-5 max-w-md text-lg leading-relaxed text-ink-500">
              {intro}
            </Reveal>
          )}
        </div>
        <div>{children}</div>
      </div>
    </Plain>
  )
}

/** Heading above, content full width. */
function Stacked({
  id,
  title,
  intro,
  children,
}: {
  id?: string | null
  title?: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <Plain id={id}>
      {title && (
        <div className="mb-8 lg:mb-12">
          <Reveal>
            <SectionTitle title={title} className="max-w-3xl" />
          </Reveal>
          {intro && (
            <Reveal as="p" index={1} className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">
              {intro}
            </Reveal>
          )}
        </div>
      )}
      {children}
    </Plain>
  )
}

/* ---------------------------------------------------------------- lists */

function ItemText({ item, className, dark = false }: { item: Item; className?: string; dark?: boolean }) {
  if (isEmail(item.body))
    return (
      <a href={`mailto:${item.body.trim()}`} className={cn("font-semibold text-navy-600 underline decoration-navy-600/30 underline-offset-4 hover:decoration-navy-600", className)}>
        {item.body}
      </a>
    )
  return (
    <span className={className}>
      {item.title && <span className={cn("font-semibold", dark ? "text-white" : "text-ink-950")}>{item.title}. </span>}
      {item.body}
    </span>
  )
}

/** Ruled rows with a round check; the check fills navy as you point at a row. */
export function CheckRows({
  items,
  ruledTop = true,
  className,
  dark = false,
}: {
  items: Item[]
  ruledTop?: boolean
  className?: string
  dark?: boolean
}) {
  // A long list of short points reads better in two columns.
  const twoCol = items.length >= 7 && items.every((it) => words(`${it.title ?? ""} ${it.body}`) <= 8)
  return (
    <ul
      className={cn(
        ruledTop && (dark ? "border-t border-white/10" : "border-t border-ink-950/[0.08]"),
        twoCol && "sm:grid sm:grid-cols-2 sm:gap-x-10 [&>li]:sm:!border-b",
        className
      )}
    >
      {items.map((it, i) => (
        <Reveal
          as="li"
          key={`${i}-${it.body}`}
          index={i}
          className={cn(
            "group flex gap-3.5 border-b py-4 text-[1.03rem] leading-relaxed transition-colors duration-300 last:border-b-0",
            dark ? "border-white/10 text-white/75 hover:text-white" : "border-ink-950/[0.08] text-ink-800 hover:text-ink-950"
          )}
        >
          <span
            className={cn(
              "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors duration-300",
              dark ? "bg-white/10 group-hover:bg-white" : "bg-navy-600/10 group-hover:bg-navy-600"
            )}
          >
            <Check
              className={cn(
                "h-3 w-3 transition-colors duration-300",
                dark ? "text-white group-hover:text-ink-950" : "text-navy-600 group-hover:text-white"
              )}
              strokeWidth={3}
              aria-hidden
            />
          </span>
          <ItemText item={it} dark={dark} />
        </Reveal>
      ))}
    </ul>
  )
}

/** Ruled rows with a dot (red for where money slips, navy otherwise); the
 *  dot grows into a short bar as you point at a row. */
function DotRows({ items, warn, ruledTop = true, dark = false }: { items: Item[]; warn: boolean; ruledTop?: boolean; dark?: boolean }) {
  return (
    <ul className={cn(ruledTop && (dark ? "border-t border-white/10" : "border-t border-ink-950/[0.08]"))}>
      {items.map((it, i) => (
        <Reveal
          as="li"
          key={`${i}-${it.body}`}
          index={i}
          className={cn(
            "group flex gap-3.5 border-b py-4 text-[1.03rem] leading-relaxed transition-colors duration-300 last:border-b-0",
            dark ? "border-white/10 text-white/75 hover:text-white" : "border-ink-950/[0.08] text-ink-800 hover:text-ink-950"
          )}
        >
          <span
            className={cn(
              "mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full transition-[width] duration-300 group-hover:w-4",
              warn ? "bg-flag" : dark ? "bg-white" : "bg-navy-600"
            )}
            aria-hidden
          />
          <ItemText item={it} dark={dark} />
        </Reveal>
      ))}
    </ul>
  )
}

/** Label on the left, line on the right (stacks on phones). */
function Ledger({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="border-t border-ink-950/[0.08]">
      {rows.map((r, i) => (
        <Reveal
          key={r.label}
          index={i}
          className="group grid gap-1 border-b border-ink-950/[0.08] py-5 transition-[padding] duration-300 hover:pl-2 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)] sm:gap-8"
        >
          <dt className="text-sm font-medium text-ink-500 transition-colors duration-300 group-hover:text-navy-600 sm:pt-1">{r.label}</dt>
          <dd className="text-[1.0625rem] leading-relaxed text-ink-900">{r.value}</dd>
        </Reveal>
      ))}
    </dl>
  )
}

const warns = (title: string) => /slip|challenge/i.test(title)

/* ------------------------------------------------------------------ pair */

type ListSection = Extract<Section, { kind: "list" }>

/** Two short lists side by side: the first on white, the second on ink. */
function Pair({ id, a, b }: { id?: string | null; a: ListSection; b: ListSection }) {
  return (
    <Plain id={id}>
      <div className="grid gap-4 md:grid-cols-2">
        {[a, b].map((s, i) => {
          const dark = i === 1
          return (
            <Reveal
              key={s.title}
              variant="scale"
              index={i}
              className={cn("rounded-[28px] p-7 sm:p-10", dark ? "bg-ink-950 text-white" : "border border-line bg-white")}
            >
              <SectionTitle title={s.title} size="md" dark={dark} />
              {s.intro && <p className={cn("mt-3 text-base leading-relaxed", dark ? "text-white/70" : "text-ink-600")}>{s.intro}</p>}
              {s.style === "checks" ? (
                <CheckRows items={s.items} ruledTop={false} className="mt-4" dark={dark} />
              ) : (
                <div className="mt-4">
                  <DotRows items={s.items} warn={warns(s.title)} ruledTop={false} dark={dark} />
                </div>
              )}
            </Reveal>
          )
        })}
      </div>
    </Plain>
  )
}

/* ----------------------------------------------------------------- bento */

function CardInner({ item, big, dark = false }: { item: Item; big: boolean; dark?: boolean }) {
  const Icon = iconFor(item.icon)
  const photo = photoForHref(item.href)
  return (
    <>
      {photo && (
        <div className="relative -mx-7 -mt-7 mb-6 h-44 overflow-hidden rounded-t-[28px] sm:-mx-8 sm:-mt-8 sm:h-52">
          <Image
            src={photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 26rem, (min-width: 768px) 45vw, 92vw"
            className="object-cover transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </div>
      )}
      {item.image && (
        <div className="relative -mx-2 -mt-2 mb-5 h-36 sm:h-40">
          <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 22rem, 90vw" className="zx-feather object-contain mix-blend-multiply" />
        </div>
      )}
      {Icon && !item.image && !photo && (
        <span
          className={cn(
            "mb-6 grid h-11 w-11 place-items-center rounded-2xl transition-colors duration-300",
            dark
              ? "bg-white/10 text-white"
              : "border border-line bg-white text-navy-600 group-hover:border-navy-600 group-hover:bg-navy-600 group-hover:text-white"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      )}
      {item.title && (
        <h3 className={cn("font-semibold leading-snug tracking-[-0.02em]", dark ? "text-white" : "text-ink-950", big ? "text-2xl" : "text-xl")}>{item.title}</h3>
      )}
      <p className={cn("leading-relaxed", dark ? "text-white/70" : "text-ink-600", item.title ? "mt-2" : "", big ? "text-[1.0625rem]" : "text-[0.9875rem]")}>{item.body}</p>
      {item.href && (
        <span
          className={cn(
            "mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold transition-colors",
            dark ? "text-white" : "text-ink-950 group-hover:text-navy-600"
          )}
        >
          {item.linkLabel ?? "Learn more"}
          {item.external ? (
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          )}
        </span>
      )}
    </>
  )
}

function CardShell({ item, className, children }: { item: Item; className: string; children: React.ReactNode }) {
  const cls = cn("group relative flex h-full flex-col", className)
  if (!item.href) return <div className={cls}>{children}</div>
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={item.href} className={cls}>
      {children}
    </Link>
  )
}

/** Up to three lead cards (two when there are more than three), the first
 *  on ink and the rest white, then white cards three to a row; a lone last
 *  card runs full width. Photo cards stay white (the photo is the accent). */
export function Bento({ items }: { items: Item[] }) {
  const n = items.length
  const tinted = n <= 3 ? n : 2
  const rest = n - tinted
  const lastRow = rest % 3
  // Photo cards swipe sideways on phones instead of stacking very tall.
  const rail = (n > 2 && items.every((it) => photoForHref(it.href))) || (n > 3 && items.every((it) => it.image))
  return (
    <div
      className={cn(
        "gap-4 md:grid md:grid-cols-6",
        rail ? "zx-swipe -mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0" : "grid"
      )}
    >
      {items.map((it, i) => {
        const isTint = i < tinted
        const dark = i === 0 && n >= 3 && !photoForHref(it.href) && !it.image
        const span = isTint
          ? tinted === 2
            ? "md:col-span-3"
            : tinted === 3
              ? "md:col-span-2"
              : "md:col-span-6"
          : lastRow === 1 && i === n - 1
            ? "md:col-span-6"
            : lastRow === 2 && i >= n - 2
              ? "md:col-span-3"
              : "md:col-span-2"
        return (
          <Reveal
            key={`${i}-${it.title ?? it.body}`}
            variant="scale"
            index={i}
            className={cn(span, rail && "w-[80%] shrink-0 snap-start md:w-auto")}
          >
            <CardShell
              item={it}
              className={cn(
                "overflow-hidden rounded-[28px] p-7 transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-8",
                dark ? "bg-ink-950" : "zx-card hover:border-navy-border",
                "hover:-translate-y-1 hover:shadow-[0_28px_56px_-30px_rgba(31,42,97,0.4)]"
              )}
            >
              <CardInner item={it} big={isTint && tinted <= 2} dark={dark} />
            </CardShell>
          </Reveal>
        )
      })}
    </div>
  )
}

/* ----------------------------------------------------------------- steps */

/** Numbered steps on a rail that draws top to bottom, on an ink card; the
 *  step you point at lights up. */
export function StepsCard({ items }: { items: Item[] }) {
  return (
    <Reveal variant="scale" className="rounded-[28px] bg-ink-950 p-6 text-white sm:p-8">
      <div className="relative">
        <span aria-hidden className="absolute bottom-5 left-4 top-5 w-px bg-white/15">
          <Reveal as="span" variant="line-y" className="absolute inset-0 bg-navy-border" />
        </span>
        <ol className="space-y-6">
          {items.map((it, i) => (
            <Reveal as="li" key={`${i}-${it.body}`} index={i + 1} className="group relative flex gap-4">
              <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[0.8125rem] font-semibold tabular-nums text-ink-950 ring-4 ring-ink-950 transition-colors duration-300 group-hover:bg-navy-500 group-hover:text-white">
                {i + 1}
              </span>
              <div className="pt-1">
                {it.title && <h3 className="text-[1.0625rem] font-semibold text-white">{it.title}</h3>}
                <p
                  className={cn(
                    "leading-relaxed text-white/70 transition-colors duration-300 group-hover:text-white",
                    it.title ? "mt-1 text-[0.9875rem]" : "text-[1.03rem]"
                  )}
                >
                  {it.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ text */

function Prose({ body }: { body: string[] }) {
  return (
    <div className="space-y-5">
      {body.map((p, i) =>
        isEmail(p) ? (
          <Reveal as="p" key={p} index={i}>
            <a href={`mailto:${p.trim()}`} className="text-xl font-semibold text-navy-600 underline decoration-navy-600/30 underline-offset-4 hover:decoration-navy-600">
              {p}
            </a>
          </Reveal>
        ) : (
          <Reveal as="p" key={p} index={i} className="text-[1.0625rem] leading-relaxed text-ink-700 sm:text-lg">
            {p}
          </Reveal>
        )
      )}
    </div>
  )
}

function NotesGrid({ notes }: { notes: { id: string | null; title: string; body: string[] }[] }) {
  return (
    <Plain>
      <div className={cn("grid gap-4", notes.length === 4 ? "md:grid-cols-2 xl:grid-cols-4" : notes.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {notes.map((note, i) => (
          <Reveal key={note.title} variant="scale" index={i}>
            <article id={note.id ?? undefined} className="zx-card h-full scroll-mt-28 p-7 sm:p-8">
              <SectionTitle title={note.title} size="md" as="h2" />
              <div className="mt-4 space-y-3">
                {note.body.map((p) =>
                  isEmail(p) ? (
                    <a key={p} href={`mailto:${p.trim()}`} className="block text-[1.0625rem] font-semibold text-navy-600 underline decoration-navy-600/30 underline-offset-4 hover:decoration-navy-600">
                      {p}
                    </a>
                  ) : (
                    <p key={p} className="text-[0.9875rem] leading-relaxed text-ink-600">
                      {p}
                    </p>
                  )
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Plain>
  )
}

/* ----------------------------------------------------------------- links */

function LinkCards({ items }: { items: Item[] }) {
  return (
    <ul className={cn("grid gap-3", items.length > 1 && "sm:grid-cols-2", items.length % 3 === 0 && "lg:grid-cols-3")}>
      {items.map((it, i) => (
        <Reveal as="li" key={it.href ?? it.title ?? it.body} index={i}>
          <Link
            href={it.href ?? "#"}
            className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-line bg-white p-5 transition-[background-color,border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-ink-950 hover:bg-ink-950 sm:p-6"
          >
            <span>
              <span className="block text-[1.0625rem] font-semibold text-ink-950 transition-colors duration-300 group-hover:text-white">{it.title ?? it.body}</span>
              {it.title && it.body && (
                <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink-600 transition-colors duration-300 group-hover:text-white/70">{it.body}</span>
              )}
            </span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition-[background-color,border-color,translate] duration-300 group-hover:translate-x-1 group-hover:border-white group-hover:bg-white">
              <ArrowRight className="h-4 w-4 text-ink-700 transition-colors duration-300 group-hover:text-ink-950" aria-hidden />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  )
}

/* ----------------------------------------------------------------- cases */

export function CaseCards({ items }: { items: { slug: string; summary: string }[] }) {
  const single = items.length === 1
  const rail = items.length >= 3
  return (
    <div
      className={cn(
        "gap-4",
        rail
          ? "zx-swipe -mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
          : cn("grid", items.length === 2 && "md:grid-cols-2")
      )}
    >
      {items.map(({ slug, summary }, i) => {
        const study = CASE_STUDIES.find((c) => c.slug === slug)
        return (
          <Reveal key={slug} variant="scale" index={i} className={cn(rail && "w-[80%] shrink-0 snap-start md:w-auto")}>
            <Link
              href={`/case-studies/${slug}`}
              className={cn(
                "zx-card group flex h-full overflow-hidden transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_28px_56px_-30px_rgba(31,42,97,0.4)]",
                single ? "flex-col md:flex-row" : "flex-col"
              )}
            >
              <div className={cn("relative shrink-0 overflow-hidden", single ? "h-48 md:h-auto md:w-[42%]" : "h-44 sm:h-52")}>
                <Image
                  src={caseImage(slug)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 26rem, (min-width: 768px) 45vw, 80vw"
                  className="object-cover transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <span className="text-sm font-medium text-ink-500">Case study</span>
                {study && <h3 className="mt-3 text-2xl font-semibold leading-snug tracking-[-0.02em] text-ink-950">{study.name}</h3>}
                {study?.industry && <span className="mt-1 text-sm font-medium text-navy-600">{study.industry}</span>}
                <span aria-hidden className="my-5 block h-px bg-ink-950/[0.08]" />
                <p className="text-[0.9875rem] leading-relaxed text-ink-600">{summary}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-ink-950 transition-colors group-hover:text-navy-600">
                  Read the case study
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}

/* ----------------------------------------------------------------- proof */

/** "2,000+ users …" / "2 million customers …" / "90+ large …" → figure + label. */
export function parseStat(s: string) {
  const m = s.match(/^(\$?)(\d{1,3}(?:,\d{3})+|\d+)(k\+|\+|%\+|%|×| million| billion)?\s+(.+)$/)
  if (!m) return null
  return { prefix: m[1], value: Number(m[2].replace(/,/g, "")), suffix: m[3] ?? "", label: m[4], comma: m[2].includes(",") }
}

/** One white strip, figures divided by hairlines; non-figures read as a fact.
 *  An optional intro sits beside the title, a source line under each figure. */
export function ProofBand({
  id,
  title,
  intro,
  items,
  sources,
}: {
  id?: string | null
  title?: string
  intro?: string
  items: string[]
  sources?: string[]
}) {
  const cols = items.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
  return (
    <Plain id={id}>
      {title && (
        <div className="mb-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <Reveal>
            <SectionTitle title={title} size="md" />
          </Reveal>
          {intro && (
            <Reveal as="p" index={1} className="max-w-xl text-lg leading-relaxed text-ink-500">
              {intro}
            </Reveal>
          )}
        </div>
      )}
      <Reveal variant="scale" className="relative isolate">
        <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_24px_60px_-34px_rgba(31,42,97,0.35)] [backdrop-filter:blur(20px)_saturate(1.5)] [-webkit-backdrop-filter:blur(20px)_saturate(1.5)]">
        <ul className={cn("grid divide-y divide-ink-950/[0.07] sm:divide-y-0 sm:[&>li+li]:border-l sm:[&>li+li]:border-ink-950/[0.07] lg:[&>li:nth-child(3)]:border-t-0", cols)}>
          {items.map((p, i) => {
            const st = parseStat(p)
            return (
              <li key={p} className="flex flex-col justify-center px-5 py-5 sm:min-h-[9rem] sm:px-8 sm:py-7">
                {st ? (
                  <>
                    <span className="whitespace-nowrap text-[1.875rem] font-semibold leading-none tracking-[-0.04em] text-ink-950 sm:text-[3.25rem]">
                      {st.comma ? `${st.prefix}${st.value.toLocaleString("en-US")}${st.suffix}` : <CountUp value={st.value} prefix={st.prefix} suffix={st.suffix} />}
                    </span>
                    <span className="mt-3 text-[0.9875rem] leading-relaxed text-ink-600">{st.label}</span>
                    {sources?.[i] && <span className="mt-3 text-xs leading-relaxed text-ink-400">{sources[i]}</span>}
                  </>
                ) : (
                  <span className="flex items-center gap-3 text-lg font-semibold leading-snug tracking-[-0.01em] text-ink-950 sm:text-xl">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-600/10">
                      <Check className="h-4 w-4 text-navy-600" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
        </div>
      </Reveal>
    </Plain>
  )
}

/* ----------------------------------------------------------------- stack */

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {items.map((s, i) => (
        <Reveal as="li" key={s} index={i}>
          <span className="zx-glass-chip inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-[0.9375rem] font-medium text-ink-900 shadow-[0_6px_16px_-12px_rgba(31,42,97,0.35)]">
            <Check className="h-3.5 w-3.5 text-navy-600" strokeWidth={3} aria-hidden />
            {s}
          </span>
        </Reveal>
      ))}
    </ul>
  )
}

/** Several named lists side by side: white panels, the middle (or second) on ink. */

function StackColumns({ groups }: { groups: { name: string; items: string[] }[] }) {
  return (
    <div className={cn("grid gap-4", groups.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2")}>
      {groups.map((g, gi) => {
        const dark = gi === 1
        return (
        <Reveal
          key={g.name}
          variant="scale"
          index={gi}
          className={cn("h-full rounded-[28px] p-7 sm:p-8", dark ? "bg-ink-950 text-white" : "border border-line bg-white")}
        >
          <h3 className={cn("text-xl font-semibold tracking-[-0.02em]", dark ? "text-white" : "text-ink-950")}>{g.name}</h3>
          {/* Phones: compact chips. Larger screens: ruled check rows. */}
          <ul className="mt-4 flex flex-wrap gap-2 sm:block">
            {g.items.map((it) => (
              <li
                key={it}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm sm:flex sm:gap-3 sm:rounded-none sm:border-b sm:bg-transparent sm:px-0 sm:py-3 sm:text-[0.9875rem] sm:leading-relaxed sm:last:border-b-0",
                  dark ? "bg-white/10 text-white/80 sm:border-white/10" : "bg-paper text-ink-800 sm:border-ink-950/[0.08]"
                )}
              >
                <span className={cn("mt-0.5 hidden h-5 w-5 shrink-0 place-items-center rounded-full sm:grid", dark ? "bg-white/10" : "bg-navy-600/10")}>
                  <Check className={cn("h-3 w-3", dark ? "text-white" : "text-navy-600")} strokeWidth={3} aria-hidden />
                </span>
                {it}
              </li>
            ))}
          </ul>
        </Reveal>
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- salezx */

/** The page's one dark band. */
export function SalezxPanel({ body, cta }: { body: string; cta?: Cta }) {
  return (
    <section className="zx-backdrop-navy relative isolate overflow-hidden text-white">
      <div className="zx-container zx-section">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <Reveal as="p" className="max-w-3xl text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-[2.25rem]">
            {body}
          </Reveal>
          {cta && (
            <Reveal index={1} className="shrink-0">
              <a
                href={cta.href}
                target={cta.external ? "_blank" : undefined}
                rel={cta.external ? "noopener noreferrer" : undefined}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-[0.9375rem] font-semibold text-ink-950 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98] sm:w-auto"
              >
                {cta.label}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ page */

const isShortText = (s: Section | undefined) => !!s && s.kind === "text" && words(s.body.join(" ")) < 40
const pairable = (s: Section | undefined): s is ListSection =>
  !!s &&
  s.kind === "list" &&
  (s.style === "rows" || s.style === "checks") &&
  s.items.length <= 6 &&
  s.items.every((it) => words(`${it.title ?? ""} ${it.body}`) <= 40)

export function PageSections({ sections }: { sections: Section[] }) {
  const ids = sectionIds(sections)
  const out: React.ReactNode[] = []

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i]
    const id = ids[i]
    const key = `${s.kind}-${i}`

    // A run of 2+ short text sections → one grid of note cards.
    if (isShortText(s) && isShortText(sections[i + 1])) {
      const notes: { id: string | null; title: string; body: string[] }[] = []
      while (i < sections.length && isShortText(sections[i])) {
        const t = sections[i] as Extract<Section, { kind: "text" }>
        notes.push({ id: ids[i], title: t.title, body: t.body })
        i++
      }
      i--
      out.push(<NotesGrid key={`notes-${i}`} notes={notes} />)
      continue
    }

    // Two short lists in a row → the pastel pair.
    const next = sections[i + 1]
    if (pairable(s) && pairable(next)) {
      out.push(<Pair key={key} id={id} a={s} b={next} />)
      i++
      continue
    }

    switch (s.kind) {
      case "list": {
        if (s.style === "cards") {
          out.push(
            <Stacked key={key} id={id} title={s.title} intro={s.intro}>
              <Bento items={s.items} />
            </Stacked>
          )
        } else if (s.style === "numbered") {
          out.push(
            <Split key={key} id={id} title={s.title} intro={s.intro} long={s.items.length > 5}>
              <StepsCard items={s.items} />
            </Split>
          )
        } else if (s.style === "rows" && s.items.every((it) => it.title)) {
          out.push(
            <Split key={key} id={id} title={s.title} intro={s.intro} long={s.items.length > 6}>
              <Ledger rows={s.items.map((it) => ({ label: it.title!, value: <ItemText item={{ body: it.body }} /> }))} />
            </Split>
          )
        } else if (s.style === "rows") {
          out.push(
            <Split key={key} id={id} title={s.title} intro={s.intro} long={s.items.length > 6}>
              <DotRows items={s.items} warn={warns(s.title)} />
            </Split>
          )
        } else {
          out.push(
            <Split key={key} id={id} title={s.title} intro={s.intro} long={s.items.length > 6}>
              <CheckRows items={s.items} />
            </Split>
          )
        }
        break
      }
      case "text":
        out.push(
          <Split key={key} id={id} title={s.title} long={words(s.body.join(" ")) > 160}>
            <Prose body={s.body} />
          </Split>
        )
        break
      case "links":
        out.push(
          <Stacked key={key} id={id} title={s.title} intro={s.intro}>
            <LinkCards items={s.items} />
          </Stacked>
        )
        break
      case "cases":
        out.push(
          <Stacked key={key} id={id} title={s.title}>
            <CaseCards items={s.items} />
          </Stacked>
        )
        break
      case "proof":
        out.push(<ProofBand key={key} id={id} title={s.title} intro={s.intro} items={s.items} sources={s.sources} />)
        break
      case "stack": {
        const lists = s.groups.length > 1 && s.groups.some((g) => g.items.length > 1)
        out.push(
          s.groups.length === 1 ? (
            <Split key={key} id={id} title={s.title ?? s.groups[0].name} intro={s.intro}>
              <Chips items={s.groups[0].items} />
            </Split>
          ) : lists ? (
            <Stacked key={key} id={id} title={s.title} intro={s.intro}>
              <StackColumns groups={s.groups} />
            </Stacked>
          ) : s.title ? (
            <Split key={key} id={id} title={s.title} intro={s.intro}>
              <Ledger rows={s.groups.map((g) => ({ label: g.name, value: g.items.join(", ") }))} />
            </Split>
          ) : (
            <Stacked key={key} id={id} intro={s.intro}>
              <Ledger rows={s.groups.map((g) => ({ label: g.name, value: g.items.join(", ") }))} />
            </Stacked>
          )
        )
        break
      }
      case "faq":
        out.push(
          <Split key={key} id={id} title={s.title} long>
            <Reveal className="border-t border-line">
              {s.items.map((f) => (
                <FaqItem key={f.q} question={f.q} answer={f.a} />
              ))}
            </Reveal>
          </Split>
        )
        break
      case "salezx":
        out.push(<SalezxPanel key={key} body={s.body} cta={s.cta} />)
        break
    }
  }

  return <>{out}</>
}
