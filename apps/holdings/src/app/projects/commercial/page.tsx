"use client";

import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function CommercialPage() {
  const items = projects.filter((p) => p.category === "Commercial");

  return (
    <>
      <PageBanner
        eyebrow="COMMERCIAL OPPORTUNITIES"
        title="Grade-A commercial real estate in Pakistan’s business corridors."
        description="Offices, retail anchors and commercial developments marketed by Apex Holdings to corporate occupiers and investors."
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Commercial" }]}
      />

      <section className="section bg-slate-50/40">
        <div className="container-x">
          {items.length === 0 ? (
            <p className="text-slate-500 italic">
              No commercial projects currently in the marketed portfolio.
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
        eyebrow="LOOKING FOR A SPECIFIC OFFICE PLATE?"
        title="Our commercial team can curate opportunities that match your footprint."
        primary={{ label: "Talk to Commercial", href: "/contact" }}
        secondary={{ label: "All Projects", href: "/projects" }}
      />
    </>
  );
}
