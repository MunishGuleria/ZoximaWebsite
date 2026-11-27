import { permanentRedirect } from "next/navigation"
import { SF_GUIDE_HUB } from "@/lib/site/content/salesforce-guide"

/* The guide hub is now a section of the Salesforce page (#guide). Old links
   and search results land there. The problem pages (/partners/salesforce/
   guide/<id>), the form (/get) and the thank-you page stay where they are. */
export default function Page() {
  permanentRedirect(SF_GUIDE_HUB)
}
