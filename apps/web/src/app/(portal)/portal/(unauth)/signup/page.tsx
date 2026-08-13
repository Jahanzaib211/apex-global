import type { Metadata } from "next";
import Link from "next/link";
import { redirectIfSignedIn } from "@/lib/portal/auth";
import { SignupForm } from "@/app/(portal)/portal/(unauth)/signup/signup-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign up", robots: { index: false, follow: false } };

/**
 * Two paths into the portal:
 *   - Self-serve signup with email verification
 *   - Invitation accept at /portal/accept-invitation/<token> (handled separately)
 *
 * Self-serve creates a fresh `PortalUser` without an account; the user must
 * be invited by an operator before they see real data. Email verification
 * confirms the address is theirs.
 */

type Props = { searchParams: Promise<{ error?: string; sent?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const { error, sent } = await searchParams;
  await redirectIfSignedIn("/portal/account");

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl">Create your portal account</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          You'll be able to sign in, but an Apex team member must invite your email to a portal
          account before any data appears.
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        <SignupForm initialError={error} sent={sent} />
      </div>

      <p className="mt-6 text-center text-sm text-[var(--ink-secondary)]">
        Already have an account?{" "}
        <Link
          href="/portal/login"
          className="font-medium text-[var(--color-amber-700)] underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
