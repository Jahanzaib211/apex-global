import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROUTE_META } from "@/lib/nav";

export const metadata: Metadata = {
  title: ROUTE_META["/case-studies"]!.title,
  description: ROUTE_META["/case-studies"]!.description,
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: ROUTE_META["/case-studies"]!.title,
    description: ROUTE_META["/case-studies"]!.description,
    url: "/case-studies",
  },
};

const CASES = [
  {
    industry: "SaaS Technology",
    title: "SDR engine for a North American SaaS scale-up",
    summary:
      "Built and ran a 12-seat SDR team generating qualified pipeline for the client's AE team.",
  },
  {
    industry: "E-commerce",
    title: "CX outsourcing for a UK-based DTC brand",
    summary: "24/7 omnichannel customer support across email, chat and social during peak season.",
  },
  {
    industry: "Financial Services",
    title: "Lead generation for a Middle East fintech",
    summary: "B2B lead generation and appointment setting for a regional fintech platform.",
  },
  {
    industry: "Healthcare",
    title: "Patient support operations for a telehealth provider",
    summary: "Inbound patient support, scheduling and follow-up communications.",
  },
  {
    industry: "Real Estate",
    title: "Listing follow-up and qualification for a property developer",
    summary: "Outbound follow-up campaigns and lead qualification for a regional developer.",
  },
  {
    industry: "Hospitality",
    title: "Reservations and guest support for a hotel group",
    summary: "Reservation handling and guest communication across multiple properties.",
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="bg-white">
      <Navbar />

      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-20 text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Case Studies
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-5xl leading-tight font-extrabold md:text-6xl">
            Real engagements. <span className="gradient-text">Measurable outcomes.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Case studies are published with client permission. Anonymized versions are available on
            request so we never compromise the confidentiality of our clients' businesses.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CASES.map((c) => (
              <article
                key={c.title}
                className="border-line card-hover overflow-hidden rounded-2xl border bg-white"
              >
                <div className="from-navy via-slate2 to-navy-dark relative h-40 bg-gradient-to-br">
                  <div className="bg-hero-grid absolute inset-0 opacity-30" />
                  <Building2
                    size={48}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30"
                    aria-hidden
                  />
                </div>
                <div className="p-6">
                  <div className="text-amber2-dark text-xs font-semibold tracking-wider uppercase">
                    {c.industry}
                  </div>
                  <h3 className="font-display text-navy mt-2 text-lg font-bold">{c.title}</h3>
                  <p className="text-steel mt-3 text-sm leading-relaxed">{c.summary}</p>
                  <p className="text-steel mt-3 text-xs italic">
                    Anonymized case study available on request.
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-mist border-line mt-16 rounded-3xl border p-10 text-center">
            <h2 className="font-display text-navy text-2xl font-extrabold md:text-3xl">
              Want the full version of a case study?
            </h2>
            <p className="text-steel mx-auto mt-3 max-w-2xl">
              Request a confidential briefing — we'll share details under NDA.
            </p>
            <Link href="/contact" className="btn-primary mt-6">
              Request a Briefing <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
