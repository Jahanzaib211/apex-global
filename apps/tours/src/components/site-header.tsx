"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, Plane } from "lucide-react";
import { NAV, BRAND, WHATSAPP_LINK } from "@/lib/brand";
import { BrandMark } from "@apex/motion/brand-mark";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="border-sand-200 sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between lg:h-20">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <BrandMark>
            <img src="/logo.png" alt={BRAND.name} className="h-9 w-auto lg:h-11" />
          </BrandMark>
          <div className="hidden leading-tight sm:block">
            <div className="font-display text-navy-600 text-base font-bold lg:text-lg">
              Apex Global
            </div>
            <div className="text-ink-400 text-[10px] tracking-widest uppercase lg:text-xs">
              Tours &amp; Travels
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setActiveMenu(item.href)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={item.href}
                className="text-ink-500 hover:text-navy-600 inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold transition"
              >
                {item.label}
                {item.children && <ChevronDown size={14} className="opacity-60" />}
              </Link>
              {item.children && activeMenu === item.href && (
                <div className="absolute top-full left-0 z-50 pt-1">
                  <div className="border-sand-200 shadow-navy animate-fade-up min-w-[240px] rounded-xl border bg-white p-2">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="text-ink-500 hover:bg-sand-100 hover:text-navy-600 block rounded-lg px-3 py-2 text-sm transition"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={WHATSAPP_LINK("Hi Apex, I would like to plan a journey.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp !px-4 !py-2 text-sm"
          >
            <Plane size={16} />
            Plan Your Journey
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-navy-600 hover:bg-sand-100 rounded-lg p-2 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-sand-200 animate-fade-up border-t bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            {NAV.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-ink-500 hover:bg-sand-100 hover:text-navy-600 block rounded-lg px-3 py-2.5 text-base font-semibold"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="border-sand-200 my-1 ml-3 space-y-1 border-l pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="text-ink-400 hover:text-navy-600 block rounded-lg px-3 py-2 text-sm"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href={WHATSAPP_LINK("Hi Apex, I would like to plan a journey.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-4 w-full"
            >
              <Plane size={16} />
              Plan Your Journey
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
