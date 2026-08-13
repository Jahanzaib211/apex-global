import { prisma } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { purgeWebCache } from "@/lib/revalidate";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dev — Maintenance mode" };

/**
 * Operational kill-switches.
 *
 * Three independent toggles, each with its own blast radius:
 *
 *   - `ops.maintenance_mode`  → public site renders /maintenance holding
 *     page, lead forms return 503.
 *   - `ops.readonly_mode`     → public forms still render but submit returns
 *     503 with a banner pointing at /status.
 *   - `ops.public_status`     → status banner at the top of every page.
 *
 * Every change writes an audit row.
 */
export default async function DevMaintenancePage() {
  await requirePermission("core:admin");

  const rows = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          "ops.maintenance_mode",
          "ops.readonly_mode",
          "ops.public_status",
          "ops.maintenance_message",
          "ops.status_banner",
        ],
      },
    },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  const boolFrom = (k: string) => map[k] === true || map[k] === "true" || map[k] === "on";
  const strFrom = (k: string, fallback = "") => (typeof map[k] === "string" ? map[k] : fallback);

  async function toggle(key: string, actionOn: string, actionOff: string, value: boolean) {
    "use server";
    const actor = await requirePermission("core:admin");
    await prisma.setting.upsert({
      where: { key },
      create: { key, value, group: "operations", label: key },
      update: { value },
    });
    await audit({
      actor,
      action: value ? actionOn : actionOff,
      entityType: "Setting",
      entityId: key,
      summary: `${key} → ${value ? "on" : "off"}`,
    });
    revalidatePath("/", "layout");
    // The kill-switches are read by the public site, not by the console.
    await purgeWebCache({ paths: ["/"] });
    redirect("/dev/maintenance");
  }

  async function setMessage(formData: FormData) {
    "use server";
    const actor = await requirePermission("core:admin");
    const key = String(formData.get("key") ?? "");
    const value = String(formData.get("message") ?? "");
    if (!key) return;
    await prisma.setting.upsert({
      where: { key },
      create: { key, value, group: "operations", label: key },
      update: { value },
    });
    await audit({
      actor,
      action: `dev.${key}_changed`,
      entityType: "Setting",
      entityId: key,
      summary: `${key} updated`,
    });
    revalidatePath("/", "layout");
    // The kill-switches are read by the public site, not by the console.
    await purgeWebCache({ paths: ["/"] });
    redirect("/dev/maintenance");
  }

  async function setStatus(formData: FormData) {
    "use server";
    const actor = await requirePermission("core:admin");
    const value = String(formData.get("status") ?? "operational");
    const key = "ops.public_status";
    await prisma.setting.upsert({
      where: { key },
      create: { key, value, group: "operations", label: key },
      update: { value },
    });
    await audit({
      actor,
      action: "dev.public_status_changed",
      entityType: "Setting",
      entityId: key,
      summary: `public_status → ${value}`,
    });
    revalidatePath("/", "layout");
    // The kill-switches are read by the public site, not by the console.
    await purgeWebCache({ paths: ["/"] });
    redirect("/dev/maintenance");
  }

  const maintenanceOn = boolFrom("ops.maintenance_mode");
  const readonlyOn = boolFrom("ops.readonly_mode");
  const currentStatus = strFrom("ops.public_status", "operational");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl">Maintenance & status</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
          Three independent kill-switches. Each writes an audit row and revalidates the public site
          so the change takes effect within seconds.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Toggle
          label="Maintenance mode"
          description="Public site shows /maintenance. Lead forms return 503."
          on={maintenanceOn}
          toggleAction={() =>
            toggle(
              "ops.maintenance_mode",
              "dev.maintenance_enabled",
              "dev.maintenance_disabled",
              !maintenanceOn,
            )
          }
        />
        <Toggle
          label="Read-only mode"
          description="Forms render but submit returns 503 with a banner."
          on={readonlyOn}
          toggleAction={() =>
            toggle(
              "ops.readonly_mode",
              "dev.readonly_enabled",
              "dev.readonly_disabled",
              !readonlyOn,
            )
          }
        />
        <form
          action={setStatus}
          className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
        >
          <h2 className="text-lg font-semibold">Public status</h2>
          <p className="mt-1 text-sm text-[var(--ink-secondary)]">
            Banner shown at the top of every page.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <select
              name="status"
              defaultValue={currentStatus}
              className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm"
            >
              {["operational", "degraded", "incident"].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary" size="sm">
              Save
            </Button>
          </div>
        </form>
      </div>

      <TextSetting
        label="Maintenance message"
        description="Shown on /maintenance when maintenance mode is on."
        value={strFrom("ops.maintenance_message")}
        settingKey="ops.maintenance_message"
        save={setMessage}
      />

      <TextSetting
        label="Status banner"
        description="Optional one-liner shown next to the public status badge."
        value={strFrom("ops.status_banner")}
        settingKey="ops.status_banner"
        save={setMessage}
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  on,
  toggleAction,
}: {
  label: string;
  description: string;
  on: boolean;
  toggleAction: () => Promise<void>;
}) {
  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="mt-1 text-sm text-[var(--ink-secondary)]">{description}</p>
      <form action={toggleAction} className="mt-4">
        <Button type="submit" variant={on ? "primary" : "secondary"} size="sm">
          {on ? "Disable" : "Enable"}
        </Button>
      </form>
    </article>
  );
}

function TextSetting({
  label,
  description,
  value,
  settingKey,
  save,
}: {
  label: string;
  description: string;
  value: string;
  settingKey: string;
  save: (fd: FormData) => Promise<void>;
}) {
  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="mt-1 text-sm text-[var(--ink-secondary)]">{description}</p>
      <form action={save} className="mt-4 flex items-start gap-2">
        <input type="hidden" name="key" value={settingKey} />
        <textarea
          name="message"
          defaultValue={value}
          rows={2}
          className="flex-1 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2 text-sm"
        />
        <Button type="submit" variant="secondary" size="sm">
          Save
        </Button>
      </form>
    </article>
  );
}
