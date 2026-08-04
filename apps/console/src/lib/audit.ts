import "server-only";
import { prisma, type Prisma } from "@apex/db";
import { headers } from "next/headers";
import type { SessionUser } from "./auth";

/**
 * Append-only audit trail.
 *
 * Every privileged action writes one row. Nothing updates or deletes them —
 * an audit log that can be edited answers no question worth asking.
 */

/** JSON-safe change record. Anything non-primitive is stringified at the edge
 *  so the column can never receive a value Postgres will reject. */
export type AuditChanges = Record<string, { from: string | null; to: string | null }>;

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

function stringify(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value);
}

/** Diff of only the keys that actually differ, for the audit `changes` field. */
export function diff<T extends Record<string, unknown>>(
  before: T,
  after: Partial<T>,
): AuditChanges {
  const changes: AuditChanges = {};
  for (const [key, value] of Object.entries(after)) {
    if (before[key] !== value) {
      changes[key] = { from: stringify(before[key]), to: stringify(value) };
    }
  }
  return changes;
}
