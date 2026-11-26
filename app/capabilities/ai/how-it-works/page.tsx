import { CapabilitySections } from "@/components/capabilities/sections"
import { SitePage, pageMetadata } from "@/components/site/site-page"
import { pageFor } from "@/lib/site/pages"

const page = pageFor("/capabilities/ai/how-it-works")

export const metadata = pageMetadata(page)

export default function Page() {
  return <SitePage page={page} sections={<CapabilitySections page={page} />} />
}
