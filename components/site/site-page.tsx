import type { Metadata } from "next"
import { Reveal } from "@/components/site/reveal"
import { SiteFooter } from "@/components/site-footer"
import { AccentTitle, CtaButton, PageHero, accentFor } from "@/components/site/page-hero"
import { PageSections } from "@/components/site/sections"
import { visualFor } from "@/lib/site/media"
import { ORGANIZATION_SCHEMA, SALEZX_SCHEMA } from "@/lib/site/schema"
import type { Closing, PageContent } from "@/lib/site/types"

/* --------------------------------------------------------------------------
   Page shell for every content-driven page: hero → sections → closing →
   footer, plus BreadcrumbList structured data. Metadata comes from the doc's
   SEO title/description via pageMetadata().
   -------------------------------------------------------------------------- */

const SITE_URL = "https://www.zoxima.com"
const CLOSING_LINE = "Week after week, the small things get done, and the big numbers follow."

export function pageMetadata(page: Pick<PageContent, "route" | "seoTitle" | "seoDescription">): Metadata {
  return {
    // The doc's SEO titles already include "| Zoxima", so bypass the template.
    title: { absolute: page.seoTitle },
    description: page.seoDescription,
    alternates: { canonical: page.route, types: { "application/rss+xml": [{ url: "/rss.xml", title: "Zoxima case studies" }] } },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${page.route}`,
      siteName: "Zoxima",
      title: page.seoTitle,
      description: page.seoDescription,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: page.seoTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.seoDescription,
      images: ["/og-image.png"],
    },
  }
}

export function ClosingSection({ closing }: { closing: Closing }) {
  return (
    <section className="zx-backdrop-close relative isolate overflow-hidden border-t border-line/70">
      <div className="zx-container zx-section text-center">
        <div className="mx-auto max-w-4xl rounded-[32px] px-6 py-10 sm:px-12 sm:py-14 border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_24px_60px_-34px_rgba(31,42,97,0.35)] [backdrop-filter:blur(20px)_saturate(1.5)] [-webkit-backdrop-filter:blur(20px)_saturate(1.5)]">
        {closing.h2 && (
          <Reveal as="h2" className="zx-display mx-auto max-w-3xl text-[2rem] leading-[1.1] tracking-[-0.035em] text-ink-950 sm:text-[2.75rem] lg:text-[3.25rem]">
            <AccentTitle text={closing.h2} accent={accentFor(closing.h2, "sales operation")} />
          </Reveal>
        )}
        {closing.body && (
          <Reveal as="p" index={1} className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
            {closing.body}
          </Reveal>
        )}
        <Reveal index={2} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {/* The main offer leads: a contact button (any /contact link, e.g.
              /contact?topic=…) is the filled one; otherwise the page's order. */}
          {[...closing.ctas]
            .sort((a, b) => Number(b.href.startsWith("/contact")) - Number(a.href.startsWith("/contact")))
            .map((cta, i) => (
              <CtaButton key={cta.label} cta={cta} variant={i === 0 ? "primary" : "secondary"} />
            ))}
        </Reveal>
        <Reveal as="p" index={3} className="mt-10 text-[0.9375rem] font-medium text-ink-500">
          {CLOSING_LINE}
        </Reveal>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   Structured data per page, as one @graph: the page itself (typed by what it
   is), its breadcrumb, and what the page is about — a Service for capability
   and industry pages, an Article for case studies, Salezx for /products, and
   an FAQPage wherever the page shows an FAQ. Every node points back to the
   Organization and WebSite defined on the home page (@id), so answer engines
   attribute it all to Zoxima Solutions LLC. Copy comes from the page data.
   -------------------------------------------------------------------------- */
const ORG = { "@id": `${SITE_URL}/#organization` }
const WEBSITE = { "@id": `${SITE_URL}/#website` }

function pageType(route: string) {
  if (route === "/about") return "AboutPage"
  if (route === "/contact") return "ContactPage"
  if (["/case-studies", "/industries", "/capabilities", "/solutions", "/partners"].includes(route)) return "CollectionPage"
  return "WebPage"
}

function PageJsonLd({ page, label }: { page: PageContent; label: string }) {
  const url = `${SITE_URL}${page.route}`
  const trail = [{ label: "Home", href: "/" }, ...(page.crumbs ?? []), { label, href: page.route }]
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.href === "/" ? "" : c.href}`,
    })),
  }
  const webPage = {
    "@type": pageType(page.route),
    "@id": `${url}#webpage`,
    url,
    name: page.seoTitle,
    description: page.seoDescription,
    inLanguage: "en-US",
    isPartOf: WEBSITE,
    publisher: ORG,
    about: ORG,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` },
  }
  const graph: Record<string, unknown>[] = [ORGANIZATION_SCHEMA, webPage, breadcrumb]

  const isCase = page.route.startsWith("/case-studies/")
  const isService = /^\/(capabilities|industries|partners)\/.+/.test(page.route)
  if (isService) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: label,
      serviceType: label,
      description: page.sub,
      url,
      provider: ORG,
      areaServed: { "@type": "Country", name: "United States" },
      mainEntityOfPage: { "@id": `${url}#webpage` },
    })
  }
  if (isCase) {
    graph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      headline: page.h1,
      description: page.seoDescription,
      articleSection: "Case study",
      url,
      image: page.visual?.kind === "photo" ? `${SITE_URL}${page.visual.src}` : `${SITE_URL}/og-image.png`,
      author: ORG,
      publisher: ORG,
      inLanguage: "en-US",
      mainEntityOfPage: { "@id": `${url}#webpage` },
    })
  }
  if (page.route === "/products") graph.push(SALEZX_SCHEMA)
  for (const s of page.sections) {
    if (s.kind === "faq") {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: s.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      })
    }
  }
  return (
    <script
      type="application/ld+json"
      // Static, authored data — no user input reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  )
}

export function SitePage({
  page,
  label,
  children,
  heroExtra,
  heroAside,
  sections,
  layout,
}: {
  page: PageContent
  /** Short page name for breadcrumbs (defaults to the H1). */
  label?: string
  /** Extra content rendered after the hero, before the data sections. */
  children?: React.ReactNode
  /** Extra content inside the hero, under the buttons (e.g. tags). */
  heroExtra?: React.ReactNode
  /** Right-hand column of the hero (e.g. the contact form). */
  heroAside?: React.ReactNode
  /** Page-specific section layouts, rendered instead of the generic kit. */
  sections?: React.ReactNode
  /** A page's own layout, replacing both the hero and the sections
   *  (case studies). Structured data, closing and footer stay. */
  layout?: React.ReactNode
}) {
  // Short page name: the doc's SEO titles are "<Name> | Zoxima…".
  const name = label ?? page.seoTitle.split(" | ")[0]
  return (
    <>
      <PageJsonLd page={page} label={name} />
      <main id="main" className="zx overflow-x-clip">
        {layout ?? (
          <>
            <PageHero page={page} label={name} visual={visualFor(page)} aside={heroAside}>
              {heroExtra}
            </PageHero>
            {children}
            {sections ?? <PageSections sections={page.sections} />}
          </>
        )}
        {page.closing && <ClosingSection closing={page.closing} />}
      </main>
      <SiteFooter />
    </>
  )
}
