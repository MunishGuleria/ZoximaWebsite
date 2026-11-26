import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const INDUSTRIES = [
  { href: "/industries/manufacturing", label: "Manufacturing" },
  { href: "/industries/appliances-manufacturing", label: "Appliances manufacturing" },
  { href: "/industries/building-materials", label: "Building materials" },
  { href: "/industries/consumer-goods", label: "Consumer goods" },
  { href: "/industries/education", label: "Education" },
  { href: "/industries/digital-natives", label: "Digital natives" },
]

export function Industries() {
  return (
    <section id="industries" className="border-t border-line bg-paper-sunken/40 py-10 lg:py-16">
      <div className="zx-container">
        <Reveal>
          <h2 className="zx-display-sm text-[2rem] text-ink-950 sm:text-[2.5rem] lg:text-[2.75rem]">
            Deep in manufacturing.{" "}
            <span className="zx-serif text-navy-600">Proven beyond it.</span>
          </h2>
        </Reveal>

        <RevealGroup as="ul" className="mt-10 grid gap-4 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <RevealItem as="li" key={industry.label}>
              <Link
                href={industry.href}
                className="group flex items-center justify-between rounded-xl border border-line bg-paper-raised p-5 shadow-sm transition-all hover:border-navy-600/30 hover:shadow-md"
              >
                <span className="text-[1.0625rem] font-semibold text-ink-950 transition-colors group-hover:text-navy-600">
                  {industry.label}
                </span>
                <ArrowRight className="h-4 w-4 text-ink-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-navy-600" />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
