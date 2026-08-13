import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@apex/ui";

/**
 * Public sub-layout for the portal.
 *
 * Used by /portal/login, /portal/signup, /portal/forgot-password,
 * /portal/reset-password, /portal/accept-invitation, /portal/auth/*,
 * /portal/logout — pages that must NOT require a session.
 *
 * The protected half of the portal lives in `(protected)` which has its
 * own layout that calls `requirePortalUser()`.
 */

export const metadata: Metadata = {
  title: { default: "Client portal", template: "%s · Apex Portal" },
  robots: { index: false, follow: false },
};

export default function PortalPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--bg-page)] text-[var(--ink-primary)]">
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-raised)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
          <Link href="/" aria-label="Apex Global Tech Solution — home" className="shrink-0">
            <Logo animated />
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
          >
            Need an account? Talk to us
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-16">{children}</main>

      <footer className="text-2xs border-t border-[var(--border-subtle)] py-6 text-center text-[var(--ink-muted)]">
        Apex Global Tech Solution · Client Portal
      </footer>
    </div>
  );
}
