import { prisma } from "@apex/db";
import type { Metadata } from "next";
import Link from "next/link";
import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Verify email",
  robots: { index: false, follow: false },
};

/**
 * Email verification on signup.
 *
 * The token is the raw value from the magic link; we look it up by SHA-256
 * hash and mark the user verified on match. Single-use — `usedAt` is set
 * the first time the link is consumed.
 */

type Props = { searchParams: Promise<{ token?: string }> };

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return <Result title="Missing token" body="The verification link is malformed." />;
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const link = await prisma.portalMagicLink.findUnique({ where: { tokenHash } });

  if (!link) {
    return <Result title="Invalid link" body="That verification link is not recognised." />;
  }
  if (link.usedAt) {
    return (
      <Result
        title="Already verified"
        body="This email address has already been verified. You can sign in now."
        success
      />
    );
  }
  if (link.expiresAt < new Date()) {
    return (
      <Result
        title="Expired"
        body="That verification link has expired. Sign in to request a new one."
      />
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.portalUser.update({
      where: { id: link.userId! },
      data: { emailVerifiedAt: new Date() },
    });
    await tx.portalMagicLink.update({
      where: { id: link.id },
      data: { usedAt: new Date() },
    });
    await tx.portalAuditLog.create({
      data: {
        portalUserId: link.userId,
        action: "user.email_verified",
        entityType: "PortalUser",
        entityId: link.userId!,
        summary: "Email verified via signup link",
      },
    });
  });

  return (
    <Result
      title="Email verified"
      body="You can now sign in to the portal."
      success
      cta={{ label: "Sign in", href: "/portal/login" }}
    />
  );
}

function Result({
  title,
  body,
  success,
  cta,
}: {
  title: string;
  body: string;
  success?: boolean;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto max-w-md">
      <div
        className={`rounded-[var(--radius-lg)] border bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)] ${
          success ? "border-[var(--color-success-500)]" : "border-[var(--border-default)]"
        }`}
      >
        <h1 className="text-xl">{title}</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">{body}</p>
        {cta ? (
          <Link
            href={cta.href}
            className="mt-6 inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 text-sm font-medium text-[var(--ink-on-accent)]"
          >
            {cta.label}
          </Link>
        ) : (
          <Link
            href="/portal/login"
            className="mt-6 inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 text-sm font-medium"
          >
            Back to sign-in
          </Link>
        )}
      </div>
    </div>
  );
}
