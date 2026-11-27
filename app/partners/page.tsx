import { permanentRedirect } from "next/navigation"

/* There is no partners overview page: the Partners menu lists the two
   practice pages directly, and old links to /partners land on Salesforce. */
export default function Page() {
  permanentRedirect("/partners/salesforce")
}
