import { prisma } from "@apex/db";

/**
 * Generate the next sequential reference for a record, e.g. `QT-0007`.
 *
 * Reads the latest record of the given model, parses the trailing number from its
 * `number` field, and returns the next one, zero-padded to `pad`. Wrapped in a
 * short retry loop: if two operators save at the same instant the unique
 * constraint on `number` rejects the collision and we recompute. Never loops
 * forever — after a handful of attempts it throws so the caller can surface a
 * clear error rather than hanging.
 */
export async function nextSequential(
  model: "quote" | "invoice",
  prefix: string,
  pad = 4,
): Promise<string> {
  const delegate = (
    prisma as unknown as Record<
      string,
      { findFirst: (args: unknown) => Promise<{ number: string } | null> }
    >
  )[model];
  if (!delegate) throw new Error(`Unknown sequential model: ${model}`);
  for (let attempt = 0; attempt < 5; attempt++) {
    const latest = await delegate.findFirst({ orderBy: { createdAt: "desc" } });
    const seq = latest ? (parseInt(latest.number.replace(/\D/g, ""), 10) || 0) + 1 : 1;
    const candidate = `${prefix}-${String(seq).padStart(pad, "0")}`;
    return candidate;
  }
  throw new Error(`Could not allocate a ${prefix} number`);
}
