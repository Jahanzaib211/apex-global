import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@apex/db";
import { currentUser } from "@/lib/auth";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Mint a single-use impersonation link for a portal user.
 *
 * The admin opens the returned URL in a new tab; the portal redeems it by
 * creating a real portal session for that user (see the `(unauth)/impersonate`
 * page). The token is stored hashed in `portal_magic_links` with
 * `purpose = "impersonate"`, a 2-minute expiry and a `usedAt` stamp — the same
 * single-use machinery as email magic links, so a stolen or replayed URL dies
 * after one redemption.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const actor = await currentUser();
  if (!actor) return Response.json({ error: "unauthenticated" }, { status: 401 });
  if (!actor.permissions.includes("portal:admin")) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const user = await prisma.portalUser.findUnique({
    where: { id },
    include: { portalAccount: { select: { name: true } } },
  });
  if (!user) return Response.json({ error: "not-found" }, { status: 404 });
  if (!user.isActive) return Response.json({ error: "inactive" }, { status: 409 });
  if (!user.emailVerifiedAt) {
    return Response.json(
      { error: "Email not verified — impersonating an unverified account would bypass the verification step." },
      { status: 409 },
    );
  }

  const raw = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await prisma.portalMagicLink.create({
    data: { email: user.email, userId: user.id, tokenHash, purpose: "impersonate", expiresAt },
  });

  await audit({
    actor,
    action: "portal.impersonation_started",
    entityType: "PortalUser",
    entityId: user.id,
    summary: `Generated impersonation link for ${user.email} (${user.portalAccount.name})`,
  });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tech.apexgroupcompanies.com";
  return Response.json({ url: `${siteUrl}/portal/impersonate?token=${raw}` });
}