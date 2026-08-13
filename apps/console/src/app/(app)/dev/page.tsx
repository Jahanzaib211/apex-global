import { prisma } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dev — System health" };

/**
 * System health overview.
 *
 * Pings each backing service and shows the latency. Read-only — the
 * actual toggles live on the more specific sub-pages (flags, maintenance,
 * cache, etc.). This page is the "is everything OK?" landing for an
 * on-call engineer.
 */

async function ping(
  label: string,
  fn: () => Promise<void>,
): Promise<{ label: string; ok: boolean; ms: number; detail?: string }> {
  const start = Date.now();
  try {
    await fn();
    return { label, ok: true, ms: Date.now() - start };
  } catch (error) {
    return {
      label,
      ok: false,
      ms: Date.now() - start,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

async function pingRedis(): Promise<void> {
  // Cheap reachability check without depending on the ioredis package.
  // The dev console may not have it installed; the production runtime
  // talks to Redis through BullMQ workers, not from here.
  const url = process.env.REDIS_URL ?? "redis://localhost:6381";
  const u = new URL(url);
  const { createConnection } = await import("node:net");
  await new Promise<void>((resolve, reject) => {
    const sock = createConnection({ host: u.hostname, port: Number(u.port || 6379) });
    const timer = setTimeout(() => {
      sock.destroy();
      reject(new Error("timeout"));
    }, 1500);
    sock.once("connect", () => {
      clearTimeout(timer);
      sock.end();
      resolve();
    });
    sock.once("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

export default async function DevHealthPage() {
  await requirePermission("core:admin");

  const checks = await Promise.all([
    ping("PostgreSQL", async () => {
      await prisma.$queryRaw`SELECT 1`;
    }),
    ping("Redis (TCP)", async () => {
      await pingRedis();
    }),
    ping("MinIO", async () => {
      const res = await fetch(
        `${process.env.S3_ENDPOINT ?? "http://localhost:9020"}/minio/health/live`,
        {
          signal: AbortSignal.timeout(2000),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }),
    ping("Meilisearch", async () => {
      const res = await fetch(`${process.env.MEILI_HOST ?? "http://localhost:7701"}/health`, {
        signal: AbortSignal.timeout(2000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }),
    ping("Hyperswitch", async () => {
      const record = await prisma.partnerIntegration.findUnique({
        where: { provider: "hyperswitch" },
      });
      if (!record?.isEnabled) return;
      const { hyperswitchFromConfig } = await import("@apex/integrations");
      const cfg = (record.config ?? {}) as { baseUrl?: string };
      const apiKey = record.secretCiphertext
        ? (await import("@apex/integrations")).open({
            ciphertext: record.secretCiphertext,
            iv: record.secretIv!,
            tag: record.secretTag!,
          })
        : "";
      const client = hyperswitchFromConfig({
        baseUrl: cfg.baseUrl ?? "",
        apiKey,
        publishableKey: "",
        profileId: "",
      });
      const r = await client.testConnection();
      if (!r.ok) throw new Error(r.detail);
    }),
    ping("Twenty CRM", async () => {
      const record = await prisma.partnerIntegration.findUnique({
        where: { provider: "twenty-crm" },
      });
      if (!record?.isEnabled) return;
      const { twentyFromConfig } = await import("@apex/integrations");
      const cfg = (record.config ?? {}) as { baseUrl?: string };
      const apiKey = record.secretCiphertext
        ? (await import("@apex/integrations")).open({
            ciphertext: record.secretCiphertext,
            iv: record.secretIv!,
            tag: record.secretTag!,
          })
        : "";
      const client = twentyFromConfig({ baseUrl: cfg.baseUrl ?? "", apiKey });
      const r = await client.testConnection();
      if (!r.ok) throw new Error(r.detail);
    }),
  ]);

  const allOk = checks.every((c) => c.ok);

  async function refresh() {
    "use server";
    await requirePermission("core:admin");
    redirect("/dev");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl">System health</h1>
          <p className="mt-1 text-sm text-[var(--ink-secondary)]">
            Latency-ping of every backing service the platform depends on.
          </p>
        </div>
        <form action={refresh}>
          <Button type="submit" variant="secondary" size="sm">
            Re-check
          </Button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {checks.map((c) => (
          <article
            key={c.label}
            className={`rounded-[var(--radius-lg)] border p-5 ${
              c.ok
                ? "border-[var(--border-default)] bg-[var(--bg-raised)]"
                : "border-[var(--color-danger-500)] bg-[var(--color-danger-100)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">{c.label}</h2>
              <span
                className={`text-2xs rounded-full px-2.5 py-0.5 font-medium uppercase ${
                  c.ok
                    ? "bg-[var(--color-success-100)] text-[var(--color-success-500)]"
                    : "bg-[var(--color-danger-100)] text-[var(--color-danger-500)]"
                }`}
              >
                {c.ok ? "OK" : "Down"}
              </span>
            </div>
            <p className="text-2xs mt-3 text-[var(--ink-muted)]">
              {c.ms} ms{c.detail ? ` · ${c.detail}` : ""}
            </p>
          </article>
        ))}
      </div>

      <p
        className={`rounded-[var(--radius-lg)] border p-4 text-sm ${
          allOk
            ? "border-[var(--border-default)] bg-[var(--bg-raised)] text-[var(--ink-secondary)]"
            : "border-[var(--color-amber-500)] bg-[var(--color-amber-100)] text-[var(--color-amber-700)]"
        }`}
      >
        {allOk
          ? "All checks passed. Operations green."
          : "One or more checks failed. Open the integrations page to verify credentials."}
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Diagnostics &amp; tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/dev/flags",
              label: "Feature flags",
              body: "Toggle gate flags and see the audit trail.",
            },
            {
              href: "/dev/maintenance",
              label: "Maintenance",
              body: "Flip maintenance mode for public traffic.",
            },
            { href: "/dev/cache", label: "Cache", body: "Browse and invalidate caches." },
            {
              href: "/dev/queues",
              label: "Queues",
              body: "Backlog, latency and dead-letter inspection.",
            },
            {
              href: "/dev/webhooks",
              label: "Webhooks",
              body: "Inspect deliveries and replay failures.",
            },
            { href: "/dev/errors", label: "Errors", body: "Recent exceptions from the platform." },
            { href: "/dev/audit", label: "Audit log", body: "Who changed what, and when." },
            { href: "/dev/env", label: "Environment", body: "Configured variables for every app." },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-1 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4 transition-colors hover:border-[var(--color-amber-500)]"
            >
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-2xs text-[var(--ink-muted)]">{item.body}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
