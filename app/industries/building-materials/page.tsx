import { SitePage, pageMetadata } from "@/components/site/site-page"
import { pageFor } from "@/lib/site/pages"

const page = pageFor("/industries/building-materials")

export const metadata = pageMetadata(page)

export default function Page() {
  return <SitePage page={page} />
}
