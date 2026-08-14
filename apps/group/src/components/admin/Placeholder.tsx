"use client";
export default function Placeholder({
  title,
  description = "Phase 2 — coming soon",
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl text-[#0B1431]">{title}</h1>
        <span className="bg-gold/20 px-2 py-1 text-[10px] font-bold tracking-wider text-[#0B1431] uppercase">
          Coming Soon
        </span>
      </div>
      <div className="border-gold/50 text-slate mt-5 border bg-[#fff9e8] p-4 text-sm">
        {description}. Requires admin authentication and Phase 2 backend services.
      </div>
    </div>
  );
}
