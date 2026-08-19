import { prisma } from "@apex/db";

/**
 * Allocate the next sequential reference for a record, e.g. `INV-0007`.
 *
 * A `sequences` row per (model, prefix) is the single counter, locked with
 * SELECT FOR UPDATE inside the transaction — two operators saving at the same
 * instant queue behind each other instead of racing to the same number.
 * First use of a key seeds the counter from the highest number already in the
 * table, so pre-existing invoices/quotes are never collided with.
 */
export async function nextSequential(
  model: "quote" | "invoice",
  prefix: string,
  pad = 4,
): Promise<string> {
  const key = `${model}:${prefix}`;
  return prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<{ value: number }[]>`
      SELECT value FROM sequences WHERE key = ${key} FOR UPDATE`;
    let value = rows[0]?.value ?? 0;

    if (rows.length === 0) {
      const delegate = (tx as unknown as Record<
        string,
        { findFirst: (args: unknown) => Promise<{ number: string } | null> }
      >)[model];
      if (!delegate) throw new Error(`Unknown sequential model: ${model}`);
      const latest = await delegate.findFirst({ orderBy: { createdAt: "desc" } });
      value = latest ? parseInt(latest.number.replace(/\D/g, ""), 10) || 0 : 0;
      await tx.sequence.create({ data: { key, value } });
    }

    value += 1;
    await tx.sequence.update({ where: { key }, data: { value } });
    return `${prefix}-${String(value).padStart(pad, "0")}`;
  });
}