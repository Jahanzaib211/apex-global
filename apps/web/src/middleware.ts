import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The self-hosted Hyperswitch widget app's webpack runtime hardcodes its
 * public path as the domain root, so dynamic chunks are fetched from
 * `/src_...`, `/vendors-...`, and `/assets/...`. Those paths don't exist on
 * the web app (it serves its own assets under `/_next/static/...`), so we
 * proxy them upstream to the web SDK container at 127.0.0.1:9056.
 *
 * Also adds X-Frame-Options: DENY to every response EXCEPT the widget app
 * paths — the widget loads inside an iframe on the portal checkout page and
 * must be frameable.
 */
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