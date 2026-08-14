import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface HealthReport {
  status: "ok" | "degraded";
  service: string;
  version: string;
  uptime: number;
  timestamp: string;
  node: string;
  checks: Record<string, { ok: boolean; detail?: string }>;
}

const startedAt = Date.now();

async function checkDataDir(): Promise<{ ok: boolean; detail?: string }> {
  const dir = process.env.APEX_HOLDINGS_DATA_DIR || path.resolve(process.cwd(), ".data");
  try {
    await fs.mkdir(path.join(dir, "submissions"), { recursive: true });
    await fs.access(path.join(dir, "submissions"));
    return { ok: true };
  } catch (err) {
    return { ok: false, detail: (err as Error).message };
  }
}

export async function GET(): Promise<NextResponse> {
  const dataDir = await checkDataDir();
  const ok = dataDir.ok;
  const report: HealthReport = {
    status: ok ? "ok" : "degraded",
    service: "apex-holdings",
    version: process.env.npm_package_version || "1.0.0",
    uptime: Math.round((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    node: process.version,
    checks: { dataDir },
  };
  return NextResponse.json(report, {
    status: ok ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
