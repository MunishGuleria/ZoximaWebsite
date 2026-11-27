"use client"

import { useEffect } from "react"

/* --------------------------------------------------------------------------
   Links to #problem-<id> (the "Ten areas" list on the Salesforce page) scroll
   to that problem's card in the guide section and highlight it for a moment.
   Also runs when the page opens with such a hash. Renders nothing.
   -------------------------------------------------------------------------- */

const PREFIX = "#problem-"
const HIGHLIGHT_MS = 2400

function highlight(hash: string, smooth: boolean) {
  const el = document.getElementById(hash.slice(1))
  if (!el) return false
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  el.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto", block: "center" })
  el.removeAttribute("data-highlight")
  // Restart the highlight if the same card is clicked again.
  void el.offsetWidth
  el.setAttribute("data-highlight", "")
  window.setTimeout(() => el.removeAttribute("data-highlight"), HIGHLIGHT_MS)
  return true
}

export function ProblemCardHighlight() {
  useEffect(() => {
    if (window.location.hash.startsWith(PREFIX)) highlight(window.location.hash, false)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a")
      const href = a?.getAttribute("href") ?? ""
      if (!href.startsWith(PREFIX)) return
      if (!highlight(href, true)) return
      e.preventDefault()
      history.replaceState(null, "", href)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])
  return null
}
