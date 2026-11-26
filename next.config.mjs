/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dynamic Next.js app (no static export) so Route Handlers, the contact API,
  // ISR and next/image optimization all work in production.
  reactStrictMode: true,

  // A local test build can use its own folder (ZX_DIST_DIR=.next-build) so it
  // never shares .next with a running dev server. Unset everywhere else.
  ...(process.env.ZX_DIST_DIR ? { distDir: process.env.ZX_DIST_DIR } : {}),

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Resized AVIF/WebP copies stay cached on the CDN for 31 days instead of
    // being re-made every minute. Replacing an image? Give it a new file name.
    minimumCacheTTL: 2678400,
  },

  // Type errors fail the build, so a broken change can't be deployed.
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // "Redirects from the current site" table in Zoxima_Website_Content_v2.docx.
  // The old page files themselves were moved to _archive/ (not deployed).
  async redirects() {
    return [
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/services/ai-implementation', destination: '/capabilities/ai', permanent: true },
      { source: '/services/apps-automations', destination: '/capabilities/automations', permanent: true },
      { source: '/services/salesforce-crm', destination: '/partners/salesforce', permanent: true },
      { source: '/industries/cpg', destination: '/industries/consumer-goods', permanent: true },
      {
        source: '/industries/healthcare',
        destination: '/case-studies/healthcare-invoice-validation',
        permanent: true,
      },
      { source: '/demo', destination: '/contact', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/microsoft-azure', destination: '/partners/microsoft', permanent: true },
      { source: '/microsoft-implementation', destination: '/partners/microsoft', permanent: true },
      { source: '/chemicals-and-pharmaceuticals', destination: '/industries/manufacturing', permanent: true },
      // Not in the doc's table: old pages with no v2 equivalent.
      { source: '/services', destination: '/capabilities', permanent: true },
      // All ten solutions now live on one page with a filter (?s=<slug>).
      { source: '/solutions/:slug', destination: '/solutions?s=:slug', permanent: false },
      { source: '/industries/professional-services', destination: '/industries', permanent: true },
    ]
  },

  async headers() {
    return [
      // Images and fonts in /public: browsers keep them a day and refresh in
      // the background for a week (/_next/static is already cached forever).
      {
        source: '/:path*.:ext(svg|png|jpg|jpeg|webp|avif|gif|ico|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
