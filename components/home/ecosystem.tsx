import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { TechChip } from "./tech-chip"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

/* --------------------------------------------------------------------------
   Partnerships and the stack Zoxima delivers on.

   Grouped rather than listed flat: a buyer scanning for "do they do Power
   Platform" or "do they run on AWS" should find their column immediately.
   Every name here is a capability Zoxima already states publicly. Logos
   render automatically once a rights-cleared SVG lands in public/logos/.
   -------------------------------------------------------------------------- */

/* The AppExchange URL is Zoxima's real consulting listing, verified against
   the live page (company name matches). No public Microsoft partner-directory
   URL was findable, so that badge points at the service page instead of an
   invented link — send it over and I will swap it in. */
const APPEXCHANGE =
  "https://appexchange.salesforce.com/appxConsultingListingDetail?listingId=a0N3A00000FnDXAUA3"

const PARTNERS = [
  { slug: "salesforce-partner", name: "Salesforce Partner", href: APPEXCHANGE, external: true },
  { slug: "microsoft-partner", name: "Microsoft Partner", href: "/services/apps-automations", external: false },
  { slug: "appexchange", name: "AppExchange Listed", href: APPEXCHANGE, external: true },
]

const GROUPS = [
  {
    title: "Salesforce",
    href: "/services/salesforce-crm",
    items: ["Salesforce", "Sales & Service Cloud", "Experience Cloud", "AppExchange"],
  },
  {
    title: "Microsoft",
    href: "/services/apps-automations",
    items: [
      "Dynamics 365",
      "Power Platform",
      "Power Apps",
      "Power Automate",
      "Power BI",
      "Copilot Studio",
      "Microsoft Copilot",
      "Teams",
      "SharePoint",
    ],
  },
  {
    title: "Cloud & data",
    href: "/services/apps-automations",
    items: ["Microsoft Azure", "AWS", "SAP", "Data warehouse"],
  },
  {
    title: "AI & automation",
    href: "/services/ai-implementation",
    items: ["Azure OpenAI", "OpenAI", "Anthropic", "LangChain", "MCP", "n8n"],
  },
  {
    title: "Engineering",
    href: "/services/apps-automations",
    items: ["Pro-code development", "Custom integrations", "Mobile apps", "APIs"],
  },
]

export function Ecosystem() {
  return (
    <section
      aria-label="Partnerships and technology stack"
      className="relative border-t border-line bg-paper-sunken/70 py-12 lg:py-24"
    >
      <div
        className="zx-dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(60rem_30rem_at_50%_0%,black,transparent_80%)]"
        aria-hidden="true"
      />
      <div className="zx-container relative">
        {/* Partnerships — given real weight rather than a footnote */}
        <div className="grid gap-x-12 gap-y-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Reveal>
              <p className="zx-eyebrow flex items-center gap-2.5">
                <span className="inline-block h-px w-7 bg-navy-600" aria-hidden="true" />
                Partnerships
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="zx-display-sm mt-4 text-[2rem] text-ink-950 sm:text-[2.5rem] lg:text-[2.875rem]">
                Partnerships & the stack we{" "}
                <span className="zx-serif text-navy-600">deliver on</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="zx-lead mt-5 max-w-xl">
                Certified on both platforms, and fluent across the tools around
                them. Drag a chip if you like — they push back.
              </p>
            </Reveal>
          </div>

          <RevealGroup as="ul" className="flex flex-wrap items-center gap-2.5" stagger={0.06}>
            {PARTNERS.map((p) => (
              <RevealItem as="li" key={p.slug}>
                <Link
                  href={p.href}
                  {...(p.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex items-center gap-2 rounded-full border border-navy-border bg-navy-soft px-5 py-2.5 shadow-sm transition-colors hover:border-navy-600 hover:bg-navy-600"
                >
                  <BrandMark
                    slug={p.slug}
                    name={p.name}
                    className="h-5 w-auto"
                    textClassName="text-[0.9375rem] font-semibold text-navy-600 group-hover:text-white"
                  />
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-navy-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden="true"
                  />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* The stack, grouped */}
        <RevealGroup
          className="mt-10 grid gap-x-8 gap-y-9 rounded-2xl border border-line bg-paper-raised p-5 shadow-[0_24px_60px_-44px_rgba(20,26,60,0.4)] sm:grid-cols-2 sm:p-7 lg:mt-12 lg:grid-cols-5 lg:p-9"
          stagger={0.05}
        >
          {GROUPS.map((group) => (
            <RevealItem key={group.title}>
              <Link
                href={group.href}
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-navy-600"
              >
                <h3 className="zx-eyebrow transition-colors group-hover:!text-navy-600">
                  {group.title}
                </h3>
                <ArrowUpRight
                  className="h-3 w-3 text-ink-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-600"
                  aria-hidden="true"
                />
              </Link>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <TechChip key={item} label={item} />
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
