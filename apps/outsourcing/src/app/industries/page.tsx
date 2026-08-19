import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROUTE_META } from "@/lib/nav";

export const metadata: Metadata = {
  title: ROUTE_META["/industries"]!.title,
  description: ROUTE_META["/industries"]!.description,
  alternates: { canonical: "/industries" },
  openGraph: {
    // Declaring openGraph replaces the root layout\'s entire node, which
    // dropped its image. The generated card lives at /opengraph-image.
    images: ["/opengraph-image"],
    title: ROUTE_META["/industries"]!.title,
    description: ROUTE_META["/industries"]!.description,
    url: "/industries",
  },
};

const INDUSTRIES = [
  {
    name: "Technology",
    desc: "SaaS, software and tech companies scale customer success, SDR and support with Apex.",
  },
  {
    name: "E-commerce",
    desc: "DTC and marketplace brands run CX, retention and reactivation campaigns with Apex.",
  },
  {
    name: "Healthcare",
    desc: "Patient support, appointment setting and back-office operations with strict quality controls.",
  },
  {
    name: "Financial Services",
    desc: "Lead generation, customer service and back-office support for fintech, lending and insurance.",
  },
  {
    name: "Real Estate",
    desc: "Lead qualification, listing follow-up and CRM management for agencies and developers.",
  },
  {
    name: "Logistics",
    desc: "Customer service, dispatch support and operational coordination for logistics operators.",
  },
  {
    name: "Retail",
    desc: "Omnichannel support, returns handling and customer engagement for retail brands.",
  },
  {
    name: "Hospitality",
    desc: "Reservations, guest support and revenue operations for hotels and travel operators.",
  },
  {
    name: "Professional Services",
    desc: "Lead generation and client support for legal, accounting and consulting firms.",
  },
  {
    name: "Education",
    desc: "Student support, admissions outreach and back-office for education providers.",
  },
  { name: "Startups", desc: "Lean teams that need flexible, scalable outsourcing from day one." },
  {
    name: "SMBs",
    desc: "Small and medium businesses that need reliable execution without building large teams.",
  },
  {
    name: "Enterprise",
    desc: "Global enterprises that need managed outsourcing at scale across multiple regions.",
  },
];

export default function IndustriesPage() {
  return (
    <main className="bg-white">
      <Navbar />

      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-20 text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Industries
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-5xl leading-tight font-extrabold md:text-6xl">
            Built for the sectors <span className="gradient-text">that move the world.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Apex delivers outsourcing solutions across technology, commerce, healthcare, finance and
            beyond. Each industry brings its own customer, regulatory and operational realities — we
            adapt to yours.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((i) => (
              <article
                key={i.name}
                className="border-line card-hover rounded-2xl border bg-white p-6"
              >
                <div className="text-amber2-dark text-xs font-semibold tracking-widest uppercase">
                  Industry
                </div>
                <h3 className="font-display text-navy mt-2 text-xl font-bold">{i.name}</h3>
                <p className="text-steel mt-3 text-sm leading-relaxed">{i.desc}</p>
                <div className="text-steel mt-5 text-xs">
                  Industry challenge → Apex solution → Operational benefit
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <h2 className="font-display text-navy text-3xl font-extrabold md:text-4xl">
              Don't see your industry?
            </h2>
            <p className="text-steel mt-3">
              We support many more. Talk to us about your specific requirements.
            </p>
            <Link href="/contact" className="btn-primary mt-6">
              Talk to Our Team <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
