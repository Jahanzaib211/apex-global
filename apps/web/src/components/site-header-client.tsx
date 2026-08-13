"use client";

import { Logo } from "@apex/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";

/**
 * Client implementation of the site header.
 *
 * Lives in its own file so the server component (`SiteHeader`) can stay lean,
 * while this component owns the scroll detection and mobile menu state on the
 * client.
 */
export function ClientSiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile sheet on navigation — otherwise it stays open over the
  // new page, which reads as a broken link.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter]",
        "border-b duration-[var(--duration-base)]",
        scrolled
          ? "border-[var(--border-subtle)] bg-[var(--bg-page)]/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Apex Global Tech Solution — home" className="shrink-0">
            <Logo animated />
          </Link>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            "children" in item && item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
                >
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden className="opacity-60">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </Link>

                {/* CSS-driven disclosure: no JS, no hydration cost, and it still
                    opens on keyboard focus via focus-within. */}
                <div className="invisible absolute top-full left-0 w-72 translate-y-1 pt-2 opacity-0 transition-[opacity,transform] duration-[var(--duration-fast)] group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-2 shadow-[var(--shadow-lg)]">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-sunken)] hover:text-[var(--ink-primary)]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={[
                  "rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "text-[var(--ink-primary)]"
                    : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden h-10 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 text-sm font-medium text-[var(--ink-on-accent)] transition-colors hover:bg-[var(--accent-hover)] sm:inline-flex"
          >
            Talk to our team
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] lg:hidden"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden>
              {open ? (
                <path
                  d="M2 2l14 10M16 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  fill="none"
                />
              ) : (
                <path
                  d="M0 1h18M0 7h18M0 13h18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  fill="none"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="scroll-x max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-[var(--border-subtle)] bg-[var(--bg-page)] lg:hidden"
        >
          <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-[var(--radius-sm)] px-2 py-2.5 text-base font-medium"
                >
                  {item.label}
                </Link>
                {"children" in item && item.children ? (
                  <ul className="mb-2 ml-3 border-l border-[var(--border-subtle)] pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block py-2 text-sm text-[var(--ink-secondary)]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            <Link
              href="/contact"
              className="mt-3 inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] font-medium text-[var(--ink-on-accent)]"
            >
              Talk to our technology team
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
