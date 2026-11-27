import { ArrowUpRight, Mail, MapPin, Sparkles } from "lucide-react"
import { ContactForm } from "@/components/site/contact-form"
import { SitePage, pageMetadata } from "@/components/site/site-page"
import { pageFor } from "@/lib/site/pages"
import { CONTACT_EMAIL } from "@/lib/site/content/company"
import { SALEZX_URL } from "@/lib/site/types"

const page = pageFor("/contact")

export const metadata = pageMetadata(page)

/* Contact, in the Salezx contact layout: the heading and the ways to reach
   us on the left, the form on the right, all in the hero. */

function Way({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 border-b border-ink-950/[0.08] py-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink-800 shadow-[0_6px_16px_-10px_rgba(31,42,97,0.45)]">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <p className="text-[0.9375rem] font-semibold text-ink-950">{label}</p>
        <div className="mt-0.5 text-[0.9375rem] leading-relaxed text-ink-600">{children}</div>
      </div>
    </li>
  )
}

export default function ContactPage() {
  const ways = (
    <ul className="max-w-md border-t border-ink-950/[0.08]">
      <Way icon={Mail} label="Email">
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-navy-600 hover:underline">
          {CONTACT_EMAIL}
        </a>
      </Way>
      <Way icon={MapPin} label="Headquarters">
        Fremont, California
      </Way>
      <Way icon={Sparkles} label="Interested in Salezx?">
        <a href={SALEZX_URL} target="_blank" rel="noopener noreferrer" className="group -my-2.5 inline-flex min-h-11 items-center gap-1 font-medium text-navy-600">
          Visit salezx.com
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </a>
      </Way>
    </ul>
  )
  return <SitePage page={page} label="Contact us" heroExtra={ways} heroAside={<ContactForm />} heroAsideFirst />
}
