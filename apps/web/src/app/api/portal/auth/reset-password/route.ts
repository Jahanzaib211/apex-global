import { prisma } from "@apex/db";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { checkPasswordStrength, hashPassword } from "@apex/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  token: z.string().min(10).max(200),
  password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });
  const input = parsed.data;

  const strength = checkPasswordStrength(input.password);
  if (!strength.ok) {
    return NextResponse.json({ error: strength.reasons.join(" ") }, { status: 422 });
  }

  const tokenHash = createHash("sha256").update(input.token).digest("hex");
  const record = await prisma.portalPasswordReset.findUnique({ where: { tokenHash } });
  if (!record) {
    return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });
  }
  if (record.usedAt) {
    return NextResponse.json({ error: "This link has already been used." }, { status: 400 });
  }
  if (record.expiresAt < new Date()) {
    return NextResponse.json({ error: "This link has expired." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.portalUser.update({
      where: { id: record.userId },
      data: {
        passwordHash: await hashPassword(input.password),
        failedLogins: 0,
        lockedUntil: null,
      },
    });
    await tx.portalPasswordReset.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });
    // Invalidate any other outstanding reset links for the same user — a
    // password change should kill any earlier "we sent you a reset link".
    await tx.portalPasswordReset.deleteMany({
      where: { userId: record.userId, usedAt: null, id: { not: record.id } },
    });
    await tx.portalAuditLog.create({
      data: {
        portalUserId: record.userId,
        action: "user.password_reset",
        entityType: "PortalUser",
        entityId: record.userId,
        summary: "Password reset via emailed link",
      },
    });
    // Revoke every active session for this user inside the same transaction so
    // a process crash between commit and revoke cannot leave the user's old
    // sessions valid with the new password.
    await tx.portalSession.deleteMany({ where: { userId: record.userId } });
  });

  return NextResponse.json({ ok: true });
}
