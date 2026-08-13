import { prisma } from "@apex/db";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";
import {
  issuePortalSession,
  PORTAL_SESSION_COOKIE,
  PORTAL_SESSION_TTL_SECONDS,
  verifyMagicLinkToken,
} from "@apex/auth";
import { clientIp } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Magic link", robots: { index: false, follow: false } };

/**
 * Magic-link landing page.
 *
 * The user clicks the link from their email. The URL carries the raw token;
 * we look it up by hash, verify expiry, mark it used, and issue a session.
 *
 * Single-use: marking `usedAt` ensures a leaked link is unusable after the
 * first sign-in. The redirect to `/portal/` carries the new session cookie.
 */
type Props = { searchParams: Promise<{ token?: string; next?: string }> };

export default async function MagicLinkPage({ searchParams }: Props) {
  const { token, next } = await searchParams;
  const ip = await clientIp();

  if (!token) {
    return (
      <Shell
        title="Missing token"
        error="The link is malformed. Request a new one from the sign-in page."
      />
    );
  }

  const link = await prisma.portalMagicLink.findUnique({
    where: { tokenHash: hashTokenForLookup(token) },
  });

  if (!link) {
    return (
      <Shell
        title="Invalid link"
        error="We could not find that link. It may already have been used or never existed."
      />
    );
  }

  if (link.usedAt) {
    return (
      <Shell
        title="Already used"
        error="This link has already been used. Request a new one from the sign-in page if you need to sign in again."
      />
    );
  }

  if (!verifyMagicLinkToken(token, link.tokenHash, link.expiresAt)) {
    return (
      <Shell
        title="Expired"
        error="This link has expired. Request a new one from the sign-in page."
      />
    );
  }

  const user = link.userId
    ? await prisma.portalUser.findUnique({
        where: { id: link.userId },
        include: { portalAccount: true },
      })
    : null;

  if (!user || !user.isActive) {
    return (
      <Shell
        title="Account unavailable"
        error="The account linked to this sign-in is no longer active."
      />
    );
  }

  await prisma.portalMagicLink.update({
    where: { id: link.id },
    data: { usedAt: new Date() },
  });

  const session = issuePortalSession();
  await prisma.portalSession.create({
    data: {
      userId: user.id,
      tokenHash: session.hash,
      expiresAt: session.expiresAt,
      ipAddress: ip,
      userAgent: "magic-link",
    },
  });
  await prisma.portalUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), failedLogins: 0, lockedUntil: null },
  });
  await prisma.portalAuditLog.create({
    data: {
      portalAccountId: user.portalAccountId,
      portalUserId: user.id,
      action: "user.signed_in",
      entityType: "PortalUser",
      entityId: user.id,
      summary: "Signed in via magic link",
      ipAddress: ip,
    },
  });

  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/portal/";
  const { cookies: cookieStore } = await import("next/headers");
  const c = await cookieStore();
  c.set(PORTAL_SESSION_COOKIE, session.raw, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PORTAL_SESSION_TTL_SECONDS,
  });
  redirect(target);
}

/**
 * Look up a magic link by the raw token. We store the SHA-256 hash of the
 * token, so we hash here for the lookup. Constant-time comparison happens
 * inside `verifyMagicLinkToken`.
 */
function hashTokenForLookup(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function Shell({ title, error }: { title: string; error: string }) {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        <h1 className="text-xl">{title}</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">{error}</p>
        <Link
          href="/portal/login"
          className="mt-6 inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 text-sm font-medium text-[var(--ink-on-accent)]"
        >
          Back to sign-in
        </Link>
      </div>
    </div>
  );
}
