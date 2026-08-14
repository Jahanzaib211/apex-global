"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV_LINKS, type ServiceNav } from "@/lib/nav";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Close dropdown on Escape
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") setServicesOpen(false);
  }, []);

  const barClass = scrolled
    ? "bg-amber2/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(216,144,28,0.18)]"
    : "bg-amber2/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(216,144,28,0.12)]";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${barClass}`}>
      <div className="container-x flex min-h-[92px] items-center justify-between py-4">
        <Link
          href="/"
          className="mr-8 flex shrink-0 items-center gap-3"
          aria-label="Apex Global Outsourcing — Home"
        >
          <Image
            src="/logo.png"
            alt="Apex Global Outsourcing"
            width={260}
            height={86}
            className="h-16 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) =>
            l.dropdown ? (
              <div
                key={l.name}
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
                onKeyDown={onKeyDown}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen((v) => !v)}
                  onFocus={() => setServicesOpen(true)}
                  className={`nav-link text-navy focus-visible:ring-amber2-dark inline-flex items-center gap-1 rounded-sm text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none ${
                    isActive(pathname, l.href) ? "nav-link-active" : ""
                  }`}
                >
                  {l.name}
                  <ChevronDown
                    size={14}
                    aria-hidden
                    className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`absolute top-full left-0 w-80 pt-3 transition-all duration-200 ${
                    servicesOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                  role="menu"
                  aria-label="Services"
                >
                  <div className="shadow-soft border-line rounded-xl border bg-white p-2">
                    {l.dropdown.map((s: ServiceNav) => (
                      <Link
                        key={s.slug}
                        href={s.href}
                        role="menuitem"
                        className={`block rounded-lg px-4 py-2.5 text-sm transition ${
                          isActive(pathname, s.href)
                            ? "bg-amber2/10 text-amber2-dark font-semibold"
                            : "text-navy hover:bg-mist hover:text-amber2-dark"
                        }`}
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={l.name}
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                className={`nav-link text-navy text-sm font-semibold ${
                  isActive(pathname, l.href) ? "nav-link-active" : ""
                }`}
              >
                {l.name}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact" className="btn-primary text-sm">
            Talk to Our Team
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="text-navy focus-visible:ring-amber2-dark rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none lg:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="bg-amber2 shadow-[0_1px_0_0_rgba(216,144,28,0.25)] lg:hidden"
        >
          <div className="container-x flex flex-col gap-1 py-5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`border-amber2-dark/15 border-b py-3 text-sm font-semibold last:border-0 ${
                  isActive(pathname, l.href) ? "text-amber2-dark" : "text-navy"
                }`}
              >
                {l.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 justify-center text-sm"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
