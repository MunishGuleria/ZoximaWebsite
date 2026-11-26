import type { Section } from "@/lib/site/types"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const titleOf = (s: Section) => ("title" in s && s.title ? s.title : null)

/** Anchor id per section (null for untitled ones), de-duplicated. */
export function sectionIds(sections: Section[]): (string | null)[] {
  const seen = new Map<string, number>()
  return sections.map((s) => {
    const title = titleOf(s)
    if (!title) return null
    const base = slugify(title) || "section"
    const n = seen.get(base) ?? 0
    seen.set(base, n + 1)
    return n ? `${base}-${n + 1}` : base
  })
}

/** The page's titled sections, in order, for the hero's "On this page". */
export function sectionIndex(sections: Section[]): { id: string; title: string }[] {
  const ids = sectionIds(sections)
  return sections.flatMap((s, i) => {
    const title = titleOf(s)
    const id = ids[i]
    return title && id ? [{ id, title }] : []
  })
}
