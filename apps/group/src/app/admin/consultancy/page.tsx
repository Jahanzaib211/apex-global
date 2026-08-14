"use client";
import Link from "next/link";
const stats = ["Active Clients", "Pending Discovery", "Awaiting Assessment", "In Consultation"];
export default function ConsultancyAdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="border-gold/50 border bg-[#fff9e8] p-4 text-sm">
        <strong>Private — Authorized Personnel Only.</strong> This CRM is a Phase 2 UI shell; no
        client data or backend is connected.
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl text-[#0B1431]">Financial Consultancy CRM</h1>
        <span className="bg-gold/20 px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
          Coming Soon
        </span>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s} className="bg-white p-5 shadow-sm">
            <p className="text-slate/60 text-xs tracking-wider uppercase">{s}</p>
            <p className="font-display mt-3 text-4xl text-[#0B1431]">—</p>
            <p className="text-slate/50 mt-2 text-xs">Requires Phase 2 backend</p>
          </div>
        ))}
      </div>
      <Link
        href="/admin/consultancy/clients"
        className="hover:bg-gold mt-8 inline-block bg-[#0B1431] px-5 py-3 text-sm font-semibold text-white hover:text-[#0B1431]"
      >
        View clients →
      </Link>
    </div>
  );
}
