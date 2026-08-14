"use client";
import Link from "next/link";
const items = [
  ["Companies", "/admin/group/companies"],
  ["Services", "/admin/group/services"],
  ["Articles", "/admin/group/articles"],
  ["Events", "/admin/group/events"],
];
export default function GroupPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-4xl text-[#0B1431]">
        Group Management{" "}
        <span className="bg-gold/20 px-2 py-1 align-middle text-[10px] font-bold tracking-wider uppercase">
          Coming Soon
        </span>
      </h1>
      <p className="border-gold/50 mt-5 border bg-[#fff9e8] p-4 text-sm">
        Phase 2 — coming soon. Requires admin authentication.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map(([a, h]) => (
          <Link href={h} key={h} className="bg-white p-7 shadow-sm hover:shadow-md">
            <h2 className="font-display text-2xl text-[#0B1431]">{a}</h2>
            <p className="text-slate/60 mt-3 text-sm">
              Manage {a.toLowerCase()} in the future CMS.
            </p>
            <span className="text-gold mt-6 block text-sm font-semibold">Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
