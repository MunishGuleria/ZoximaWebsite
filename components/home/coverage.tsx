"use client"

import { Reveal } from "@/components/motion/reveal"
import { StackingCards, StackingCardItem } from "@/components/home/stacking-cards"

const PILLARS: StackingCardItem[] = [
  {
    title: "Sales",
    subtitle: "From the first enquiry to cash in the bank.",
    accentColor: "blue",
    image: "/sales.webp",
    items: [
      "Lead and enquiry management",
      "CRM and account management",
      "Pricing, quotes and CPQ",
      "Field sales",
      "Distributor and dealer management",
      "Schemes, incentives and loyalty",
      "Order management and Direct Store Delivery",
      "Order to invoice",
      "Collections and credit",
      "Sales reviews and forecasting",
    ],
  },
  {
    title: "Service",
    subtitle: "Every customer answered, every contract renewed.",
    accentColor: "green",
    image: "/service.webp",
    items: [
      "Service CRM and case management",
      "Field service",
      "Installed base and assets",
      "Service contracts and warranty",
      "Spare parts and service orders",
      "Customer support on voice, chat and email",
      "SLA and service performance",
    ],
  },
  {
    title: "Operations and commercials",
    subtitle: "Invoices, approvals and payouts, done without chasing.",
    accentColor: "purple",
    image: "/operations.webp",
    items: [
      "Invoice processing",
      "Approvals",
      "Reconciliation",
      "Commissions and payouts",
    ],
  },
]

export function Coverage() {
  return (
    <section id="coverage" className="relative border-t border-line py-16 lg:py-24 overflow-visible">
      <div className="zx-container overflow-visible">
        {/* Header Introduction matching Zoxima_Website_Content_v2.docx Section 4 */}
        <Reveal>
          <div className="max-w-3xl mb-10 lg:mb-12">
            <h2 className="zx-display-sm text-[2.25rem] text-ink-950 sm:text-[2.75rem] lg:text-[3rem]">
              Revenue systems,{" "}
              <span className="zx-serif text-navy-600">built for manufacturers.</span>
            </h2>
            <p className="zx-lead mt-3 text-[1rem] leading-relaxed text-ink-600 sm:text-[1.125rem]">
              From the first enquiry to the last service visit.
            </p>
          </div>
        </Reveal>

        {/* Scroll-Stacking Cards Container */}
        <div className="overflow-visible">
          <StackingCards
            cards={PILLARS}
            navHeight={104}
            offsetGap={20}
            cardStackStep={24}
            scaleFactor={0.96}
            dimOpacity={0.9}
          />
        </div>
      </div>
    </section>
  )
}
