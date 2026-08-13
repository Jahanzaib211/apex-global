import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware.
 *
 * Two responsibilities:
 *
 *   1. Maintenance mode: when `ops.maintenance_mode` is `true` (signalled
 *      here by the cookie `apex_maintenance_mode`, set by the maintenance
 *      toggle in the /dev panel), all public traffic is redirected to
 *      `/maintenance` except the portal routes (clients still sign in) and
 *      the API routes (so internal services can keep working).
 *
 *   2. Public status banner: a non-blocking hint cookie is set on every
 *      response so client components can read the status and render a
 *      banner without a second round-trip.
 *
 * Reads and writes cookies only — never blocks the request on a database
 * hit. The actual settings live in `core.Setting` and are flipped by the
 * /dev panel.
 */

const PROTECTED_PATHS = [
  "/portal",
  "/api/portal",
  "/api/health",
  "/_next",
  "/maintenance",
  "/favicon",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  // The maintenance flag travels in a short-lived cookie that the /dev
  // panel sets when an operator toggles it. We also honour an explicit
  // ?maintenance=1 query for testing.
  const maintenanceCookie = request.cookies.get("apex_maintenance_mode")?.value;
  const maintenanceQuery = request.nextUrl.searchParams.get("maintenance");
  const inMaintenance = maintenanceCookie === "1" || maintenanceQuery === "1";

  // Status banner cookie — always set so the layout can read it without
  // a DB query on every render.
  const res = NextResponse.next();
  if (!request.cookies.get("apex_public_status")) {
    // Default to "operational" until the /dev panel sets something else.
    res.cookies.set("apex_public_status", "operational", {
      path: "/",
      sameSite: "lax",
      maxAge: 60,
    });
  }

  if (!inMaintenance || isProtected) return res;

  // Block lead-form submissions outright while in maintenance.
  if (pathname === "/api/leads" || pathname === "/api/demo-request") {
    return NextResponse.json(
      { error: "We are temporarily offline for maintenance. Please email us instead." },
      { status: 503 },
    );
  }

  // Redirect everything else to the holding page.
  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Run on everything except static assets, _next internals, the favicon
    // and the maintenance page itself.
    "/((?!_next/static|_next/image|favicon.ico|maintenance|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
