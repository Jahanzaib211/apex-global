import type { NextRequest } from "next/server";
import { persistSubmission } from "@/lib/submissions";
import { clientIp, jsonResponse, preflight } from "@/lib/http";
import { forwardLeadToApex, visitorFrom, type ApexLeadAttribution } from "@/lib/apex-lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  /** utm_* / gclid captured on landing, forwarded so paid traffic stays attributable. */
  attribution?: ApexLeadAttribution;
}

export function OPTIONS(req: NextRequest): Response {
  return preflight(req);
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(req, { ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return jsonResponse(req, { ok: false, error: "missing_fields" }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(req, { ok: false, error: "invalid_email" }, { status: 422 });
  }

  await persistSubmission({
    kind: "contact",
    receivedAt: new Date().toISOString(),
    ip: clientIp(req),
    userAgent: req.headers.get("user-agent"),
    payload: {
      name,
      email,
      phone: (body.phone || "").trim(),
      subject: (body.subject || "").trim(),
      message,
    },
  });

  // Forward into the Apex CRM. The local file above stays as the backstop:
  // it is written first and it is what proves an enquiry arrived even if the
  // CRM was unreachable. Awaited rather than fired-and-forgotten so the
  // serverless-style request is not torn down mid-flight, but a failure here
  // never fails the submission — the customer's enquiry is already saved.
  const forwarded = await forwardLeadToApex(
    {
      name,
      email,
      phone: (body.phone || "").trim(),
      interestType: "holdings",
      interestSlug: (body.subject || "").trim() || undefined,
      message,
      attribution: body.attribution,
    },
    visitorFrom(req),
    { site: "apex-holdings" },
  );

  if (!forwarded.ok) {
    console.warn(`[contact] enquiry stored locally but not forwarded: ${forwarded.reason}`);
  }

  return jsonResponse(req, { ok: true });
}
