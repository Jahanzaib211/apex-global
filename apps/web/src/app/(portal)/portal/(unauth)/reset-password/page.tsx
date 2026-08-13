import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@apex/db";
import { createHash } from "node:crypto";
import { redirectIfSignedIn } from "@/lib/portal/auth";
import { ResetForm } from "@/app/(portal)/portal/(unauth)/reset-password/reset-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

/**
 * Reset-password landing.
 *
 * Validates the token's existence and expiry on the server before showing
 * the form. The form posts to /api/portal/auth/reset-password which does
 * the final verify-and-replace with a constant-time hash check.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string; saved?: string }>;
}) {
  const { token, error, saved } = await searchParams;
  await redirectIfSignedIn("/portal/");

  if (!token) {
    return <Shell title="Missing token" body="The reset link is malformed." />;
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const record = await prisma.portalPasswordReset.findUnique({ where: { tokenHash } });
  if (!record) {
    return <Shell title="Invalid link" body="That reset link is not recognised." />;
  }
  if (record.usedAt) {
    return (
      <Shell
        title="Already used"
        body="This reset link has already been used. Request a new one."
      />
    );
  }
  if (record.expiresAt < new Date()) {
    return (
      <Shell
        title="Expired"
        body="That reset link has expired. Request a new one from the sign-in page."
      />
    );
  }

  if (saved) {
    return (
      <Shell
        title="Password updated"
        body="You can now sign in with your new password."
        cta={{ label: "Sign in", href: "/portal/login" }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl">Set a new password</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Choose a strong password. After this, all other reset links for the same account are
          invalidated.
        </p>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        <ResetForm token={token} error={error} />
      </div>
    </div>
  );
}

function Shell({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        <h1 className="text-xl">{title}</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">{body}</p>
        <Link
          href={cta?.href ?? "/portal/login"}
          className="mt-6 inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 text-sm font-medium text-[var(--ink-on-accent)]"
        >
          {cta?.label ?? "Back to sign-in"}
        </Link>
      </div>
    </div>
  );
}
