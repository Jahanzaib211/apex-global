import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "@/app/(portal)/portal/(unauth)/forgot-password/forgot-form";
import { redirectIfSignedIn } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  // A signed-in user who lands here gets bounced — same as login, signup
  // and reset-password. The form is harmless either way, but the UX
  // diverges from the rest of the unauth surface without this.
  await redirectIfSignedIn("/portal/");
  const { sent, error } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl">Forgot your password?</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Enter your email and we'll send a link to set a new one. The link is single-use and
          expires in an hour.
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        <ForgotForm sent={sent} error={error} />
      </div>

      <p className="mt-6 text-center text-sm text-[var(--ink-secondary)]">
        <Link href="/portal/login" className="underline-offset-4 hover:underline">
          Back to sign-in
        </Link>
      </p>
    </div>
  );
}
