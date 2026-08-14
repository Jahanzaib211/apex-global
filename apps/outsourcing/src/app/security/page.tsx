import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LegalDocumentPage } from "@/components/LegalDocument";
import { documentBySlug } from "@/lib/legal";

const doc = documentBySlug("security");

export const metadata: Metadata = {
  title: doc?.title ?? "Legal",
  description: doc?.summary,
  alternates: { canonical: "/security" },
};

export default function Page() {
  if (!doc) notFound();
  return (
    <>
      <Navbar />
      <LegalDocumentPage doc={doc} />
      <Footer />
    </>
  );
}
