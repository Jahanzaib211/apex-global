#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Post-deploy smoke test.
 *
 * Checks that the public site is actually serving, not merely listening: the
 * homepage renders, the health endpoint reports a reachable database, and the
 * lead endpoint still validates its input. `pnpm smoke` referenced this file
 * for a long time without it existing, so the command failed instantly and
 * nothing noticed.
 *
 * Usage:  pnpm smoke
 *         WEB_ORIGIN=https://tech.apexgroupcompanies.com pnpm smoke
 */

const ORIGIN = (process.env.WEB_ORIGIN ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:4300")
  .replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS ?? 10000);

/** @type {Array<{ name: string, run: () => Promise<string> }>} */
const checks = [
  {
    name: "homepage renders",
    async run() {
      const res = await get("/");
      if (res.status !== 200) throw new Error(`expected 200, got ${res.status}`);
      const html = await res.text();
      if (!html.includes("<html")) throw new Error("response was not HTML");
      return `200, ${html.length} bytes`;
    },
  },
  {
    name: "health reports a reachable database",
    async run() {
      const res = await get("/api/health");
      const body = await res.json().catch(() => ({}));
      if (res.status !== 200) {
        throw new Error(`expected 200, got ${res.status} (db: ${body.db ?? "unknown"})`);
      }
      if (body.ok !== true || body.db !== "up") {
        throw new Error(`health body reports not-ok: ${JSON.stringify(body)}`);
      }
      return `db up in ${body.latencyMs}ms`;
    },
  },
  {
    name: "lead endpoint rejects an invalid body",
    async run() {
      // Deliberately invalid: proves validation runs without writing a lead.
      const res = await fetch(`${ORIGIN}/api/leads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "not-an-email" }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.status !== 422) throw new Error(`expected 422, got ${res.status}`);
      return "422 as expected";
    },
  },
];

function get(path) {
  return fetch(`${ORIGIN}${path}`, {
    headers: { "cache-control": "no-cache" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

async function main() {
  console.log(`Smoke test against ${ORIGIN}\n`);
  let failed = 0;

  for (const check of checks) {
    try {
      const detail = await check.run();
      console.log(`  PASS  ${check.name} — ${detail}`);
    } catch (error) {
      failed += 1;
      console.error(`  FAIL  ${check.name} — ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log("");
  if (failed > 0) {
    console.error(`${failed} of ${checks.length} checks failed.`);
    process.exit(1);
  }
  console.log(`All ${checks.length} checks passed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
