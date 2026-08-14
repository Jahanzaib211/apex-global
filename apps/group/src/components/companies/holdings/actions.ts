"use server";

import { recordGroupEnquiry } from "@/lib/group-enquiry";

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

export async function submitSiteVisit(payload: SiteVisitPayload): Promise<{ ok: true }> {
  await recordGroupEnquiry({
    source: "Apex Group — Holdings site visit",
    interestType: "holdings",
    payload,
  });
  return { ok: true };
}
