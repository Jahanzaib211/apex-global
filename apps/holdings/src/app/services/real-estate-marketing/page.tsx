import type { Metadata } from "next";
import { ServiceDetail } from "../detail-page";
export const metadata: Metadata = {
  title: "Real Estate Marketing",
  description:
    "Real-estate marketing that connects developers with serious buyers and investors across Pakistan's major cities.",
};

export default function Page() {
  return <ServiceDetail slug="real-estate-marketing" />;
}
