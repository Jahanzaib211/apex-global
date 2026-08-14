"use client";
import Link from "next/link";
const cards = [
  ["Group Overview", "Manage the group’s operating structure.", "/admin/group"],
  ["Companies", "Maintain company profiles and details.", "/admin/companies"],
  ["Financial Consultancy", "Review restricted client workflows.", "/admin/consultancy"],
  ["System", "Roles, audit history, and integrations.", "/admin/system"],
];
export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-gold text-xs font-semibold tracking-[.2em] uppercase">
            Phase 2 workspace
          </p>
          <h1 className="font-display mt-2 text-4xl text-[#0B1431]">Admin dashboard</h1>
        </div>
        <Link href="/" className="text-slate decoration-gold text-sm underline underline-offset-4">
          Back to site
        </Link>
      </div>
      <div className="border-gold/50 text-slate mt-5 border bg-[#fff9e8] p-4 text-sm">
        <strong>Admin Login Required.</strong> This is a UI shell only. Requires Phase 2
        authentication and backend services.
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[["Total Leads"], ["Active Companies"], ["Pending Consultations"]].map(([label]) => (
          <div key={label} className="bg-white p-5 shadow-sm">
            <p className="text-slate/60 text-xs tracking-wider uppercase">{label}</p>
            <p className="font-display mt-3 text-4xl text-[#0B1431]">—</p>
            <p className="text-slate/50 mt-2 text-xs">Requires Phase 2 backend</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {cards.map(([title, description, href]) => (
          <Link
            href={href}
            key={href}
            className="group bg-white p-7 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-gold text-xs font-semibold tracking-wider uppercase">
              Operational module
            </p>
            <h2 className="font-display mt-3 text-2xl text-[#0B1431]">{title}</h2>
            <p className="text-slate/65 mt-2 text-sm">{description}</p>
            <span className="group-hover:text-gold mt-6 block text-sm font-semibold text-[#0B1431]">
              Open module →
            </span>
          </Link>
        ))}
      </div>
      <button
        onClick={() => console.info("Apex admin sign out — Phase 2 authentication not connected")}
        className="text-slate hover:border-gold mt-8 border border-slate-300 px-4 py-2 text-xs font-semibold"
      >
        Sign Out
      </button>
    </div>
  );
}
