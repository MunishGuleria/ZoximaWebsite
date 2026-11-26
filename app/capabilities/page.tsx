import { CapabilitySections, PillarRows } from "@/components/capabilities/sections"
import { SitePage, pageMetadata } from "@/components/site/site-page"
import { CAPABILITY_PILLARS } from "@/lib/site/content/capabilities-industries"
import { pageFor } from "@/lib/site/pages"

const page = pageFor("/capabilities")

export const metadata = pageMetadata(page)

export default function Page() {
  return (
    <SitePage
      page={page}
      sections={
        <>
          <PillarRows pillars={CAPABILITY_PILLARS} />
          <CapabilitySections page={page} />
        </>
      }
    />
  )
}
