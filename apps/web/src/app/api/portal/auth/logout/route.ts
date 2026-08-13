import { NextResponse } from "next/server";
import { PORTAL_SESSION_COOKIE, verifyCsrf } from "@apex/auth";
import { destroyPortalSession } from "@/lib/portal/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/portal/auth/logout — revoke the session and clear the cookie.
 *
 * Caller: the sign-out button in the portal chrome
 * (`(portal)/portal/(protected)/layout.tsx`), which posts an ordinary HTML form
 * so sign-out works without JavaScript.
 *
 * Form posts carry a signed CSRF pair. Without it, any site could log a signed-in
 * user out with a hidden auto-submitting form — minor as attacks go, but free to
 * prevent. A JSON caller is same-origin by fetch policy and is answered in kind.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const isForm =
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");

  if (isForm) {
    const form = await request.formData().catch(() => null);
    const token = String(form?.get("csrf") ?? "");
    const signature = String(form?.get("csrfSignature") ?? "");

    if (!token || !signature || !verifyCsrf(token, signature)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 403 });
    }
  }

  await destroyPortalSession();

  if (isForm) {
    // Redirect the browser rather than leaving it on a JSON body. 303 forces
    // the follow-up to be a GET.
    const res = NextResponse.redirect(new URL("/portal/login", request.url), 303);
    res.cookies.set(PORTAL_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PORTAL_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
