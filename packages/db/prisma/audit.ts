/* eslint-disable no-console */
import { PrismaClient } from "../generated/client/index.js";
import { assertCredibility } from "./credibility.js";

/**
 * CI entry point for the credibility gate (`pnpm audit:credibility`).
 * Exits non-zero on any violation so a build cannot ship content that breaks
 * the rules in docs/CREDIBILITY.md.
 */
const prisma = new PrismaClient();

async function main() {
  const violations = await assertCredibility(prisma);

  if (violations.length === 0) {
    console.log("Credibility audit passed — all published content is defensible.");
    return;
  }

  console.error(`Credibility audit failed with ${violations.length} violation(s):\n`);

  const byRule = new Map<string, typeof violations>();
  for (const v of violations) {
    byRule.set(v.rule, [...(byRule.get(v.rule) ?? []), v]);
  }

  for (const [rule, items] of byRule) {
    console.error(`  ${rule}`);
    for (const item of items) {
      console.error(`    - ${item.entity}: ${item.detail}`);
      // GitHub Actions renders this as an inline annotation.
      console.error(`::error title=Credibility: ${rule}::${item.entity} — ${item.detail}`);
    }
  }

  console.error("\nSee docs/CREDIBILITY.md for what each rule means and why it exists.");
  process.exitCode = 1;
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
