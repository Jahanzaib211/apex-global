import { NextResponse } from "next/server";
import { z } from "zod";
import { Pool } from "pg";
import { clientIp } from "@/lib/portal/auth";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(200) });

// apex-portal: bypass Prisma entirely for this path. The bundled Prisma engine
// (7.1.1-3.c299...) conflicts with our 6.19.3 client version and falls back
// to a TLS reconnect path that fails on the host's missing CA bundle. Going
// directly through pg is simpler, faster, and idempotent.
declare global {
  var __apexPortalPool: Pool | undefined;
}
function pool(): Pool {
  if (!globalThis.__apexPortalPool) {
    globalThis.__apexPortalPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 4,
      idleTimeoutMillis: 10_000,
    });
  }
  return globalThis.__apexPortalPool;
}

export async function POST(request: Request) {
  const ip = await clientIp();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email." }, { status: 422 });

  try {
    return await handleForgot(parsed.data.email, ip);
  } catch (err) {
    const e = err as unknown as { code?: string; message?: string; meta?: unknown; stack?: string };
    console.error("[forgot] fatal", {
      code: e?.code,
      message: e?.message,
      meta: e?.meta,
      stack: e?.stack,
    });
    // The detail goes to the log, not to the caller. This route is
    // unauthenticated, and database error codes and messages describe the
    // schema to anyone willing to provoke a failure.
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function handleForgot(email: string, ip: string) {
  // Lazy-load the auth helpers that depend on Prisma via @apex/auth.
  // Importing at the top of the module pulls Prisma into the bundle and
  // triggers the broken engine version compare at module-eval time.
  const [
    { checkLimit, passwordResetPolicy },
    { issueMagicLink, hashMagicLink },
    { sendPasswordReset },
  ] = await Promise.all([
    import("@apex/auth").then((m) => ({
      checkLimit: m.checkLimit,
      passwordResetPolicy: m.passwordResetPolicy,
    })),
    import("@apex/auth").then((m) => ({
      issueMagicLink: m.issueMagicLink,
      hashMagicLink: m.hashMagicLink,
    })),
    import("@apex/auth").then((m) => ({ sendPasswordReset: m.sendPasswordReset })),
  ]);

  // Rate-limit per email.
  if (!checkLimit({ key: `pwd-reset:${email}`, ...passwordResetPolicy }).ok) {
    return NextResponse.json({ ok: true });
  }

  const client = await pool().connect();
  try {
    const userRes = await client.query(
      'SELECT id, "isActive", "emailVerifiedAt" FROM "portal_users" WHERE email = $1',
      [email],
    );
    const user = userRes.rows[0];
    if (user && user.isActive && user.emailVerifiedAt) {
      const link = issueMagicLink({ email, purpose: "reset" });
      const tokenHash = hashMagicLink(link.raw);
      await client.query(
        `INSERT INTO "portal_password_resets" ("id", "userId", "tokenHash", "expiresAt", "ipAddress", "createdAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, NOW())`,
        [user.id, tokenHash, link.expiresAt, ip],
      );
      const url = `${siteUrl()}/portal/reset-password?token=${encodeURIComponent(link.raw)}`;
      // Email delivery is a best-effort side effect: the reset token is already
      // persisted above, so a mail-transport failure must not fail the request.
      // A 500 here would only ever fire for an existing, verified account —
      // leaking that the address is one — and would deny a legitimate user the
      // ability to retry. Log the transport error and return the same
      // privacy-preserving response as every other branch.
      try {
        await sendPasswordReset({ to: email, url, ttlMinutes: 60 });
      } catch (mailErr) {
        console.error("[forgot] reset email delivery failed", {
          message: (mailErr as { message?: string })?.message,
        });
      }
    }
  } finally {
    client.release();
  }

  // Always return the same response regardless of account existence.
  return NextResponse.json({ ok: true });
}
