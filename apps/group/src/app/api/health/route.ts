import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  const mem = process.memoryUsage();
  return NextResponse.json(
    {
      status: "ok",
      service: "apex-group",
      uptime: Math.round(process.uptime()),
      now: new Date().toISOString(),
      nodeVersion: process.version,
      memory: {
        rss: mem.rss,
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
