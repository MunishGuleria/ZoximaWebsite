import { SitePage, pageMetadata } from "@/components/site/site-page"
import { PartnerDetail } from "@/components/site/partner-detail"
import { SALESFORCE_PRACTICE } from "@/lib/site/content/partner-salesforce"

export const metadata = pageMetadata(SALESFORCE_PRACTICE.page)

export default function Page() {
  return <SitePage page={SALESFORCE_PRACTICE.page} label="Salesforce" layout={<PartnerDetail data={SALESFORCE_PRACTICE} />} />
}
