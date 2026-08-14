"use client";
import Link from "next/link";
import { useState } from "react";

const nav = [
  ["Dashboard", "/admin"],
  ["Group", "/admin/group"],
  ["Companies", "/admin/companies"],
  ["Financial Consultancy", "/admin/consultancy"],
  ["System", "/admin/system"],
];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-slate min-h-screen bg-slate-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#17233f] p-5 text-white transition-transform ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <Link href="/admin" className="block border-b border-white/10 pb-5">
          <span className="font-display text-2xl">Apex Group</span>
          <span className="text-gold mt-1 block text-[10px] tracking-[.2em] uppercase">
            Admin workspace
          </span>
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/"
            className="hover:text-gold mt-8 block border-t border-white/10 px-3 pt-6 text-sm text-white/50"
          >
            Sign Out
          </Link>
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
          <button
            className="text-slate lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open admin navigation"
          >
            ☰
          </button>
          <p className="text-slate text-xs font-semibold tracking-[.18em] uppercase">
            Apex Group Admin
          </p>
          <span className="text-slate/60 text-xs">admin@apexgroup.example</span>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
