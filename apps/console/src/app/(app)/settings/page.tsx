import { getProvider, listProviders, seal } from "@apex/ai";
import { prisma } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings" };

type Props = { searchParams: Promise<{ tested?: string; saved?: string; error?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  await requirePermission("core:admin");
  const flash = await searchParams;

  const [settings, integrations] = await Promise.all([
    prisma.setting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] }),
    prisma.integration.findMany({ orderBy: { provider: "asc" } }),
  ]);

  const providers = listProviders();

  /** Save a provider credential. The plaintext never leaves this function. */
  async function saveIntegration(formData: FormData) {
    "use server";
    const actor = await requirePermission("ai:admin");

    const provider = String(formData.get("provider") ?? "");
    const apiKey = String(formData.get("apiKey") ?? "").trim();
    const model = String(formData.get("model") ?? "").trim();
    const baseUrl = String(formData.get("baseUrl") ?? "").trim();
    const enabled = formData.get("isEnabled") === "on";

    const definition = getProvider(provider);
    const existing = await prisma.integration.findUnique({ where: { provider } });

    // A blank key on an existing integration means "leave the key alone" —
    // otherwise editing the model would silently wipe the credential.
    const sealed = apiKey ? seal(apiKey) : null;

    await prisma.integration.upsert({
      where: { provider },
      create: {
        provider,
        label: definition.label,
        isEnabled: enabled,
        config: {
          model: model || definition.defaultModel,
          baseUrl: baseUrl || definition.defaultBaseUrl,
        },
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
      },
      update: {
        isEnabled: enabled,
        config: {
          model: model || definition.defaultModel,
          baseUrl: baseUrl || definition.defaultBaseUrl,
        },
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
      },
    });

    await audit({
      actor,
      action: "integration.updated",
      entityType: "Integration",
      entityId: provider,
      // The key itself is never written to the audit log — only that it changed.
      summary: `${definition.label}: ${sealed ? "credential replaced, " : ""}${enabled ? "enabled" : "disabled"}`,
      changes: {
        isEnabled: { from: String(existing?.isEnabled ?? false), to: String(enabled) },
        ...(sealed ? { credential: { from: "***", to: `***${sealed.lastFour}` } } : {}),
      },
    });

    redirect("/settings?saved=1");
  }

  /** Cheapest possible round trip to prove the credential works. */
  async function testIntegration(formData: FormData) {
    "use server";
    await requirePermission("ai:admin");

    const provider = String(formData.get("provider") ?? "");
    const { open } = await import("@apex/ai");
    const record = await prisma.integration.findUnique({ where: { provider } });

    if (!record?.secretCiphertext || !record.secretIv || !record.secretTag) {
      redirect(
        `/settings?error=${encodeURIComponent("No credential saved for this provider yet.")}`,
      );
    }

    const definition = getProvider(provider);
    const config = record.config as { model?: string; baseUrl?: string };

    const result = await definition.test({
      apiKey: open({
        ciphertext: record.secretCiphertext!,
        iv: record.secretIv!,
        tag: record.secretTag!,
      }),
      model: config.model,
      baseUrl: config.baseUrl,
    });

    await prisma.integration.update({
      where: { provider },
      data: { lastTestedAt: new Date(), lastTestOk: result.ok, lastTestNote: result.detail },
    });

    redirect(`/settings?tested=${encodeURIComponent(result.detail)}`);
  }

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h1 className="text-2xl">Settings</h1>
        <p className="mt-1 text-[var(--ink-secondary)]">
          Organisation details and third-party credentials.
        </p>
      </div>

      {flash.saved ? (
        <p className="rounded-[var(--radius-md)] bg-[var(--color-success-100)] px-4 py-3 text-sm text-[var(--color-success-500)]">
          Saved.
        </p>
      ) : null}
      {flash.tested ? (
        <p className="rounded-[var(--radius-md)] bg-[var(--bg-sunken)] px-4 py-3 text-sm">
          {flash.tested}
        </p>
      ) : null}
      {flash.error ? (
        <p className="rounded-[var(--radius-md)] bg-[var(--color-danger-100)] px-4 py-3 text-sm text-[var(--color-danger-500)]">
          {flash.error}
        </p>
      ) : null}

      {/* ── AI providers ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl">AI providers</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
          Keys are encrypted with AES-256-GCM before they touch the database and are never sent back
          to a browser — you will only ever see the last four characters. The application talks to a
          provider interface, so switching provider is a setting rather than a rebuild.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          {providers.map((p) => {
            const record = integrations.find((i) => i.provider === p.id);
            const config = (record?.config ?? {}) as { model?: string; baseUrl?: string };

            return (
              <div
                key={p.id}
                className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{p.label}</h3>
                    <p className="text-xs text-[var(--ink-muted)]">
                      {record?.lastFour
                        ? `Key installed, ending ${record.lastFour}`
                        : "No key installed"}
                      {record?.lastTestedAt
                        ? ` · last tested ${record.lastTestedAt.toLocaleString("en-GB")}: ${
                            record.lastTestOk ? "OK" : "failed"
                          }`
                        : ""}
                    </p>
                  </div>
                  {record?.isEnabled ? (
                    <span className="text-2xs rounded-full bg-[var(--color-success-100)] px-2.5 py-0.5 font-medium text-[var(--color-success-500)]">
                      Enabled
                    </span>
                  ) : null}
                </div>

                <form action={saveIntegration} className="mt-5 grid gap-4 md:grid-cols-3">
                  <input type="hidden" name="provider" value={p.id} />

                  <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-3">
                    API key
                    <input
                      type="password"
                      name="apiKey"
                      autoComplete="off"
                      placeholder={
                        record?.lastFour ? "Leave blank to keep the current key" : "Paste the key"
                      }
                      className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] px-3 text-sm font-normal"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm font-medium">
                    Model
                    <input
                      name="model"
                      defaultValue={config.model ?? p.defaultModel}
                      className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] px-3 text-sm font-normal"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-2">
                    Base URL
                    <input
                      name="baseUrl"
                      defaultValue={config.baseUrl ?? p.defaultBaseUrl}
                      className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] px-3 text-sm font-normal"
                    />
                  </label>

                  <label className="flex items-center gap-2 text-sm md:col-span-3">
                    <input
                      type="checkbox"
                      name="isEnabled"
                      defaultChecked={record?.isEnabled ?? false}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    Use this provider
                  </label>

                  <div className="flex gap-3 md:col-span-3">
                    <Button type="submit">Save</Button>
                  </div>
                </form>

                <form action={testIntegration} className="mt-3">
                  <input type="hidden" name="provider" value={p.id} />
                  <Button type="submit" variant="secondary" size="sm">
                    Test connection
                  </Button>
                </form>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Organisation ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl">Organisation</h2>
        <p className="mt-1 text-sm text-[var(--ink-secondary)]">
          These values render on the public site. Contact details are never hardcoded in the pages.
        </p>

        <div className="scroll-x mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
          <table className="w-full min-w-[40rem] text-sm">
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {settings
                .filter((s) => !s.group.startsWith("partner"))
                .map((s) => (
                  <tr key={s.key}>
                    <td className="px-5 py-3 align-top">
                      <p className="font-medium">{s.label}</p>
                      <p className="text-2xs text-[var(--ink-muted)]">{s.key}</p>
                    </td>
                    <td className="px-5 py-3 text-[var(--ink-secondary)]">
                      {typeof s.value === "string" && s.value ? (
                        s.value
                      ) : (
                        <span className="text-[var(--color-amber-700)]">not set</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Engineering partner ─────────────────────────────────────── */}
      <section>
        <h2 className="text-xl">Engineering partner</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
          The technology partner responsible for designing, building and operating the platforms
          behind Apex. Their portfolio is linked from the public site footer, the site header and
          the homepage partner strip.
        </p>

        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
          {(
            ["partner.name", "partner.tagline", "partner.url", "partner.relationship"] as const
          ).map((key) => {
            const setting = settings.find((s) => s.key === key);
            return (
              <dl
                key={key}
                className="grid items-baseline gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[14rem_1fr] [&:not(:first-child)]:border-t [&:not(:first-child)]:border-[var(--border-subtle)]"
              >
                <dt className="text-sm font-medium">{setting?.label ?? key}</dt>
                <dd className="text-sm text-[var(--ink-secondary)]">
                  {typeof setting?.value === "string" && setting.value ? (
                    key === "partner.url" ? (
                      <a
                        href={setting.value}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-[var(--color-amber-700)] underline-offset-4 hover:underline"
                      >
                        {setting.value}
                      </a>
                    ) : (
                      setting.value
                    )
                  ) : (
                    <span className="text-[var(--color-amber-700)]">not set</span>
                  )}
                </dd>
              </dl>
            );
          })}
        </div>
        <p className="text-2xs mt-3 text-[var(--ink-muted)]">
          Edit these values in <code>packages/db/prisma/content/site.ts</code> and re-run{" "}
          <code>pnpm db:seed</code>.
        </p>
      </section>
    </div>
  );
}
