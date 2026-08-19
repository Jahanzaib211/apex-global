import { prisma } from "@apex/db";
import { issuePortalSession, PORTAL_SESSION_COOKIE } from "@apex/auth";
import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";

/**
 * Redeem an admin-issued impersonation link.
 *
 * The console mints the link (purpose = "impersonate", 2-minute TTL, stored
 * hashed like every other portal token); this route swaps it for a real portal
 * session for the target user and drops the session cookie, so the admin lands
 * inside the customer's portal as that customer. Single-use: `usedAt` is set
 * on first redemption and every redemption is audited on the portal side.
 *
 * The page that links here just renders a brief "one moment" screen; cookies
 * are only settable in a route handler, not during RSC render.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return Response.json({ error: "missing token" }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const link = await prisma.portalMagicLink.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!link || link.purpose !== "impersonate" || !link.userId || !link.user) {
    return Response.json({ error: "invalid link" }, { status: 400 });
  }
  if (link.usedAt) {
    return Response.json({ error: "already used" }, { status: 400 });
  }
  if (link.expiresAt < new Date()) {
    return Response.json({ error: "expired" }, { status: 400 });
  }
  if (!link.user.isActive) {
    return Response.json({ error: "account inactive" }, { status: 403 });
  }

  const session = issuePortalSession();
  await prisma.$transaction(async (tx) => {
    await tx.portalSession.create({
      data: {
        tokenHash: session.hash,
        userId: link.userId!,
        expiresAt: session.expiresAt,
        ipAddress: "console-impersonation",
        userAgent: "admin",
      },
    });
    await tx.portalMagicLink.update({ where: { id: link.id }, data: { usedAt: new Date() } });
    await tx.portalAuditLog.create({
      data: {
        portalAccountId: link.user!.portalAccountId,
        portalUserId: link.userId!,
        action: "admin.impersonated",
        entityType: "PortalUser",
        entityId: link.userId!,
        summary: "Signed in via an admin impersonation link",
      },
    });
  });

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${PORTAL_SESSION_COOKIE}=${session.raw}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 8}${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  );
  // 200 + Set-Cookie, not a redirect: the cookie must land on the same origin
  // the page was served from, and the client navigates to /portal/ itself.
  return Response.json({ ok: true }, { status: 200, headers });
}