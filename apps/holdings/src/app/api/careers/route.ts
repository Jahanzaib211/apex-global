import type { NextRequest } from "next/server";
import { persistSubmission } from "@/lib/submissions";
import { clientIp, jsonResponse, preflight } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CareersPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  cover?: string;
  resumeUrl?: string;
  message?: string;
}

export function OPTIONS(req: NextRequest): Response {
  return preflight(req);
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: CareersPayload;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(req, { ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const role = (body.role || "").trim();

  if (!name || !email || !role) {
    return jsonResponse(req, { ok: false, error: "missing_fields" }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(req, { ok: false, error: "invalid_email" }, { status: 422 });
  }

  await persistSubmission({
    kind: "careers",
    receivedAt: new Date().toISOString(),
    ip: clientIp(req),
    userAgent: req.headers.get("user-agent"),
    payload: body,
  });

  return jsonResponse(req, { ok: true });
}
