import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { Reveal } from "@/components/motion/reveal"

/* Proof strip under the hero: three open columns divided by hairlines (no
   boxes). The project count, then each partnership as a large name with its
   proof underneath; the partner columns link to their practice pages and turn
   navy on hover. Names are typeset until the official partner badges are
   dropped into public/logos (see its README); then BrandMark shows the file. */
const PARTNERS = [
  {
    slug: "salesforce-partner",
    name: "Salesforce",
    tier: "Partner",
    proof: "4.97 from 41 reviews · 75+ projects",
    stars: true,
    href: "/partners/salesforce",
  },
  {
    slug: "microsoft-partner",
    name: "Microsoft",
    tier: "Solutions Partner",
    proof: "3 designations · Agentic Business Solutions",
    stars: false,
    href: "/partners/microsoft",
  },
]

export function ProofBar() {
  return (
    <section aria-label="Proof strip" className="border-y border-line bg-white">
      <div className="zx-container">
        <Reveal>
          <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex flex-col justify-center py-6 sm:py-8 sm:pr-8">
              <p className="text-[2.25rem] font-semibold leading-none tracking-[-0.04em] text-ink-950 sm:text-[2.75rem]">90+</p>
              <p className="mt-2 text-[0.9375rem] text-ink-600">large enterprise projects</p>
            </div>
            {PARTNERS.map((p) => (
              <Link key={p.slug} href={p.href} className="group flex flex-col justify-center py-6 sm:px-8 sm:py-8">
                <span className="flex items-center gap-3">
                  <BrandMark
                    slug={p.slug}
                    name={p.name}
                    className="h-9 opacity-100 grayscale-0"
                    textClassName="text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-ink-950 transition-colors duration-300 group-hover:text-navy-600 sm:text-[2rem]"
                  />
                  <span className="text-[0.75rem] font-semibold uppercase leading-tight tracking-[0.08em] text-navy-600">{p.tier}</span>
                  <ArrowRight
                    className="ml-auto h-5 w-5 shrink-0 text-ink-300 transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-navy-600"
                    aria-hidden
                  />
                </span>
                <span className="mt-2.5 flex items-center gap-2 text-[0.9375rem] text-ink-600">
                  {p.stars && (
                    <span className="flex gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-ink-950 text-ink-950" />
                      ))}
                    </span>
                  )}
                  {p.proof}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
