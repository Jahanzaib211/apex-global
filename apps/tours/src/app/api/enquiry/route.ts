import { NextResponse } from "next/server";
import { forwardLeadToApex, visitorFrom, type ApexLeadAttribution } from "@/lib/apex-lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Tour enquiries → the Apex CRM.
 *
 * Until this route existed the enquiry modal composed a WhatsApp message and
 * that was the whole pipeline: if the customer never sent the message, or the
 * agent lost the thread, the enquiry existed nowhere. Every tour enquiry ever
 * submitted was invisible to the business.
 *
 * The WhatsApp hand-off is deliberately kept — it is how this audience prefers
 * to talk, and it converts. This route runs alongside it so the enquiry is
 * also recorded, attributed and scored.
 */

interface EnquiryPayload {
  name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  type?: string;
  message?: string;
  /** The full composed summary from the modal, so nothing typed is lost. */
  summary?: string;
  attribution?: ApexLeadAttribution;
  company_website?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request): Promise<NextResponse> {
  let body: EnquiryPayload;
  try {
    body = (await req.json()) as EnquiryPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const whatsapp = (body.whatsapp || "").trim();
  const email = (body.email || "").trim();

  // A name plus some way to reach them is the floor. Tour customers routinely
  // leave email blank and give a phone number instead, so requiring an address
  // here would reject the majority of real enquiries.
  if (!name || (!phone && !whatsapp && !email)) {
    return NextResponse.json({ ok: false, error: "missing_contact" }, { status: 422 });
  }

  // The CRM keys people on email, so synthesise a stable placeholder when a
  // customer only left a phone number. Same person, same number, same lead —
  // rather than a new orphan record on every submission.
  const contactDigits = (phone || whatsapp).replace(/\D/g, "");
  const effectiveEmail =
    email && EMAIL_RE.test(email)
      ? email
      : contactDigits
        ? `tours+${contactDigits}@apexgroupcompanies.com`
        : "";

  if (!effectiveEmail) {
    return NextResponse.json({ ok: false, error: "missing_contact" }, { status: 422 });
  }

  const forwarded = await forwardLeadToApex(
    {
      name,
      email: effectiveEmail,
      phone: phone || whatsapp,
      country: "Pakistan",
      interestType: "tour",
      interestSlug: (body.type || "").trim() || undefined,
      // The composed summary carries pickup, dates, vehicle, travellers — all
      // the detail the agent needs to quote without a second conversation.
      requirements: (body.summary || "").trim() || undefined,
      message: (body.message || "").trim() || undefined,
      attribution: body.attribution,
      company_website: body.company_website,
    },
    visitorFrom(req),
    { site: "apex-tours" },
  );

  // Always 200. The client opens WhatsApp immediately after this call; a CRM
  // outage must not block the customer from reaching a human.
  if (!forwarded.ok) {
    console.warn(`[enquiry] not forwarded to the CRM: ${forwarded.reason}`);
    return NextResponse.json({ ok: true, recorded: false });
  }

  return NextResponse.json({ ok: true, recorded: true, id: forwarded.id });
}
