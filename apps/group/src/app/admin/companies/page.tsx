"use client";
import Link from "next/link";
const companies = [
  ["Apex Global Tech Solution", "tech-solution"],
  ["Apex Outsourcing", "outsourcing"],
  ["Apex Tours & Travels", "tours-travels"],
  ["Apex Holdings", "holdings"],
  ["Financial Consultancy", "consultancy"],
];
export default function CompaniesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-4xl text-[#0B1431]">
        Companies{" "}
        <span className="bg-gold/20 px-2 py-1 align-middle text-[10px] font-bold tracking-wider uppercase">
          Coming Soon
        </span>
      </h1>
      <p className="border-gold/50 mt-5 border bg-[#fff9e8] p-4 text-sm">
        Phase 2 — coming soon. Requires admin authentication.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map(([name, slug]) => (
          <div key={slug} className="bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl text-[#0B1431]">{name}</h2>
            <p className="text-slate/50 mt-2 text-xs">Company profile</p>
            <Link
              href={`/admin/companies/${slug}`}
              className="hover:border-gold mt-5 inline-block border border-slate-300 px-4 py-2 text-xs font-semibold"
            >
              Manage
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
