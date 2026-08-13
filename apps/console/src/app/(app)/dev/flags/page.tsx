import { prisma } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dev — Feature flags" };

/**
 * FeatureFlag UI.
 *
 * `FeatureFlag.key` is the value a feature-gating call reads. `isEnabled`
 * is the boolean switch. `rollout` (0–100) is the percentage of traffic
 * to enable when a partial rollout is needed.
 *
 * Every change writes an `AuditLog` row so the audit tail shows who
 * toggled what and when.
 */

const SEED_FLAGS: Array<{ key: string; description: string; enabled: boolean; rollout: number }> = [
  {
    key: "public.new_homepage",
    description: "New homepage redesign (rollout 0 → 100).",
    enabled: false,
    rollout: 0,
  },
  {
    key: "crm.lead_enrich_v2",
    description: "Use v2 lead enrichment model.",
    enabled: false,
    rollout: 0,
  },
  {
    key: "billing.auto_invoice",
    description: "Auto-generate invoices on quote acceptance.",
    enabled: false,
    rollout: 0,
  },
  {
    key: "support.sla_breach_alerts",
    description: "Email alerts when a ticket SLA is about to breach.",
    enabled: false,
    rollout: 0,
  },
];

export default async function DevFlagsPage() {
  await requirePermission("core:admin");

  const stored = await prisma.featureFlag.findMany();
  const storedMap = new Map(stored.map((f) => [f.key, f]));

  // Ensure every seeded flag exists in the DB. Seeding is idempotent.
  for (const seed of SEED_FLAGS) {
    if (!storedMap.has(seed.key)) {
      await prisma.featureFlag.upsert({
        where: { key: seed.key },
        create: seed,
        update: {},
      });
    }
  }

  const flags = await prisma.featureFlag.findMany({ orderBy: { key: "asc" } });

  async function toggleFlag(formData: FormData) {
    "use server";
    const actor = await requirePermission("core:admin");
    const id = String(formData.get("id") ?? "");
    const flag = await prisma.featureFlag.findUnique({ where: { id } });
    if (!flag) return;
    const next = !flag.isEnabled;
    await prisma.featureFlag.update({
      where: { id },
      data: { isEnabled: next },
    });
    await audit({
      actor,
      action: next ? "dev.flag_enabled" : "dev.flag_disabled",
      entityType: "FeatureFlag",
      entityId: flag.key,
      summary: `${flag.key} → ${next ? "on" : "off"}`,
    });
    redirect("/dev/flags");
  }

  async function setRollout(formData: FormData) {
    "use server";
    const actor = await requirePermission("core:admin");
    const id = String(formData.get("id") ?? "");
    const rollout = Math.max(0, Math.min(100, Number(formData.get("rollout") ?? 0)));
    const flag = await prisma.featureFlag.findUnique({ where: { id } });
    if (!flag) return;
    await prisma.featureFlag.update({ where: { id }, data: { rollout } });
    await audit({
      actor,
      action: "dev.flag_rollout_changed",
      entityType: "FeatureFlag",
      entityId: flag.key,
      summary: `${flag.key} rollout → ${rollout}%`,
      changes: { rollout: { from: String(flag.rollout), to: String(rollout) } },
    });
    redirect("/dev/flags");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl">Feature flags</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
          Toggle platform features at runtime. Each change is audited. Rollout is the percentage of
          traffic that sees the feature on when it is enabled.
        </p>
      </div>

      <div className="grid gap-4">
        {flags.map((f) => (
          <article
            key={f.id}
            className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <h2 className="font-mono text-sm font-semibold">{f.key}</h2>
                <p className="mt-1 text-sm text-[var(--ink-secondary)]">{f.description}</p>
              </div>
              <form action={toggleFlag} className="shrink-0">
                <input type="hidden" name="id" value={f.id} />
                <Button type="submit" variant={f.isEnabled ? "primary" : "secondary"} size="sm">
                  {f.isEnabled ? "Disable" : "Enable"}
                </Button>
              </form>
            </div>
            <form action={setRollout} className="mt-4 flex items-center gap-3 text-sm">
              <input type="hidden" name="id" value={f.id} />
              <label className="text-2xs tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                Rollout
              </label>
              <input
                name="rollout"
                type="range"
                min="0"
                max="100"
                defaultValue={String(f.rollout)}
                className="flex-1 accent-[var(--accent)]"
              />
              <span className="w-12 text-right font-mono">{f.rollout}%</span>
              <Button type="submit" variant="secondary" size="sm">
                Save
              </Button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
