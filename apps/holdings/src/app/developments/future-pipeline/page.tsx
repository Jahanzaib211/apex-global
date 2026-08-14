"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, ShieldCheck, Clock } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";

type PipelineItem = {
  city: string;
  category: string;
  status:
    | "Planned"
    | "In Scoping"
    | "Feasibility"
    | "Concept Design"
    | "Land Sourcing"
    | "Scouted"
    | "Pre-feasibility";
  note: string;
};

const items: PipelineItem[] = [
  {
    city: "Lahore",
    category: "Premium Apartments",
    status: "Feasibility",
    note: "High-rise residential in an established corridor. Land and unit-mix thesis under evaluation.",
  },
  {
    city: "Karachi",
    category: "Mixed-Use District",
    status: "Land Sourcing",
    note: "Vertical mixed-use opportunity combining retail, residences and offices in a marquee district.",
  },
  {
    city: "Islamabad",
    category: "Commercial Plaza",
    status: "Concept Design",
    note: "Grade-A office concept targeted at corporate occupiers and select institutional investors.",
  },
  {
    city: "Northern Region",
    category: "Resorts & Hospitality",
    status: "Scouted",
    note: "Boutique hospitality and second-home concepts in scenic northern corridors — early-stage.",
  },
  {
    city: "Multan",
    category: "Master-Planned Community",
    status: "In Scoping",
    note: "Large-format residential community — location and demand thesis being shaped.",
  },
  {
    city: "Karachi",
    category: "Seafront Residences",
    status: "Planned",
    note: "Low-density, premium residences on select seafront parcels. Site-specific feasibility required.",
  },
];

const statusTone: Record<PipelineItem["status"], string> = {
  Planned: "bg-ink text-gold-400",
  Scouted: "bg-ink text-gold-400",
  "In Scoping": "bg-gold-50 text-ink border border-gold-400",
  "Land Sourcing": "bg-gold-50 text-ink border border-gold-400",
  "Concept Design": "bg-gold-50 text-ink border border-gold-400",
  "Pre-feasibility": "bg-gold-50 text-ink border border-gold-400",
  Feasibility: "bg-gold-50 text-ink border border-gold-400",
};

export default function FuturePipelinePage() {
  return (
    <>
      <PageBanner
        eyebrow="FUTURE PIPELINE"
        title="A selective pipeline of what comes next."
        description="A discreet preview of categories and locations on our development radar — formal announcements will follow when projects are officially launched."
        breadcrumbs={[
          { label: "Apex Developments", href: "/developments" },
          { label: "Future Pipeline" },
        ]}
        bg="https://images.unsplash.com/photo-1503387762-592deb58ef7e?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Intro strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-x py-14 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="eyebrow mb-4 block">How to read this page</span>
              <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl">
                Six categories we are actively evaluating.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                The items below represent the high-level categories and locations that sit on our
                development radar. Each is at a different stage — from early scouting through to
                concept design. They are not commitments, and they are not announcements.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="border-gold-400 border-l-2 bg-slate-50 p-6 lg:p-7">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-gold-500 mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="tracking-wide-2 text-ink mb-2 text-[11px] font-semibold uppercase">
                      Important
                    </p>
                    <p className="text-[14px] leading-relaxed text-slate-600">
                      Pipeline items are subject to change at any time. They are shared here for
                      context only — not as commitments, offers or launch indications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline grid */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => (
              <article
                key={`${item.city}-${item.category}-${idx}`}
                className="shadow-card hover:shadow-card-hover flex flex-col bg-white p-8 transition-shadow duration-500"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="tracking-wide-2 inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`tracking-wide-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase ${
                      statusTone[item.status]
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {item.status}
                  </span>
                </div>

                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="text-gold-500 h-4 w-4" />
                  <span className="tracking-wide-1 text-xs font-semibold uppercase">
                    {item.city}
                  </span>
                </div>

                <h3 className="font-display text-ink mb-4 text-2xl leading-snug font-bold">
                  {item.category}
                </h3>
                <p className="flex-1 text-[14px] leading-relaxed text-slate-600">{item.note}</p>

                <div className="tracking-wide-2 mt-7 border-t border-slate-200 pt-5 text-[11px] font-semibold text-slate-500 uppercase">
                  Discreet evaluation · Not formally announced
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-x py-10 lg:py-12">
          <div className="border-gold-400 flex flex-col items-start gap-5 border-l-2 bg-slate-50 p-6 lg:flex-row lg:items-center lg:p-7">
            <div className="bg-gold-50 border-gold-400/40 text-gold-500 inline-flex h-10 w-10 shrink-0 items-center justify-center border">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="flex-1 text-[14px] leading-relaxed text-slate-600">
              <span className="text-ink font-semibold">Disclaimer:</span> Future pipeline items are
              subject to change; nothing is announced until formal launch. Approvals, market
              conditions and partnership dynamics can shift priorities without prior notice.
            </p>
            <Link
              href="/contact"
              className="tracking-wide-1 text-gold-500 hover:text-ink inline-flex shrink-0 items-center gap-2 text-[12px] font-semibold uppercase transition-colors"
            >
              Register interest
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow="Stay close"
        title="Want to be notified when a project is formally announced?"
        description="Register your interest and our team will keep you informed of major development milestones — quietly and without spam."
        primary={{ label: "Register Interest", href: "/contact" }}
        secondary={{ label: "Our Development Vision", href: "/developments/vision" }}
      />
    </>
  );
}
