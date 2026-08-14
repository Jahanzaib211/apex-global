import type { NextRequest } from "next/server";

const ALLOWED = (process.env.APEX_HOLDINGS_CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  if (!ALLOWED.length) return {};
  if (!ALLOWED.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

export function preflight(req: NextRequest): Response {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

export function jsonResponse(req: NextRequest, body: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  for (const [k, v] of Object.entries(corsHeaders(req))) headers.set(k, v);
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function clientIp(req: NextRequest): string | null {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  );
}

export function isDryRun(): boolean {
  return (process.env.APEX_HOLDINGS_DRY_RUN || "false").toLowerCase() === "true";
}
