"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Filter, Building2, ArrowRight } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const categories = ["All", "Residential", "Commercial", "Mixed-Use", "Plots & Apartments"];
const statuses = ["All", "Upcoming", "Pre-Launch", "Ongoing", "Completed"];
const cities = ["All", "Lahore", "Karachi", "Islamabad"];

export default function ProjectsPage() {
  const [category, setCategory] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (status !== "All" && p.status !== status) return false;
      if (city !== "All" && p.city !== city) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const haystack = [
          p.name,
          p.tagline,
          p.summary,
          p.city,
          p.area,
          p.category,
          p.status,
          p.developer,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [category, status, city, query]);

  const categoryTiles = [
    {
      label: "Residential",
      href: "/projects/residential",
      desc: "Apartments, villas and family homes designed for how Pakistan lives.",
    },
    {
      label: "Commercial",
      href: "/projects/commercial",
      desc: "Grade-A offices and retail anchors in central business districts.",
    },
    {
      label: "Mixed-Use",
      href: "/projects/mixed-use",
      desc: "Vertical masterplans blending retail, residences, hospitality and offices.",
    },
    {
      label: "Plots & Apartments",
      href: "/projects/plots-apartments",
      desc: "Plots and built-form apartments across Lahore, Karachi and Islamabad.",
    },
  ];

  return (
    <>
      <PageBanner
        eyebrow="PORTFOLIO"
        title="Selected projects we market and promote across Pakistan."
        description="A curated portfolio of real-estate opportunities — apartments, villas, Grade-A offices and mixed-use districts — marketed by Apex Holdings across the country’s primary corridors."
        breadcrumbs={[{ label: "Projects" }]}
      />

      <section className="section-tight border-b border-slate-200 bg-white">
        <div className="container-x">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, locations, developers..."
                className="focus:border-ink focus:ring-ink w-full border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm focus:ring-1 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Filter className="text-gold-500 h-4 w-4" />
              <span className="text-ink font-medium">{filtered.length}</span>
              <span>matching project{filtered.length === 1 ? "" : "s"}</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <FilterRow
              label="Category"
              options={categories}
              value={category}
              onChange={setCategory}
            />
            <FilterRow label="Status" options={statuses} value={status} onChange={setStatus} />
            <FilterRow label="City" options={cities} value={city} onChange={setCity} />
          </div>
        </div>
      </section>

      <section className="section bg-slate-50/40">
        <div className="container-x">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <Building2 className="mx-auto mb-4 h-10 w-10 text-slate-300" />
              <h3 className="font-display text-ink mb-2 text-2xl">
                No projects match your filters.
              </h3>
              <p className="text-slate-500">Try widening your search or reset the filters.</p>
              <button
                onClick={() => {
                  setCategory("All");
                  setStatus("All");
                  setCity("All");
                  setQuery("");
                }}
                className="btn-ghost mt-6"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section border-y border-slate-200 bg-white">
        <div className="container-x">
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow mb-3 block">EXPLORE BY CATEGORY</span>
            <h2 className="font-display text-ink text-3xl leading-tight lg:text-4xl">
              Find opportunities tailored to the way you want to invest or live.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryTiles.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="group hover:border-ink border border-slate-200 bg-white p-6 transition-colors lg:p-7"
              >
                <Building2 className="text-gold-500 mb-4 h-6 w-6" />
                <h3 className="font-display text-ink group-hover:text-gold-600 text-xl transition-colors">
                  {c.label}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
                <span className="tracking-wide-2 text-ink mt-5 inline-flex items-center gap-1 text-xs uppercase transition-all group-hover:gap-2">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow="LOOKING FOR SOMETHING SPECIFIC?"
        title="Tell us what you're after — we'll connect you with the right opportunity."
        description="If you have a budget range, location or project type in mind, our team can curate a short-list from our network."
        primary={{ label: "Talk to a Consultant", href: "/contact" }}
        secondary={{ label: "Partner With Us", href: "/partner" }}
      />
    </>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="tracking-wide-3 w-20 shrink-0 text-[11px] font-medium text-slate-500 uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`tracking-wide-1 px-3.5 py-1.5 text-[12px] font-medium uppercase transition-all ${
                active
                  ? "bg-ink border-ink border text-white"
                  : "hover:border-ink hover:text-ink border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
