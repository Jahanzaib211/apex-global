import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";
import { prisma } from "@apex/db";
import {
  consumePortalSession,
  PORTAL_SESSION_COOKIE,
  revokeAllPortalSessionsForUser,
  revokePortalSession,
  type PortalSessionContext,
  type SessionPortalUser,
} from "@apex/auth";

/**
 * Portal authentication.
 *
 * Every page inside `(portal)` calls `requirePortalUser()` on the server.
 * Pages that need the account call `requirePortalUserAccount()`. Both throw
 * or redirect to `/portal/login` rather than rendering nothing, so the user
 * always knows what happened.
 *
 * The session cookie is `apex_portal_session` and is bound to the portal
 * routes only — middleware on the marketing site never reads it.
 */

export async function currentPortalUser(): Promise<SessionPortalUser | null> {
  const store = await cookies();
  const token = store.get(PORTAL_SESSION_COOKIE)?.value;
  if (!token) return null;

  const ctx = await consumePortalSession(token);
  return ctx?.user ?? null;
}

export async function requirePortalUser(next?: string): Promise<SessionPortalUser> {
  const user = await currentPortalUser();
  if (!user) {
    const target = next ? `/portal/login?next=${encodeURIComponent(next)}` : "/portal/login";
    redirect(target);
  }
  return user!;
}

export async function requirePortalUserAccount(next?: string): Promise<PortalSessionContext> {
  await requirePortalUser(next);
  const store = await cookies();
  const token = store.get(PORTAL_SESSION_COOKIE)?.value;
  if (!token) redirect("/portal/login");
  const ctx = await consumePortalSession(token!);
  if (!ctx) redirect("/portal/login");
  return ctx!;
}

/**
 * Destroy the current session: revoke it server-side, write the audit row and
 * clear the cookie.
 *
 * The single implementation behind both sign-out entry points — the
 * `POST /api/portal/auth/logout` route and the `signOutPortal` server action.
 * Two copies of this drifted: the route's audit lookup ran *after* the revoke,
 * so whenever revoking deleted the session row the sign-out went unrecorded.
 * The user id is resolved first here for exactly that reason.
 */
export async function destroyPortalSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(PORTAL_SESSION_COOKIE)?.value;

  if (token) {
    const session = await prisma.portalSession
      .findUnique({ where: { tokenHash: hashSessionToken(token) } })
      .catch(() => null);

    await revokePortalSession(token);

    if (session) {
      await prisma.portalAuditLog
        .create({
          data: {
            portalUserId: session.userId,
            action: "user.signed_out",
            entityType: "PortalUser",
            entityId: session.userId,
            summary: "Signed out",
          },
        })
        // An unrecorded sign-out must not fail the sign-out itself.
        .catch(() => undefined);
    }
  }

  store.delete(PORTAL_SESSION_COOKIE);
}

/** Sign out: thin wrapper for server actions and pages. */
export async function signOutPortal(): Promise<void> {
  await destroyPortalSession();
}

function hashSessionToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Sign out everywhere: revoke every session for the user. */
export async function signOutEverywherePortal(): Promise<void> {
  const user = await currentPortalUser();
  if (!user) return;
  await revokeAllPortalSessionsForUser(user.id);
  const store = await cookies();
  store.delete(PORTAL_SESSION_COOKIE);
}

/**
 * For the login page itself: bounce signed-in users to the portal home.
 * Otherwise they see the login form again, which is confusing.
 */
export async function redirectIfSignedIn(next?: string): Promise<void> {
  const user = await currentPortalUser();
  if (user) redirect(next && next.startsWith("/") ? next : "/portal/");
}

/** Best-effort client IP for rate-limit and audit logging. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("cf-connecting-ip") ?? h.get("x-real-ip") ?? "unknown";
}
