import { prisma } from "@apex/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health — liveness and database reachability.
 *
 * Callers: `scripts/smoke-test.mjs`, the deploy workflow's smoke step, and the
 * maintenance-mode allowlist in `middleware.ts`, which has always exempted this
 * path — the route it named simply did not exist, so a deploy check had nothing
 * better to poll than the homepage.
 *
 * Answers 200 when the process is up and the database responds, 503 otherwise.
 * A health check that reports healthy while the database is unreachable tells
 * you nothing worth knowing.
 */
export async function GET() {
  const startedAt = Date.now();
  let db: "up" | "down" = "down";

  try {
    await prisma.$queryRaw`SELECT 1`;
    db = "up";
  } catch (error) {
    console.error("[health] database unreachable", error);
  }

  const body = {
    ok: db === "up",
    version: process.env.npm_package_version ?? "unknown",
    db,
    latencyMs: Date.now() - startedAt,
    now: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status: db === "up" ? 200 : 503,
    headers: { "cache-control": "no-store" },
  });
}
