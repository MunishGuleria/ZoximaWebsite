'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Calendar, Check, Pointer, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Ported from the live Salezx hero (salezx.com, components/visual/HeroDesks.tsx,
 * Oct 2026) for the Zoxima Products page; Salezx tokens mapped to Zoxima's.
 *
 * HERO — "A week with Salezx".
 *
 * One story told through the cards Salezx actually posts in Microsoft Teams:
 * the rep's morning card (Rep Desk), an enquiry (Lead Actions), the renewals
 * plan (Service Renewals), collections actions (Collections), a stuck order
 * (Ordering & Billing), a discount question on a call (Pricing & Quote), and
 * the manager's Friday summary (Review).
 *
 * Each scene has a few beats. A beat is either a person clicking a real button
 * from those cards (the hand glides to it and clicks: View, Draft reply, tick
 * + Submit my plan, Log the promise, Save changes, Approve 2 instalments) or
 * Salezx doing it on its own. A line under the card says what just happened,
 * tagged "You" or "Salezx". Names, amounts and wording come from the product's
 * own cards and demo videos.
 */

type Beat = {
  /** data-hand key of the element the hand clicks; omit when Salezx acts alone. */
  hand?: string
  says: string
}
type Scene = {
  key: string
  desk: string
  short: string
  when: string
  who: string
  intro: string
  beats: Beat[]
  render: (phase: number) => ReactNode
}

// ── Little building blocks styled after the Teams cards ─────────────────────

function Btn({ id, children, primary }: { id?: string; children: ReactNode; primary?: boolean }) {
  return (
    <span
      data-hand={id}
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-medium',
        primary ? 'bg-navy-600 text-white' : 'border border-ink-950/15 bg-white text-ink-950'
      )}
    >
      {children}
    </span>
  )
}

function Tick({ id, on, children }: { id?: string; on: boolean; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[12px] text-ink-950">
      <span
        data-hand={id}
        className={cn(
          'w-4 h-4 shrink-0 rounded border grid place-items-center transition-colors duration-300',
          on ? 'border-navy-600 bg-navy-600' : 'border-ink-950/30 bg-white'
        )}
      >
        {on && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      {children}
    </span>
  )
}

function Pill({ tone, children }: { tone: 'warn' | 'bad' | 'good' | 'info' | 'neutral'; children: ReactNode }) {
  const t = {
    // Theme neutrals only (2026-10-23); the text colour carries the tone.
    warn: 'bg-paper-sunken text-[#8A5A00]',
    bad: 'bg-paper-sunken text-[#A12A2A]',
    good: 'bg-tint-mint text-emerald-700',
    info: 'bg-tint-blue text-navy-700',
    neutral: 'bg-paper-sunken text-ink-600',
  }[tone]
  return <span key={String(children)} className={cn('sx-pane-in whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-medium', t)}>{children}</span>
}

function Toast({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null
  return (
    <div className="sx-pane-in mt-2.5 flex items-center gap-2 rounded-lg bg-tint-mint px-3 py-2 text-[11.5px] font-medium text-emerald-700">
      <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={3} />
      {children}
    </div>
  )
}

function Stats({ items }: { items: [string, string, string?][] }) {
  return (
    <div className="sx-short-hide mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map(([v, l, tone]) => (
        <div key={l} className="rounded-lg bg-paper px-2 py-1.5">
          <p className={cn('text-[14px] font-semibold tabular-nums leading-tight', tone ?? 'text-ink-950')}>{v}</p>
          <p className="text-[10px] text-ink-500 leading-tight">{l}</p>
        </div>
      ))}
    </div>
  )
}

const Title = ({ children }: { children: ReactNode }) => <p className="text-[14.5px] font-semibold tracking-[-0.01em] text-ink-950">{children}</p>
const Note = ({ children }: { children: ReactNode }) => <p className="text-[11.5px] leading-snug text-ink-500">{children}</p>

// ── The story ───────────────────────────────────────────────────────────────

const SCENES: Scene[] = [
  {
    key: 'rep-desk',
    desk: 'Rep Desk',
    short: 'Rep Desk',
    when: 'Mon 7:30 AM',
    who: 'Sarah · sales rep',
    intro: 'Monday, 7:30. Sarah’s day is waiting in Teams.',
    beats: [
      { hand: 'meetings', says: 'Your day is sorted before you open the CRM.' },
      { says: 'A brief for each meeting is ready an hour before it starts.' },
    ],
    render: p => (
      <>
        <Title>Good morning, Sarah</Title>
        <Note>Today’s priority actions</Note>
        <ul className="mt-2.5 space-y-1.5">
          {[
            ['bg-[#E5484D]', '19 open leads', 'No follow-up scheduled', 'leads'],
            ['bg-navy-500', '7 meetings today', 'Check your schedule', 'meetings'],
            ['bg-[#F5A524]', '15 quotes pending', 'Needs follow-up', 'quotes'],
          ].map(([dot, label, sub, id]) => (
            <li key={id} className={cn('rounded-lg px-2.5 py-2 transition-colors duration-500', p >= 1 && id === 'meetings' ? 'bg-tint-blue/60' : 'bg-paper')}>
              <div className="flex items-center gap-2.5">
                <span className={cn('w-2 h-2 rounded-full shrink-0', dot)} />
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium text-ink-950">{label}</p>
                  <p className="text-[10.5px] text-ink-500">{sub}</p>
                </div>
                <Btn id={id}>View</Btn>
              </div>
              {id === 'meetings' && p >= 1 && (
                <ul className="sx-pane-in mt-2 ml-4 space-y-1 border-l border-navy-border pl-3">
                  {[
                    ['10:00', 'AMC pricing options call — Midwest Precision'],
                    ['11:30', 'Reinstatement fee waiver — Great Lakes Tool & Die'],
                    ['14:00', 'Discovery call — Redline Precision Products'],
                  ].map(([t, m], i) => (
                    <li key={t} className="flex items-center gap-2 text-[11px] text-ink-600">
                      <span className="tabular-nums text-ink-500">{t}</span>
                      <span className="min-w-0 truncate">{m}</span>
                      {i === 0 && p >= 2 && <Pill tone="good">Brief ready</Pill>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    key: 'lead-actions',
    desk: 'Lead Actions',
    short: 'Leads',
    when: 'Mon 9:04 AM',
    who: 'Sarah · sales rep',
    intro: '9:04. An enquiry lands in the shared inbox.',
    beats: [
      { says: 'New enquiry read — lead created in the CRM, owner set by your rules.' },
      { hand: 'draft', says: 'Reply drafted with the brochure and a first quote.' },
    ],
    render: p => (
      <>
        <div className="flex items-center gap-2">
          <Title>Incoming email</Title>
          {p >= 1 && <Pill tone="bad">Priority: High</Pill>}
        </div>
        <dl className="mt-2 space-y-1 text-[11.5px]">
          {[
            ['Subject', 'Product enquiry — NQ60 horizontal machining center'],
            ['From', 'Wilson Systems'],
            ['Intent', 'Request for quote'],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[64px_1fr] gap-2">
              <dt className="text-ink-500">{k}</dt>
              <dd className="text-ink-950">{v}</dd>
            </div>
          ))}
          <div className="grid grid-cols-[64px_1fr] gap-2">
            <dt className="text-ink-500">CRM</dt>
            <dd>{p >= 1 ? <Pill tone="good">Auto-created lead</Pill> : <span className="text-ink-400">—</span>}</dd>
          </div>
        </dl>
        <div className="sx-short-hide mt-2.5 rounded-lg bg-paper px-2.5 py-2 text-[11.5px] leading-snug text-ink-600">
          <span className="font-medium text-ink-950">Recommended action:</span> reply with the NQ60 brochure and a preliminary quote; ask for drawings to finalise the configuration.
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Btn>View email</Btn>
          <Btn>Open CRM record</Btn>
          <Btn id="draft" primary>Draft reply (save in Outlook)</Btn>
        </div>
        <Toast show={p >= 2}>Draft saved — check your Outlook Drafts.</Toast>
      </>
    ),
  },
  {
    key: 'service-renewals',
    desk: 'Service Renewals',
    short: 'Renewals',
    when: 'Tue 8:00 AM',
    who: 'Sarah · sales rep',
    intro: 'Tuesday. The renewals that need a plan, ranked by urgency.',
    beats: [
      { hand: 'tick', says: 'Ticked: email Emily Chen today.' },
      { hand: 'submit', says: 'Plan submitted — the action is logged to the CRM.' },
    ],
    render: p => (
      <>
        <Title>Your renewals ahead</Title>
        <Stats items={[['2', 'pending'], ['$75K', 'at stake'], ['1', 'renew ≤14 days', 'text-[#8A5A00]']]} />
        <div className="mt-2.5 rounded-lg border border-line p-2.5">
          <div className="flex items-center gap-2">
            <p className="flex-1 text-[12.5px] font-medium text-ink-950">Northfield Packaging Corp</p>
            <Pill tone="warn">High</Pill>
            <span className="text-[12px] font-medium tabular-nums text-ink-950">$40K</span>
          </div>
          <p className="mt-0.5 text-[10.5px] text-ink-500">
            Emily Chen · Quoted · <span className="text-[#A12A2A]">Renews Oct 19 · in 11 days</span>
          </p>
          <p className="mt-1.5 text-[11.5px] font-medium text-ink-950">Quote sent, no reply yet. Resend it with a short nudge.</p>
          <div className="mt-2 flex items-center gap-2">
            <Tick id="tick" on={p >= 1}>Email Emily Chen</Tick>
            <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-ink-950/15 px-2 py-0.5 text-[10.5px] text-ink-600">
              <Calendar className="w-3 h-3" /> Oct 8
            </span>
            <Btn>Open draft</Btn>
          </div>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <Btn id="submit" primary>Submit my plan</Btn>
          <Btn>Open my action sheet</Btn>
        </div>
        <Toast show={p >= 2}>Ticked actions logged to the CRM.</Toast>
      </>
    ),
  },
  {
    key: 'collections',
    desk: 'Collections',
    short: 'Collections',
    when: 'Wed 7:30 AM',
    who: 'Dave · sales rep',
    intro: 'Wednesday. Dave’s collections actions, one per invoice.',
    beats: [
      { hand: 'benson', says: 'Ticked — the call is in Dave’s Outlook To-Do.' },
      { hand: 'baxter', says: 'Ticked — Baxter goes on today’s call list too.' },
      { says: 'Karen Benson replied: paying on 20 Oct. Promise recorded.' },
    ],
    render: p => (
      <>
        <Title>Your collections actions</Title>
        <Stats items={[['5', 'actions today'], ['2', 'overdue', 'text-[#A12A2A]'], ['$30,000', 'due today']]} />
        <ul className="mt-2.5 space-y-1.5">
          <li className="rounded-lg border border-line p-2.5">
            <div className="flex items-center gap-2">
              <p className="flex-1 text-[12px] font-medium text-ink-950">Benson Metal Works · INV-26-1160</p>
              {p >= 3 ? <Pill tone="good">Promised 20 Oct</Pill> : <Pill tone="warn">$30,000 due today</Pill>}
            </div>
            <div className="mt-1.5">
              <Tick id="benson" on={p >= 1}>Call Karen Benson — $40K order waits on this payment</Tick>
            </div>
          </li>
          <li className="rounded-lg border border-line p-2.5">
            <div className="flex items-center gap-2">
              <p className="flex-1 text-[12px] font-medium text-ink-950">Baxter Tool & Die · INV-26-1118</p>
              <Pill tone="bad">$12,400 · 12 days over</Pill>
            </div>
            <p className="sx-short-hide mt-1 text-[10.5px] text-ink-500">Missed 9 Oct. Emails 3 of 3 sent, no reply.</p>
            <div className="mt-1.5">
              <Tick id="baxter" on={p >= 2}>Call Ray Baxter</Tick>
            </div>
          </li>
        </ul>
      </>
    ),
  },
  {
    key: 'ordering-billing',
    desk: 'Ordering & Billing',
    short: 'Orders',
    when: 'Wed 7:35 AM',
    who: 'Dave · sales rep',
    intro: 'One order is stuck. Salezx says who can release it.',
    beats: [
      { hand: 'log', says: 'Promise logged — Rachel in credit is told.' },
      { says: 'Payment in — Rachel released order 7750 the same morning.' },
    ],
    render: p => (
      <>
        <Title>Your orders</Title>
        <Stats items={[['14', 'open'], ['$486K', 'order book'], ['3', 'need attention', 'text-[#8A5A00]']]} />
        <div className={cn('mt-2.5 rounded-lg border p-2.5 transition-colors duration-500', p >= 2 ? 'border-line' : 'border-[#F5A524]/60')}>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-[12px] font-medium text-ink-950">Ridge Manufacturing · 7750 · $40,000</p>
            {p >= 2 ? <Pill tone="good">Released</Pill> : <Pill tone="bad">Credit hold</Pill>}
          </div>
          <p className="mt-1 text-[11px] leading-snug text-ink-600">
            $164K of a $180K credit limit used. Call Ridge for $25K — Rachel releases the order the moment the ERP shows it.
          </p>
          <div className="mt-2 flex gap-1.5">
            <Btn id="log" primary>Log the promise</Btn>
            <Btn>Open invoice 4455</Btn>
          </div>
        </div>
        <div className="sx-short-hide mt-1.5 rounded-lg bg-paper p-2.5">
          <div className="flex items-center gap-2">
            <p className="flex-1 text-[12px] font-medium text-ink-950">Keller Plastics · 7712 · $27,000</p>
            <Pill tone="warn">1 day late</Pill>
          </div>
          <p className="mt-0.5 text-[10.5px] text-ink-500">Jason (dispatch) has been asked for a new date.</p>
        </div>
      </>
    ),
  },
  {
    key: 'pricing-quote',
    desk: 'Pricing & Quote',
    short: 'Pricing',
    when: 'Thu 3:07 PM',
    who: 'Sarah · on a call',
    intro: 'Thursday, on a call. The customer wants 15% off.',
    beats: [
      { says: 'Not an opinion — what has actually happened before.' },
      { hand: 'save', says: 'Quote revised to 10% and the covering email drafted.' },
    ],
    render: p => (
      <>
        <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-navy-600 px-3 py-2 text-[11.5px] leading-snug text-white">
          I’m on a call with Carolina Precision Works — they want 15% off. What do you think?
        </div>
        {p >= 1 && (
          <div className="sx-pane-in mt-2.5 rounded-xl rounded-bl-sm border border-line p-2.5">
            <p className="text-[12px] font-semibold text-ink-950">Recommendation: hold at 10%, not 15%.</p>
            <table className="mt-1.5 w-full text-[11px]">
              <tbody>
                {[
                  ['Customer history', '4 prior orders — 5%, 7%, 6%, 8% (avg 6.5%)'],
                  ['Comparable market', 'Similar customers ~7%'],
                  ['Current request', '15% — margin below the normal range'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-t border-line">
                    <td className="py-1 pr-2 text-ink-500 whitespace-nowrap">{k}</td>
                    <td className="py-1 text-ink-950">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 flex gap-1.5">
              <Btn id="save" primary>Save changes</Btn>
            </div>
          </div>
        )}
        <Toast show={p >= 2}>Quote updated successfully.</Toast>
      </>
    ),
  },
  {
    key: 'review',
    desk: 'Review',
    short: 'Review',
    when: 'Fri 7:00 AM',
    who: 'Mark · manager',
    intro: 'Friday. The manager’s summary, before the review call.',
    beats: [
      { hand: 'approve', says: 'Decision sent to Tom — logged against the account.' },
      { says: 'Every rep’s week in one card — actions set, and chased.' },
    ],
    render: p => (
      <>
        <Title>Collections summary — this week</Title>
        <Stats
          items={[
            ['$1.29M', 'outstanding'],
            ['$650K', 'overdue', 'text-[#A12A2A]'],
            ['$130K', 'received', 'text-emerald-700'],
            ['$190K', 'at risk', 'text-[#8A5A00]'],
          ]}
        />
        <div className={cn('mt-2.5 rounded-lg border p-2.5', p >= 1 ? 'border-line' : 'border-[#F5A524]/60')}>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-[12px] font-medium text-ink-950">Ridge Manufacturing · $60,000</p>
            {p >= 1 ? <Pill tone="good">2 instalments</Pill> : <Pill tone="bad">38 days over</Pill>}
          </div>
          <p className="mt-1 text-[11px] leading-snug text-ink-600">
            $58K used of a $75K credit limit. A $12K order is pending. Payment plan requested — your decision.
          </p>
          <div className="mt-2 flex gap-1.5">
            <Btn id="approve" primary>Approve 2 instalments</Btn>
            <Btn>Approve 3</Btn>
            <Btn>Hold</Btn>
          </div>
        </div>
        <div className={cn('mt-1.5 rounded-lg bg-paper p-2.5 text-[11px] text-ink-600 transition-opacity duration-500', p >= 2 ? 'opacity-100' : 'opacity-60')}>
          <p className="font-medium text-ink-950">Rep replies this morning</p>
          <p className="mt-0.5">Sarah · 2 actions · 2 ticked &nbsp;·&nbsp; Tom · 4 actions · 3 ticked &nbsp;·&nbsp; Dave · 5 actions · 3 ticked</p>
        </div>
      </>
    ),
  },
]

const START_MS = 1300
const BEAT_MS = 2100
const HOLD_MS = 2200
/** How long a whole scene runs — the progress lines fill over exactly this. */
const sceneMs = (beats: number) => START_MS + beats * BEAT_MS + HOLD_MS

export function HeroDesks() {
  const [active, setActive] = useState(0)
  const [phase, setPhase] = useState(0)
  const [inView, setInView] = useState(true)
  const [still, setStill] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [cursorOn, setCursorOn] = useState(false)
  const [click, setClick] = useState<{ x: number; y: number; n: string } | null>(null)

  const scene = SCENES[active]
  const total = scene.beats.length
  // Keeps playing on hover; only pauses when scrolled off screen.
  const running = inView && !still

  /** A spot on the element the beat's hand clicks, relative to the deck. */
  const spot = (key?: string) => {
    if (!key) return null
    const w = deck.current?.getBoundingClientRect()
    const el = deck.current?.querySelector(`[data-hand="${key}"]`)
    const r = el?.getBoundingClientRect()
    if (!w || !r || r.width === 0) return null
    return { x: r.left - w.left + r.width * 0.6, y: r.top - w.top + r.height * 0.75 }
  }

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Reduced motion: each scene shown finished.
  useEffect(() => {
    if (still) setPhase(total)
  }, [still, total, active])

  // One beat at a time; hold at the end of a scene, then the next scene.
  useEffect(() => {
    if (!running) return
    const id = setTimeout(
      () => {
        if (phase < total) setPhase(p => p + 1)
        else {
          setActive(a => (a + 1) % SCENES.length)
          setPhase(0)
        }
      },
      phase < total ? (phase === 0 ? START_MS : BEAT_MS) : HOLD_MS
    )
    return () => clearTimeout(id)
  }, [phase, total, running])

  // The hand: click if the beat just played was a person's; then glide to the
  // next beat's button, or step aside when Salezx acts alone.
  useLayoutEffect(() => {
    if (still) return
    const last = scene.beats[phase - 1]
    if (last?.hand && cursor && cursorOn) setClick({ ...cursor, n: `${active}-${phase}` })
    const next = scene.beats[phase]
    const t = setTimeout(() => {
      const at = spot(next?.hand)
      if (at) {
        setCursor(at)
        setCursorOn(true)
      } else {
        // Salezx's turn: drift down and away, fading — never sit frozen.
        setCursor(c => (c ? { x: c.x + 36, y: c.y + 46 } : c))
        setCursorOn(false)
      }
    }, 450)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, active, still])

  const pick = (i: number) => {
    setActive(i)
    setPhase(still ? SCENES[i].beats.length : 0)
  }

  const last = scene.beats[phase - 1]
  const narration = last ? { who: last.hand ? 'You' : 'Salezx', text: last.says } : { who: 'Salezx', text: scene.intro }

  return (
    // min-w-0: never let a long row widen the card past the screen.
    <div ref={root} className="min-w-0">
      {/* Room on the right and top for the cards stacked behind. */}
      <div ref={deck} className="relative mr-[44px] mt-[30px] sm:mr-[60px] sm:mt-[36px] [--dx:20px] [--dy:-20px] sm:[--dx:30px] sm:[--dy:-28px]">
        {/* The next two scenes, stacked behind on the right. */}
        {[2, 1].map(depth => {
          const next = SCENES[(active + depth) % SCENES.length]
          return (
            <div
              key={`ghost-${depth}`}
              aria-hidden="true"
              className="absolute inset-0 rounded-[24px] bg-white shadow-[0_10px_30px_-18px_rgba(19,23,32,0.35)] ring-1 ring-ink-950/[0.06] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translate3d(calc(var(--dx) * ${depth}), calc(var(--dy) * ${depth}), 0) scale(${1 - depth * 0.04})`,
                transformOrigin: 'right center',
                opacity: depth === 1 ? 0.95 : 0.7,
              }}
            >
              <span key={next.key} className="sx-pane-in absolute right-4 top-[5px] hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-ink-500">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-950/20" />
                {next.desk}
              </span>
            </div>
          )
        })}

        {/* The scene card — arrives from the stacked position behind. */}
        <div key={scene.key} className="sx-desk-in relative overflow-hidden rounded-[24px] bg-white shadow-[0_40px_90px_-35px_rgba(31,42,97,0.4),0_0_0_1px_rgba(20,22,27,0.05)]">
          <div className="flex items-center gap-2 px-4 h-11 border-b border-line bg-paper/60">
            <span className="w-6 h-6 rounded-md bg-navy-600 grid place-items-center text-[11px] font-bold text-white" aria-hidden="true">S</span>
            <span className="min-w-0 truncate text-[12.5px] font-medium text-ink-950"><span className="hidden sm:inline">Salezx · </span>{scene.desk}</span>
            <span className="ml-auto shrink-0 whitespace-nowrap rounded-full bg-tint-blue px-2 py-0.5 text-[10.5px] font-medium text-navy-700"><span className="hidden sm:inline">{scene.who} · </span>{scene.when}</span>
          </div>

          <div className="h-[330px] [@media(min-width:1024px)_and_(max-height:780px)]:h-[290px] overflow-hidden px-4 pt-3.5 pb-3">
            {scene.render(phase)}
          </div>

          {/* What just happened, and who did it. */}
          <div className="flex min-h-[46px] items-center gap-2.5 border-t border-line bg-paper/60 px-4 py-2" aria-live="polite">
            <span
              className={cn(
                'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold',
                narration.who === 'You' ? 'bg-ink-950 text-white' : 'bg-tint-blue text-navy-700'
              )}
            >
              {narration.who === 'You' ? <Pointer className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              {narration.who}
            </span>
            <p key={`${active}-${phase}`} className="sx-pane-in flex-1 text-[12px] leading-snug text-ink-600">
              {narration.text}
            </p>
            {/* Salezx is on the next step. */}
            {!still && phase < total && !scene.beats[phase]?.hand && (
              <span className="sx-working-dots ml-auto flex shrink-0 gap-1" aria-hidden="true">
                <span /> <span /> <span />
              </span>
            )}
          </div>
        </div>

        {/* The hand: glides to a person's button and clicks it. */}
        {cursor && !still && (
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute left-0 top-0 z-30 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              cursorOn ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
          >
            <span className="sx-hand-idle block">
            <Pointer
              key={click?.n ?? 'start'}
              className="sx-hand-press w-6 h-6 -translate-x-[9px] -translate-y-[2px] fill-white text-ink-950 drop-shadow-[0_4px_8px_rgba(20,22,27,0.3)]"
              strokeWidth={1.6}
            />
            </span>
          </div>
        )}
        {click && !still && (
          <span
            key={`ripple-${click.n}`}
            aria-hidden="true"
            className="sx-click-ripple pointer-events-none absolute z-20 w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border-2 border-navy-600/60"
            style={{ left: click.x, top: click.y }}
          />
        )}
      </div>

      {/* The week, desk by desk: a hairline fills while that desk plays. The day
          and time sit on the card header (two desks share a day). */}
      <div role="tablist" aria-label="A week with Salezx" className="mt-7 grid grid-cols-7 gap-1.5">
        {SCENES.map((s, i) => {
          const on = i === active
          return (
            <button key={s.key} type="button" role="tab" aria-selected={on} title={s.desk} onClick={() => pick(i)} className="group text-left min-h-[44px]">
              <span className="relative block h-[2px] w-full overflow-hidden rounded-full bg-ink-950/10">
                <span
                  aria-hidden="true"
                  key={on ? `fill-${active}` : `idle-${i}`}
                  className={cn('absolute inset-0 origin-left bg-navy-600', on && running ? 'sx-scene-fill' : '')}
                  style={
                    on && running
                      ? { animationDuration: `${sceneMs(total)}ms` }
                      : { transform: `scaleX(${i < active || (on && still) ? 1 : 0})` }
                  }
                />
              </span>
              <span
                className={cn(
                  'hidden sm:block mt-2 text-[11.5px] leading-tight transition-colors duration-300',
                  on ? 'font-medium text-ink-950' : 'text-ink-500 group-hover:text-ink-600'
                )}
              >
                {s.short}
              </span>
            </button>
          )
        })}
      </div>
      <p className="sm:hidden mt-1 text-[12px] text-ink-600">
        <span className="font-medium text-ink-950">{scene.when.split(' ')[0]}</span> · {scene.desk} · {scene.who}
      </p>
    </div>
  )
}
