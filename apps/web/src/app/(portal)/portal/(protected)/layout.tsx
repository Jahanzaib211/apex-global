import "server-only";
import { Logo } from "@apex/ui";
import Link from "next/link";
import { issueCsrfToken, signCsrf } from "@apex/auth";
import { requirePortalUser } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

/**
 * Portal chrome.
 *
 * Deliberately distinct from the marketing layout — no `(site)` header, no
 * services nav, no partner pill. Customers inside the portal see only the
 * scoped navigation and their account name in the top-right.
 */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePortalUser();

  // Sign-out posts to the route rather than a server action, so the same code
  // path serves the button and any programmatic caller. Double-submit CSRF:
  // the token and its signature travel together and are checked by the route.
  const csrf = issueCsrfToken();
  const csrfSignature = signCsrf(csrf);

  return (
    <div className="min-h-dvh bg-[var(--bg-page)] text-[var(--ink-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-raised)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
          <div className="flex items-center gap-8">
            <Link href="/portal/" aria-label="Apex client portal — home" className="shrink-0">
              <Logo animated />
            </Link>
            <nav aria-label="Portal" className="hidden items-center gap-1 md:flex">
              {[
                { label: "Home", href: "/portal/" },
                { label: "Services", href: "/portal/services" },
                { label: "Invoices", href: "/portal/invoices" },
                { label: "Tickets", href: "/portal/tickets" },
                { label: "Projects", href: "/portal/projects" },
                { label: "Documents", href: "/portal/documents" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-tight font-medium">{user.name}</p>
              <p className="text-2xs tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                {user.portalAccountName}
              </p>
            </div>
            <Link
              href="/portal/account"
              className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 text-sm font-medium transition-colors hover:border-[var(--border-strong)]"
            >
              Account
            </Link>
            <form action="/api/portal/auth/logout" method="post">
              <input type="hidden" name="csrf" value={csrf} />
              <input type="hidden" name="csrfSignature" value={csrfSignature} />
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 text-sm transition-colors hover:border-[var(--border-strong)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <nav
          aria-label="Portal mobile"
          className="scroll-x flex gap-1 overflow-x-auto border-t border-[var(--border-subtle)] px-5 py-2 md:hidden"
        >
          {[
            { label: "Home", href: "/portal/" },
            { label: "Invoices", href: "/portal/invoices" },
            { label: "Tickets", href: "/portal/tickets" },
            { label: "Projects", href: "/portal/projects" },
            { label: "Documents", href: "/portal/documents" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm text-[var(--ink-secondary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">{children}</main>

      <footer className="text-2xs border-t border-[var(--border-subtle)] py-6 text-center text-[var(--ink-muted)]">
        Apex Global Tech Solution · Client Portal ·{" "}
        <Link href="/status" className="underline-offset-4 hover:underline">
          status
        </Link>
      </footer>
    </div>
  );
}
