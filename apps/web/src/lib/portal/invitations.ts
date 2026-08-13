import { prisma } from "@apex/db";
import { createHash } from "node:crypto";
import { checkPasswordStrength, hashPassword, revokeAllPortalSessionsForUser } from "@apex/auth";
import { siteUrl } from "@/lib/site";

/**
 * Invitation links, built in one place.
 *
 * The page is a dynamic segment — `accept-invitation/[token]/page.tsx` — so the
 * token belongs in the path. Every emitter here previously used a `?token=`
 * query string, which matches no route at all and sent invitees to a 404.
 */
export function invitationPath(token: string): string {
  return `/portal/accept-invitation/${encodeURIComponent(token)}`;
}

/** The absolute link that goes in the invitation email. */
export function invitationUrl(token: string): string {
  return `${siteUrl()}${invitationPath(token)}`;
}

export type RedeemResult =
  { ok: true; userId: string } | { ok: false; status: 400 | 422; error: string };

/**
 * Redeem an invitation: set the password, verify the email, mark the invitation
 * accepted and revoke any sessions that predate the password change.
 *
 * Shared by the API route and the accept page's server action. The page used to
 * `fetch` its own API over the network to get here, which is why the route also
 * has to accept `multipart/form-data`.
 */
export async function redeemInvitation(input: {
  token: string;
  name: string;
  password: string;
}): Promise<RedeemResult> {
  const strength = checkPasswordStrength(input.password);
  if (!strength.ok) {
    return { ok: false, status: 422, error: strength.reasons.join(" ") };
  }

  const tokenHash = createHash("sha256").update(input.token).digest("hex");
  const invitation = await prisma.portalInvitation.findUnique({ where: { tokenHash } });
  if (!invitation || invitation.acceptedAt || invitation.expiresAt < new Date()) {
    return { ok: false, status: 400, error: "Invalid or expired invitation." };
  }

  // Reuse an existing user with the same email if one exists, otherwise create
  // a fresh one.
  const existing = await prisma.portalUser.findUnique({ where: { email: invitation.email } });
  const passwordHash = await hashPassword(input.password);

  // The transaction returns the id rather than re-querying for it afterwards:
  // the old re-query was non-null asserted and would throw on a null result.
  const userId = await prisma.$transaction(async (tx) => {
    let id: string;
    if (existing) {
      await tx.portalUser.update({
        where: { id: existing.id },
        data: {
          name: input.name,
          passwordHash,
          emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
          failedLogins: 0,
          lockedUntil: null,
        },
      });
      id = existing.id;
    } else {
      const user = await tx.portalUser.create({
        data: {
          email: invitation.email,
          name: input.name,
          passwordHash,
          emailVerifiedAt: new Date(),
          portalAccountId: invitation.portalAccountId,
          role: invitation.role,
        },
      });
      id = user.id;
    }

    await tx.portalInvitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    });

    await tx.portalAuditLog.create({
      data: {
        portalAccountId: invitation.portalAccountId,
        portalUserId: id,
        action: "user.invitation_accepted",
        entityType: "PortalInvitation",
        entityId: invitation.id,
        summary: `Accepted invitation to ${invitation.portalAccountId}`,
      },
    });

    return id;
  });

  // Anything issued before the password was set must not survive it.
  await revokeAllPortalSessionsForUser(userId);

  return { ok: true, userId };
}
