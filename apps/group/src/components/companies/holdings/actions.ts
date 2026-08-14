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

export type SiteVisitPayload = {
  name: string;
  email: string;
  phone: string;
  project: string;
  preferredDate: string;
  preferredTime: string;
  visitors: string;
  notes: string;
  source: string;
};

export async function submitSiteVisit(payload: SiteVisitPayload): Promise<RecordResult> {
  return await recordGroupEnquiry({
    source: "Apex Group — Holdings site visit",
    interestType: "holdings",
    payload,
  });
}
