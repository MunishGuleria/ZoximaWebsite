import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { LiquidPointer } from "@/components/site/liquid-pointer"

/* --------------------------------------------------------------------------
   Typography
   The stylesheet already asked for Inter but no font was ever loaded, so every
   page silently fell back to system-ui. These three faces are the real system:
   Inter for interface + body, Instrument Serif for the editorial accent, and
   JetBrains Mono for eyebrows, figures and code.
   -------------------------------------------------------------------------- */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  // Italic only — the upright face was preloaded but never rendered, which
  // the browser flags as an unused-preload warning on every page load.
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const SITE_URL = "https://zoxima.com"

const SITE_DESCRIPTION =
  "Zoxima builds the applications, automations and AI agents that run sales and service for large enterprises."
const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "Zoxima: Large enterprises run their sales and service on systems we build." }

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Default title/description = the doc's home SEO copy; every page sets its own.
  title: {
    default: "Zoxima | Sales automation and enterprise AI",
    template: "%s | Zoxima",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Zoxima",
  authors: [{ name: "Zoxima Solutions LLC", url: SITE_URL }],
  creator: "Zoxima Solutions LLC",
  publisher: "Zoxima Solutions LLC",
  // Google ignores meta keywords; kept short and on-topic for other engines.
  keywords: [
    "sales automation",
    "sales operations",
    "enterprise AI",
    "AI agents",
    "Microsoft Dynamics 365",
    "Power Platform",
    "Salesforce",
    "order to cash",
    "collections automation",
    "service contract renewals",
    "Salezx",
  ],
  category: "technology",
  formatDetection: { email: false, address: false, telephone: false },
  // No canonical here: each page sets its own (a root canonical would be
  // inherited by pages that don't, e.g. the 404, pointing them at "/").
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Zoxima",
    title: "Zoxima | Sales automation and enterprise AI",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoxima | Sales automation and enterprise AI",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Icons come from app/icon.png and app/apple-icon.png (file conventions).
  // NOTE: `verification` intentionally omitted until Search Console / Bing
  // Webmaster Tools issue real codes.
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#171b26" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {/* Marks JS as running before first paint, so scroll reveals on the
            content pages (`.zx-js [data-zx-reveal]`) only hide content when
            something will bring it back. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('zx-js')" }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface-dark focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <Navigation />
        <LiquidPointer />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
