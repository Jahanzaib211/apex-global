import { prisma } from "@apex/db";
import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { checkPasswordStrength, hashPassword, sendEmailVerification } from "@apex/auth";
import { clientIp } from "@/lib/portal/auth";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Self-serve signup.
 *
 * Creates a `PortalUser` with a placeholder `PortalAccount` so the row is
 * self-consistent before any operator invitation lands. Email verification
 * confirms the address. The user can sign in but sees no data until an
 * operator invites them to a real account.
 */

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(200),
});

const SIGNUP_TOKEN_BYTES = 32;

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

  const strength = checkPasswordStrength(input.password);
  if (!strength.ok) {
    return NextResponse.json({ error: strength.reasons.join(" ") }, { status: 422 });
  }

  const existing = await prisma.portalUser.findUnique({ where: { email: input.email } });
  if (existing) {
    // Don't leak existence: respond as if it succeeded.
    return NextResponse.json({ ok: true });
  }

  const passwordHash = await hashPassword(input.password);

  // Self-serve users start with no real account — create a holding account
  // named after their email so the row is well-formed. An operator
  // invitation later reassigns the user to a real account.
  const slug = `self-${
    input.email
      .split("@")[0]
      ?.replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase() ?? "user"
  }-${randomBytes(3).toString("hex")}`;

  const token = randomBytes(SIGNUP_TOKEN_BYTES).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  await prisma.$transaction(async (tx) => {
    const account = await tx.portalAccount.create({
      data: {
        slug,
        name: `${input.name} (pending)`,
        status: "ACTIVE",
      },
    });
    const user = await tx.portalUser.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        portalAccountId: account.id,
        role: "MEMBER",
      },
    });
    await tx.portalMagicLink.create({
      data: {
        email: input.email,
        userId: user.id,
        tokenHash,
        purpose: "verify-email",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ipAddress: ip,
      },
    });
  });

  // Send after the commit, never inside it. A slow mail provider used to hold a
  // database transaction open for the length of an SMTP round trip, and a send
  // failure rolled back the account the user had just created.
  const url = `${siteUrl()}/portal/auth/verify-email?token=${encodeURIComponent(token)}`;
  try {
    await sendEmailVerification({ to: input.email, url, ttlHours: 24 });
  } catch (error) {
    // The account exists and the token is valid; the user can request a new
    // link. Losing the account because the mail server hiccuped is worse.
    console.error("[signup] verification email failed to send", error);
  }

  return NextResponse.json({ ok: true });
}
