import type { NextRequest } from "next/server";
import { persistSubmission } from "@/lib/submissions";
import { clientIp, jsonResponse, preflight } from "@/lib/http";
import { forwardLeadToApex, visitorFrom, type ApexLeadAttribution } from "@/lib/apex-lead";

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
  /** utm_* / gclid captured on landing, forwarded so paid traffic stays attributable. */
  attribution?: ApexLeadAttribution;
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


  // Forward into the Apex CRM. The local file above stays as the backstop: it
  // is written first and proves the enquiry arrived even if the CRM was
  // unreachable. A failure here never fails the submission.
  const forwarded = await forwardLeadToApex(
    {
      name,
      email,
      phone: (body.phone || "").trim() || undefined,
      interestType: "holdings-careers",
      interestSlug: (body.role || "").trim() || undefined,
      message: (body.cover || body.message || "").trim() || undefined,
      jobTitle: (body.role || "").trim() || undefined,
      requirements: [
        body.role && `Role: ${body.role}`,
        body.resumeUrl && `CV: ${body.resumeUrl}`,
      ]
        .filter(Boolean)
        .join("\n"),
      attribution: body.attribution,
    },
    visitorFrom(req),
    { site: "apex-holdings" },
  );

  if (!forwarded.ok) {
    console.warn(`[careers] stored locally but not forwarded: ${forwarded.reason}`);
  }

  return jsonResponse(req, { ok: true });
}
