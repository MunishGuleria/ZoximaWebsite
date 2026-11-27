"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe"

/** `sub`: shown indented under the entry above it (e.g. Partners → Microsoft). */
type NavChild = { href: string; label: string; sub?: boolean }
type NavItem = {
  href: string
  label: string
  /** Path prefix that marks this item active, when it differs from href. */
  match?: string
  children?: NavChild[]
}

const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/capabilities",
    label: "Capabilities",
    children: [
      { href: "/capabilities/applications", label: "Applications" },
      { href: "/capabilities/automations", label: "Automations" },
      { href: "/capabilities/ai", label: "AI" },
      { href: "/capabilities/ai/how-it-works", label: "How our AI works" },
      { href: "/capabilities/platforms", label: "Platforms" },
      { href: "/solutions", label: "Solutions" },
    ],
  },
  {
    href: "/industries",
    label: "Industries",
    children: [
      { href: "/industries/manufacturing", label: "Manufacturing" },
      { href: "/industries/appliances-manufacturing", label: "Appliances manufacturing" },
      { href: "/industries/building-materials", label: "Building materials" },
      { href: "/industries/consumer-goods", label: "Consumer goods" },
      { href: "/industries/education", label: "Education" },
      { href: "/industries/digital-natives", label: "Digital natives" },
    ],
  },
  { href: "/products", label: "Products" },
  {
    href: "/partners/salesforce",
    label: "Partners",
    match: "/partners",
    children: [
      { href: "/partners/salesforce", label: "Salesforce" },
      { href: "/partners/microsoft", label: "Microsoft" },
    ],
  },
  { href: "/partners/salesforce/guide", label: "Guides" },
  { href: "/case-studies", label: "Case Studies" },
  {
    href: "/about",
    label: "Company",
    children: [
      { href: "/about", label: "About" },
      { href: "/security", label: "Security and trust" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

export function Navigation() {
  const pathname = usePathname()
  const reduced = useReducedMotionSafe()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close everything on navigation
  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
    setMobileSection(null)
  }, [pathname])

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  // Escape closes; click outside closes the desktop dropdown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpenMenu(null)
      setMobileOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [])

  const openNow = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(label)
  }, [])

  const closeSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140)
  }, [])

  // The longest matching top-level link wins, so /partners/salesforce/guide
  // marks "Guides", not "Partners".
  const matches = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))
  const active = NAV.filter((i) => matches(i.match ?? i.href)).sort(
    (a, b) => (b.match ?? b.href).length - (a.match ?? a.href).length
  )[0]
  const isActive = (href: string) => href === active?.href

  return (
    <header ref={navRef} className="fixed inset-x-0 top-0 z-50">
      {/* Frosted bar on its own layer. Only this layer's opacity transitions
          (compositor-only); the blur radius itself is never animated, which
          would re-blur the strip under the header on every frame. At 85%
          paper, a 12px blur reads the same as 24px at a quarter of the cost. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 border-b border-white/60 bg-paper/60 shadow-[inset_0_-1px_0_rgba(15,27,45,0.06),0_10px_30px_-26px_rgba(15,27,45,0.35)] [backdrop-filter:blur(18px)_saturate(1.6)] [-webkit-backdrop-filter:blur(18px)_saturate(1.6)] transition-opacity duration-300",
          scrolled || mobileOpen || openMenu ? "opacity-100" : "opacity-0"
        )}
      />
      <nav aria-label="Main" className="zx-container">
        <div className="flex h-20 items-center justify-between gap-6 lg:h-[104px]">
          {/* Wordmark — the asset is a square stacked lockup (mark over
              wordmark), so it needs real height for the wordmark to read. */}
          <Link
            href="/"
            aria-label="Zoxima — home"
            className="relative -m-2 flex shrink-0 items-center rounded-md p-2"
          >
            <Image
              src="/zoxima-logo.png"
              alt="Zoxima"
              width={200}
              height={200}
              priority
              sizes="(min-width: 1024px) 72px, 56px"
              className="h-14 w-auto lg:h-[4.5rem]"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openNow(item.label)}
                  onMouseLeave={closeSoon}
                >
                  <Link
                    href={item.href}
                    aria-expanded={openMenu === item.label}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(null)}
                    onFocus={() => openNow(item.label)}
                    className={cn(
                      "zx-glass-row flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-2 text-[0.875rem] transition-colors xl:px-3 xl:text-[0.9375rem]",
                      isActive(item.href)
                        ? "text-ink-950"
                        : "text-ink-600 hover:text-ink-950"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        openMenu === item.label && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </Link>

                  <div
                    className={cn(
                      "absolute left-1/2 top-full w-56 -translate-x-1/2 pt-2 transition-[opacity,translate] duration-200",
                      openMenu === item.label
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-1 opacity-0"
                    )}
                  >
                    <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_0_0_1px_rgba(15,27,45,0.06),0_24px_48px_-20px_rgba(10,14,25,0.3)] [backdrop-filter:blur(20px)_saturate(1.6)] [-webkit-backdrop-filter:blur(20px)_saturate(1.6)]">
                      <ul className="space-y-0.5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpenMenu(null)}
                              className={cn(
                                "zx-glass-row block rounded-lg py-2 text-[0.875rem] transition-colors hover:bg-ink-50 hover:text-ink-950",
                                child.sub
                                  ? "ml-3 border-l border-line pl-3 font-normal text-ink-600"
                                  : "px-3 font-medium text-ink-800"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "zx-glass-row whitespace-nowrap rounded-full px-2 py-2 text-[0.875rem] transition-colors xl:px-3 xl:text-[0.9375rem]",
                    isActive(item.href)
                      ? "text-ink-950"
                      : "text-ink-600 hover:text-ink-950"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
            {/* Menu button from the doc: "Contact us" */}
            <Link
              href="/contact"
              className="zx-sheen ml-2 inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-ink-950 px-4 text-[0.875rem] xl:ml-3 xl:px-5 font-medium text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98]"
            >
              Contact us
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="zx-glass-row -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-800 transition-colors hover:bg-ink-100 lg:hidden"
          >
            <AnimatePresence initial={false} mode="wait">
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={reduced ? false : { rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={reduced ? undefined : { rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="flex"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={reduced ? false : { rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={reduced ? undefined : { rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="flex"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            key="sheet"
            // Revealed with a clip instead of animating height: no layout
            // work per frame, and framer can hand it to the compositor.
            initial={reduced ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            exit={reduced ? undefined : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            transition={{ duration: 0.34, ease: EASE }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
          >
            <div className="max-h-[calc(100dvh-var(--zx-nav-h))] overflow-y-auto overscroll-contain">
        <div className="zx-container py-5">
          <motion.ul
            className="space-y-0.5"
            initial={reduced ? false : "hidden"}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } } }}
          >
            {NAV.map((item) => (
              <motion.li
                key={item.label}
                variants={{
                  // `transform` (not `y`) so framer runs it off the main thread.
                  hidden: { opacity: 0, transform: "translateY(8px)" },
                  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.35, ease: EASE } },
                }}
              >
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileSection(
                          mobileSection === item.label ? null : item.label
                        )
                      }
                      aria-expanded={mobileSection === item.label}
                      className="zx-glass-row flex w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-base text-ink-900 transition-colors hover:bg-ink-50"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-ink-500 transition-transform duration-200",
                          mobileSection === item.label && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {mobileSection === item.label && (
                      <ul className="mb-2 ml-3 space-y-0.5 border-l border-line pl-3">
                        <li>
                          <Link
                            href={item.href}
                            className="zx-glass-row block rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium text-ink-800 transition-colors hover:bg-ink-50"
                          >
                            All {item.label.toLowerCase()}
                          </Link>
                        </li>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "zx-glass-row block rounded-lg py-2.5 text-[0.9375rem] text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-950",
                                child.sub ? "ml-3 border-l border-line pl-3" : "px-3"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="zx-glass-row block rounded-lg px-3 py-3.5 text-base text-ink-900 transition-colors hover:bg-ink-50"
                  >
                    {item.label}
                  </Link>
                )}
              </motion.li>
            ))}
          </motion.ul>

          <Link
            href="/contact"
            className="zx-glass-btn mt-5 flex h-11 w-full items-center justify-center rounded-xl border border-line-strong text-[0.875rem] font-medium text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-950"
          >
            Contact us
          </Link>

          <p className="mt-4 px-3 text-sm text-ink-500">
            Or email{" "}
            <a href="mailto:info@zoxima.com" className="text-ink-800 underline underline-offset-4">
              info@zoxima.com
            </a>
          </p>
        </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
