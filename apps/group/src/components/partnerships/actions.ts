"use server";

import { recordGroupEnquiry } from "@/lib/group-enquiry";

export type PartnershipPayload = {
  fullName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  partnershipType: string;
  companyOfInterest: string;
  proposal: string;
  consent: boolean;
};

export async function submitPartnershipEnquiry(payload: PartnershipPayload): Promise<{ ok: true }> {
  await recordGroupEnquiry({
    source: "Apex Group — Partnership enquiry",
    interestType: "partnership",
    payload,
  });
  return { ok: true };
}
