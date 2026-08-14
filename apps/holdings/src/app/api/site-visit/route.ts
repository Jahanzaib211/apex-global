import type { NextRequest } from "next/server";
import { persistSubmission } from "@/lib/submissions";
import { clientIp, jsonResponse, preflight } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SiteVisitPayload {
  name?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
  project?: string;
  visitors?: string;
  transport?: boolean;
  whatsapp?: boolean;
  message?: string;
}

export function OPTIONS(req: NextRequest): Response {
  return preflight(req);
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: SiteVisitPayload;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(req, { ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();

  if (!name || !email || !phone) {
    return jsonResponse(req, { ok: false, error: "missing_fields" }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(req, { ok: false, error: "invalid_email" }, { status: 422 });
  }

  await persistSubmission({
    kind: "site-visit",
    receivedAt: new Date().toISOString(),
    ip: clientIp(req),
    userAgent: req.headers.get("user-agent"),
    payload: body,
  });

  return jsonResponse(req, { ok: true });
}
