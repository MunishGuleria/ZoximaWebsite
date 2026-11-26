"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/* --------------------------------------------------------------------------
   Case studies (doc Home §8): every customer story on one slow, endless
   carousel. Each card is a photo over a white body: the customer by size and
   sector, one line on what we built, and "Read" where a case study page
   exists. The track runs the list twice so it loops without a seam; hovering
   or tabbing into it pauses it. Reduced motion: no movement, the row
   scrolls sideways instead. Transform only.
   -------------------------------------------------------------------------- */
const STORIES: { title: string; description: string; image: string; href?: string }[] = [
  {
    // $9B: confirmed by Zoxima (doc had $[9]B).
    title: "A $9B building materials manufacturer",
    description: "Sales systems and AI for a nationwide partner network.",
    href: "/case-studies/building-materials-partner-network",
    image: "/images/pages/construction.webp",
  },
  {
    // ~10 million liters: figure confirmed by Zoxima (doc had [X]).
    title: "A bottled-water company shipping ~10 million liters a day",
    description: "Direct Store Delivery and a loyalty app for 2 million customers.",
    href: "/case-studies/bottled-water-direct-store-delivery",
    image: "/images/pages/bottle.webp",
  },
  {
    title: "A Fortune 500 corporate services company",
    description: "AI invoice processing, capex approvals and price intelligence.",
    href: "/case-studies/corporate-services-finance-operations",
    image: "/images/pages/corporate.webp",
  },
  {
    title: "A $900M wires and cables maker present in 85+ countries",
    description: "AI briefs and KPI alerts for leadership, across ERP, CRM and loyalty data.",
    href: "/case-studies/electrical-products-leadership-ai",
    image: "/images/pages/manufacturing.webp",
  },
  {
    title: "A snack foods brand sold in 100 countries",
    description: "AI agents working across retail and manufacturing operations.",
    href: "/case-studies/snack-foods-ai-agents",
    image: "/images/pages/consumer-goods.webp",
  },
  {
    title: "A $7B+ global technology company",
    description: "Promotional pricing built into the CRM, so every quote is priced right.",
    href: "/case-studies/technology-promotional-pricing",
    image: "/images/pages/applications.webp",
  },
  {
    title: "A national postal and logistics operator",
    description: "AI that reads customer enquiries and tags every case automatically.",
    href: "/case-studies/postal-case-tagging-ai",
    image: "/images/pages/ai.webp",
  },
  {
    title: "A medical imaging maker with 25,000+ installations in 110 countries",
    description: "Sales and service systems for field teams across the globe.",
    href: "/case-studies/medical-imaging-sales-service",
    image: "/images/pages/appliances.webp",
  },
  {
    title: "A leading hospital network",
    description: "AI that checks vendor invoices across six systems and calculates payouts automatically.",
    href: "/case-studies/healthcare-invoice-validation",
    image: "/images/pages/insights.webp",
  },
  {
    title: "A global visa and consular services company",
    description: "Voice AI that answers customer queries and sells add-on services.",
    href: "/case-studies/visa-services-voice-ai",
    image: "/images/pages/team.webp",
  },
  {
    title: "A digital-native company with 4,000+ sales users",
    description: "Sales and service on one CRM, across three businesses.",
    href: "/case-studies/marketplace-sales-service-crm",
    image: "/images/pages/digital-natives.webp",
  },
  {
    title: "A diversified industrial conglomerate",
    description: "Seven custom apps for approvals, sales targets and operations.",
    href: "/case-studies/conglomerate-approvals-sales-targets",
    image: "/images/pages/dashboard.webp",
  },
  {
    title: "An education company with a 1 million-user app",
    description: "CRM, business apps and a top-rated learning app on Android and iOS.",
    href: "/case-studies/education-crm-learning-app",
    image: "/images/pages/education.webp",
  },
  {
    title: "A building materials manufacturer",
    description: "Sales force and dealer management apps, connected to the CRM.",
    href: "/case-studies/building-materials-dealer-apps",
    image: "/images/pages/platforms.webp",
  },
  {
    title: "Logistics companies",
    description: "AI for recruitment, roster scheduling and compliance monitoring.",
    href: "/case-studies/logistics-workforce-ai",
    image: "/images/pages/automations.webp",
  },
]

/** Seconds for one full pass of the list: slow enough to read a card as it moves. */
const PASS_SECONDS = 150

const CARD =
  "group flex h-full w-[18rem] flex-col overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_20px_44px_-34px_rgba(15,27,45,0.45)] sm:w-[21rem]"

function StoryCard({ story, copy }: { story: (typeof STORIES)[number]; copy: boolean }) {
  const body = (
    <>
      <div className="relative h-40 overflow-hidden">
        <Image
          src={story.image}
          alt=""
          fill
          sizes="21rem"
          className="object-cover transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-ink-950">{story.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{story.description}</p>
        {story.href && (
          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-ink-950">
            Read
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 text-white transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </span>
        )}
      </div>
    </>
  )
  return story.href ? (
    // The second copy of the list is only there for the loop: out of the tab order.
    <Link
      href={story.href}
      tabIndex={copy ? -1 : undefined}
      className={`${CARD} transition-[translate,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-navy-border`}
    >
      {body}
    </Link>
  ) : (
    <div className={CARD}>{body}</div>
  )
}

export function Work() {
  const reduceMotion = useReducedMotionSafe()

  return (
    <section id="case-studies" className="border-t border-line py-16 lg:py-24">
      <div className="zx-container">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="zx-display-sm text-[2.25rem] text-ink-950 sm:text-[2.75rem] lg:text-[3rem]">
                Work that runs{" "}
                <span className="relative inline-block zx-serif text-navy-600">
                  every day
                  {/* Soft animated underline sweep */}
                  <svg
                    viewBox="0 0 170 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute -bottom-1.5 left-0 w-full h-3.5 overflow-visible pointer-events-none"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M 3 9 C 45 4, 120 4, 167 9"
                      stroke="#2563eb"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeOpacity="0.45"
                      // Same first render on server and client; reduced motion just skips the draw.
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={reduceMotion ? { pathLength: 1, opacity: 1 } : undefined}
                      whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Link
              href="/case-studies"
              className="zx-glass-btn group inline-flex items-center gap-2 rounded-xl border border-line-strong bg-paper px-6 py-3 text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:border-ink-400 hover:bg-ink-50"
            >
              See all case studies
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Every customer story, moving slowly. Full-bleed so cards enter and
          leave at the screen edges. */}
      <Reveal delay={0.1}>
        <div className="zx-marquee zx-fade-x mt-10 overflow-hidden py-3 motion-reduce:overflow-x-auto sm:mt-12 [&:focus-within_.zx-marquee-track]:[animation-play-state:paused]">
          <div className="zx-marquee-track" style={{ animationDuration: `${PASS_SECONDS}s` }}>
            {[false, true].map((copy) => (
              <ul key={String(copy)} aria-hidden={copy || undefined} className="flex shrink-0 items-stretch gap-4 pr-4 lg:gap-5 lg:pr-5">
                {STORIES.map((story) => (
                  <li key={story.title} className="flex">
                    <StoryCard story={story} copy={copy} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
