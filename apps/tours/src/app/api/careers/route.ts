import { NextResponse } from "next/server";
import { forwardLeadToApex, visitorFrom, type ApexLeadAttribution } from "@/lib/apex-lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Job applications → the Apex CRM.
 *
 * The careers page had no form at all: every "Apply" button was a `mailto:` to
 * an address on a domain Apex does not own, on a mail stack whose outbound
 * delivery has never succeeded (infra/MAIL.md). Applications went nowhere and
 * left no trace, so nobody could tell the page was broken.
 *
 * The CV is taken as a link rather than a file upload, matching the
 * `resumeUrl` contract apps/holdings already uses. That keeps one shape across
 * the group and avoids standing up an unmanaged store of CVs — personal data
 * with no retention policy — on the web server's disk.
 */
interface CareersPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  experience?: string;
  resumeUrl?: string;
  cover?: string;
  attribution?: ApexLeadAttribution;
  /** Honeypot. Real people leave it empty. */
  company_website?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request): Promise<NextResponse> {
  let body: CareersPayload;
  try {
    body = (await req.json()) as CareersPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const role = (body.role || "").trim();

  if (!name || !email || !role) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const forwarded = await forwardLeadToApex(
    {
      name,
      email,
      phone: (body.phone || "").trim() || undefined,
      jobTitle: role,
      interestType: "career",
      interestSlug: role,
      message: (body.cover || "").trim() || undefined,
      requirements: [
        `Role: ${role}`,
        body.experience && `Experience: ${body.experience}`,
        body.resumeUrl && `CV: ${body.resumeUrl}`,
      ]
        .filter(Boolean)
        .join("\n"),
      attribution: body.attribution,
      company_website: body.company_website,
    },
    visitorFrom(req),
    { site: "apex-tours" },
  );

  // `forwardLeadToApex` spools to disk when the CRM is unreachable, so the
  // application is never lost — but the applicant is told the truth either way.
  if (!forwarded.ok) {
    console.error(`[careers] application not forwarded (${forwarded.reason}) — spooled for replay`);
    return NextResponse.json({ ok: false, error: forwarded.reason }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
