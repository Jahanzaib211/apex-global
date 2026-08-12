import { NextResponse } from "next/server";
import { clientIp } from "@/lib/attribution.server";
import { ingestLead } from "@/lib/ingest-lead";
import { leadSchema } from "@/lib/lead-schema";
import { rateLimited, verifyTurnstile } from "@/lib/form-guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The public contact form on tech.apexgroupcompanies.com.
 *
 * Browser-facing, so it carries the guards a browser submission needs —
 * rate limit, honeypot, Turnstile. Once the submission is judged human the
 * write itself is `ingestLead`, shared with the demo-request form and with
 * the four group sites posting through /api/leads/partner.
 */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  if (rateLimited(`leads:${ip}`)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const input = parsed.data;

  // Honeypot. Return success so the bot believes it worked and does not retry
  // with a different strategy — but write nothing.
  if (input.company_website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const humanVerified = await verifyTurnstile(input.turnstileToken, ip);
  if (!humanVerified) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 403 });
  }

  try {
    const { lead } = await ingestLead({
      input,
      attribution: input.attribution,
      headers: request.headers,
      sourceSite: "tech",
      sourceType: input.interestType === "product" ? "DEMO_REQUEST" : "FORM",
      activitySummary: "Lead captured from the website",
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead capture failed", error);
    return NextResponse.json(
      { error: "We could not record your enquiry. Please email us instead." },
      { status: 500 },
    );
  }
}
