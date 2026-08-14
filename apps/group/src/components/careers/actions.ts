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

export type CareersPayload = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  position: string;
  companyOfInterest: string;
  coverLetter: string;
  linkedin: string;
  consent: boolean;
};

export async function submitCareersApplication(payload: CareersPayload): Promise<RecordResult> {
  return await recordGroupEnquiry({
    source: "Apex Group — Career application",
    interestType: "career",
    payload,
  });
}
