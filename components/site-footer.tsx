import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Linkedin, Mail } from "lucide-react"
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
              <Linkedin className="h-4 w-4" aria-hidden="true" />
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
        <Reveal delay={0.1} className="border-t border-line py-4 text-[0.8125rem] text-ink-500">
          <p>© {year} Zoxima Solutions LLC · Fremont, California · Microsoft Solutions Partner · Salesforce Partner</p>
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
