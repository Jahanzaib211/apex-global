const isProd = process.env.NODE_ENV === "production";

// Google's font hosts are deliberately absent from every directive.
// fonts.googleapis.com was in *script-src*, which it never needed — it serves
// a stylesheet, not a script — and README.md lists "no external script hosts
// in the CSP" as a non-negotiable. All four sites now self-host their fonts
// through next/font/local, so neither googleapis nor gstatic is fetched at all.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://chat.apexgroupcompanies.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://chat.apexgroupcompanies.com",
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

const nextConfig = {
  reactStrictMode: true,
  // Workspace packages ship TypeScript source, not a build artifact, so Next
  // has to compile them alongside the app.
  transpilePackages: ["@apex/motion"],
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
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
