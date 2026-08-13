import "server-only";
import { prisma, type Prisma } from "@apex/db";
import { headers } from "next/headers";
import type { SessionUser } from "./auth";
import type { AuditChanges } from "./audit-diff";

/**
 * Append-only audit trail.
 *
 * Every privileged action writes one row. Nothing updates or deletes them —
 * an audit log that can be edited answers no question worth asking.
 */

export async function audit(params: {
  actor: SessionUser;
  action: string;
  entityType: string;
  entityId?: string;
  summary: string;
  changes?: AuditChanges;
}): Promise<void> {
  const h = await headers();

  await prisma.auditLog.create({
    data: {
      actorId: params.actor.id,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      summary: params.summary,
      // Only the fields that changed, and never anything from the vault.
      changes: (params.changes ?? undefined) as Prisma.InputJsonValue | undefined,
      ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: h.get("user-agent")?.slice(0, 500) ?? null,
    },
  });
}
