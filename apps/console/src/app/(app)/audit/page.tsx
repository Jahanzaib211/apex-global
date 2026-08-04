import { prisma } from "@apex/db";
import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Audit log" };

export default async function AuditPage() {
  await requirePermission("core:admin");

  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: { select: { name: true, email: true } } },
  });

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-2xl">Audit log</h1>
        <p className="mt-1 max-w-2xl text-[var(--ink-secondary)]">
          Append-only. Every privileged action writes a row here and nothing edits or removes them —
          a log that can be changed answers no question worth asking.
        </p>
      </div>

      <div className="scroll-x rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
        <table className="w-full min-w-[48rem] text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-left text-2xs uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              <th className="px-5 py-3 font-semibold">When</th>
              <th className="px-5 py-3 font-semibold">Who</th>
              <th className="px-5 py-3 font-semibold">Action</th>
              <th className="px-5 py-3 font-semibold">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="whitespace-nowrap px-5 py-3 text-[var(--ink-muted)]">
                  {e.createdAt.toLocaleString("en-GB")}
                </td>
                <td className="px-5 py-3">{e.actor?.name ?? "System"}</td>
                <td className="px-5 py-3">
                  <code className="rounded bg-[var(--bg-sunken)] px-1.5 py-0.5 text-xs">
                    {e.action}
                  </code>
                </td>
                <td className="px-5 py-3 text-[var(--ink-secondary)]">{e.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {entries.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--ink-secondary)]">
            Nothing recorded yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
