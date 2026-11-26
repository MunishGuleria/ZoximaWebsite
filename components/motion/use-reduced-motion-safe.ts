"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

/**
 * `useReducedMotion`, but false on the server and on the first client render,
 * so the markup hydrates identically whatever the visitor's setting (the
 * server cannot know it). The real setting applies right after mount; use it
 * where reduced motion changes what is rendered, not only how it animates.
 */
export function useReducedMotionSafe() {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && !!reduced
}
