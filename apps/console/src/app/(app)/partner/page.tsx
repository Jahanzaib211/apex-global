import { prisma } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Engineering partner" };

/**
 * Engineering partner overview.
 *
 * Shows what the public site is telling visitors about ALI Technologies,
 * and links into the partner-specific integrations — Hyperswitch for
 * payments and Twenty CRM as the partner-facing sales surface.
 */
export default async function PartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requirePermission("partner:read");
  const flash = await searchParams;

  const [settings, integrations] = await Promise.all([
    prisma.setting.findMany({ where: { group: "partner" }, orderBy: { key: "asc" } }),
    prisma.partnerIntegration.findMany({ orderBy: { provider: "asc" } }),
  ]);

  const settingMap = Object.fromEntries(
    settings.map((s) => [s.key, typeof s.value === "string" ? s.value : ""]),
  );

  const partnerName = settingMap["partner.name"] ?? "ALI Technologies";
  const partnerUrl = settingMap["partner.url"];
  const partnerRelationship = settingMap["partner.relationship"];
  const partnerTagline = settingMap["partner.tagline"];
  const chatwootBaseUrl = settingMap["chatwoot.base_url"];
  const chatwootToken = settingMap["chatwoot.token"];
  const chatwootEnabled = settingMap["chatwoot.enabled"] === "true";
  const orgWhatsapp = settingMap["org.whatsapp"];

  async function setPartnerUrl(formData: FormData) {
    "use server";
    const actor = await requirePermission("partner:write");
    const url = String(formData.get("url") ?? "").trim();
    const valid = /^https?:\/\/.+/.test(url) ? url : "";
    await prisma.setting.upsert({
      where: { key: "partner.url" },
      update: { value: valid },
      create: { key: "partner.url", group: "partner", label: "Partner URL", value: valid },
    });
    await audit({
      actor,
      action: "partner.url_changed",
      entityType: "Setting",
      entityId: "partner.url",
      summary: valid ? `Partner URL set to ${valid}` : "Partner URL cleared",
    });
    redirect("/partner");
  }

  async function saveChatwoot(formData: FormData) {
    "use server";
    const actor = await requirePermission("partner:write");
    const baseUrl = String(formData.get("baseUrl") ?? "").trim();
    const token = String(formData.get("token") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const enabled = formData.get("enabled") === "on";
    const validUrl = /^https?:\/\/.+/.test(baseUrl) ? baseUrl : "";
    await prisma.setting.upsert({
      where: { key: "chatwoot.base_url" },
      update: { value: validUrl },
      create: {
        key: "chatwoot.base_url",
        group: "chatwoot",
        label: "Chatwoot base URL",
        value: validUrl,
      },
    });
    await prisma.setting.upsert({
      where: { key: "chatwoot.token" },
      update: { value: token },
      create: {
        key: "chatwoot.token",
        group: "chatwoot",
        label: "Chatwoot widget token",
        value: token,
      },
    });
    await prisma.setting.upsert({
      where: { key: "chatwoot.enabled" },
      update: { value: enabled ? "true" : "false" },
      create: {
        key: "chatwoot.enabled",
        group: "chatwoot",
        label: "Chatwoot enabled",
        value: enabled ? "true" : "false",
      },
    });
    await prisma.setting.upsert({
      where: { key: "org.whatsapp" },
      update: { value: whatsapp },
      create: { key: "org.whatsapp", group: "org", label: "WhatsApp number", value: whatsapp },
    });
    await audit({
      actor,
      action: "partner.chatwoot_changed",
      entityType: "Setting",
      entityId: "chatwoot.base_url",
      summary: enabled ? "Chatwoot live chat configured" : "Chatwoot disabled",
    });
    redirect("/partner?saved=chatwoot");
  }

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h1 className="text-2xl">Engineering partner</h1>
        <p className="mt-1 max-w-2xl text-[var(--ink-secondary)]">
          The relationship between Apex and {partnerName}. The settings below render on the public
          site footer, the site header pill, the homepage partner strip and the about page.
        </p>
      </div>

      {flash.saved ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--color-success-200)] bg-[var(--color-success-100)] px-4 py-2 text-sm text-[var(--color-success-500)]">
          Saved.
        </p>
      ) : null}

      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="text-xl">{partnerName}</h2>
            {partnerTagline ? (
              <p className="mt-1 text-sm text-[var(--ink-secondary)]">{partnerTagline}</p>
            ) : null}
          </div>
          {partnerUrl ? (
            <a
              href={partnerUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 text-sm font-medium transition-colors hover:border-[var(--border-strong)]"
            >
              Visit {partnerName} ↗
            </a>
          ) : null}
        </div>

        {partnerRelationship ? (
          <p className="mt-5 max-w-3xl text-[1.0625rem] leading-[1.75] text-[var(--ink-secondary)]">
            {partnerRelationship}
          </p>
        ) : null}

        <form action={setPartnerUrl} className="mt-6 flex flex-wrap items-end gap-3">
          <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium">
            Partner URL
            <input
              name="url"
              type="url"
              defaultValue={partnerUrl ?? ""}
              placeholder="https://alilabsx.com/"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <Button type="submit">Save URL</Button>
        </form>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <h2 className="text-xl">Live chat & WhatsApp</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
          The “Talk to a real person” launcher on the public site. Chatwoot runs the self-hosted
          widget; WhatsApp is an independent channel. Empty fields leave the launcher hidden.
        </p>
        <form action={saveChatwoot} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Chatwoot base URL
            <input
              name="baseUrl"
              type="url"
              defaultValue={chatwootBaseUrl ?? ""}
              placeholder="https://chat.apexgroupcompanies.com"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Chatwoot widget token
            <input
              name="token"
              defaultValue={chatwootToken ?? ""}
              placeholder="website token"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 font-mono text-xs font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            WhatsApp number (E.164)
            <input
              name="whatsapp"
              defaultValue={orgWhatsapp ?? ""}
              placeholder="923001234567"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={chatwootEnabled}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Show the live-chat launcher on the public site
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Save chat settings</Button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl">Partner integrations</h2>
          <Link
            href="/integrations"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Manage integrations →
          </Link>
        </div>

        <ul className="grid gap-4 md:grid-cols-2">
          {integrations.map((i) => (
            <li
              key={i.id}
              className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                    {i.provider}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{i.label}</h3>
                </div>
                <span
                  className={`text-2xs rounded-full px-2.5 py-0.5 font-medium uppercase ${
                    i.isEnabled
                      ? "bg-[var(--color-success-100)] text-[var(--color-success-500)]"
                      : "bg-[var(--bg-sunken)] text-[var(--ink-secondary)]"
                  }`}
                >
                  {i.isEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              {i.lastEventKind ? (
                <p className="text-2xs mt-3 text-[var(--ink-muted)]">
                  Last event {i.lastEventAt ? ` · ${i.lastEventAt.toLocaleString("en-GB")}` : ""}:{" "}
                  {i.lastEventKind}
                </p>
              ) : (
                <p className="text-2xs mt-3 text-[var(--ink-muted)]">No events yet.</p>
              )}
            </li>
          ))}
          {integrations.length === 0 ? (
            <li className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] p-6 text-sm text-[var(--ink-secondary)]">
              No partner integrations configured. Add Hyperswitch and Twenty CRM from the{" "}
              <Link href="/integrations" className="font-medium underline-offset-4 hover:underline">
                integrations page
              </Link>
              .
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
