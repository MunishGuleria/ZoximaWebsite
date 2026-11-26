import { SitePage, pageMetadata } from "@/components/site/site-page"
import { CaseStudyLibrary } from "@/components/site/case-study-library"
import { CASE_STUDIES_PAGE } from "@/lib/site/content/case-studies"

export const metadata = pageMetadata(CASE_STUDIES_PAGE)

export default function CaseStudiesPage() {
  return (
    <SitePage page={CASE_STUDIES_PAGE} label="Case studies">
      <CaseStudyLibrary />
    </SitePage>
  )
}
