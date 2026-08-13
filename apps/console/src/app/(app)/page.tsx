import { prisma } from "@apex/db";
import Link from "next/link";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const user = await currentUser();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [total, recent, unassigned, byStage, topCampaigns, latest] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: since } } }),
    prisma.lead.count({ where: { ownerId: null, stage: "NEW" } }),
    prisma.lead.groupBy({ by: ["stage"], _count: true }),
    // Which campaigns actually produce enquiries. The whole point of storing
    // attribution at submission time.
    prisma.attribution.groupBy({
      by: ["utmCampaign"],
      where: { utmCampaign: { not: null }, createdAt: { gte: since } },
      _count: true,
      orderBy: { _count: { utmCampaign: "desc" } },
      take: 5,
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { attribution: { select: { utmSource: true, utmCampaign: true } } },
    }),
  ]);

  const stageCount = (stage: string) => byStage.find((s) => s.stage === stage)?._count ?? 0;

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h1 className="text-2xl">Overview</h1>
        <p className="mt-1 text-[var(--ink-secondary)]">
          Signed in as {user?.name}. Last 30 days unless stated.
        </p>
      </div>

      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Leads, 30 days", recent],
          ["Leads, all time", total],
          ["Awaiting assignment", unassigned],
          ["Customers", stageCount("CUSTOMER")],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6"
          >
            <dd className="font-display text-3xl font-semibold">{String(value)}</dd>
            <dt className="mt-1 text-sm text-[var(--ink-secondary)]">{label}</dt>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
          <h2 className="border-b border-[var(--border-subtle)] px-6 py-4 font-semibold">
            Latest enquiries
          </h2>
          {latest.length === 0 ? (
            <p className="px-6 py-8 text-sm text-[var(--ink-secondary)]">
              No enquiries yet. They appear here the moment a form is submitted.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border-subtle)]">
              {latest.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/leads/${lead.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-[var(--bg-sunken)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{lead.name}</p>
                      <p className="truncate text-sm text-[var(--ink-secondary)]">
                        {lead.companyName ?? lead.email}
                        {lead.attribution?.utmCampaign ? ` · ${lead.attribution.utmCampaign}` : ""}
                      </p>
                    </div>
                    <span className="text-2xs shrink-0 rounded-full bg-[var(--bg-sunken)] px-2.5 py-0.5 font-medium tracking-wide uppercase">
                      {lead.stage}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
          <h2 className="border-b border-[var(--border-subtle)] px-6 py-4 font-semibold">
            Campaigns producing leads
          </h2>
          {topCampaigns.length === 0 ? (
            <p className="px-6 py-8 text-sm text-[var(--ink-secondary)]">
              Nothing attributed yet. Campaign parameters on your ad links populate this.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border-subtle)]">
              {topCampaigns.map((c) => (
                <li key={c.utmCampaign} className="flex items-center justify-between px-6 py-4">
                  <span className="truncate text-sm">{c.utmCampaign}</span>
                  <span className="font-display font-semibold">{c._count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
