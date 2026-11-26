import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { TimelineTrack } from "./timeline-track"

const REASONS = [
  {
    title: "Return measured in weeks",
    body: "Engagements start with two to four targeted use cases scoped to show value in 4–5 weeks each, chosen for measurability rather than novelty.",
  },
  {
    title: "One backbone, not twenty projects",
    body: "The same foundation carries the second use case and the hundredth. Cost per use case falls as the estate grows instead of compounding.",
  },
  {
    title: "Built to survive review",
    body: "Access control, audit logging, evaluation and CI/CD are part of the first delivery — not a remediation project after security asks.",
  },
  {
    title: "Consulting depth with delivery teams",
    body: "Salesforce and Microsoft partnerships, with a Global Delivery Center covering both build and long-run support.",
  },
]

const PHASES = [
  { week: "Week 1", title: "Diagnose", body: "Value mapping across processes; two to four candidate use cases scored on impact and feasibility." },
  { week: "Weeks 2–3", title: "Architect", body: "The platform stood up — integrations, routing, policy and tracing against your real systems." },
  { week: "Weeks 4–5", title: "Deliver", body: "First use case in production behind governance controls, with baseline metrics captured." },
  { week: "Ongoing", title: "Scale", body: "Subsequent use cases deploy onto the existing backbone; each one lands faster than the last." },
]

/**
 * Layout note: this section deliberately breaks the "eyebrow → heading → lead"
 * rhythm used above it. The heading sits inline with the first reason, and the
 * engagement model runs as a horizontal timeline rather than another card grid.
 */
export function WhyZoxima() {
  return (
    <section className="border-t border-line bg-paper-sunken/40 py-12 lg:py-16">
      <div className="zx-container">
        {/* Heading shares a row with the reasons rather than sitting above them */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2 className="zx-display-sm text-[2rem] text-ink-950 sm:text-[2.5rem] lg:text-[2.75rem]">
                The difference is what happens after the{" "}
                <span className="zx-serif text-navy-600">first demo</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="zx-lead mt-6 max-w-md">
                Anyone can show a working prototype. The question worth asking a
                partner is what the second year looks like.
              </p>
            </Reveal>
          </div>

          <RevealGroup as="ol" className="divide-y divide-line border-y border-line">
            {REASONS.map((reason, i) => (
              <RevealItem as="li" key={reason.title} className="py-7 first:pt-0 lg:py-8 lg:first:pt-0">
                <div className="flex gap-6">
                  <span className="mt-1 font-mono text-[0.8125rem] text-ink-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[1.125rem] font-semibold tracking-tight text-ink-950">
                      {reason.title}
                    </h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-600">
                      {reason.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Engagement model: a segmented progress track. Each phase owns a
            rule segment with its marker sitting on it — no dashed connectors,
            which read as noise at column width. */}
        <div className="mt-12 lg:mt-16">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h3 className="text-[1.0625rem] font-semibold tracking-tight text-ink-950">
                How an engagement runs
              </h3>
              <p className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-500">
                First use case live in 4–5 weeks
              </p>
            </div>
          </Reveal>

          <RevealGroup
            as="ol"
            className="mt-7 grid gap-x-5 gap-y-0 sm:gap-y-9 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.09}
          >
            {PHASES.map((phase, i) => {
              const last = i === PHASES.length - 1
              return (
                <RevealItem
                  as="li"
                  key={phase.title}
                  className="group relative pb-8 pl-9 last:pb-0 sm:pb-0 sm:pl-0"
                >
                  <TimelineTrack index={i} last={last} />

                  <div className="flex items-baseline gap-2.5 sm:mt-4">
                    <span className="zx-figure text-[0.8125rem] font-normal tracking-normal text-navy-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-500">
                      {phase.week}
                    </span>
                  </div>

                  <h4 className="mt-2.5 text-[1.0625rem] font-semibold tracking-tight text-ink-950">
                    {phase.title}
                  </h4>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">
                    {phase.body}
                  </p>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
