import { SitePage, pageMetadata } from "@/components/site/site-page"
import { LegalDoc } from "@/components/site/legal-doc"
import { PRIVACY_SECTIONS } from "@/lib/site/content/company"
import { pageFor } from "@/lib/site/pages"

const page = pageFor("/privacy")

export const metadata = pageMetadata(page)

export default function Page() {
  return <SitePage page={page} sections={<LegalDoc sections={PRIVACY_SECTIONS} />} />
}
