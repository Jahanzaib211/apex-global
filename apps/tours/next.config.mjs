/**
 * Apex Global Tours & Travels — production config.
 *
 * The app shipped with no `next.config.mjs` at all after the migration, which
 * meant **no security headers** at all — no CSP, no HSTS, no X-Frame-Options —
 * while its sibling sites all served the full set.
 *
 * Brought to the same baseline as apps/holdings and apps/group. The only
 * deliberate difference is `images.remotePatterns`: this site loads no remote
 * images, so the allowlist stays empty rather than carrying an unsplash entry
 * it never uses.
 */

const isProd = process.env.NODE_ENV === "production";

// Google's font hosts are deliberately absent from every directive.
// fonts.googleapis.com was in *script-src*, which it never needed — it serves
// a stylesheet, not a script — and README.md lists "no external script hosts
// in the CSP" as a non-negotiable. All four sites now self-host their fonts
// through next/font/local, so neither googleapis nor gstatic is fetched at all.
const csp = [
  "default-src 'self'",
  // chat.apexgroupcompanies.com is the group's self-hosted Chatwoot. The widget
  // needs five directives, not just script-src: it loads /packs/js/sdk.js
  // (script), mounts its UI in an iframe (frame), polls and opens a websocket
  // (connect, including wss:), renders agent avatars and attachments (img), and
  // plays a notification sound (media). Miss any one and the widget fails
  // silently — the SDK is injected client-side, so a CSP refusal appears only
  // in the browser console, never in page source or a curl.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://chat.apexgroupcompanies.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://chat.apexgroupcompanies.com",
  "font-src 'self' data:",
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
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
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
  // Workspace packages ship TypeScript source, not a build artifact, so Next
  // has to compile them alongside the app.
  transpilePackages: ["@apex/motion"],
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  images: {
    // `unoptimized: true` was set to "avoid a runtime dependency on sharp on
    // the deploy host". The cost was no srcset, no AVIF/WebP and full-size
    // originals on mobile: tours served a 1367x1289, 56 KB logo.png for a 44px
    // header mark, which Lighthouse scored `uses-responsive-images` 0.5 on
    // every page. sharp is now a workspace dependency, so the optimizer runs.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [{ source: "/home", destination: "/", permanent: true }];
  },
};

export default nextConfig;
