"use server";

import { recordGroupEnquiry } from "@/lib/group-enquiry";

export type ConsultancyPayload = {
  source: string;
  personal: {
    fullName: string;
    preferredName: string;
    email: string;
    mobile: string;
    whatsapp: string;
    country: string;
    city: string;
    contactMethod: string;
    preferredTime: string;
  };
  profile: { clientType: string };
  requirement: { topics: string[] };
  business: {
    businessName: string;
    industry: string;
    country: string;
    yearsOperating: string;
    employees: string;
    revenueRange: string;
    ownership: string;
    numBusinesses: string;
    expansion: string;
    funding: string;
    challenges: string;
  };
  objectives: {
    realEstateValue: string;
    realEstateProps: string;
    realEstateCountries: string;
    businessValue: string;
    businessCount: string;
    financialValue: string;
    financialCategory: string;
    otherValue: string;
    otherDesc: string;
    liabilityTotal: string;
    liabilityBusiness: string;
    liabilityProperty: string;
    liabilityOther: string;
    debtServicing: string;
    primaryObjectives: string[];
    experience: string;
    risk: string;
    horizon: string;
    liquidity: string;
  };
  final: {
    additional: string;
    consent: boolean;
  };
};

export async function submitConsultancyRequest(payload: ConsultancyPayload): Promise<{ ok: true }> {
  await recordGroupEnquiry({
    source: "Apex Group — Consultancy request",
    interestType: "consultancy",
    payload,
  });
  return { ok: true };
}
