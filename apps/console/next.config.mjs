/** @type {import('next').NextConfig} */

/**
 * The console shipped four headers and no CSP, while the four public brochure
 * sites each carried a full one. It is the surface with the lead PII, the
 * billing editor, the AI provider keys and the RBAC admin — an injection here
 * is worth more than one on a marketing page.
 *
 * Stricter than the public sites in two ways: no third-party origin is
 * allowed at all (the console talks only to itself), and `frame-ancestors` is
 * 'none' to match the existing X-Frame-Options: DENY.
 *
 * `script-src` keeps 'unsafe-inline'/'unsafe-eval' because Next's App Router
 * inlines its hydration payload; moving to per-request nonces is the next step
 * and is tracked with the same change on apps/web.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'self'",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export default {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@apex/ui", "@apex/db", "@apex/ai"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          // The console is never indexed. It is an internal surface and its
          // URLs should not appear in a search result.
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Content-Security-Policy", value: csp },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};
