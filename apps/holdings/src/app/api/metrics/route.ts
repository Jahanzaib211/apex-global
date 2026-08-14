import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MetricsReport {
  timestamp: string;
  uptime: number;
  process: {
    pid: number;
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  submissions: {
    total: number;
    byKind: Record<string, number>;
  };
}

const startedAt = Date.now();

export async function GET(): Promise<NextResponse> {
  const dataDir = process.env.APEX_HOLDINGS_DATA_DIR || path.resolve(process.cwd(), ".data");
  const submissionsDir = path.join(dataDir, "submissions");
  let total = 0;
  const byKind: Record<string, number> = {};
  try {
    const entries = await fs.readdir(submissionsDir);
    total = entries.length;
    for (const entry of entries) {
      const kind = entry.split("-")[0];
      if (kind) byKind[kind] = (byKind[kind] || 0) + 1;
    }
  } catch {
    // directory may not exist yet — that's fine
  }

  const mem = process.memoryUsage();
  const report: MetricsReport = {
    timestamp: new Date().toISOString(),
    uptime: Math.round((Date.now() - startedAt) / 1000),
    process: {
      pid: process.pid,
      rss: mem.rss,
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
    },
    submissions: { total, byKind },
  };

  return NextResponse.json(report, {
    headers: { "Cache-Control": "no-store" },
  });
}
