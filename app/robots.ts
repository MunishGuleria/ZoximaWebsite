import type { MetadataRoute } from "next"

const SITE_URL = "https://zoxima.com"

/**
 * Replaces the old public/robots.txt, which was written for "Persimium" and
 * pointed the sitemap at persimum.com.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // AI search and answer engines: allowed by name, so the site can be
      // cited in ChatGPT, Claude, Perplexity, Gemini and Copilot answers.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Bingbot",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
