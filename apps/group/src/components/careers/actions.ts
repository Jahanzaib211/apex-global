"use server";

import { recordGroupEnquiry } from "@/lib/group-enquiry";

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

export async function submitCareersApplication(payload: CareersPayload): Promise<{ ok: true }> {
  await recordGroupEnquiry({
    source: "Apex Group — Career application",
    interestType: "career",
    payload,
  });
  return { ok: true };
}
