import { Button } from "@apex/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dev — Queues" };

/**
 * BullMQ queue depth + DLQ.
 *
 * Until the worker tier lands, the queues connection isn't a real Redis
 * consumer. We render the page in "not configured" mode rather than fake
 * numbers — an operator must see honest telemetry.
 */

interface QueueSnapshot {
  name: string;
  waiting: number;
  active: number;
  failed: number;
  delayed: number;
  completed: number;
  oldestWaitingSeconds: number | null;
}

async function snapshotQueues(): Promise<QueueSnapshot[] | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  try {
    const { Queue } = await import("bullmq");
    const names = [
      "lead.notify",
      "lead.enrich",
      "lead.conversion",
      "adspend.sync",
      "attribution.rebuild",
    ];
    return Promise.all(
      names.map(async (name): Promise<QueueSnapshot> => {
        const q = new Queue(name, { connection: { url, maxRetriesPerRequest: 1 } });
        try {
          const counts = await q.getJobCounts(
            "waiting",
            "active",
            "failed",
            "delayed",
            "completed",
          );
          const waiting = counts.waiting ?? 0;
          const oldest = waiting > 0 ? null : null;
          return {
            name,
            waiting,
            active: counts.active ?? 0,
            failed: counts.failed ?? 0,
            delayed: counts.delayed ?? 0,
            completed: counts.completed ?? 0,
            oldestWaitingSeconds: oldest,
          };
        } finally {
          await q.close();
        }
      }),
    );
  } catch {
    return null;
  }
}

export default async function DevQueuesPage() {
  await requirePermission("core:admin");
  const queues = await snapshotQueues();

  async function replayDlq() {
    "use server";
    const actor = await requirePermission("core:admin");
    await audit({
      actor,
      action: "dev.dlq_replay_requested",
      entityType: "BullMQ",
      summary: "DLQ replay requested — actual requeue requires the worker tier",
    });
    redirect("/dev/queues");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl">Queues</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
            BullMQ job counts per queue. The worker tier must be live for these numbers to mean
            anything — until then, "Not configured" is the honest state.
          </p>
        </div>
        <form action={replayDlq}>
          <Button type="submit" variant="secondary" size="sm">
            Replay DLQ
          </Button>
        </form>
      </div>

      {queues === null ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center">
          <h2 className="text-lg font-semibold">Worker tier not configured</h2>
          <p className="mt-2 text-sm text-[var(--ink-secondary)]">
            Configure <code>REDIS_URL</code> and a BullMQ worker process to start processing queued
            jobs.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {queues.map((q) => (
            <article
              key={q.name}
              className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
            >
              <h2 className="font-mono text-sm font-semibold">{q.name}</h2>
              <dl className="text-2xs mt-3 grid grid-cols-2 gap-2 text-[var(--ink-muted)]">
                <dt>Waiting</dt>
                <dd className="text-right font-mono">{q.waiting}</dd>
                <dt>Active</dt>
                <dd className="text-right font-mono">{q.active}</dd>
                <dt>Delayed</dt>
                <dd className="text-right font-mono">{q.delayed}</dd>
                <dt>Failed (DLQ)</dt>
                <dd className="text-right font-mono">{q.failed}</dd>
                <dt>Completed</dt>
                <dd className="text-right font-mono">{q.completed}</dd>
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
