import "server-only";
import { prisma } from "@apex/db";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

/**
 * Console authentication.
 *
 * A signed, httpOnly session cookie carrying only the user id — permissions are
 * read from the database on every request rather than baked into the token, so
 * revoking a role takes effect immediately instead of whenever the token
 * happens to expire.
 */

const COOKIE = "apex_console_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // one working day

/** Wrong password attempts before the account locks. */
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is not set. Generate one with `openssl rand -base64 32`.");
  }
  return new TextEncoder().encode(value);
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  permissions: string[];
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "locked" | "inactive"; message: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

  // Same generic message whether the address is unknown or the password is
  // wrong. Distinguishing them turns the login form into a way of discovering
  // which addresses have accounts.
  const invalid: LoginResult = {
    ok: false,
    reason: "invalid",
    message: "Those credentials were not recognised.",
  };

  if (!user?.passwordHash) {
    // Burn comparable time so a missing account is not detectably faster.
    await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
    return invalid;
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return {
      ok: false,
      reason: "locked",
      message: "This account is temporarily locked. Try again shortly.",
    };
  }

  if (!user.isActive) {
    return { ok: false, reason: "inactive", message: "This account has been deactivated." };
  }

  const matches = await bcrypt.compare(password, user.passwordHash);

  if (!matches) {
    const failed = user.failedLogins + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLogins: failed,
        lockedUntil:
          failed >= MAX_FAILED_LOGINS
            ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
            : user.lockedUntil,
      },
    });
    return invalid;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() },
  });

  const token = await new SignJWT({ sub: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return { ok: true };
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/**
 * Current user with live permissions, or null.
 * Cached per request so a page with six permission checks makes one query.
 */
export const currentUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    userId = payload.sub;
  } catch {
    // Expired or tampered. Treated identically: no session.
    return null;
  }

  const user = await prisma.user.findFirst({
    where: { id: userId, isActive: true },
    include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
  });
  if (!user) return null;

  const permissions = new Set<string>();
  for (const link of user.roles) {
    for (const rp of link.role.permissions) permissions.add(rp.permission.key);
  }

  return { id: user.id, email: user.email, name: user.name, permissions: [...permissions] };
});

export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

/**
 * Authorisation check for a mutation.
 *
 * Called in the server action itself, not only where the UI decides whether to
 * render a button. Hiding a control is presentation; this is the control.
 */
export async function requirePermission(permission: string): Promise<SessionUser> {
  const user = await requireUser();
  if (!user.permissions.includes(permission)) {
    throw new Error(`FORBIDDEN: ${permission}`);
  }
  return user;
}

export function can(user: SessionUser | null, permission: string): boolean {
  return !!user?.permissions.includes(permission);
}
