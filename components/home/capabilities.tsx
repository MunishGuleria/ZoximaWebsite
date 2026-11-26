"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import Link from "next/link"
import {
  animate,
  motion,
  cubicBezier,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
  type Variants
} from "framer-motion"
import {
  ArrowRight,
  Users,
  LayoutGrid,
  Rocket,
  Zap,
  GitFork,
  Clock,
  FileSearch,
  Scale,
  Send,
  Search,
  FileText,
  CheckCircle2,
  Home,
  UserCheck,
  Building,
  Target,
  HeartHandshake,
  Workflow,
  BellRing,
  Database,
  MessagesSquare,
  CornerDownRight,
} from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

const TABS = [
  {
    id: "applications",
    num: "01",
    tabLabel: "Applications",
    eyebrow: "ENTERPRISE APPS",
    title: "Enterprise apps for every team, ",
    titleHighlight: "built for real work",
    summary:
      "The enterprise apps your sales, service and partner teams use every day.",
    href: "/capabilities/applications",
    cta: "Explore applications",
    features: [
      {
        icon: Users,
        title: "Sales, service and partner apps",
        desc: "Everything in one place",
      },
      {
        icon: LayoutGrid,
        title: "Unified data and experience",
        desc: "Work across teams seamlessly",
      },
      {
        icon: Rocket,
        title: "Ready to deploy",
        desc: "Start fast and scale easily",
      },
    ],
    Mockup: ApplicationsMockup,
  },
  {
    id: "automations",
    num: "02",
    tabLabel: "Automations",
    // TODO: copy — eyebrow, headline, summary and feature rows below are the
    // existing site copy, kept as-is. Replace with final Automations copy.
    eyebrow: "PROCESS ORCHESTRATION",
    title: "Workflows that ",
    titleHighlight: "keep work moving",
    summary:
      "Workflows that move work between people and systems, without chasing.",
    href: "/capabilities/automations",
    cta: "Explore automations",
    features: [
      {
        icon: Zap,
        title: "Automate everyday work",
        desc: "From approvals to updates",
      },
      {
        icon: GitFork,
        title: "Connect your systems",
        desc: "No manual work, no chasing",
      },
      {
        icon: Clock,
        title: "Reliable and scalable",
        desc: "System-to-system automation",
      },
    ],
    Mockup: AutomationsMockup,
  },
  {
    id: "ai",
    num: "03",
    tabLabel: "AI",
    // TODO: copy — eyebrow, headline, summary and feature rows below are the
    // existing site copy, kept as-is. Replace with final AI copy.
    eyebrow: "AGENTIC SYSTEMS",
    title: "Agents that read, decide ",
    titleHighlight: "and take action",
    summary:
      "Agents that read, decide and act inside your processes, with your people in control.",
    href: "/capabilities/ai",
    cta: "Explore AI",
    features: [
      {
        icon: FileSearch,
        title: "Understand your data",
        desc: "Read across systems and content",
      },
      {
        icon: Scale,
        title: "Make decisions",
        desc: "Follow your business rules",
      },
      {
        icon: Send,
        title: "Take action",
        desc: "Update, notify or automate the next step",
      },
    ],
    Mockup: AiMockup,
  },
]

type Capability = (typeof TABS)[number]

/* --------------------------------------------------------------------------
   Pinned deck timeline, in fractions of the pinned scroll distance.

   Something is moving for most of the scroll, so the pin never feels stuck:
   a short read of card 01, a long, even slide for 02, a short hold to read
   it, a long slide for 03, a short hold before the section unpins. Long
   slide ranges keep each card's speed close to the user's scroll speed.

     0.00–0.12  card 01 holds
     0.12–0.48  card 02 slides in
     0.48–0.56  card 02 holds
     0.56–0.92  card 03 slides in
     0.92–1.00  card 03 holds, then unpins

   Everything is driven straight off scroll position — no spring, no tween —
   the same way the stacking cards are. The cards are wherever the scroll
   says they are on every frame, so a fast scroll plays the transition fast
   but whole, and scrolling back up plays it in reverse.

   Keep DECK_QUERY in sync with the `deck` variant in app/globals.css — CSS
   owns the layout, this only switches behaviour (label, focus handling).
   -------------------------------------------------------------------------- */
const DECK_QUERY =
  "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)"

/** [start, end] of each card's slide-in. Card 01 is in place from the start. */
const SLIDE: [number, number][] = [
  [0, 0],
  [0.12, 0.48],
  [0.56, 0.92],
]
/** A card counts as "on top" once it is halfway in. Drives keyboard focus. */
const ON_TOP = SLIDE.map(([start, end], i) => (i === 0 ? 0 : (start + end) / 2))
/** Where a programmatic scroll lands: the middle of that card's hold. */
const SETTLE = [0, (0.48 + 0.56) / 2, (0.92 + 1) / 2]

/** How far through its (eased) slide a card counts as visually landed. */
const LANDED_AT = 0.92

/** Each step back in the deck: smaller, lifted, dimmed. */
const RECEDE_SCALE = 0.06
const RECEDE_LIFT_PX = 12

const EASE = [0.22, 1, 0.36, 1] as const
/* Card slides: an even ease-in-out, so a card moves at roughly the user's
   scroll speed instead of rushing in and then crawling to a stop. */
const SLIDE_EASE = cubicBezier(0.4, 0, 0.2, 1)
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

function useDeckEnabled() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(DECK_QUERY)
    const update = () => setOn(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return on
}

export function Capabilities() {
  const deck = useDeckEnabled()
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const fitRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  /* Page-scroll positions where the stage pins and unpins. Measured on
     resize rather than per scroll tick, so scrolling never reads layout. */
  const range = useRef({ start: 0, end: 1 })
  const progress = useMotionValue(0)
  const { scrollY } = useScroll()

  const sync = useCallback(() => {
    const { start, end } = range.current
    const p = (window.scrollY - start) / Math.max(1, end - start)
    progress.set(Math.min(1, Math.max(0, p)))
  }, [progress])

  /* Card labels straddle the card's top border through the middle of their
     capitals. Where that middle sits in a line-height:1 box depends on the
     font's metrics, so measure it once the webfont is in. Falls back to 0.5,
     which is right for Inter to within a hundredth of an em. */
  useEffect(() => {
    let cancelled = false
    document.fonts.ready.then(() => {
      const section = sectionRef.current
      const ctx = document.createElement("canvas").getContext("2d")
      if (cancelled || !section || !ctx) return
      ctx.font = `600 100px ${getComputedStyle(section).fontFamily}`
      const m = ctx.measureText("H")
      const ascent = m.fontBoundingBoxAscent
      const descent = m.fontBoundingBoxDescent
      const cap = m.actualBoundingBoxAscent
      if (!ascent || !cap) return
      const baseline = (100 - (ascent + descent)) / 2 + ascent
      section.style.setProperty("--cap-mid", ((baseline - cap / 2) / 100).toFixed(4))
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    const fit = fitRef.current
    if (!deck || !track || !stage || !fit) return

    const measure = () => {
      const top = track.getBoundingClientRect().top + window.scrollY
      // The sticky `top` resolves --zx-nav-h, so the fixed header is accounted for.
      const navH = parseFloat(getComputedStyle(stage).top) || 0
      range.current = {
        start: top - navH,
        end: top + track.offsetHeight - window.innerHeight,
      }
      sync()

      /* Safety net for short windows: if the deck is taller than the stage,
         scale it down to fit instead of letting it spill into the heading. */
      const styles = getComputedStyle(stage)
      const room =
        stage.clientHeight -
        parseFloat(styles.paddingTop) -
        parseFloat(styles.paddingBottom)
      const scale = Math.min(1, room / Math.max(1, fit.offsetHeight))
      stage.style.setProperty("--deck-fit", scale.toFixed(4))
    }

    measure()
    // Images and fonts loading above the section move the track after mount.
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    ro.observe(fit)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      stage.style.removeProperty("--deck-fit")
    }
  }, [deck, sync])

  useMotionValueEvent(scrollY, "change", () => {
    if (deck) sync()
  })

  /* Per-card motion. `enter` runs 0 → 1 as a card slides in; `depth` counts
     how many cards sit on top of it (0–2, fractional while one is moving). */
  const enter1 = useTransform(progress, SLIDE[1], [0, 1], { ease: SLIDE_EASE })
  const enter2 = useTransform(progress, SLIDE[2], [0, 1], { ease: SLIDE_EASE })
  const alwaysIn = useMotionValue(1)
  const nothingOnTop = useMotionValue(0)
  const depth0 = useTransform([enter1, enter2], ([a, b]: number[]) => a + b)
  const enters = [alwaysIn, enter1, enter2]
  const depths = [depth0, enter2, nothingOnTop]

  // The card that has landed on top — what the straddling label names.
  const [active, setActive] = useState(0)
  // The card that is more than halfway in — where keyboard focus belongs.
  const onTopRef = useRef(0)
  // Highest card that has fully landed at least once; its mockup plays once.
  const [furthestSettled, setFurthestSettled] = useState(0)

  const landedRef = useRef(0)
  const furthestRef = useRef(0)

  useMotionValueEvent(progress, "change", (p) => {
    onTopRef.current = p >= ON_TOP[2] ? 2 : p >= ON_TOP[1] ? 1 : 0
    /* "Landed" is read off the card's eased position, not raw progress, so
       the label switches when the card is visibly in place. */
    const landed =
      enter2.get() >= LANDED_AT ? 2 : enter1.get() >= LANDED_AT ? 1 : 0
    // Only touch React state when the landed card actually changes — this
    // handler runs on every scroll frame.
    if (landed !== landedRef.current) {
      landedRef.current = landed
      setActive(landed)
      if (landed > furthestRef.current) {
        furthestRef.current = landed
        setFurthestSettled(landed)
      }
    }
  })

  /* Programmatic scroll to a settled card (when keyboard focus enters a
     covered card): an eased scroll whose length scales with distance. Any
     wheel, touch, key or pointer input from the user cancels it. */
  const scrollAnim = useRef<{ controls: AnimationPlaybackControls; cancel: () => void } | null>(null)

  useEffect(() => () => scrollAnim.current?.cancel(), [])

  const scrollToCard = useCallback((i: number) => {
    scrollAnim.current?.cancel()

    const { start, end } = range.current
    const to = Math.ceil(start + SETTLE[i] * (end - start))
    const from = window.scrollY
    const distance = Math.abs(to - from)
    if (distance < 2) return

    const html = document.documentElement
    const previousBehavior = html.style.scrollBehavior
    // The site sets `scroll-behavior: smooth`; it would fight per-frame scrollTo.
    html.style.scrollBehavior = "auto"

    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const
    const cancel = () => {
      controls.stop()
      html.style.scrollBehavior = previousBehavior
      events.forEach((type) => window.removeEventListener(type, cancel, true))
      scrollAnim.current = null
    }

    const controls = animate(from, to, {
      duration: Math.min(1.1, 0.55 + distance / 3200),
      ease: EASE_IN_OUT,
      onUpdate: (y) => window.scrollTo(0, y),
      onComplete: cancel,
    })

    // Capture phase, so the cancel runs before a new click/keypress starts its own.
    events.forEach((type) =>
      window.addEventListener(type, cancel, { capture: true, passive: true })
    )
    scrollAnim.current = { controls, cancel }
  }, [])

  /* Keyboard focus moving into a covered card brings that card to the front,
     so focus never lands on something the user can't see. */
  const onCardFocus = (i: number) => {
    if (deck && onTopRef.current !== i) scrollToCard(i)
  }

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      style={LABEL_COLORS}
      className="py-16 lg:py-24 deck:pb-6"
    >
      <div className="zx-container">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <h2 className="zx-display-sm text-[2.25rem] text-ink-950 sm:text-[2.75rem] lg:text-[3rem]">
              Core capabilities
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-ink-600 sm:text-base">
              Three governed pillars running on one shared enterprise foundation — so every layer reinforces the other.
            </p>
          </div>
        </Reveal>

        {/* Phones and tablets: one card at a time behind a segmented switch. */}
        <MobileCapabilities />
      </div>

      {/* Desktop: a ~300vh track whose sticky stage holds the card deck.
          Short or reduced-motion desktop viewports get a plain vertical stack;
          below lg, MobileCapabilities replaces it. */}
      <div ref={trackRef} className="hidden lg:block deck:mt-4 deck:h-[300vh]">
        <div
          ref={stageRef}
          className="deck:sticky deck:top-[var(--zx-nav-h)] deck:flex deck:h-[calc(100vh-var(--zx-nav-h))] deck:flex-col deck:justify-center deck:overflow-clip deck:py-5"
        >
          <div
            ref={fitRef}
            className="zx-container deck:origin-center deck:[transform:scale(var(--deck-fit,1))]"
          >
            {/* Cards: stacked in one grid cell on desktop (equal heights, no
                measuring), a normal vertical list everywhere else. On desktop
                the top padding holds the upper half of the straddling label,
                which also clears the receded cards peeking out above. */}
            <div className="mt-10 grid grid-cols-1 gap-6 deck:mt-0 deck:pt-[max(1.5rem,calc(var(--label-size)*0.68))]">
              {TABS.map((tab, i) => (
                <CapabilityCard
                  key={tab.id}
                  tab={tab}
                  index={i}
                  enter={enters[i]}
                  depth={depths[i]}
                  deck={deck}
                  settled={furthestSettled >= i}
                  onFocus={() => onCardFocus(i)}
                />
              ))}
              <DeckLabel active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   Phones and tablets (< lg): one capability at a time.

   A segmented switch (sliding pill) picks Applications / Automations / AI;
   swiping the card left/right does the same. All three cards share one grid
   cell, so the block is always as tall as the tallest card and switching
   never moves the page; the active card fades in, the others fade out and
   drift sideways in the direction of travel. Transform + opacity only.
   -------------------------------------------------------------------------- */
const MOCK_DESIGN_WIDTH = 520 // the width the mockups are laid out at

/** Renders a mockup at its desktop width, scaled down to fit as a picture,
    inside a fixed-height window that fades out at the bottom. */
function ScaledPreview({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.6)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) =>
      setScale(Math.min(1, entry.contentRect.width / MOCK_DESIGN_WIDTH))
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden
      className="relative h-[13.5rem] overflow-hidden rounded-2xl [mask-image:linear-gradient(to_bottom,black_72%,transparent)]"
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: MOCK_DESIGN_WIDTH, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

function MobileCapabilities() {
  const reduce = useReducedMotionSafe()
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.3 })
  const n = TABS.length
  const go = (i: number) => setActive(Math.max(0, Math.min(n - 1, i)))

  return (
    <div ref={rootRef} className="mt-8 lg:hidden">
      {/* Segmented switch */}
      <div
        role="tablist"
        aria-label="Core capabilities"
        className="relative grid grid-cols-3 rounded-2xl border border-line bg-paper-sunken p-1"
      >
        <span
          aria-hidden
          className="absolute bottom-1 left-1 top-1 rounded-xl border border-line bg-white shadow-xs transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: "calc((100% - 0.5rem) / 3)",
            transform: `translateX(${active * 100}%)`,
          }}
        />
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`cap-m-tab-${tab.id}`}
            aria-selected={i === active}
            aria-controls={`cap-m-panel-${tab.id}`}
            onClick={() => go(i)}
            className={`relative z-10 select-none rounded-xl py-2.5 text-sm font-semibold transition-colors duration-300 ${
              i === active ? "text-ink-950" : "text-ink-500"
            }`}
          >
            {tab.tabLabel}
          </button>
        ))}
      </div>

      {/* Cards */}
      <motion.div
        className="mt-4 grid"
        style={{ touchAction: "pan-y" }}
        onPanEnd={(_, info) => {
          if (Math.abs(info.offset.x) < 40 || Math.abs(info.offset.x) < Math.abs(info.offset.y)) return
          go(active + (info.offset.x < 0 ? 1 : -1))
        }}
      >
        {TABS.map((tab, i) => {
          const isActive = i === active
          const drift = i < active ? -24 : 24
          const { Mockup } = tab
          return (
            <motion.article
              key={tab.id}
              id={`cap-m-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`cap-m-tab-${tab.id}`}
              aria-hidden={!isActive}
              inert={!isActive}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                transform: isActive || reduce ? "translateX(0px)" : `translateX(${drift}px)`,
              }}
              transition={{ duration: reduce ? 0.15 : 0.45, ease: EASE }}
              className="col-start-1 row-start-1 flex flex-col rounded-3xl border border-line bg-white p-5 shadow-xs"
            >
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                {tab.eyebrow}
              </span>
              <h3 className="mt-2 text-[1.625rem] font-bold leading-[1.15] tracking-tight text-ink-950">
                {tab.title}
                <span className="zx-serif text-navy-900">{tab.titleHighlight}</span>
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{tab.summary}</p>

              <ul className="mt-4 divide-y divide-line border-y border-line">
                {tab.features.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.title} className="flex items-center gap-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-paper-sunken text-ink-800">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink-950">{item.title}</span>
                        <span className="block text-[13px] text-ink-500">{item.desc}</span>
                      </span>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-4">
                <ScaledPreview>
                  <Mockup play={inView && isActive} />
                </ScaledPreview>
              </div>

              <Link
                href={tab.href}
                className="zx-sheen group mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink-950 text-sm font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98]"
              >
                {tab.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.article>
          )
        })}
      </motion.div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Straddling card label.

   One large word whose cap-height middle sits on the front card's top border.
   It is drawn twice, stacked: one layer clipped to above the border (page
   ink), one clipped to below it (the on-card colour). The clip boundary is
   the same expression as the label's offset, so it lands on the border at
   every size. The clip boxes also act as the roll mask: letters leaving or
   entering by a full letter-box height are clipped at the label's edges.

     --cap-mid      cap-height middle, in em, from the top of a line-height:1
                    box (measured in Capabilities; 0.5 fallback)
     --label-pad    vertical room above/below the glyphs so descenders and
                    rolling letters aren't shaved
   -------------------------------------------------------------------------- */
const LABEL_COLORS = {
  "--label-above": "#0F1B2D",
  // The one switch for the split. Set to #F3F5F9 when the cards go dark;
  // while the cards are light, both layers are ink.
  "--label-on-card": "#0F1B2D",
  /* The word sits on top of the card lines and hides them only where the
     word is: each layer's backing matches what's behind it (page ground
     above the border, card fill below). Change --label-card-bg with the
     card background. */
  "--label-above-bg": "var(--zx-paper)",
  "--label-card-bg": "#ffffff",
  "--label-pad": "0.14em",
  "--label-pad-x": "0.12em",
  // Label sizes. Spacing that makes room for the label derives from these.
  "--label-size": "clamp(40px, 4.5vw, 72px)",
  "--label-size-sm": "clamp(32px, 9vw, 44px)",
  // Distance from the card's outer right edge to the label's last letter.
  "--label-inset": "1.5rem",
} as CSSProperties

const LABEL_BORDER = "calc(var(--label-pad) + var(--cap-mid, 0.5) * 1em)"
const LABEL_LIFT: CSSProperties = { transform: `translateY(calc(-1 * ${LABEL_BORDER}))` }
/* Only one cut. The base layer is the whole word, uncut, in the on-card
   colour; the overlay sits on top and is clipped to everything above the
   border, in the above colour. Two clips meeting at the border (however
   much they overlap) are each rasterised and pixel-snapped on their own and
   can leave a pale row through the letters; with a complete word underneath
   there is nothing for a seam to show through. */
const LAYER_BASE = {
  color: "var(--label-on-card)",
  "--layer-bg": "var(--label-card-bg)",
} as CSSProperties
const LAYER_ABOVE = {
  color: "var(--label-above)",
  "--layer-bg": "var(--label-above-bg)",
  clipPath: `inset(0 0 calc(100% - ${LABEL_BORDER}) 0)`,
} as CSSProperties

/* Leaving word: a quick, even roll out. Arriving word: a slower left-to-
   right sweep — each letter starts 45ms after the one before and settles on
   a soft ease-out, so the word visibly travels from first letter to last. */
const ROLL_OUT = { duration: 0.4, stagger: 0.02, ease: [0.65, 0, 0.35, 1] as const }
const ROLL_IN = { duration: 0.65, stagger: 0.045, ease: [0.22, 1, 0.36, 1] as const, delay: 0.12 }

/** Renders the same content as two colour layers split at the border line:
    a complete base layer, and an overlay clipped to above the border. The
    boxes overhang the content by --label-pad-x so letter edges aren't
    shaved. The base layer also clips (top and bottom edges only) so rolling
    letters stay masked to the label box. */
function SplitLayers({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden className="relative block w-max" style={LABEL_LIFT}>
      <span
        className="block px-[var(--label-pad-x)] [clip-path:inset(0)]"
        style={LAYER_BASE}
      >
        {children}
      </span>
      <span className="absolute inset-0 block px-[var(--label-pad-x)]" style={LAYER_ABOVE}>
        {children}
      </span>
    </span>
  )
}

function Letters({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="inline-block py-[var(--label-pad)]">
          {ch}
        </span>
      ))}
    </>
  )
}

type RollPhase = "rest" | "in" | "out"

function RollWord({
  text,
  phase,
  dir,
  reduced,
}: {
  text: string
  phase: RollPhase
  /** 1 when scrolling down (letters roll up), -1 when scrolling up. */
  dir: number
  reduced: boolean
}) {
  const letters = Array.from(text)

  if (reduced) {
    return (
      <motion.span
        className="absolute right-[var(--label-pad-x)] top-0 inline-flex"
        initial={phase === "in" ? { opacity: 0 } : phase === "out" ? { opacity: 1 } : false}
        animate={{ opacity: phase === "out" ? 0 : 1 }}
        transition={{ duration: 0.15, ease: "linear" }}
      >
        <Letters text={text} />
      </motion.span>
    )
  }

  /* Letters roll on y only — the layer clips mask them in and out. No
     opacity: the two colour layers share a 1px overlap row at the border,
     and semi-transparent letters would paint it twice, leaving a dash
     across every letter mid-roll. */
  const above = { y: "-100%" }
  const below = { y: "100%" }
  const rest = { y: "0%" }

  return (
    <span className="absolute right-[var(--label-pad-x)] top-0 inline-flex">
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          className="relative inline-block py-[var(--label-pad)]"
          initial={phase === "in" ? (dir > 0 ? below : above) : phase === "out" ? rest : false}
          animate={phase === "out" ? (dir > 0 ? above : below) : rest}
          transition={{
            ...(phase === "in"
              ? { duration: ROLL_IN.duration, ease: ROLL_IN.ease, delay: ROLL_IN.delay + i * ROLL_IN.stagger }
              : { duration: ROLL_OUT.duration, ease: ROLL_OUT.ease, delay: i * ROLL_OUT.stagger }),
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/**
 * The single label for the pinned deck. Lives in the cards' grid cell, so its
 * anchor is the front card's resting top edge; it never follows a card that
 * is receding or sliding in.
 */
function DeckLabel({ active }: { active: number }) {
  const reduced = useReducedMotionSafe() ?? false

  /* Only two words ever exist: the one leaving and the one arriving. A new
     change remounts both under a new key — the old arriving word restarts
     from its end state as the leaving one — so letters never pile up. */
  const [roll, setRoll] = useState({ current: active, previous: -1, dir: 1, token: 0 })
  if (roll.current !== active) {
    setRoll({
      current: active,
      previous: roll.current,
      dir: active > roll.current ? 1 : -1,
      token: roll.token + 1,
    })
  }

  const words = (
    <>
      {roll.previous >= 0 && (
        <RollWord
          key={`out-${roll.token}`}
          text={TABS[roll.previous].tabLabel}
          phase="out"
          dir={roll.dir}
          reduced={reduced}
        />
      )}
      <RollWord
        key={`in-${roll.token}`}
        text={TABS[roll.current].tabLabel}
        phase={roll.token === 0 ? "rest" : "in"}
        dir={roll.dir}
        reduced={reduced}
      />
    </>
  )

  /* One backing for both words, hiding the card lines only where the word
     is. It spans the widest word and is scaled from the right edge (the
     words are right-aligned) to the current word's width, so the lines
     beside the word are drawn back in — or covered — by a moving edge:
     left-to-right when the word gets shorter, right-to-left when longer.
     Widths are ratios of the widest word, re-read if fonts or size change. */
  const sizerRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [ratios, setRatios] = useState<number[]>([])
  useEffect(() => {
    const els = sizerRefs.current.filter((el): el is HTMLSpanElement => !!el)
    if (!els.length) return
    const measure = () => {
      const widths = sizerRefs.current.map((el) => el?.offsetWidth ?? 0)
      const widest = Math.max(1, ...widths)
      setRatios(widths.map((w) => w / widest))
    }
    measure()
    const ro = new ResizeObserver(measure)
    els.forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [])

  const ratio = ratios[roll.current]
  const shrinking =
    roll.previous >= 0 && (ratios[roll.previous] ?? 0) > (ratio ?? 0)
  const outLetters = roll.previous >= 0 ? TABS[roll.previous].tabLabel.length : 0

  const backing =
    ratio !== undefined ? (
      <motion.span
        aria-hidden
        className="absolute inset-y-0 left-[var(--label-pad-x)] right-[var(--label-pad-x)] origin-right bg-[var(--layer-bg)]"
        initial={false}
        animate={{ scaleX: ratio }}
        transition={
          reduced
            ? { duration: 0 }
            : shrinking
              ? {
                  // Lines draw back in once the old letters have mostly left.
                  duration: 0.6,
                  ease: [0.65, 0, 0.35, 1],
                  delay: ROLL_OUT.duration * 0.6 + outLetters * ROLL_OUT.stagger,
                }
              : {
                  // Covering runs just ahead of the new letters sweeping in.
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }
        }
      />
    ) : null

  return (
    <div className="pointer-events-none relative z-10 self-start justify-self-end pr-[calc(var(--label-inset)-var(--label-pad-x))] text-[length:var(--label-size)] font-semibold leading-none tracking-[-0.03em] [grid-area:1/1] no-deck:hidden">
      <SplitLayers>
        {/* Sizer: the widest word, invisible, gives both clip boxes their
            width. The label overlays the deck, so nothing around it moves. */}
        <span className="invisible grid justify-items-end">
          {TABS.map((tab, i) => (
            <span
              key={tab.id}
              ref={(el) => {
                sizerRefs.current[i] = el
              }}
              className="inline-flex [grid-area:1/1]"
            >
              <Letters text={tab.tabLabel} />
            </span>
          ))}
        </span>
        {backing}
        {words}
      </SplitLayers>
      <span className="sr-only" aria-live="polite">
        {TABS[active].tabLabel}
      </span>
    </div>
  )
}

/** Static per-card label for the stacked (mobile / reduced-motion) layout. */
function CardLabel({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute -top-px right-[calc(var(--label-inset)-1px-var(--label-pad-x))] z-10 text-[length:var(--label-size-sm)] font-semibold leading-none tracking-[-0.03em] deck:hidden">
      <SplitLayers>
        <span className="inline-flex bg-[var(--layer-bg)]">
          <Letters text={text} />
        </span>
      </SplitLayers>
    </div>
  )
}

function CapabilityCard({
  tab,
  index,
  enter,
  depth,
  deck,
  settled,
  onFocus,
}: {
  tab: Capability
  index: number
  enter: MotionValue<number>
  depth: MotionValue<number>
  deck: boolean
  settled: boolean
  onFocus: () => void
}) {
  /* Slides in from fully off-screen right: half the viewport plus half the
     card puts its left edge at the viewport edge, whatever the screen width.
     The viewport half is divided by the stage's fit scale, which would
     otherwise shrink the offset and leave waiting cards peeking in. */
  const shift = useTransform(enter, (v) => (1 - v) * 50)
  const lift = useTransform(depth, (d) => d * -RECEDE_LIFT_PX)
  const scale = useTransform(depth, (d) => 1 - d * RECEDE_SCALE)
  const transform = useMotionTemplate`translateX(calc(${shift}vw / var(--deck-fit, 1) + ${shift}%)) translateY(${lift}px) scale(${scale})`
  const dim = useTransform(depth, [0, 1, 2], [1, 0.6, 0.4])

  const mockRef = useRef<HTMLDivElement>(null)
  const inView = useInView(mockRef, { once: true, amount: 0.35 })
  // In the deck, cards 02/03 are clipped off-screen until they land, so they
  // play on landing; card 01 and the stacked layout play on scroll-into-view.
  const play = deck && index > 0 ? settled : inView

  const { Mockup } = tab

  return (
    <Reveal className="deck:[grid-area:1/1] deck:opacity-100! deck:transform-none! no-deck:pt-[calc(var(--label-size-sm)*0.68)]">
      <motion.article
        id={`capability-${tab.id}`}
        aria-labelledby={`capability-title-${tab.id}`}
        onFocus={onFocus}
        style={{ transform }}
        className="relative h-full origin-top rounded-3xl border border-line bg-white p-6 shadow-xs sm:p-8 lg:p-10 no-deck:transform-none! no-deck:pt-[calc(var(--label-size-sm)*0.6+1rem)] deck:flex deck:flex-col deck:justify-center deck:shadow-[0_1px_2px_rgb(15_23_42/0.04),0_18px_44px_-22px_rgb(15_23_42/0.28)] deck:will-change-transform deck:short:p-8 deck:pt-[max(2.5rem,calc(var(--label-size)*0.6+1rem))] deck:short:pt-[max(2rem,calc(var(--label-size)*0.6+1rem))]"
      >
        <CardLabel text={tab.tabLabel} />
        <motion.div
          style={{ opacity: dim }}
          // Own GPU layer on desktop: the dim changes every scroll frame while
          // a card recedes, and without a layer the whole card repaints.
          className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12 no-deck:opacity-100! deck:will-change-[opacity]"
        >
          {/* Left Column: Editorial Information */}
          <div className="flex flex-col items-start">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              {tab.eyebrow}
            </span>

            <h3
              id={`capability-title-${tab.id}`}
              className="mt-4 text-[1.75rem] font-bold leading-[1.12] tracking-tight text-ink-950 sm:text-[2rem] lg:text-[2.25rem] deck:short:text-[2rem]"
            >
              {tab.title}
              <span className="zx-serif text-navy-900">{tab.titleHighlight}</span>
            </h3>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-600 sm:text-[15px]">
              {tab.summary}
            </p>

            {/* 3 Capabilities Feature List */}
            <ul className="mt-6 w-full divide-y divide-line border-y border-line">
              {tab.features.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.title}
                    className="flex items-center gap-3.5 py-3 deck:short:py-2.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-paper-sunken text-ink-800">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-ink-950">
                        {item.title}
                      </h4>
                      <p className="text-[13px] text-ink-500">{item.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <Link
              href={tab.href}
              className="zx-sheen group mt-6 inline-flex items-center gap-2 rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98]"
            >
              {tab.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Column: product mockup */}
          <div ref={mockRef} className="w-full">
            <Mockup play={play} />
          </div>
        </motion.div>
      </motion.article>
    </Reveal>
  )
}

/* --------------------------------------------------------------------------
   Mockup entrance: pieces fade up 60ms apart, once, when the card lands.
   Under reduced motion they are simply shown.

   Palette inside mockups follows the brand jobs: ink for structure, green
   (`signal`) for outcomes and status, red (`flag`) for the one thing that
   needs attention. No decorative accent colour.
   -------------------------------------------------------------------------- */
const MOCK_STAGE: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const MOCK_ITEM: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

const MOCK_FRAME = "rounded-2xl border border-line bg-paper-sunken p-3 sm:p-4"
const MOCK_PANEL = "rounded-xl border border-line bg-white shadow-2xs"

function MockStage({
  play,
  children,
}: {
  play: boolean
  children: ReactNode
}) {
  return (
    <motion.div
      className={MOCK_FRAME}
      variants={MOCK_STAGE}
      initial="hidden"
      animate={play ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  )
}

function MockItem({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <motion.div
      variants={MOCK_ITEM}
      className={`motion-reduce:opacity-100! motion-reduce:transform-none! ${className}`}
    >
      {children}
    </motion.div>
  )
}

function MockHeader({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof LayoutGrid
  title: string
  children?: ReactNode
}) {
  return (
    <MockItem className={`flex items-center justify-between px-3.5 py-2.5 ${MOCK_PANEL}`}>
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-950 text-white">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-semibold text-ink-950">{title}</span>
      </div>
      {children}
    </MockItem>
  )
}

function StatusDot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-signal-border bg-signal-soft px-2.5 py-1 text-[11px] font-semibold text-signal-strong">
      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
      <span>{label}</span>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Mockup 1: Enterprise Portal (Applications)
   -------------------------------------------------------------------------- */
const PORTAL_NAV = [
  { icon: Home, label: "Home" },
  { icon: UserCheck, label: "Leads" },
  { icon: Building, label: "Accounts" },
  { icon: Target, label: "Opportunities" },
  { icon: HeartHandshake, label: "Partners" },
]

const PORTAL_TILES = [
  { label: "Leads", value: "248", delta: "+12%", path: "M2 14 L12 12 L22 8 L32 10 L46 3" },
  { label: "Opportunities", value: "$1.4M", delta: "+18%", path: "M2 15 L14 13 L24 10 L34 5 L46 6" },
  { label: "Active Customers", value: "186", delta: "+8%", path: "M2 12 L14 14 L24 9 L34 11 L46 4" },
  { label: "Partner Requests", value: "24", delta: "+5%", path: "M2 15 L14 14 L26 11 L36 10 L46 5" },
]

function ApplicationsMockup({ play }: { play: boolean }) {
  return (
    <MockStage play={play}>
      <MockHeader icon={LayoutGrid} title="Enterprise Portal">
        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-1.5 rounded-lg border border-line bg-paper-sunken px-2.5 py-1 text-[11px] text-ink-400 sm:flex">
            <Search className="h-3 w-3" />
            <span>Search records...</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-100 text-[11px] font-semibold text-ink-800">
            MK
          </div>
        </div>
      </MockHeader>

      <div className="mt-3 grid grid-cols-[auto_1fr] gap-3">
        {/* Sidebar */}
        <MockItem className={`space-y-0.5 p-1.5 text-xs ${MOCK_PANEL}`}>
          {PORTAL_NAV.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${
                i === 0
                  ? "bg-ink-100 font-semibold text-ink-950"
                  : "font-medium text-ink-600"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${i === 0 ? "text-ink-950" : "text-ink-400"}`} />
              <span>{label}</span>
            </div>
          ))}
        </MockItem>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          {PORTAL_TILES.map((tile) => (
            <MockItem key={tile.label} className={`p-3 ${MOCK_PANEL}`}>
              <span className="text-[11px] font-medium text-ink-500">{tile.label}</span>
              <div className="mt-0.5 text-xl font-bold tracking-tight text-ink-950">
                {tile.value}
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-signal">{tile.delta}</span>
                <svg className="h-4 w-12 text-signal" viewBox="0 0 48 18" fill="none" aria-hidden>
                  <path d={tile.path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </MockItem>
          ))}
        </div>
      </div>
    </MockStage>
  )
}

/* --------------------------------------------------------------------------
   Mockup 2: Workflow run (Automations)
   -------------------------------------------------------------------------- */
// TODO: copy — workflow name, step labels, step details, timings and run
// status text are placeholders.
const WORKFLOW_NAME = "Lead to quote"
const WORKFLOW_STEPS = [
  { icon: Zap, label: "Trigger: new lead", meta: "From web form or CRM", time: "0.1s", trigger: true },
  { icon: UserCheck, label: "Assign owner", meta: "Round-robin by region", time: "0.3s" },
  { icon: FileText, label: "Send quote", meta: "From the approved price book", time: "1.2s" },
  { icon: BellRing, label: "Follow-up reminder", meta: "If no reply in 3 days", time: "0.2s" },
  { icon: Database, label: "Update CRM", meta: "Opportunity set to Quote sent", time: "0.4s" },
]
const WORKFLOW_STATUS = "Active"
const WORKFLOW_RUN_STATUS = "Run succeeded · 5 of 5 steps"
const WORKFLOW_LAST_RUN = "Last run 2 min ago"

function AutomationsMockup({ play }: { play: boolean }) {
  return (
    <MockStage play={play}>
      <MockHeader icon={Workflow} title={WORKFLOW_NAME}>
        <StatusDot label={WORKFLOW_STATUS} />
      </MockHeader>

      {/* Connected Steps */}
      <ol className="mt-3">
        {WORKFLOW_STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <li key={step.label}>
              <MockItem>
                {i > 0 && (
                  <div aria-hidden className="ml-[22.5px] h-1.5 w-px bg-line-strong" />
                )}
                <div className={`flex items-center gap-3 p-2 ${MOCK_PANEL}`}>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      step.trigger
                        ? "bg-ink-950 text-white"
                        : "border border-line bg-paper-sunken text-ink-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-ink-950">{step.label}</div>
                    <div className="truncate text-[11px] text-ink-500">{step.meta}</div>
                  </div>
                  <span className="font-mono text-[11px] text-ink-400">{step.time}</span>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-signal" />
                </div>
              </MockItem>
            </li>
          )
        })}
      </ol>

      {/* Run Status */}
      <MockItem className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl border border-signal-border bg-signal-soft px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-2 font-semibold text-signal-strong">
          <CheckCircle2 className="h-4 w-4" />
          <span>{WORKFLOW_RUN_STATUS}</span>
        </div>
        <span className="font-mono text-[11px] text-ink-500">{WORKFLOW_LAST_RUN}</span>
      </MockItem>
    </MockStage>
  )
}

/* --------------------------------------------------------------------------
   Mockup 3: Agent chat (AI)
   -------------------------------------------------------------------------- */
// TODO: copy — agent name, question, answer, partner rows and follow-up
// chips are placeholders.
const AGENT_NAME = "Sales Agent"
const AGENT_STATUS = "Online"
const AGENT_QUESTION = "Which partners are behind on this month’s target?"
const AGENT_ANSWER_LEAD = "3 partners"
const AGENT_ANSWER_REST = " are under 70% of this month’s target. Northwind is furthest behind."
const PARTNER_ROWS = [
  { name: "Northwind Traders", target: "$420K", pct: 48 },
  { name: "Apex Distributors", target: "$350K", pct: 61 },
  { name: "Sunrise Retail", target: "$280K", pct: 66 },
]
const AGENT_FOLLOW_UPS = ["Draft a nudge to all three", "Compare with last month"]

function AiMockup({ play }: { play: boolean }) {
  return (
    <MockStage play={play}>
      <MockHeader icon={MessagesSquare} title={AGENT_NAME}>
        <StatusDot label={AGENT_STATUS} />
      </MockHeader>

      {/* User Question */}
      <MockItem className="mt-3 flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink-950 px-3.5 py-2 text-xs font-medium leading-relaxed text-white">
          {AGENT_QUESTION}
        </p>
      </MockItem>

      {/* Agent Reply */}
      <MockItem className="mt-2.5 flex items-start gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink-800 shadow-2xs">
          <MessagesSquare className="h-3.5 w-3.5" />
        </div>
        <div className={`min-w-0 flex-1 rounded-tl-md p-3 ${MOCK_PANEL}`}>
          <p className="text-xs leading-relaxed text-ink-700">
            <span className="font-semibold text-ink-950">{AGENT_ANSWER_LEAD}</span>
            {AGENT_ANSWER_REST}
          </p>
          <table className="mt-2.5 w-full text-left text-[11px]">
            <thead>
              <tr className="font-mono uppercase tracking-wider text-ink-400">
                <th scope="col" className="pb-1 font-medium">Partner</th>
                <th scope="col" className="pb-1 font-medium">Target</th>
                <th scope="col" className="pb-1 text-right font-medium">Achieved</th>
              </tr>
            </thead>
            <tbody>
              {PARTNER_ROWS.map((row) => {
                const behind = row.pct < 50
                return (
                  <tr key={row.name} className="border-t border-line">
                    <td className="py-1.5 pr-2 font-semibold text-ink-950">{row.name}</td>
                    <td className="py-1.5 pr-2 text-ink-600">{row.target}</td>
                    <td className="py-1.5">
                      <div className="flex items-center justify-end gap-2">
                        <div className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-ink-100 sm:block">
                          <div
                            className={`h-full rounded-full ${behind ? "bg-flag" : "bg-ink-700"}`}
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span
                          className={`w-8 text-right font-mono font-semibold ${
                            behind ? "text-flag" : "text-ink-950"
                          }`}
                        >
                          {row.pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </MockItem>

      {/* Suggested Follow-ups */}
      <MockItem className="mt-2.5 flex flex-wrap gap-2 pl-[38px]">
        {AGENT_FOLLOW_UPS.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-medium text-ink-700 shadow-2xs"
          >
            <CornerDownRight className="h-3 w-3 text-ink-400" />
            {chip}
          </span>
        ))}
      </MockItem>
    </MockStage>
  )
}
