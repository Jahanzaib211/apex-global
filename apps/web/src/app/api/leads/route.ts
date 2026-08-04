import { prisma } from "@apex/db";
import { NextResponse } from "next/server";
import { clientCountry, clientIp, dedupeKey, hashIp } from "@/lib/attribution.server";
import { enrichLeadInBackground } from "@/lib/enrich";
import { leadSchema } from "@/lib/lead-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Requests per window, per address. Generous for humans, useless for a bot. */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const attempts = new Map<string, { count: number; resetAt: number }>();

/**
 * In-process limiter. Correct for a single instance and honest about its
 * limits: behind more than one replica this becomes per-replica, so the Redis
 * counter in `modules/crm` supersedes it when the worker tier lands.
 */
function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // Fail open, loudly. Rejecting every submission because a key was not
    // configured would silently bin real enquiries in the middle of a paid
    // campaign — far more damaging than the spam the challenge prevents, and
    // much harder to notice. The honeypot and rate limit still apply.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "TURNSTILE_SECRET_KEY is not set in production. Form submissions are accepted " +
          "without a human-verification challenge. Configure it.",
      );
    }
    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // A challenge provider outage must not stop us taking business. Log and
    // let it through; the honeypot and rate limit still apply.
    console.warn("Turnstile verification unavailable — allowing submission");
    return true;
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  if (rateLimited(ip)) {
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

  const attribution = input.attribution ?? {};
  const key = dedupeKey(input.email);

  try {
    // One transaction: a lead without its attribution is a lead we cannot
    // attribute to spend, which defeats the purpose of collecting it.
    const lead = await prisma.$transaction(async (tx) => {
      const existing = await tx.lead.findUnique({ where: { dedupeKey: key } });

      if (existing) {
        // Same person, same day. Append rather than duplicating, so sales does
        // not call twice and the original attribution is preserved.
        await tx.leadActivity.create({
          data: {
            leadId: existing.id,
            type: "note",
            summary: "Repeat submission on the same day",
            detail: input.message ?? input.requirements ?? null,
          },
        });
        return existing;
      }

      return tx.lead.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          companyName: input.companyName,
          jobTitle: input.jobTitle,
          country: input.country ?? clientCountry(request.headers),
          countryCode: clientCountry(request.headers),
          companySize: input.companySize,
          interestType: input.interestType ?? "general",
          interestSlug: input.interestSlug,
          requirements: input.requirements,
          budgetBand: input.budgetBand,
          timeline: input.timeline,
          message: input.message,
          sourceType: input.interestType === "product" ? "DEMO_REQUEST" : "FORM",
          dedupeKey: key,
          attribution: {
            create: {
              utmSource: attribution.utmSource,
              utmMedium: attribution.utmMedium,
              utmCampaign: attribution.utmCampaign,
              utmTerm: attribution.utmTerm,
              utmContent: attribution.utmContent,
              gclid: attribution.gclid,
              fbclid: attribution.fbclid,
              msclkid: attribution.msclkid,
              referrer: attribution.referrer,
              landingPath: attribution.landingPath,
              currentPath: attribution.currentPath,
              userAgent: request.headers.get("user-agent")?.slice(0, 500),
              // Hashed, never stored raw.
              ipHash: hashIp(ip),
              country: clientCountry(request.headers),
              consentAnalytics: attribution.consentAnalytics ?? false,
              consentMarketing: attribution.consentMarketing ?? false,
            },
          },
          activities: {
            create: {
              type: "stage_change",
              summary: "Lead captured from the website",
              meta: { landingPath: attribution.landingPath ?? null },
            },
          },
        },
      });
    });

    // Enrichment runs after the lead is committed and is never awaited. A slow
    // or failing model must not delay the response or lose the enquiry — the
    // record is already safe, and a summary is a convenience on top of it.
    void enrichLeadInBackground(lead.id);

    // TODO(modules/crm): notification and server-side conversion delivery move
    // onto BullMQ with the worker tier, for retries and a dead-letter queue.

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead capture failed", error);
    return NextResponse.json(
      { error: "We could not record your enquiry. Please email us instead." },
      { status: 500 },
    );
  }
}
