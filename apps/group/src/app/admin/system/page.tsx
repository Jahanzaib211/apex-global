"use client";
const items = ["Users & Roles", "Audit Log", "Integrations"];
export default function SystemPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-4xl text-[#0B1431]">
        System{" "}
        <span className="bg-gold/20 px-2 py-1 align-middle text-[10px] font-bold tracking-wider uppercase">
          Coming Soon
        </span>
      </h1>
      <p className="border-gold/50 mt-5 border bg-[#fff9e8] p-4 text-sm">
        Phase 2 — coming soon. Requires admin authentication.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {items.map((i) => (
          <button
            key={i}
            onClick={() => console.info(`${i} — Phase 2`)}
            className="bg-white p-7 text-left shadow-sm hover:shadow-md"
          >
            <h2 className="font-display text-2xl text-[#0B1431]">{i}</h2>
            <p className="text-slate/60 mt-3 text-sm">Configuration module placeholder.</p>
            <span className="text-gold mt-6 block text-sm font-semibold">Open →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
