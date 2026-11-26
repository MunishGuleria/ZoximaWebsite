import { permanentRedirect } from "next/navigation"

/* Insights now lives as a section of the About page. */
export default function Page() {
  permanentRedirect("/about#insights")
}
