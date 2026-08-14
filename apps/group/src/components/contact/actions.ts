"use server";

import { recordGroupEnquiry } from "@/lib/group-enquiry";

export type ContactPayload = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  interestedCompany: string;
  enquiryType: string;
  service: string;
  message: string;
  preferredContact: string;
};

export async function submitGroupContact(payload: ContactPayload): Promise<{ ok: true }> {
  await recordGroupEnquiry({
    source: "Apex Group — General contact",
    interestType: "general",
    payload,
  });
  return { ok: true };
}

export async function submitNewsletterSubscription(payload: {
  email: string;
}): Promise<{ ok: true }> {
  await recordGroupEnquiry({
    source: "Apex Group — Newsletter",
    interestType: "newsletter",
    payload,
  });
  return { ok: true };
}
