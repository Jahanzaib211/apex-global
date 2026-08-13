import "server-only";
import { prisma } from "@apex/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  checkLimit,
  issueCsrfToken,
  issueMagicLink,
  sendMagicLink,
  signInAttemptPolicy,
  signInEmailPolicy,
  verifyPassword,
} from "@apex/auth";
import { issuePortalSession, PORTAL_SESSION_COOKIE, PORTAL_SESSION_TTL_SECONDS } from "@apex/auth";
import { clientIp } from "@/lib/portal/auth";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FAILED = 5;
const LOCK_MINUTES = 15;

/**
 * Portal sign-in.
 *
 * Two modes on the same endpoint:
 *   - password: email + password
 *   - magic:    email only (the response is always "we sent a link" so the
 *               endpoint does not leak whether an account exists)
 *
 * On success, a session cookie is set. On failure, the IP and email are
 * rate-limited and the account is locked after MAX_FAILED attempts.
 */

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().max(200).nullish(),
  magic: z.boolean().optional(),
  next: z.string().nullish(),
});

export async function POST(request: Request) {
  const ip = await clientIp();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details." }, { status: 422 });
  }
  const input = parsed.data;

  // Rate limit per IP + per email, before we touch the database.
  if (
    checkLimit({
      key: `ip:${ip}`,
      max: signInAttemptPolicy.max,
      windowMs: signInAttemptPolicy.windowMs,
    }).ok === false
  ) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again shortly." },
      { status: 429 },
    );
  }
  // Per-email as well as per-IP: the IP limiter alone does nothing against a
  // distributed guess at one account. The result of this call used to be
  // discarded, so the policy existed but never refused anything.
  if (
    checkLimit({
      key: `email:${input.email}`,
      max: signInEmailPolicy.max,
      windowMs: signInEmailPolicy.windowMs,
    }).ok === false
  ) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again shortly." },
      { status: 429 },
    );
  }

  const user = await prisma.portalUser.findUnique({
    where: { email: input.email },
    include: { portalAccount: true },
  });

  if (input.magic) {
    // Magic-link path. Always respond with the same shape regardless of
    // whether the account exists — no enumeration.
    if (user && user.isActive && user.emailVerifiedAt) {
      const link = issueMagicLink({ email: user.email, purpose: "sign-in" });
      await prisma.portalMagicLink.create({
        data: {
          email: user.email,
          userId: user.id,
          tokenHash: link.hash,
          purpose: "sign-in",
          expiresAt: link.expiresAt,
          ipAddress: ip,
        },
      });
      const url = `${siteUrl()}/portal/auth/magic?token=${encodeURIComponent(link.raw)}`;
      await sendMagicLink({ to: user.email, url, ttlHours: 24 });
    }
    return NextResponse.json({ ok: true });
  }

  // Password path.
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Those credentials were not recognised." }, { status: 401 });
  }
  if (!user.isActive) {
    return NextResponse.json({ error: "This account has been deactivated." }, { status: 403 });
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return NextResponse.json(
      { error: "This account is temporarily locked. Try again in a few minutes." },
      { status: 423 },
    );
  }
  if (!user.emailVerifiedAt) {
    return NextResponse.json(
      { error: "Please verify your email before signing in. Check your inbox for the link." },
      { status: 403 },
    );
  }

  const ok = await verifyPassword(input.password ?? "", user.passwordHash);
  if (!ok) {
    const failed = user.failedLogins + 1;
    await prisma.portalUser.update({
      where: { id: user.id },
      data: {
        failedLogins: failed,
        lockedUntil:
          failed >= MAX_FAILED ? new Date(Date.now() + LOCK_MINUTES * 60_000) : user.lockedUntil,
      },
    });
    return NextResponse.json({ error: "Those credentials were not recognised." }, { status: 401 });
  }

  // If 2FA is on, the password alone is not enough — the login form will
  // require a TOTP code in a follow-up step. For v1 we treat password +
  // 2FA as one flow: the user submits the password, then we redirect to
  // a `/portal/auth/totp` challenge page that accepts the code.
  if (user.totpEnabledAt) {
    const csrf = issueCsrfToken();
    // We do not have a `pendingTotp` table; use a short-lived signed cookie.
    const res = NextResponse.json({ ok: true, requiresTotp: true });
    res.cookies.set("apex_portal_totp_pending", `${user.id}.${csrf}`, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 5 * 60,
    });
    return res;
  }

  const session = issuePortalSession();
  await prisma.portalSession.create({
    data: {
      userId: user.id,
      tokenHash: session.hash,
      expiresAt: session.expiresAt,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent")?.slice(0, 500),
    },
  });
  await prisma.portalUser.update({
    where: { id: user.id },
    data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() },
  });
  await prisma.portalAuditLog.create({
    data: {
      portalAccountId: user.portalAccountId,
      portalUserId: user.id,
      action: "user.signed_in",
      entityType: "PortalUser",
      entityId: user.id,
      summary: "Signed in via password",
      ipAddress: ip,
    },
  });

  const target =
    input.next && input.next.startsWith("/") && !input.next.startsWith("//")
      ? input.next
      : "/portal/";

  const res = NextResponse.json({ ok: true, next: target });
  res.cookies.set(PORTAL_SESSION_COOKIE, session.raw, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PORTAL_SESSION_TTL_SECONDS,
  });
  return res;
}
