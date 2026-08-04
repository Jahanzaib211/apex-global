import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "apex_console_session";
const PUBLIC_PATHS = ["/login"];

/**
 * Gate every console route at the edge.
 *
 * This only checks that the session signature is valid — it deliberately does
 * not check permissions. Authorisation needs the database, which middleware
 * cannot reach, and a permission check that runs in two places tends to drift.
 * Server actions do the real check; this just keeps signed-out users out.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;

  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return NextResponse.next();
    } catch {
      // Fall through to the redirect below.
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  // Preserve where they were heading so the login can return them there.
  url.searchParams.set("next", pathname);

  const response = NextResponse.redirect(url);
  if (token) response.cookies.delete(COOKIE);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
