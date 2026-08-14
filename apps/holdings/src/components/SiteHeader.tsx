"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { SiteLogo } from "./SiteLogo";
import { nav, site } from "@/data/site";
import { BrandMark } from "@apex/motion/brand-mark";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/95 backdrop-blur-md"
          : "border-b border-transparent bg-white"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <BrandMark>
          <SiteLogo />
        </BrandMark>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className={`tracking-wide-1 px-3 py-2 text-[13px] font-medium uppercase transition-colors ${
                  isActive(item.href) ? "text-ink" : "hover:text-ink text-slate-600"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {item.label}
                  {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                </span>
              </Link>
              {item.children && openMenu === item.label && (
                <div className="shadow-card-hover animate-fade-in absolute top-full right-0 mt-0 w-60 border border-slate-200 bg-white py-2">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="hover:text-ink block px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${site.phone.replace(/\s+/g, "")}`}
            className="tracking-wide-1 hover:text-ink inline-flex items-center gap-2 text-xs text-slate-600 uppercase"
          >
            <Phone className="h-3.5 w-3.5" />
            {site.phone}
          </a>
          <Link href="/contact" className="btn-primary !px-5 !py-2.5 text-[12px]">
            Explore Projects
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-ink inline-flex h-10 w-10 items-center justify-center lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container-x flex flex-col py-4">
            {nav.map((item) => (
              <div key={item.href} className="border-b border-slate-100">
                <Link
                  href={item.href}
                  className={`tracking-wide-1 block py-3 text-sm font-medium uppercase ${
                    isActive(item.href) ? "text-gold-500" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="flex flex-col gap-1 pb-3 pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block py-1.5 text-sm text-slate-600"
                      >
                        · {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-3 pt-5">
              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="btn-ghost !py-2.5 text-[13px]"
              >
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <Link href="/contact" className="btn-primary text-[13px]">
                Explore Projects
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
