import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

/* Twenty-five shipped use cases, by function. Lifted verbatim from the
   existing use-case catalog so nothing here is invented. */
const FUNCTIONS = [
  {
    name: "Sales & Distribution",
    items: ["Field Sales Super App", "Van Sales (DSD) App", "Sales Assistant AI Bot", "Lead & Opportunity Scoring", "Cross-Sell / Upsell AI"],
  },
  {
    name: "Customer & Partners",
    items: ["Customer Commerce Portal", "Dealer / Distributor Portal", "Vendor Onboarding & KYC", "Architect / Influencer App", "Customer Self-Service"],
  },
  {
    name: "Service & Operations",
    items: ["Field Service App", "Warranty & Claims", "Preventive Maintenance", "AI Knowledge Assistant", "Complaint Management"],
  },
  {
    name: "Finance & Compliance",
    items: ["Credit Control Workflow", "Invoice Processing", "Expense & Travel Approvals", "Budgeting & Forecasting", "Contract Management"],
  },
  {
    name: "Marketing, HR & R&D",
    items: ["Campaign Planning & Execution", "Event & BTL Management", "Product Launch Workflow", "Employee Self-Service App", "Strategic Workforce Planning"],
  },
]

/**
 * Layout note: a five-column index on a sunken ground. Dense by design —
 * this is the section an enterprise buyer scans for their own function.
 */
export function UseCases() {
  return (
    <section className="border-t border-line bg-paper-sunken/50 py-12 lg:py-14">
      <div className="zx-container">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
          <Reveal>
            <h2 className="zx-display-sm text-[1.875rem] text-ink-950 sm:text-[2.25rem] lg:text-[2.5rem]">
              Where it pays for itself{" "}
              <span className="zx-serif text-navy-600">first</span>
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
              Twenty-five use cases we have shipped across CRM, apps, automation and
              AI. Most engagements start with two to four of these.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="zx-swipe mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 sm:grid sm:gap-x-8 sm:gap-y-7 sm:overflow-visible sm:border-t sm:border-line sm:pb-0 sm:pt-7 sm:grid-cols-2 lg:grid-cols-5" stagger={0.05}>
          {FUNCTIONS.map((fn) => (
            <RevealItem
              key={fn.name}
              /* On a phone the five groups collapse into one column; without a
                 rule they read as a single 25-item list. Borders drop away at
                 `sm` where the grid gives its own separation. */
              className="w-[76%] shrink-0 snap-center rounded-xl border border-line bg-paper-raised p-5 sm:w-auto sm:shrink sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
            >
              <h3 className="text-[0.9375rem] font-semibold tracking-tight text-ink-950">{fn.name}</h3>
              <ul className="mt-3 space-y-2">
                {fn.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[0.875rem] leading-snug text-ink-600">
                    <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-navy-600/60" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
