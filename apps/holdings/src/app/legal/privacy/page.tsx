import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocumentPage } from "@/components/LegalDocument";
import { documentBySlug } from "@/lib/legal";

const doc = documentBySlug("privacy");

export const metadata: Metadata = {
  title: doc?.title ?? "Legal",
  description: doc?.summary,
  alternates: { canonical: "/legal/privacy" },
};

export default function Page() {
  if (!doc) notFound();
  return <LegalDocumentPage doc={doc} />;
}
