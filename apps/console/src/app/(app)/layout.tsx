import { Logo } from "@apex/ui";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser, logout } from "@/lib/auth";
import { modules } from "@apex/module-kit/registry";

/**
 * Console navigation is built from the module registry, so a user only sees the
 * entries their permissions grant. Hiding a link is presentation — the
 * enforcement is in each server action. Adding a module with nav + permission
 * automatically surfaces it here; nothing is hard-coded.
 */
const NAV = modules.flatMap((m) => m.nav).filter((item) => Boolean(item.href));

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const visible = NAV.filter((item) => user.permissions.includes(item.permission));

  async function signOut() {
    "use server";
    await logout();
    redirect("/login");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-page)]">
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-raised)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
          <div className="flex items-center gap-8">
            <Link href="/" aria-label="Apex Console">
              <Logo animated />
            </Link>
            <nav aria-label="Console" className="hidden items-center gap-1 md:flex">
              {visible.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-sunken)] hover:text-[var(--ink-primary)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[var(--ink-secondary)] sm:inline">
              {user.name}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-[var(--radius-sm)] border border-[var(--border-default)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--border-strong)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <nav
          aria-label="Console mobile"
          className="scroll-x flex gap-1 border-t border-[var(--border-subtle)] px-5 py-2 md:hidden"
        >
          {visible.map((item) => (
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-9">{children}</main>
    </div>
  );
}
