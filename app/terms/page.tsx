import { SitePage, pageMetadata } from "@/components/site/site-page"
import { LegalDoc } from "@/components/site/legal-doc"
import { TERMS_SECTIONS } from "@/lib/site/content/company"
import { pageFor } from "@/lib/site/pages"

const page = pageFor("/terms")

export const metadata = pageMetadata(page)

export default function Page() {
  return <SitePage page={page} sections={<LegalDoc sections={TERMS_SECTIONS} />} />
}
