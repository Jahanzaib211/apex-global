"use server";

import { recordGroupEnquiry } from "@/lib/group-enquiry";

export type ToursBookingPayload = {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  travelDate: string;
  passengers: string;
  departureCity: string;
  message: string;
  source: string;
};

export async function submitToursBooking(payload: ToursBookingPayload): Promise<{ ok: true }> {
  await recordGroupEnquiry({
    source: "Apex Group — Tours & Travels booking",
    interestType: "tour",
    payload,
  });
  return { ok: true };
}
