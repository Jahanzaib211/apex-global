import type { Metadata } from "next";
import { ServiceDetail } from "../detail-page";
export const metadata: Metadata = {
  title: "Sales & Lead Generation",
  description:
    "Qualified lead generation and sales support for property developers, measured on booked site visits and closings.",
};

export default function Page() {
  return <ServiceDetail slug="sales-lead-generation" />;
}
