/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,

  // The design system and DB client are workspace TypeScript, not build output.
  transpilePackages: ["@apex/ui", "@apex/db"],

  experimental: {
    optimizePackageImports: ["@apex/ui"],
  },

  // Self-contained server bundle for the PM2 deploy.

  async rewrites() {
    return [
      // The /hyperswitch-api/* paths are handled by the route handler at
      // apps/web/src/app/hyperswitch-api/[...path]/route.ts, which adds the
      // API key and wallets-field shims the self-hosted router requires.
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
