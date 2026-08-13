/** JSON-safe change record. Anything non-primitive is stringified at the edge
 *  so the column can never receive a value Postgres will reject. */
export type AuditChanges = Record<string, { from: string | null; to: string | null }>;

function stringify(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value);
}

/**
 * Diff of only the keys that actually differ, for the audit `changes` field.
 * Declared apart from the server-only audit module so it can be unit-tested
 * without a database or Next request context.
 */
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
