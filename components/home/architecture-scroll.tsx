"use client"

/**
 * Reference architecture — scroll-driven assembly.
 *
 * Mechanics are a port of the build spec in scrollanimation.md (§1–§11):
 * stage anatomy, FLIP maths, motion timeline, performance rules and the
 * responsive/reduced-motion split all follow that document.
 *
 * The COPY is not from the spec. Its figures (30 min → 10 sec, 98% contact
 * rate, 2.4x conversions, −80% record-update time, 150+ projects) were not
 * verifiable, and several conflicted with what the rest of this site states.
 * Every heading, body, chart value and proof point below is drawn from claims
 * already made elsewhere on this site — 24/7 coverage, 2 → 100+ use cases,
 * 60% faster launches, 40% faster approvals, 25% lower compliance cost,
 * 200+ implementations, Salesforce & Microsoft partner, Fremont HQ.
 *
 * Stage is a 2-row grid that fills the viewport exactly, so there is no dead
 * space above the content:
 *   row 1 (1fr)  — hero zone: the block at hero size (left) + description,
 *                  chart and proof points (right)
 *   row 2 (auto) — the card the blocks travel down into
 *
 * Motion is FLIP, not two copies: each column is rendered once in its resting
 * slot, measured against the hero anchor, and transformed back to hero size
 * at t=0. Scroll interpolates to identity at t=1.
 *
 * Scroll frames write transform/opacity straight to refs — no React state, no
 * re-renders (§9). Measurement runs on mount, resize, once at 350ms and after
 * fonts load, never per frame.
 *
 * Mobile (<960px) / reduced motion: stacked, no pinning (§8).
 *
 * Do not invent metrics here: every number must already appear elsewhere on
 * the site, so the two can never contradict each other.
 *
 * Product naming: SaleZx is the platform, and it runs across industries.
 * GoEd AI is its education edition, not a sibling product, so it is not
 * listed separately in this diagram.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"

/* Site tokens replacing the spec's placeholder palette (§7 allows this). */
const C = {
  ink: "var(--zx-ink-950)",
  soft: "var(--zx-ink-600)",
  line: "var(--zx-line)",
  surface: "var(--zx-paper-raised)",
  tile: "var(--zx-ink-50)",
  tint: "var(--zx-navy-soft)",
  tintInk: "var(--zx-navy-600)",
  bar: "var(--zx-navy-500)",
  barSoft: "var(--zx-navy-border)",
}

type BarRow = { label: string; value: string; frac: number; soft?: boolean }
type Chart =
  | { type: "bars"; rows: BarRow[] }
  | { type: "ramp"; caption: string }

type Block = {
  key: string
  label: string
  items: string[]
  heading: string
  body: string
  chart: Chart
  proof: string[]
}

const BLOCKS: Block[] = [
  {
    key: "channels",
    label: "Channels",
    items: ["Microsoft Teams & Outlook", "WhatsApp & voice", "Mobile & field apps", "Customer & dealer portals"],
    heading: "Work happens where your people already are",
    body:
      "Reps, field teams and customers reach the same systems through the tools they already open every day. No new console to learn, and no licence you are not already paying for.",
    chart: {
      type: "bars",
      rows: [
        { label: "Applicant & customer coverage", value: "24/7", frac: 1 },
        { label: "New tools your team must learn", value: "none", frac: 0.03, soft: true },
      ],
    },
    proof: ["No new licences", "Multilingual by default"],
  },
  {
    key: "platform",
    label: "Zoxima platform",
    items: ["Routing", "Policy & access control", "Integration", "Observability"],
    heading: "One governed foundation, not a project per department",
    body:
      "Routing, policy, integration and observability are built once and shared by everything above them. The second project inherits what the first paid for, which is why cost per use case falls as the estate grows.",
    chart: { type: "ramp", caption: "2 → 100+ use cases on the same backbone" },
    proof: ["Governed centrally", "Every step logged"],
  },
  {
    key: "build",
    label: "What we build",
    items: ["Microsoft Dynamics 365", "Power Platform apps", "Salesforce CRM", "SaleZx"],
    heading: "CRM, applications, agents and our own platform",
    body:
      "Microsoft Dynamics 365 and Power Platform, Salesforce CRM, and agentic AI — three practices on one foundation. Alongside them we ship SaleZx, our own sales platform, which runs across manufacturing, distribution, consumer goods, education and professional services.",
    chart: {
      type: "bars",
      rows: [
        { label: "Faster product launches", value: "60%", frac: 0.6 },
        { label: "Faster approvals and collections", value: "40%", frac: 0.4, soft: true },
      ],
    },
    proof: ["200+ implementations", "Salesforce & Microsoft partner"],
  },
  {
    key: "systems",
    label: "Systems of record",
    items: ["Microsoft Dataverse", "SAP & ERP", "PostgreSQL & SQL", "SharePoint & data warehouse"],
    heading: "Your data stays in the systems that own it",
    body:
      "Agents and applications read widely and write back through governed integrations, inside your own environment. Nothing is ripped out, and every action leaves an audit trail that survives review.",
    chart: {
      type: "bars",
      rows: [
        { label: "Lower compliance cost", value: "25%", frac: 0.25 },
        { label: "Data migrated out of your systems", value: "none", frac: 0.03, soft: true },
      ],
    },
    proof: ["Runs in your environment", "Global Delivery Center"],
  },
]

const SPAN = 0.22
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1)
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

const eyebrow: CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: C.soft,
  fontFamily: "var(--zx-font-mono)",
}

type Mode = "static" | "mobile" | "scroll"

export function ArchitectureScroll() {
  // SSR renders the plain stacked variant: every block visible, no JS needed,
  // fully crawlable. The client then picks the right experience.
  const [mode, setMode] = useState<Mode>("static")

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 960px)")
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")
    const decide = () =>
      setMode(still.matches ? "static" : wide.matches ? "scroll" : "mobile")
    decide()
    wide.addEventListener("change", decide)
    still.addEventListener("change", decide)
    return () => {
      wide.removeEventListener("change", decide)
      still.removeEventListener("change", decide)
    }
  }, [])

  if (mode === "scroll") return <ScrollStage />
  if (mode === "mobile") return <MobileAssembly />
  return <StackedSection />
}

type Geo = { dx: number; dy: number; scale: number }

function ScrollStage() {
  const wrapRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const chromeRef = useRef<HTMLDivElement>(null)
  const cols = useRef<(HTMLDivElement | null)[]>([])
  const descs = useRef<(HTMLDivElement | null)[]>([])
  const links = useRef<(HTMLDivElement | null)[]>([])
  const dots = useRef<(HTMLSpanElement | null)[]>([])
  const fills = useRef<Record<number, (HTMLDivElement | null)[]>>({})
  const ramps = useRef<Record<number, Record<string, SVGElement | null>>>({})
  const geo = useRef<Geo[]>([])
  const progress = useRef(0)

  const registerFill = (i: number, j: number, el: HTMLDivElement | null) => {
    if (!fills.current[i]) fills.current[i] = []
    fills.current[i][j] = el
  }
  const registerRamp = (i: number, part: string, el: SVGElement | null) => {
    if (!ramps.current[i]) ramps.current[i] = {}
    ramps.current[i][part] = el
  }

  useLayoutEffect(() => {
    const paint = (p: number) => {
      progress.current = p
      const active = Math.min(BLOCKS.length - 1, Math.max(0, Math.floor(p / SPAN)))

      BLOCKS.forEach((_, i) => {
        const g = geo.current[i] || { dx: 0, dy: 0, scale: 1 }
        const start = i * SPAN
        // Block 0 is what you see the instant the stage pins, so it is never
        // faded in — at p=0 an eased 0→0.05 window leaves the whole stage blank.
        const enter = i === 0 ? 1 : ease(range(p, start, start + 0.05))
        const travel = ease(range(p, start + 0.1, start + 0.205))
        const k = 1 - travel

        const col = cols.current[i]
        if (col) {
          col.style.opacity = String(enter)
          col.style.transform = `translate3d(${g.dx * k}px, ${g.dy * k}px, 0) scale(${1 + (g.scale - 1) * k})`
          col.style.zIndex = travel < 1 ? "20" : "1"
        }

        const desc = descs.current[i]
        if (desc) {
          // Spec §5 fades this out at start+0.16, but the next block does not
          // enter until start+SPAN (0.22) — leaving ~6% of scroll, three times
          // over, with an empty hero zone. Hold it until the handoff instead.
          const out = range(p, start + SPAN - 0.05, start + SPAN + 0.025)
          desc.style.opacity = String(enter * (1 - out))
          desc.style.transform = `translate3d(0, ${12 * (1 - enter) - 14 * out}px, 0)`
        }

        ;(fills.current[i] || []).forEach((el, j) => {
          if (!el) return
          const frac = parseFloat(el.dataset.frac || "1")
          const t = ease(range(p, start + 0.03 + j * 0.02, start + 0.11 + j * 0.02))
          el.style.transform = `scaleX(${(t * frac).toFixed(4)})`
        })

        const ramp = ramps.current[i]
        if (ramp) {
          const t = ease(range(p, start + 0.03, start + 0.12))
          if (ramp.line) ramp.line.style.strokeDashoffset = (1 - t).toFixed(4)
          if (ramp.area) ramp.area.style.opacity = (t * 0.5).toFixed(3)
          if (ramp.head) ramp.head.style.opacity = ease(range(p, start + 0.1, start + 0.13)).toFixed(3)
        }

        if (i > 0 && links.current[i - 1]) {
          const rev = ease(range(p, start + 0.185, start + 0.235))
          const link = links.current[i - 1]!
          link.style.opacity = String(rev)
          link.style.transform = `translate3d(${-12 * (1 - rev)}px, 0, 0)`
        }

        const dot = dots.current[i]
        if (dot) dot.style.background = i === active ? C.tintInk : C.line
      })

      // Chrome has to be there before block 0 lands at 0.205, or the column
      // arrives into an invisible card.
      if (chromeRef.current) chromeRef.current.style.opacity = String(ease(range(p, 0.08, 0.19)))
    }

    const measure = () => {
      const anchor = anchorRef.current
      if (!anchor) return
      cols.current.forEach((el) => el && (el.style.transform = "none"))
      const a = anchor.getBoundingClientRect()
      const heroX = a.left + a.width / 2
      const heroY = a.top + a.height / 2
      geo.current = cols.current.map((el) => {
        if (!el) return { dx: 0, dy: 0, scale: 1 }
        const r = el.getBoundingClientRect()
        const scale = clamp(
          Math.min((a.height * 0.88) / r.height, (a.width * 0.96) / r.width),
          1.05,
          1.8
        )
        return { dx: heroX - (r.left + r.width / 2), dy: heroY - (r.top + r.height / 2), scale }
      })
      paint(progress.current)
    }

    let raf = 0
    const read = () => {
      raf = 0
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // Travel is measured against the stage, not the viewport: the stage is
      // shorter than 100vh because it sits below the fixed header.
      const stageH = stageRef.current?.offsetHeight ?? window.innerHeight
      const travel = rect.height - stageH
      paint(travel <= 0 ? 0 : clamp(-rect.top / travel, 0, 1))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }

    measure()
    read()
    const settle = setTimeout(measure, 350)
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {})
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      clearTimeout(settle)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
    }
  }, [])

  return (
    <section
      ref={wrapRef}
      aria-label="Reference architecture"
      style={{ height: `${BLOCKS.length * 100 + 120}vh`, position: "relative" }}
    >
      <div
        ref={stageRef}
        style={{
          position: "sticky",
          top: "var(--zx-nav-h)",
          height: "calc(100vh - var(--zx-nav-h))",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "1fr auto",
          rowGap: "1.5vh",
          padding: "1.5vh 0 3.5vh",
          boxSizing: "border-box",
        }}
      >
        {/* ---- hero zone ---- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(240px, 32%) 1fr",
            gap: "3vw",
            alignItems: "center",
            padding: "0 4vw",
            minHeight: 0,
          }}
        >
          <div ref={anchorRef} style={{ height: "100%" }} aria-hidden="true" />
          <div style={{ position: "relative", minHeight: 300, pointerEvents: "none" }}>
            {BLOCKS.map((b, i) => (
              <div
                key={b.key}
                ref={(el) => {
                  descs.current[i] = el
                }}
                style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: 0, willChange: "transform, opacity" }}
              >
                <div style={{ ...eyebrow, marginBottom: 10 }}>{b.label}</div>
                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: "clamp(20px, 2vw, 29px)",
                    lineHeight: 1.22,
                    fontWeight: 500,
                    color: C.ink,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {b.heading}
                </h3>
                <p style={{ margin: "0 0 18px", maxWidth: "58ch", fontSize: 15, lineHeight: 1.6, color: C.soft }}>
                  {b.body}
                </p>
                {b.chart.type === "bars" ? (
                  <Bars rows={b.chart.rows} index={i} register={registerFill} />
                ) : (
                  <Ramp caption={b.chart.caption} index={i} register={registerRamp} />
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 18, ...eyebrow }}>
                  {b.proof.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- card zone ---- */}
        <div style={{ justifySelf: "center", width: "min(1080px, 92vw)", position: "relative" }}>
          <div
            ref={chromeRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              background: C.surface,
              opacity: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "13px 18px",
                borderBottom: `1px solid ${C.line}`,
                ...eyebrow,
              }}
            >
              <span>Reference architecture</span>
              <span>one backbone · n use cases</span>
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", paddingTop: 46 }}>
            {BLOCKS.map((b, i) => (
              <div key={b.key} style={{ display: "contents" }}>
                {i > 0 && (
                  <div
                    ref={(el) => {
                      links.current[i - 1] = el
                    }}
                    aria-hidden="true"
                    style={{ width: 42, display: "flex", alignItems: "center", gap: 3, opacity: 0 }}
                  >
                    <span style={{ flex: 1, borderTop: `1px dashed ${C.soft}`, opacity: 0.5 }} />
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderTop: `1px solid ${C.soft}`,
                        borderRight: `1px solid ${C.soft}`,
                        transform: "rotate(45deg)",
                        opacity: 0.6,
                      }}
                    />
                  </div>
                )}
                <div
                  ref={(el) => {
                    cols.current[i] = el
                  }}
                  style={{ flex: 1, padding: "2px 12px 16px", opacity: 0, willChange: "transform, opacity" }}
                >
                  <div style={{ ...eyebrow, marginBottom: 11 }}>{b.label}</div>
                  {b.items.map((item) => (
                    <div
                      key={item}
                      style={{
                        padding: "10px 12px",
                        marginBottom: 8,
                        borderRadius: 8,
                        fontSize: 13,
                        lineHeight: 1.25,
                        background: i === 1 ? C.tint : C.tile,
                        color: i === 1 ? C.tintInk : C.ink,
                        border: `1px solid ${i === 1 ? "transparent" : C.line}`,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "1.2vh",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
          }}
        >
          {BLOCKS.map((b, i) => (
            <span
              key={b.key}
              ref={(el) => {
                dots.current[i] = el
              }}
              style={{ width: 18, height: 5, borderRadius: 3, background: C.line, transition: "background .3s" }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function Bars({
  rows,
  index,
  register,
  still,
}: {
  rows: BarRow[]
  index?: number
  register?: (i: number, j: number, el: HTMLDivElement | null) => void
  still?: boolean
}) {
  return (
    <div style={{ maxWidth: 420 }}>
      {rows.map((r, j) => (
        <div key={r.label} style={{ marginBottom: j === rows.length - 1 ? 0 : 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: C.soft }}>{r.label}</span>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.ink }}>{r.value}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: C.tile, overflow: "hidden" }}>
            <div
              ref={register && index !== undefined ? (el) => register(index, j, el) : undefined}
              data-frac={r.frac}
              style={{
                height: "100%",
                background: r.soft ? C.barSoft : C.bar,
                transformOrigin: "left center",
                transform: still ? `scaleX(${r.frac})` : "scaleX(0)",
                transition: register ? undefined : "transform .9s cubic-bezier(.22,1,.36,1)",
                transitionDelay: register ? undefined : `${0.28 + j * 0.16}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Ramp({
  caption,
  index,
  register,
  still,
}: {
  caption: string
  index?: number
  register?: (i: number, part: string, el: SVGElement | null) => void
  still?: boolean
}) {
  const line = "M0 86 L70 83 L140 73 L210 51 L280 10"
  return (
    <div style={{ maxWidth: 420 }}>
      <svg viewBox="0 0 280 96" width="100%" height="96" role="img" aria-label={caption} style={{ display: "block" }}>
        <path
          ref={register && index !== undefined ? (el) => register(index, "area", el) : undefined}
          d={`${line} L280 96 L0 96 Z`}
          fill={C.tint}
          opacity={still ? 0.5 : 0}
          style={register ? undefined : { transition: "opacity .8s ease .45s" }}
        />
        <path
          ref={register && index !== undefined ? (el) => register(index, "line", el) : undefined}
          d={line}
          fill="none"
          stroke={C.bar}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={still ? 0 : 1}
          style={
            register
              ? undefined
              : { transition: "stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1) .28s" }
          }
        />
        <circle
          ref={register && index !== undefined ? (el) => register(index, "head", el) : undefined}
          cx="280"
          cy="10"
          r="3.5"
          fill={C.bar}
          opacity={still ? 1 : 0}
          style={register ? undefined : { transition: "opacity .4s ease 1.25s" }}
        />
      </svg>
      <div style={{ ...eyebrow, marginTop: 4 }}>{caption}</div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   MobileAssembly — the phone counterpart to ScrollStage.

   The desktop sequence pins the viewport and scrubs a build. Doing that on a
   phone means hijacking the only navigation gesture the user has, so the
   assembly happens differently here: a compact four-column diagram sticks
   under the header while the blocks scroll past it normally. As each block
   comes into view its column fills in, so the diagram builds as you read —
   same "it assembles" reading, no scroll-jacking.

   Charts animate the moment their block becomes active rather than on a
   separate observer, so the number and its bar arrive together.
   -------------------------------------------------------------------------- */
function MobileAssembly() {
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState<boolean[]>(() => BLOCKS.map(() => false))
  const items = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    // reveal: fires as a block arrives, so nothing sits blank below the fold
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = items.current.indexOf(e.target as HTMLLIElement)
          if (i < 0) return
          setSeen((prev) => {
            if (prev[i]) return prev
            const next = [...prev]
            next[i] = true
            return next
          })
        })
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    )

    // active: biased to mid-screen, so it tracks what is actually being read
    const activeIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = items.current.indexOf(e.target as HTMLLIElement)
          if (i >= 0) setActive(i)
        })
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0 }
    )

    items.current.forEach((el) => {
      if (!el) return
      revealIO.observe(el)
      activeIO.observe(el)
    })
    return () => {
      revealIO.disconnect()
      activeIO.disconnect()
    }
  }, [])

  return (
    <section aria-label="Reference architecture" className="relative">
      {/* the blocks themselves */}
      <ol className="zx-container">
        {BLOCKS.map((b, i) => {
          const on = seen[i]
          return (
            <li
              key={b.key}
              ref={(el) => {
                items.current[i] = el
              }}
              className={[
                i > 0 ? "relative pt-16" : "relative",
                "rounded-xl border bg-paper-raised p-5 transition-all duration-500",
                i === active ? "border-navy-border" : "border-line",
                on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              ].join(" ")}
            >
              {/* connector into this block — draws downward as it is reached */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 flex h-16 -translate-x-1/2 flex-col items-center"
                >
                  <span
                    className="w-px flex-1 origin-top bg-navy-600/45 transition-transform duration-700 ease-out"
                    style={{ transform: `scaleY(${on ? 1 : 0})` }}
                  />
                  <svg
                    viewBox="0 0 10 6"
                    className="mt-1 h-2 w-3 text-navy-600/70 transition-opacity duration-500"
                    style={{ opacity: on ? 1 : 0, transitionDelay: on ? "0.5s" : "0s" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 1l4 4 4-4" />
                  </svg>
                </span>
              )}

              <div className="flex items-center gap-2.5">
                <span
                  className="font-mono text-[0.625rem] uppercase tracking-[0.14em]"
                  style={{ color: i === 1 ? C.tintInk : C.soft }}
                >
                  {b.label}
                </span>
                <span className="font-mono text-[0.625rem] text-ink-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-2.5 text-[1.125rem] font-semibold leading-snug tracking-tight text-ink-950">
                {b.heading}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{b.body}</p>

              <div className="mt-4">
                {b.chart.type === "bars" ? (
                  <Bars rows={b.chart.rows} still={on} />
                ) : (
                  <Ramp caption={b.chart.caption} still={on} />
                )}
              </div>

              <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                {b.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      background: i === 1 ? C.tint : C.tile,
                      color: i === 1 ? C.tintInk : C.ink,
                      border: `1px solid ${i === 1 ? "transparent" : C.line}`,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3">
                {b.proof.map((pt) => (
                  <span
                    key={pt}
                    className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-500"
                  >
                    {pt}
                  </span>
                ))}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function StackedSection() {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      aria-label="Reference architecture"
      style={{
        width: "min(1080px, 92vw)",
        margin: "0 auto",
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        background: C.surface,
      }}
    >
      <div style={{ padding: "15px 20px", borderBottom: `1px solid ${C.line}`, ...eyebrow }}>
        Reference architecture
      </div>
      <div style={{ padding: "6px 18px 20px" }}>
        {BLOCKS.map((b, i) => (
          <div
            key={b.key}
            style={{
              padding: "20px 0",
              borderBottom: i < BLOCKS.length - 1 ? `1px solid ${C.line}` : "none",
              opacity: shown ? 1 : 0,
              transform: shown ? "none" : "translate3d(0, 12px, 0)",
              transition: `opacity .5s ${i * 0.09}s, transform .5s ${i * 0.09}s`,
            }}
          >
            <div style={{ ...eyebrow, marginBottom: 10 }}>{b.label}</div>
            <h3 style={{ margin: "0 0 10px", fontSize: 19, lineHeight: 1.28, fontWeight: 500, color: C.ink }}>
              {b.heading}
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.6, color: C.soft }}>{b.body}</p>
            {b.chart.type === "bars" ? (
              <Bars rows={b.chart.rows} still={shown} />
            ) : (
              <Ramp caption={b.chart.caption} still={shown} />
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {b.items.map((item) => (
                <span
                  key={item}
                  style={{
                    padding: "9px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    background: i === 1 ? C.tint : C.tile,
                    color: i === 1 ? C.tintInk : C.ink,
                    border: `1px solid ${i === 1 ? "transparent" : C.line}`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
