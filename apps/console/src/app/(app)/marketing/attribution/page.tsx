import { prisma } from "@apex/db";
import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Attribution" };

/**
 * Attribution report.
 *
 * The page that makes "we spent X on this campaign, it produced Y enquiries,
 * Z became customers, worth W" a single screen — the definition-of-done for
 * the marketing module per `modules/marketing/README.md`.
 */
export default async function AttributionPage() {
  await requirePermission("marketing:read");

  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const [byCampaign, bySource, totals] = await Promise.all([
    prisma.lead.groupBy({
      by: ["stage"],
      where: {
        attribution: { utmCampaign: { not: null } },
        createdAt: { gte: since },
      },
      _count: true,
    }),
    prisma.attribution.groupBy({
      by: ["utmSource", "utmMedium"],
      where: { createdAt: { gte: since } },
      _count: true,
      orderBy: { _count: { utmSource: "desc" } },
      take: 8,
    }),
    prisma.lead.aggregate({
      where: {
        attribution: { utmCampaign: { not: null } },
        createdAt: { gte: since },
      },
      _count: true,
    }),
  ]);

  const customers = byCampaign.find((b) => b.stage === "CUSTOMER")?._count ?? 0;

  const spendByCampaign = await prisma.campaignSpend.groupBy({
    by: ["campaign"],
    where: { periodStart: { gte: since } },
    _sum: { amount: true },
  });
  const spendMap = new Map(spendByCampaign.map((s) => [s.campaign, s._sum.amount ?? 0]));
  const totalSpend = Array.from(spendMap.values()).reduce((a, b) => a + b, 0);

  // Per-campaign roll-up using direct joins so the number is real, not
  // estimated from a roll-up table.
  const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });
  const perCampaign = await Promise.all(
    campaigns.map(async (c) => {
      const [leads, qualified, customers, revenue] = await Promise.all([
        prisma.lead.count({
          where: { attribution: { utmCampaign: c.slug }, createdAt: { gte: since } },
        }),
        prisma.lead.count({
          where: {
            attribution: { utmCampaign: c.slug },
            stage: { in: ["QUALIFIED", "OPPORTUNITY", "CUSTOMER"] },
            createdAt: { gte: since },
          },
        }),
        prisma.lead.count({
          where: { attribution: { utmCampaign: c.slug }, stage: "CUSTOMER" },
        }),
        prisma.lead.aggregate({
          where: { attribution: { utmCampaign: c.slug }, stage: "CUSTOMER" },
          _sum: { valueAmount: true },
        }),
      ]);

      const spend = spendMap.get(c.slug) ?? 0;
      const cpl = leads > 0 ? Math.round(spend / leads) : 0;
      const revenueAmount = revenue._sum.valueAmount ?? 0;

      return {
        campaign: c,
        leads,
        qualified,
        customers,
        spend,
        revenueAmount,
        cpl,
      };
    }),
  );

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h1 className="text-2xl">Attribution</h1>
        <p className="mt-1 max-w-2xl text-[var(--ink-secondary)]">
          Spend entered on the campaigns page, joined against leads captured at submission. Last 90
          days. The number that closes the loop on advertising is here, not in a spreadsheet.
        </p>
      </div>

      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Leads with UTM", totals._count],
          ["Customers", customers],
          [
            "Spend recorded",
            `$${(totalSpend / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
          ],
          [
            "Cost per lead",
            totals._count > 0 ? `$${(totalSpend / totals._count / 100).toFixed(2)}` : "—",
          ],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
          >
            <dt className="text-2xs tracking-[0.16em] text-[var(--ink-muted)] uppercase">
              {label}
            </dt>
            <dd className="font-display mt-2 text-2xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <section>
        <h2 className="text-lg font-semibold">Per campaign</h2>
        <div className="scroll-x mt-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
          <table className="w-full min-w-[64rem] text-sm">
            <thead>
              <tr className="text-2xs border-b border-[var(--border-subtle)] text-left tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                <th className="px-5 py-3 font-semibold">Campaign</th>
                <th className="px-5 py-3 text-right font-semibold">Leads</th>
                <th className="px-5 py-3 text-right font-semibold">Qualified</th>
                <th className="px-5 py-3 text-right font-semibold">Customers</th>
                <th className="px-5 py-3 text-right font-semibold">Spend</th>
                <th className="px-5 py-3 text-right font-semibold">Revenue</th>
                <th className="px-5 py-3 text-right font-semibold">Cost / lead</th>
                <th className="px-5 py-3 text-right font-semibold">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {perCampaign.map((row) => {
                const roi =
                  row.spend > 0 ? ((row.revenueAmount - row.spend) / row.spend) * 100 : null;
                return (
                  <tr key={row.campaign.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium">{row.campaign.name}</p>
                      <p className="text-2xs text-[var(--ink-muted)]">{row.campaign.channel}</p>
                    </td>
                    <td className="px-5 py-3 text-right font-mono">{row.leads}</td>
                    <td className="px-5 py-3 text-right font-mono">{row.qualified}</td>
                    <td className="px-5 py-3 text-right font-mono">{row.customers}</td>
                    <td className="px-5 py-3 text-right font-mono">
                      ${(row.spend / 100).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      ${(row.revenueAmount / 100).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      {row.cpl > 0 ? `$${(row.cpl / 100).toFixed(2)}` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      {roi == null ? "—" : roi >= 0 ? `+${roi.toFixed(0)}%` : `${roi.toFixed(0)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">By source / medium</h2>
        <div className="scroll-x mt-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="text-2xs border-b border-[var(--border-subtle)] text-left tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                <th className="px-5 py-3 font-semibold">Source</th>
                <th className="px-5 py-3 font-semibold">Medium</th>
                <th className="px-5 py-3 text-right font-semibold">Leads (90d)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {bySource.map((s) => (
                <tr key={`${s.utmSource}-${s.utmMedium}`}>
                  <td className="px-5 py-3">{s.utmSource ?? "—"}</td>
                  <td className="px-5 py-3 text-[var(--ink-secondary)]">{s.utmMedium ?? "—"}</td>
                  <td className="px-5 py-3 text-right font-mono">{s._count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
