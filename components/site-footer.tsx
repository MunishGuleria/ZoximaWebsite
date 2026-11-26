import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Mail } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const CAPABILITIES = [
  { href: "/capabilities/applications", label: "Applications" },
  { href: "/capabilities/automations", label: "Automations" },
  { href: "/capabilities/ai", label: "AI" },
  { href: "/capabilities/ai/how-it-works", label: "How our AI works" },
  { href: "/capabilities/platforms", label: "Platforms" },
]

const WHAT_WE_DRIVE = [
  { href: "/solutions?s=lead-to-quote", label: "Lead to quote" },
  { href: "/solutions?s=pricing", label: "Pricing and quotes" },
  { href: "/solutions?s=order-to-invoice", label: "Order to invoice" },
  { href: "/solutions?s=collections", label: "Collections and credit" },
  { href: "/solutions?s=service-renewals", label: "Service renewals" },
  { href: "/solutions", label: "All solutions" },
]

const INDUSTRIES = [
  { href: "/industries/manufacturing", label: "Manufacturing" },
  { href: "/industries/appliances-manufacturing", label: "Appliances manufacturing" },
  { href: "/industries/building-materials", label: "Building materials" },
  { href: "/industries/consumer-goods", label: "Consumer goods" },
  { href: "/industries/education", label: "Education" },
  { href: "/industries/digital-natives", label: "Digital natives" },
]

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/partners", label: "Partners" },
  { href: "/security", label: "Security and trust" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
]

const PRODUCTS = [
  { href: "https://salezx.com", label: "Salezx", external: true },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="zx border-t border-line bg-paper-sunken/60 text-ink-600">
      <div className="zx-container">
        {/* Top: brand + contact, then the link columns (Products sits with
            them, so the brand column stays short). */}
        <div className="grid gap-x-10 gap-y-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3.2fr)] lg:py-10">
          <Reveal>
            <Link href="/" aria-label="Zoxima home" className="inline-block">
              <Image
                src="/zoxima-logo.png"
                alt="Zoxima"
                width={200}
                height={200}
                sizes="96px"
                className="h-20 w-auto sm:h-24"
              />
            </Link>

            <p className="mt-4 max-w-[17rem] text-[0.9375rem] leading-relaxed text-ink-700">
              Applications, automations and AI agents that run sales and service for large enterprises.
            </p>

            <a
              href="mailto:info@zoxima.com"
              className="group mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-navy-600 transition-colors hover:text-navy-700"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              info@zoxima.com
            </a>

            <a
              href="https://www.linkedin.com/company/zoxima/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2.5 flex w-fit items-center gap-2 text-[0.9375rem] font-medium text-ink-700 transition-colors hover:text-navy-600"
            >
              <LinkedInMark className="h-4 w-4" />
              Follow us on LinkedIn
              <ArrowUpRight
                className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>

            <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.875rem] text-ink-600">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-navy-600">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-navy-600">Terms of Service</Link>
              </li>
            </ul>
          </Reveal>

          <RevealGroup
            className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5"
            stagger={0.07}
            delay={0.05}
          >
            <RevealItem><FooterColumn title="Capabilities" links={CAPABILITIES} /></RevealItem>
            <RevealItem><FooterColumn title="What we drive" links={WHAT_WE_DRIVE} /></RevealItem>
            <RevealItem><FooterColumn title="Industries" links={INDUSTRIES} /></RevealItem>
            <RevealItem><FooterColumn title="Company" links={COMPANY} /></RevealItem>
            <RevealItem><FooterColumn title="Products" links={PRODUCTS} /></RevealItem>
          </RevealGroup>
        </div>

        {/* Bottom: legal line */}
        <Reveal delay={0.1} className="flex flex-col gap-3 border-t border-line py-4 text-[0.8125rem] text-ink-500 md:flex-row md:items-center md:justify-between">
          <p>© {year} Zoxima Solutions LLC · Fremont, California · Microsoft Solutions Partner · Salesforce Partner</p>
          <Link href="/security" className="w-fit transition-colors hover:text-navy-600">
            Security and trust
          </Link>
        </Reveal>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string; external?: boolean }[]
}) {
  return (
    <div>
      <h2 className="zx-eyebrow">{title}</h2>
      <ul className="mt-3 space-y-1.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.875rem] leading-snug text-ink-600 transition-colors hover:text-navy-600"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-[0.875rem] leading-snug text-ink-600 transition-colors hover:text-navy-600"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** LinkedIn "in" mark (lucide's brand icons are deprecated). */
function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}
