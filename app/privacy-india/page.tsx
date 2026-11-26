import { permanentRedirect } from "next/navigation"

/* The India privacy policy is now a section of the one Privacy Policy. */
export default function Page() {
  permanentRedirect("/privacy#india")
}
