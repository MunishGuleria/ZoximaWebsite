import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

/* --------------------------------------------------------------------------
   What Zoxima delivers, as one picture.

   Three bands: the applications actually built, the platform they are built
   on, and the systems they read from. Everything named here is a capability
   Zoxima already states publicly — Salesforce, Dynamics 365, Power Platform,
   Copilot Studio, agentic AI on MCP, and its own products.

   SaleZx and GoEd AI sit *inside* the platform band deliberately: they are
   part of what Zoxima delivers, not the whole of it.
   -------------------------------------------------------------------------- */

const APPLICATIONS = [
  "CRM implementations",
  "Custom sales & service apps",
  "Mobile & field apps",
  "Dealer & customer portals",
  "End-to-end automation",
  "AI agents & assistants",
]

const PLATFORM = [
  "Salesforce",
  "Dynamics 365",
  "Power Platform",
  "Copilot Studio",
  "Agentic AI · MCP",
  "SaleZx",
  "GoEd AI",
]

const SYSTEMS = ["SAP & ERP", "SharePoint", "Data warehouse", "Excel & reports"]

const INDUSTRIES =
  "Manufacturing · Medical devices · Machinery & equipment · FMCG & consumer goods · Building materials · Education · Professional services"

export function CapabilityMap() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-[0_28px_70px_-38px_rgba(20,26,60,0.32)]">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-ink-50/60 px-4 py-2.5">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-500">
          What Zoxima delivers
        </span>
        <span className="font-mono text-[0.6875rem] text-ink-400">
          one platform · every system
        </span>
      </div>

      <div className="p-4 lg:p-5">
        {/* ---- what gets built ---- */}
        <Reveal>
          <p className="zx-eyebrow">Applications we build</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {APPLICATIONS.map((a) => (
              <li
                key={a}
                className="rounded-md border border-line bg-paper px-2.5 py-1.5 text-[0.8125rem] text-ink-700"
              >
                {a}
              </li>
            ))}
          </ul>
        </Reveal>

        <Connector />

        {/* ---- the platform ---- */}
        <Reveal delay={0.1}>
          <div className="rounded-xl bg-navy-600 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/70">
                Zoxima platform
              </p>
              <p className="font-mono text-[0.625rem] text-white/60">
                built once · governed centrally
              </p>
            </div>

            <RevealGroup as="ul" className="mt-3 flex flex-wrap gap-1.5" stagger={0.05}>
              {PLATFORM.map((p) => (
                <RevealItem
                  as="li"
                  key={p}
                  className="rounded-md bg-white/12 px-2.5 py-1.5 text-[0.8125rem] font-medium text-white ring-1 ring-inset ring-white/20"
                >
                  {p}
                </RevealItem>
              ))}
            </RevealGroup>

            <p className="mt-3 border-t border-white/15 pt-2.5 text-[0.75rem] leading-relaxed text-white/70">
              Consulting, implementation and delivery — plus routing, access
              control and audit applied in one place rather than per project.
            </p>
          </div>
        </Reveal>

        <Connector />

        {/* ---- systems of record ---- */}
        <Reveal delay={0.15}>
          <p className="zx-eyebrow">Systems of record</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {SYSTEMS.map((s) => (
              <li
                key={s}
                className="rounded-md border border-line bg-ink-50/60 px-2.5 py-1.5 text-[0.8125rem] text-ink-700"
              >
                {s}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ---- who it is built for ---- */}
        <Reveal delay={0.2}>
          <p className="mt-4 border-t border-line pt-3 text-[0.75rem] leading-relaxed text-ink-500">
            <span className="font-medium text-ink-700">Built for:</span>{" "}
            {INDUSTRIES}
          </p>
        </Reveal>
      </div>
    </div>
  )
}

/** Flowing dashes — the same motion language as the hero's connectors. */
function Connector() {
  return (
    <div className="flex justify-center gap-1.5 py-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="zx-flow h-4 w-px [background-image:repeating-linear-gradient(180deg,var(--zx-navy-600)_0_4px,transparent_4px_9px)] [background-size:1px_9px]"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
  )
}
