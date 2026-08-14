"use client";

import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function PlotsApartmentsPage() {
  const items = projects.filter((p) => p.category === "Plots & Apartments");

  return (
    <>
      <PageBanner
        eyebrow="PLOTS & APARTMENTS"
        title="Plots and built-form apartments across Pakistan."
        description="From ready-possession apartments in central sectors to housing-residency plots in masterplanned communities."
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Plots & Apartments" }]}
      />

      <section className="section bg-slate-50/40">
        <div className="container-x">
          {items.length === 0 ? (
            <p className="text-slate-500 italic">
              No plots-apartments projects currently in the marketed portfolio.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        eyebrow="WANT A WIDER SHORT-LIST?"
        title="Tell us your budget, location and configuration — we’ll curate options."
        primary={{ label: "Request a Short-list", href: "/contact" }}
        secondary={{ label: "All Projects", href: "/projects" }}
      />
    </>
  );
}
