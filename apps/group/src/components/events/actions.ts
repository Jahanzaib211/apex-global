"use server";

import { recordGroupEnquiry } from "@/lib/group-enquiry";

export type EventRegistrationPayload = {
  eventSlug: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
};

export async function submitEventRegistration(
  payload: EventRegistrationPayload,
): Promise<{ ok: true }> {
  await recordGroupEnquiry({
    source: "Apex Group — Event registration",
    interestType: "event",
    payload,
  });
  return { ok: true };
}

export async function submitEventsNewsletter(payload: { email: string }): Promise<{ ok: true }> {
  await recordGroupEnquiry({
    source: "Apex Group — Events newsletter",
    interestType: "newsletter",
    payload,
  });
  return { ok: true };
}
