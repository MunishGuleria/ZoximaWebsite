import { SitePage, pageMetadata } from "@/components/site/site-page"
import { PartnerDetail } from "@/components/site/partner-detail"
import { MICROSOFT_PRACTICE } from "@/lib/site/content/partner-microsoft"

export const metadata = pageMetadata(MICROSOFT_PRACTICE.page)

export default function Page() {
  return <SitePage page={MICROSOFT_PRACTICE.page} label="Microsoft" layout={<PartnerDetail data={MICROSOFT_PRACTICE} />} />
}
