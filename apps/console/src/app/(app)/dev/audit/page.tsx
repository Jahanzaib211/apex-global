import { prisma } from "@apex/db";
import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dev — Audit" };

/**
 * Audit log tail.
 *
 * Re-uses the core `AuditLog` table — every privileged action writes there
 * regardless of whether the change came from a console screen, a server
 * action, or the /dev toggles. The tail here is the operator's window into
 * "what changed, who changed it, when, from which IP".
 */
export default async function DevAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; actor?: string }>;
}) {
  await requirePermission("core:admin");
  const { q, actor } = await searchParams;

  const entries = await prisma.auditLog.findMany({
    where: {
      ...(q ? { action: { contains: q, mode: "insensitive" } } : {}),
      ...(actor ? { actor: { email: { contains: actor, mode: "insensitive" } } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: { select: { name: true, email: true } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl">Audit</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
          Every privileged action. Append-only — there is no edit path on this table. The same view
          is available at <code>/audit</code> on the console.
        </p>
      </div>

      <form className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Action contains
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="lead.stage_changed"
            className="h-11 w-64 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Actor email contains
          <input
            name="actor"
            defaultValue={actor ?? ""}
            placeholder="admin@apexglobal.local"
            className="h-11 w-64 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-medium text-[var(--ink-on-accent)]"
        >
          Filter
        </button>
      </form>

      <div className="scroll-x rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
        <table className="w-full min-w-[64rem] text-sm">
          <thead>
            <tr className="text-2xs border-b border-[var(--border-subtle)] text-left tracking-[0.16em] text-[var(--ink-muted)] uppercase">
              <th className="px-5 py-3 font-semibold">When</th>
              <th className="px-5 py-3 font-semibold">Who</th>
              <th className="px-5 py-3 font-semibold">Action</th>
              <th className="px-5 py-3 font-semibold">Detail</th>
              <th className="px-5 py-3 font-semibold">Entity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="text-2xs px-5 py-3 text-[var(--ink-muted)]">
                  {e.createdAt.toLocaleString("en-GB")}
                </td>
                <td className="px-5 py-3">{e.actor?.email ?? "system"}</td>
                <td className="text-2xs px-5 py-3 font-mono">{e.action}</td>
                <td className="px-5 py-3 text-[var(--ink-secondary)]">{e.summary}</td>
                <td className="text-2xs px-5 py-3 text-[var(--ink-muted)]">
                  {e.entityType}:{e.entityId ?? "—"}
                </td>
              </tr>
            ))}
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[var(--ink-secondary)]">
                  No audit entries yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
