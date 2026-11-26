/* /.well-known/security.txt (RFC 9116): where to report a security issue.
   Expires must stay in the future; renew it yearly. */
export const dynamic = "force-static"

export function GET() {
  const body = [
    "Contact: mailto:info@zoxima.com",
    "Expires: 2027-11-30T00:00:00.000Z",
    "Preferred-Languages: en",
    "Canonical: https://www.zoxima.com/.well-known/security.txt",
    "Policy: https://www.zoxima.com/security",
    "",
  ].join("\n")
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
