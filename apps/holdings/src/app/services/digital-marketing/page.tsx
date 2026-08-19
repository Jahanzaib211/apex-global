import type { Metadata } from "next";
import { ServiceDetail } from "../detail-page";
export const metadata: Metadata = {
  title: "Digital Marketing",
  description:
    "Performance marketing for property: paid search, social, creative and landing pages built to generate qualified enquiries.",
};

export default function Page() {
  return <ServiceDetail slug="digital-marketing" />;
}
