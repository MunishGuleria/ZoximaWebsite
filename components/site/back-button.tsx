"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * "Back" for phones: returns to the page you came from on this site. If you
 * arrived from elsewhere (a search result, a shared link), it goes to the
 * fallback instead — the parent section, else home — so it never leaves the
 * site. Hidden on desktop (lg and up).
 */
export function BackButton({ fallback = "/", className }: { fallback?: string; className?: string }) {
  const router = useRouter()

  const goBack = () => {
    let sameSite = false
    try {
      sameSite = !!document.referrer && new URL(document.referrer).origin === window.location.origin
    } catch {}
    if (sameSite && window.history.length > 1) router.back()
    else router.push(fallback)
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={cn(
        "zx-glass-btn inline-flex min-h-10 items-center gap-1.5 rounded-full border border-ink-950/10 bg-white/80 pl-3 pr-4 text-sm font-medium text-ink-800 shadow-[0_6px_16px_-12px_rgba(15,27,45,0.4)] backdrop-blur-sm transition-transform active:scale-[0.97] lg:hidden",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Back
    </button>
  )
}
