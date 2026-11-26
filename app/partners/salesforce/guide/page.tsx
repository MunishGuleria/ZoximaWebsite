import { SitePage, pageMetadata } from "@/components/site/site-page"
import { GuideCard, GuideHub } from "@/components/site/guide-hub"
import { SF_GUIDE_ROUTE } from "@/lib/site/content/salesforce-guide"
import { pageFor } from "@/lib/site/pages"

/* The Salesforce guide hub (prototype screen 3). The hero line adds how the
   guide works: the start of each section is free, the full guide is emailed. */
const page = pageFor(SF_GUIDE_ROUTE)
const hero = {
  ...page,
  sub: `${page.sub} Read the start of any section free. Get the full guide by email.`,
}

export const metadata = pageMetadata(page)

export default function Page() {
  return (
    <SitePage
      page={hero}
      label="Salesforce guide"
      heroEyebrow="Free guide for Salesforce users"
      heroAside={<GuideCard />}
      sections={<GuideHub />}
    />
  )
}
