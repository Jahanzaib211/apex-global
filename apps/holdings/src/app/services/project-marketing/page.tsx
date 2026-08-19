import type { Metadata } from "next";
import { ServiceDetail } from "../detail-page";
export const metadata: Metadata = {
  title: "Project Marketing",
  description:
    "End-to-end project marketing for developers — positioning, launch campaigns and sales-team enablement.",
};

export default function Page() {
  return <ServiceDetail slug="project-marketing" />;
}
