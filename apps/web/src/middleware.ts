import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The self-hosted Hyperswitch widget app's webpack runtime hardcodes its
 * public path as the domain root, so dynamic chunks are fetched from
 * `/src_...`, `/vendors-...`, and `/assets/...`. Those paths don't exist on
 * the web app (it serves its own assets under `/_next/static/...`), so we
 * proxy them upstream to the web SDK container at 127.0.0.1:9056.
 *
 * Also sets the frame policy and the Content-Security-Policy on every
 * response EXCEPT the widget app paths — the widget loads inside an iframe on
 * the portal checkout page and must be frameable, and it ships its own CSP as
 * a meta tag (see app/hyperswitch-sdk/[[...path]]/route.ts).
 *
 * Why here and not `next.config.mjs`: the frame policy is path-dependent, and
 * two overlapping `headers()` entries would send two CSP headers, which
 * browsers intersect rather than override. One place, one policy.
 *
 * This app shipped **no CSP at all** while its four sibling brochure sites
 * each carried a full one — and this is the app with the login, the client
 * portal, invoice PDFs and card payments. The directives that matter most
 * here are the ones that bound the damage of an injection:
 * `frame-ancestors` (clickjacking the portal), `form-action` (posting
 * credentials off-origin), `base-uri` (rewriting every relative URL) and
 * `connect-src` (exfiltration).
 *
 * `script-src` keeps 'unsafe-inline'/'unsafe-eval', matching the four sibling
 * sites: Next's App Router inlines hydration payloads, and the Hyperswitch
 * loader is a webpack bundle. Tightening this to per-request nonces is a
 * real improvement but it has to be done with the card flow exercised
 * end-to-end, because a CSP refusal inside the payment iframe surfaces only
 * in the browser console.
 */

/** The group's self-hosted Chatwoot; the only third-party origin this app talks to. */
const CHAT_ORIGIN = "https://chat.apexgroupcompanies.com";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${CHAT_ORIGIN}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${CHAT_ORIGIN}`,
  "font-src 'self' data:",
  `connect-src 'self' ${CHAT_ORIGIN} wss://chat.apexgroupcompanies.com`,
  // 'self' covers the payment widget: the loader and its iframes are served
  // same-origin through /hyperswitch-sdk/, not from a Hyperswitch CDN.
  `frame-src 'self' ${CHAT_ORIGIN}`,
  `media-src 'self' ${CHAT_ORIGIN}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Matches the X-Frame-Options: DENY set alongside it.
  "frame-ancestors 'none'",
].join("; ");
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (
    pathname.startsWith("/src_") ||
    pathname.startsWith("/vendors-") ||
    pathname.startsWith("/node_modules_") ||
    pathname.startsWith("/assets/")
  ) {
    const url = `http://127.0.0.1:9056${pathname}${request.nextUrl.search}`;
    return NextResponse.rewrite(url);
  }

  if (!pathname.startsWith("/hyperswitch-sdk/")) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Content-Security-Policy", CSP);
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  }
  return response;
}

export const config = {
  matcher: [
    "/src_:path*",
    "/vendors-:path*",
    "/node_modules_:path*",
    "/assets/:path*",
    "/((?!hyperswitch-sdk/).*)",
  ],
};