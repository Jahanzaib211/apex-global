import { prisma } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Campaigns" };

/**
 * Campaigns list with per-campaign attribution roll-up.
 *
 * The point of this page is to answer the question the partner agreement
 * implies: "we spent X, it produced Y enquiries, Z became customers, worth W".
 * The next iteration wires the same numbers into `/marketing/attribution` with
 * a date filter; this list is the at-a-glance view.
 */
export default async function CampaignsPage() {
  await requirePermission("marketing:read");

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const campaigns = await prisma.campaign.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  // Pull attribution per campaign for the last 30 days. One query per campaign
  // is acceptable while the volume is small; it collapses into the
  // AttributionReport roll-up once jobs land.
  const stats = await Promise.all(
    campaigns.map(async (c) => {
      const [leads, qualified, customers, spend] = await Promise.all([
        prisma.lead.count({
          where: {
            attribution: { utmCampaign: c.slug },
            createdAt: { gte: since },
          },
        }),
        prisma.lead.count({
          where: {
            attribution: { utmCampaign: c.slug },
            stage: { in: ["QUALIFIED", "OPPORTUNITY", "CUSTOMER"] },
            createdAt: { gte: since },
          },
        }),
        prisma.lead.count({
          where: {
            attribution: { utmCampaign: c.slug },
            stage: "CUSTOMER",
            createdAt: { gte: since },
          },
        }),
        prisma.campaignSpend.aggregate({
          where: { campaign: c.slug, periodStart: { gte: since } },
          _sum: { amount: true },
        }),
      ]);

      const spendTotal = spend._sum.amount ?? 0;
      const cpl = leads > 0 ? Math.round(spendTotal / leads) : 0;

      return { leads, qualified, customers, spendTotal, cpl };
    }),
  );

  async function setStatus(formData: FormData) {
    "use server";
    const actor = await requirePermission("marketing:write");
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");
    if (!["active", "paused", "completed"].includes(status)) throw new Error("Unknown status");
    await prisma.campaign.update({ where: { id }, data: { status } });
    await audit({
      actor,
      action: "campaign.status_changed",
      entityType: "Campaign",
      entityId: id,
      summary: `Campaign set to ${status}`,
    });
    redirect("/marketing/campaigns");
  }

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h1 className="text-2xl">Campaigns</h1>
        <p className="mt-1 max-w-2xl text-[var(--ink-secondary)]">
          The named campaigns driving traffic to the site. Last 30 days. Spend entered manually here
          joins lead attribution captured at submission — that is the join that decides what worked.
        </p>
      </div>

      <div className="scroll-x rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
        <table className="w-full min-w-[68rem] text-sm">
          <thead>
            <tr className="text-2xs border-b border-[var(--border-subtle)] text-left tracking-[0.12em] text-[var(--ink-muted)] uppercase">
              <th className="px-5 py-3 font-semibold">Campaign</th>
              <th className="px-5 py-3 font-semibold">Channel</th>
              <th className="px-5 py-3 text-right font-semibold">Leads</th>
              <th className="px-5 py-3 text-right font-semibold">Qualified</th>
              <th className="px-5 py-3 text-right font-semibold">Customers</th>
              <th className="px-5 py-3 text-right font-semibold">Spend</th>
              <th className="px-5 py-3 text-right font-semibold">Cost / lead</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {campaigns.map((c, i) => {
              const s = stats[i];
              return (
                <tr key={c.id}>
                  <td className="px-5 py-3">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-2xs text-[var(--ink-muted)]">utm_campaign={c.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-[var(--ink-secondary)]">{c.channel}</td>
                  <td className="px-5 py-3 text-right font-mono">{s?.leads ?? 0}</td>
                  <td className="px-5 py-3 text-right font-mono">{s?.qualified ?? 0}</td>
                  <td className="px-5 py-3 text-right font-mono">{s?.customers ?? 0}</td>
                  <td className="px-5 py-3 text-right font-mono">
                    ${((s?.spendTotal ?? 0) / 100).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right font-mono">
                    {s && s.cpl > 0 ? `$${(s.cpl / 100).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-2xs rounded-full px-2.5 py-0.5 font-medium uppercase ${
                        c.status === "active"
                          ? "bg-[var(--color-success-100)] text-[var(--color-success-500)]"
                          : c.status === "paused"
                            ? "bg-[var(--bg-sunken)] text-[var(--ink-secondary)]"
                            : "bg-[var(--color-amber-100)] text-[var(--color-amber-700)]"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <form action={setStatus} className="inline-flex">
                      <input type="hidden" name="id" value={c.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={c.status === "active" ? "paused" : "active"}
                      />
                      <Button type="submit" variant="secondary" size="sm">
                        {c.status === "active" ? "Pause" : "Resume"}
                      </Button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {campaigns.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--ink-secondary)]">
            No campaigns yet. Add one with a slug that matches the <code>utm_campaign</code>{" "}
            parameter on its ads.
          </p>
        ) : null}
      </div>

      <div>
        <Link
          href="/marketing/attribution"
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          Full attribution report →
        </Link>
      </div>
    </div>
  );
}
