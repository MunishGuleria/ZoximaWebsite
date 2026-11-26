import { SitePage, pageMetadata } from "@/components/site/site-page"
import { pageFor } from "@/lib/site/pages"

const page = pageFor("/about")

export const metadata = pageMetadata(page)

export default function Page() {
  return <SitePage page={page} />
}
