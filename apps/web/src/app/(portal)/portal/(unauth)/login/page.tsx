import type { Metadata } from "next";
import Link from "next/link";
import { configuredProviders } from "@apex/auth";
import { LoginForm } from "@/app/(portal)/portal/(unauth)/login/login-form";
import { redirectIfSignedIn } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

type Props = {
  searchParams: Promise<{ next?: string; error?: string; sent?: string; oauth?: string }>;
};

export default async function PortalLoginPage({ searchParams }: Props) {
  const { next, error, sent, oauth } = await searchParams;
  await redirectIfSignedIn(next);
  const providers = configuredProviders();

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl">Sign in to the client portal</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Access your services, invoices, tickets, projects and shared documents.
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        {providers.length > 0 ? (
          <div className="flex flex-col gap-2">
            {providers.map((p) => {
              const params = new URLSearchParams({ provider: p.id });
              if (next) params.set("next", next);
              return (
                <Link
                  key={p.id}
                  href={`/portal/auth/${p.id}/start?${params.toString()}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-4 text-sm font-medium transition-colors hover:border-[var(--color-amber-500)]"
                >
                  Continue with {p.label}
                </Link>
              );
            })}
          </div>
        ) : null}

        {providers.length > 0 ? (
          <div className="text-2xs my-6 flex items-center gap-3 tracking-[0.16em] text-[var(--ink-muted)] uppercase">
            <span className="h-px flex-1 bg-[var(--border-default)]" />
            or with email
            <span className="h-px flex-1 bg-[var(--border-default)]" />
          </div>
        ) : null}

        <LoginForm next={next} initialError={error} sent={sent} oauthError={oauth} />
      </div>

      <p className="mt-6 text-center text-sm text-[var(--ink-secondary)]">
        No account?{" "}
        <Link
          href="/contact"
          className="font-medium text-[var(--color-amber-700)] underline-offset-4 hover:underline"
        >
          Talk to our team
        </Link>{" "}
        to get one.
      </p>
    </div>
  );
}
