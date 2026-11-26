import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { CapabilityMap } from "./capability-map"

const FAILURE_MODES = [
  {
    title: "Pilots that never get a second budget",
    body: "A promising demo is built against a copy of the data, wired to nothing, and owned by no one. It impresses a steering committee and then quietly expires.",
  },
  {
    title: "Every project rebuilt from scratch",
    body: "CRM here, a portal there, an agent somewhere else — each delivered by a different team on a different stack. Nothing composes, nothing is reusable, and cost scales linearly with ambition.",
  },
  {
    title: "No answer when risk asks the hard question",
    body: "Without access control, logging, evaluation and traceability, a system cannot pass an audit — so it never reaches the processes where the value actually sits.",
  },
]

/**
 * Layout note: the diagram column is tall, so everything else lives in the left
 * column to match its height — heading, argument, then the three failure modes
 * as a compact list. Previously the failure modes sat in a full-width row
 * below and the columns were vertically centred, which left a large empty
 * block beside the diagrams. Both columns are top-aligned now.
 */
export function Positioning() {
  return (
    <section className="py-12 lg:py-16">
      <div className="zx-container">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          {/* ---------- Argument ---------- */}
          <div>
            <Reveal>
              <p className="text-[1.75rem] leading-[1.22] tracking-[-0.02em] text-ink-950 sm:text-[2.125rem] lg:text-[2.25rem]">
                Enterprises are not short of pilots.{" "}
                <span className="text-ink-400">
                  They are short of systems that reach{" "}
                  <span className="zx-serif text-navy-600">production</span>.
                </span>
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-6 border-l border-line-strong pl-5">
                <p className="text-[1rem] leading-relaxed text-ink-600">
                  The gap is rarely the technology. It is architecture,
                  governance and the unglamorous work of connecting Salesforce,
                  Dynamics 365, Power Platform and agentic AI to the systems the
                  business already runs on. We build one platform, once — so the
                  second project is faster than the first, and the twentieth is
                  faster still.
                </p>
              </div>
            </Reveal>

            <RevealGroup as="ol" className="mt-9 border-t border-line">
              {FAILURE_MODES.map((item, i) => (
                <RevealItem
                  as="li"
                  key={item.title}
                  className="border-b border-line py-4"
                >
                  <div className="flex gap-4">
                    <span className="mt-0.5 shrink-0 font-mono text-[0.75rem] text-ink-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[0.9375rem] font-semibold tracking-tight text-ink-950">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-600">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* ---------- Diagram ---------- */}
          <Reveal delay={0.15} direction="left">
            <CapabilityMap />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
