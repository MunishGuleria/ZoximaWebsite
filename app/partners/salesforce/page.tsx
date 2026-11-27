import { SitePage, pageMetadata } from "@/components/site/site-page"
import { SalesforcePage } from "@/components/site/salesforce-page"
import { SALESFORCE_PAGE } from "@/lib/site/content/partner-salesforce"

export const metadata = pageMetadata(SALESFORCE_PAGE.page)

export default function Page() {
  return <SitePage page={SALESFORCE_PAGE.page} label="Salesforce" layout={<SalesforcePage data={SALESFORCE_PAGE} />} />
}
