"use client";

import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function ResidentialPage() {
  const items = projects.filter((p) => p.category === "Residential");

  return (
    <>
      <PageBanner
        eyebrow="RESIDENTIAL OPPORTUNITIES"
        title="Homes designed for how Pakistan lives."
        description="A curated selection of residential apartments, villas and family homes — marketed by Apex Holdings across Pakistan’s leading addresses."
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Residential" }]}
      />

      <section className="section bg-slate-50/40">
        <div className="container-x">
          {items.length === 0 ? (
            <p className="text-slate-500 italic">
              No residential projects currently in the marketed portfolio.
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
        eyebrow="WANT TO SEE A PROJECT IN PERSON?"
        title="Schedule a visit at your convenience."
        description="Our property consultants can arrange site visits, presentations and full walk-throughs of any of our marketed projects."
        primary={{ label: "Schedule a Visit", href: "/site-visit" }}
        secondary={{ label: "All Projects", href: "/projects" }}
      />
    </>
  );
}
