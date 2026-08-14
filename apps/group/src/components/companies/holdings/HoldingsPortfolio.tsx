"use client";

import { useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Building2, MapPin, ArrowUpRight } from "lucide-react";

type Project = {
  name: string;
  city: string;
  category: "Residential" | "Commercial" | "Mixed Use" | "Apartments" | "Plots";
  status: "Available" | "Limited Units" | "Sold Out";
};

const projects: Project[] = [
  {
    name: "Project A — Heights Residency",
    city: "Islamabad",
    category: "Residential",
    status: "Available",
  },
  {
    name: "Project B — Garden Apartments",
    city: "Lahore",
    category: "Apartments",
    status: "Available",
  },
  {
    name: "Project C — Commercial Plaza",
    city: "Karachi",
    category: "Commercial",
    status: "Limited Units",
  },
  { name: "Project D — Riverside Plots", city: "Multan", category: "Plots", status: "Available" },
  {
    name: "Project E — Mixed-Use Square",
    city: "Islamabad",
    category: "Mixed Use",
    status: "Available",
  },
  {
    name: "Project F — Boulevard Homes",
    city: "Faisalabad",
    category: "Residential",
    status: "Sold Out",
  },
];

const filters = ["All", "Residential", "Commercial", "Mixed Use", "Apartments", "Plots"] as const;

export default function HoldingsPortfolio() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="PORTFOLIO"
          title="Complete Project Directory."
          subtitle="A sample of projects in our marketing portfolio. Specific projects are shared under NDA."
        />

        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-4 py-2 text-xs font-semibold tracking-[.18em] uppercase transition ${
                filter === f
                  ? "border-navy bg-navy text-white"
                  : "border-navy/20 text-navy hover:border-gold"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <div key={p.name} className="flex h-full flex-col bg-white">
              <div className="bg-navy relative aspect-[4/3] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(242,169,0,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,.25) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
                  <Building2 size={32} className="text-gold" />
                  <p className="text-gold/70 mt-3 text-[10px] tracking-[.2em] uppercase">
                  </p>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={p.status} />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-navy text-2xl">{p.name}</h3>
                <p className="text-charcoal/65 mt-2 inline-flex items-center gap-1 text-xs">
                  <MapPin size={12} className="text-gold" /> {p.city}
                </p>
                <p className="text-charcoal/65 mt-3 text-sm leading-6">
                  Developer: <span className="text-charcoal/80">On request</span>
                </p>
                <p className="text-charcoal/40 mt-1 text-[10px] italic">
                  Representative project
                </p>
                <a
                  href="#site-visits"
                  className="text-navy hover:text-gold mt-5 inline-flex items-center gap-1 text-xs font-semibold tracking-[.18em] uppercase"
                >
                  View Project <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const styles: Record<Project["status"], string> = {
    Available: "bg-green-500/90 text-white",
    "Limited Units": "bg-amber-500/90 text-navy",
    "Sold Out": "bg-charcoal/80 text-white",
  };
  return (
    <span
      className={`px-2 py-1 text-[10px] font-bold tracking-[.15em] uppercase ${styles[status]}`}
    >
      {status}
    </span>
  );
}
