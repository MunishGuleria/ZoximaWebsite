import { SitePage, pageMetadata } from "@/components/site/site-page"
import { MicrosoftWork, SalesforceWork } from "@/components/home/partners"
import { pageFor } from "@/lib/site/pages"

const page = pageFor("/partners")

export const metadata = pageMetadata(page)

/* The partner sections from the home page (#salesforce, #microsoft), with
   links on to the full practice pages (/partners/salesforce, /partners/microsoft). */
export default function Page() {
  return (
    <SitePage
      page={page}
      sections={
        <>
          <SalesforceWork />
          <MicrosoftWork />
        </>
      }
    />
  )
}
