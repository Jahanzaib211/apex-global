/**
 * Apex Group of Companies — Next.js 14 production config.
 *
 * Mirrors the apex-holdings playbook:
 *   - strict security headers (CSP, HSTS, X-Frame-Options, etc.)
 *   - lean image proxy allowlist
 *   - telemetry off in production
 *   - poweredByHeader disabled
 *   - reactStrictMode kept on
 *
 * PM2 serves this with `pnpm --filter @apex/group start` (i.e. `next start`),
 * per infra/ecosystem.config.cjs — not a standalone server bundle.
 */

const isProd = process.env.NODE_ENV === "production";

const csp = [
  "default-src 'self'",
  // chat.apexgroupcompanies.com is the group's self-hosted Chatwoot. The widget
  // needs five directives, not just script-src: it loads /packs/js/sdk.js
  // (script), mounts its UI in an iframe (frame), polls and opens a websocket
  // (connect, including wss:), renders agent avatars and attachments (img), and
  // plays a notification sound (media). Miss any one and the widget fails
  // silently — the SDK is injected client-side, so a CSP refusal appears only
  // in the browser console, never in page source or a curl.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://chat.apexgroupcompanies.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://chat.apexgroupcompanies.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://chat.apexgroupcompanies.com wss://chat.apexgroupcompanies.com",
  "frame-src 'self' https://chat.apexgroupcompanies.com",
  "media-src 'self' https://chat.apexgroupcompanies.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Download-Options", value: "noopen" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

if (isProd) securityHeaders.push({ key: "Content-Security-Policy", value: csp });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  images: {
    // Unoptimized avoids a runtime dependency on sharp on the deploy host.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-slot"],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
    ];
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
