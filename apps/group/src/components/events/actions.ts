"use server";

/**
 * Every action here returned a hard-coded `{ ok: true }` and threw away the
 * `RecordResult` from `recordGroupEnquiry`, so a visitor saw a confirmation
 * even when the enquiry was spooled to disk (CRM unreachable) or dropped
 * outright (no email in the payload). `recordGroupEnquiry`'s own contract
 * says the caller "should be able to see what happened, and to decide whether
 * to soften what it tells the visitor" — now it can.
 */
import { recordGroupEnquiry, type RecordResult } from "@/lib/group-enquiry";

export type EventRegistrationPayload = {
  eventSlug: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
};

export async function submitEventRegistration(
  payload: EventRegistrationPayload,
): Promise<RecordResult> {
  return await recordGroupEnquiry({
    source: "Apex Group — Event registration",
    interestType: "event",
    payload,
  });
}

export async function submitEventsNewsletter(payload: { email: string }): Promise<RecordResult> {
  return await recordGroupEnquiry({
    source: "Apex Group — Events newsletter",
    interestType: "newsletter",
    payload,
  });
}
