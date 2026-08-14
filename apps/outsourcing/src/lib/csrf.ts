/**
 * Double-submit cookie CSRF protection for same-origin form posts.
 * Pattern: server sets a token cookie (readable by JS) AND expects the same
 * token in a request header. Attacker cross-origin can't read the cookie.
 *
 * Usage in route handlers:
 *   if (!(await verifyCsrf(req, formData.get("_csrf")))) return 403;
 */

import { randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "apex_csrf";
const HEADER_NAME = "x-csrf-token";
const FORM_FIELD = "_csrf";

export async function ensureCsrfCookie(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const token = randomBytes(24).toString("base64url");
  // Note: caller must attach cookie to outgoing response via next/headers cookie API
  return token;
}

export function setCsrfCookieHeader(token: string): {
  name: string;
  value: string;
  options: Record<string, unknown>;
} {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: false, // intentionally readable so the client can mirror it into the header
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    },
  };
}

export async function verifyCsrf(_req: Request, provided: string | null): Promise<boolean> {
  const jar = await cookies();
  const cookie = jar.get(COOKIE_NAME)?.value;
  if (!cookie || !provided) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(provided);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const CSRF_HEADER = HEADER_NAME;
export const CSRF_FIELD = FORM_FIELD;
