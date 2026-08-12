import { prisma } from "@apex/db";
import { NextResponse } from "next/server";
import { clientIp } from "@/lib/attribution.server";
import { ingestLead } from "@/lib/ingest-lead";
import { rateLimited, verifyTurnstile } from "@/lib/form-guards";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Product demo request — a lead with a product attached.
 *
 * The product page's "Request a demo" form posts here. The pipeline is the
 * same as the general lead form, plus a `DemoRequest` row linking the lead to
 * the SaaS product they asked about, so demo requests join the same CRM
 * pipeline as contact-form enquiries rather than sitting in a separate inbox.
 */
const demoSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  companyName: z.string().trim().max(160).nullish(),
  jobTitle: z.string().trim().max(120).nullish(),
  country: z.string().trim().max(80).nullish(),
  phone: z.string().trim().max(40).nullish(),
  preferredTime: z.string().trim().max(200).nullish(),
  notes: z.string().trim().max(4000).nullish(),

  productSlug: z.string().trim().min(1).max(120),
  productId: z.string().trim().min(1).max(80).nullish(),

  consentContact: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we may contact you about this demo" }),
  }),
  company_website: z.string().nullish(),
  turnstileToken: z.string().nullish(),

  attribution: z
    .object({
      utmSource: z.string().nullish(),
      utmMedium: z.string().nullish(),
      utmCampaign: z.string().nullish(),
      utmTerm: z.string().nullish(),
      utmContent: z.string().nullish(),
      gclid: z.string().nullish(),
      fbclid: z.string().nullish(),
      msclkid: z.string().nullish(),
      referrer: z.string().nullish(),
      landingPath: z.string().nullish(),
      currentPath: z.string().nullish(),
      consentAnalytics: z.boolean().optional(),
      consentMarketing: z.boolean().optional(),
    })
    .optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  if (rateLimited(`demo:${ip}`)) {
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

  const parsed = demoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const input = parsed.data;

  // Honeypot. Return success so the bot believes it worked and does not retry
  // with a different strategy — but write nothing.
  if (input.company_website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // The schema has always accepted a `turnstileToken`; until now nothing
  // checked it, which made this the softer of the two public form endpoints.
  if (!(await verifyTurnstile(input.turnstileToken ?? undefined, ip))) {
    return NextResponse.json({ error: "Human verification failed." }, { status: 403 });
  }

  // Resolve the product. Only published products can receive demo requests;
  // any other slug is treated as a malformed submission.
  const product = await prisma.saasProduct.findFirst({
    where: { slug: input.productSlug, status: "LIVE" },
    select: { id: true, slug: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  }

  try {
    const result = await ingestLead({
      input: {
        name: input.name,
        email: input.email,
        phone: input.phone ?? undefined,
        companyName: input.companyName ?? undefined,
        jobTitle: input.jobTitle ?? undefined,
        country: input.country ?? undefined,
        interestType: "product",
        interestSlug: product.slug,
        message: input.notes ?? undefined,
      },
      attribution: input.attribution ?? undefined,
      headers: request.headers,
      sourceSite: "tech",
      sourceType: "DEMO_REQUEST",
      activitySummary: `Demo requested for ${product.slug}`,
      // Create or refresh the demo request record inside the same transaction:
      // a DemoRequest pointing at a lead that failed to commit is a row nobody
      // can action.
      extend: (tx, lead) =>
        tx.demoRequest.upsert({
          where: { leadId: lead.id },
          create: {
            productId: product.id,
            leadId: lead.id,
            preferredTime: input.preferredTime,
            notes: input.notes,
          },
          update: {
            preferredTime: input.preferredTime,
            notes: input.notes,
          },
        }),
    });

    return NextResponse.json(
      { ok: true, id: result.lead.id, demoId: result.extended.id, wasNew: result.wasNew },
      { status: 201 },
    );
  } catch (error) {
    console.error("Demo request failed", error);
    return NextResponse.json(
      { error: "We could not record your demo request. Please email us instead." },
      { status: 500 },
    );
  }
}
