import { NextResponse } from "next/server";
import { z } from "zod";
import { ingestLead, isLeadSite, LEAD_SITES } from "@/lib/ingest-lead";
import { leadSchema } from "@/lib/lead-schema";
import { verifyPartnerSignature } from "@/lib/partner-signature";

/**
 * The first-party contract plus the visitor details the sending origin has to
 * pass through on the browser's behalf. Turnstile is dropped — there is no
 * browser here to challenge.
 */
const partnerLeadSchema = leadSchema.omit({ turnstileToken: true }).extend({
  visitor: z
    .object({
      ip: z.string().trim().max(64).optional(),
      userAgent: z.string().trim().max(500).optional(),
      country: z.string().trim().max(8).optional(),
    })
    .optional(),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lead intake for the Apex group sites.
 *
 * Apex Group, Holdings, Outsourcing and Tours each run their own Next.js app.
 * Their contact forms POST to their own origin, and that server signs and
 * forwards the enquiry here, so every Apex enquiry lands in one pipeline with
 * one dedupe rule, one attribution model, one AI scoring pass and one CRM sync.
 *
 * Server-to-server by design. The alternative — CORS on the public form
 * endpoint — would put a shared credential in four browser bundles and require
 * a Turnstile deployment on each site. Here the secret never leaves the
 * origins, and there is no browser to challenge:
 *
 *   - Turnstile is skipped (nothing human is on the other end of this call)
 *   - the HMAC replaces it as the guard
 *   - the honeypot is still enforced, because the *sending* site's form is
 *     browser-facing and forwards whatever the bot typed
 */
export async function POST(request: Request) {
  const secret = process.env.PARTNER_LEAD_SECRET ?? "";

  // Refuse rather than fall open. An unconfigured deployment that accepted
  // unsigned traffic would be an open lead-injection endpoint.
  if (!secret) {
    return NextResponse.json({ error: "Partner lead intake is not configured" }, { status: 503 });
  }

  const site = request.headers.get("x-apex-site") ?? "";
  if (!isLeadSite(site)) {
    return NextResponse.json({ error: "Unknown site" }, { status: 400 });
  }

  // Raw text, not request.json(): the signature covers the exact bytes sent,
  // and re-serialising a parsed object would not reproduce them.
  const rawBody = await request.text();

  const verified = verifyPartnerSignature({
    rawBody,
    site,
    timestamp: request.headers.get("x-apex-timestamp"),
    signature: request.headers.get("x-apex-signature"),
    secret,
  });

  if (!verified.ok) {
    // Deliberately uniform: distinguishing "stale" from "mismatch" to the
    // caller tells a probe which half of the scheme it got right.
    console.warn(`[leads/partner] rejected ${site}: ${verified.reason}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = partnerLeadSchema.safeParse(body);
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

  // Honeypot, forwarded from the sending site's form.
  if (input.company_website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    const { lead, wasNew } = await ingestLead({
      input,
      attribution: input.attribution,
      headers: request.headers,
      visitor: input.visitor,
      sourceSite: site,
      sourceType: "FORM",
      activitySummary: `Lead captured from ${LEAD_SITES[site]}`,
    });

    return NextResponse.json({ ok: true, id: lead.id, wasNew }, { status: 201 });
  } catch (error) {
    console.error(`[leads/partner] capture failed for ${site}`, error);
    // 5xx on purpose: the sending site retries on 5xx, and the dedupe key
    // makes that retry idempotent.
    return NextResponse.json({ error: "Could not record the enquiry." }, { status: 500 });
  }
}
