/* --------------------------------------------------------------------------
   The serif accent on headings (content pages): the closing word(s) of a
   heading set in the italic serif, in navy. Shared by server and client
   components, so it imports nothing.
   -------------------------------------------------------------------------- */

/** The serif accent for a heading: the given one, else the last word when the
 *  heading has two or more words and the last is a real word (4+ letters). */
export function accentFor(text: string, explicit?: string) {
  if (explicit && text.endsWith(explicit)) return explicit
  const words = text.trim().split(/\s+/)
  if (words.length < 2) return undefined
  const last = words[words.length - 1]
  return last.replace(/[^A-Za-z]/g, "").length >= 4 ? last : undefined
}

export function AccentTitle({ text, accent }: { text: string; accent?: string }) {
  if (!accent || !text.endsWith(accent)) return <>{text}</>
  const head = text.slice(0, text.length - accent.length)
  return (
    <>
      {head}
      <span className="zx-serif text-navy-600">{accent}</span>
    </>
  )
}
