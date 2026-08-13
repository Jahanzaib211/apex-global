import "server-only";

/**
 * Cookie-bound session for the portal.
 *
 * The cookie carries an opaque session id. The lookup is by hashed token —
 * the database never sees the plaintext, the cookie cannot be forged without
 * DB access. Revocation is a delete on the row.
 *
 * Sliding 8h expiry: a session that is used within the last hour has its
 * expiry extended on every authenticated request. Idle sessions expire.
 */

import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@apex/db";

export const PORTAL_SESSION_COOKIE = "apex_portal_session";
export const PORTAL_SESSION_TTL_SECONDS = 60 * 60 * 8;
export const PORTAL_SESSION_RENEW_THRESHOLD_SECONDS = 60 * 60;

const TOKEN_BYTES = 32;

export interface IssuedPortalSession {
  raw: string;
  hash: string;
  expiresAt: Date;
}

export function issuePortalSession(): IssuedPortalSession {
  const raw = randomBytes(TOKEN_BYTES).toString("base64url");
  const hash = hashSessionToken(raw);
  return {
    raw,
    hash,
    expiresAt: new Date(Date.now() + PORTAL_SESSION_TTL_SECONDS * 1000),
  };
}

export function hashSessionToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export interface SessionPortalUser {
  id: string;
  email: string;
  name: string;
  portalAccountId: string;
  portalAccountName: string;
  portalAccountSlug: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  emailVerifiedAt: Date | null;
  totpEnabled: boolean;
}

export interface PortalSessionContext {
  user: SessionPortalUser;
  expiresAt: Date;
}

export async function consumePortalSession(rawToken: string): Promise<PortalSessionContext | null> {
  const hash = hashSessionToken(rawToken);
  const session = await prisma.portalSession.findUnique({
    where: { tokenHash: hash },
    include: {
      user: {
        include: { portalAccount: true },
      },
    },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.portalSession.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  if (!session.user.isActive) {
    await prisma.portalSession.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }

  // Sliding expiry: extend if we're inside the renewal threshold.
  let expiresAt = session.expiresAt;
  const renewAt = new Date(
    session.expiresAt.getTime() - PORTAL_SESSION_RENEW_THRESHOLD_SECONDS * 1000,
  );
  if (new Date() > renewAt) {
    expiresAt = new Date(Date.now() + PORTAL_SESSION_TTL_SECONDS * 1000);
    await prisma.portalSession.update({
      where: { id: session.id },
      data: { expiresAt, lastSeenAt: new Date() },
    });
  } else {
    await prisma.portalSession.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    });
  }

  await prisma.portalUser.update({
    where: { id: session.user.id },
    data: { lastLoginAt: new Date(), failedLogins: 0, lockedUntil: null },
  });

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      portalAccountId: session.user.portalAccountId,
      portalAccountName: session.user.portalAccount.name,
      portalAccountSlug: session.user.portalAccount.slug,
      role: session.user.role,
      emailVerifiedAt: session.user.emailVerifiedAt,
      totpEnabled: session.user.totpEnabledAt !== null,
    },
    expiresAt,
  };
}

export async function revokePortalSession(rawToken: string): Promise<void> {
  const hash = hashSessionToken(rawToken);
  await prisma.portalSession.deleteMany({ where: { tokenHash: hash } });
}

export async function revokeAllPortalSessionsForUser(userId: string): Promise<void> {
  await prisma.portalSession.deleteMany({ where: { userId } });
}
