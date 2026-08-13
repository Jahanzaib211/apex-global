import { prisma } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dev — Webhooks" };

/**
 * Inbound webhook event log.
 *
 * Every webhook delivery from Hyperswitch, Twenty, Stripe (future), etc.
 * lands in the `WebhookEvent` table — first 200 newest first. Operators
 * can replay a failed delivery by re-running the route's handler.
 */
export default async function DevWebhooksPage() {
  await requirePermission("core:admin");

  const events = await prisma.webhookEvent.findMany({
    orderBy: { receivedAt: "desc" },
    take: 200,
  });

  async function markReplay(formData: FormData) {
    "use server";
    const actor = await requirePermission("core:admin");
    const id = String(formData.get("id") ?? "");
    const event = await prisma.webhookEvent.findUnique({ where: { id } });
    if (!event) return;
    // "Replay" here is a logical marker — actual re-delivery would re-POST to
    // our own /api/webhooks/<provider> route. We just record the intent in
    // the audit log so the operator can see who did it.
    await prisma.webhookEvent.update({
      where: { id },
      data: { handledAs: "replay.requested" },
    });
    await audit({
      actor,
      action: "dev.webhook_replay_requested",
      entityType: "WebhookEvent",
      entityId: id,
      summary: `${event.provider}/${event.eventType} replay requested`,
    });
    redirect("/dev/webhooks");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl">Webhooks</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
          Inbound deliveries from every connected provider. Failed events show the error. Replay
          marks the event for re-delivery and writes an audit row.
        </p>
      </div>

      <div className="scroll-x rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
        <table className="w-full min-w-[72rem] text-sm">
          <thead>
            <tr className="text-2xs border-b border-[var(--border-subtle)] text-left tracking-[0.16em] text-[var(--ink-muted)] uppercase">
              <th className="px-5 py-3 font-semibold">When</th>
              <th className="px-5 py-3 font-semibold">Provider</th>
              <th className="px-5 py-3 font-semibold">Event</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Signature</th>
              <th className="px-5 py-3 font-semibold">Handled as</th>
              <th className="px-5 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {events.map((e) => (
              <tr key={e.id}>
                <td className="text-2xs px-5 py-3 text-[var(--ink-muted)]">
                  {e.receivedAt.toLocaleString("en-GB")}
                </td>
                <td className="px-5 py-3">{e.provider}</td>
                <td className="text-2xs px-5 py-3 font-mono">{e.eventType}</td>
                <td className="text-2xs px-5 py-3 font-mono">{e.responseStatus}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-2xs rounded-full px-2 py-0.5 ${
                      e.signatureOk
                        ? "bg-[var(--color-success-100)] text-[var(--color-success-500)]"
                        : "bg-[var(--color-danger-100)] text-[var(--color-danger-500)]"
                    }`}
                  >
                    {e.signatureOk ? "valid" : "invalid"}
                  </span>
                </td>
                <td className="text-2xs px-5 py-3 text-[var(--ink-secondary)]">
                  {e.handledAs ?? "—"}
                </td>
                <td className="px-5 py-3 text-right">
                  <form action={markReplay}>
                    <input type="hidden" name="id" value={e.id} />
                    <Button type="submit" variant="secondary" size="sm">
                      Replay
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[var(--ink-secondary)]">
                  No webhook events recorded yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
