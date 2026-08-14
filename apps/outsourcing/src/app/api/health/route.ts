import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    name: "Apex Global Outsourcing",
    env: process.env.NODE_ENV ?? "unknown",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

export async function HEAD(): Promise<NextResponse> {
  // Lightweight probe used by uptime monitors; logs every check to avoid log noise.
  logger.debug("health probe");
  return NextResponse.json({ ok: true });
}
