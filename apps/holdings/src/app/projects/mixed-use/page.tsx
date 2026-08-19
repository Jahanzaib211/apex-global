import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Mixed-Use Projects",
  description:
    "Vertical communities blending retail, residences, hospitality and offices in Pakistan's fastest-growing districts.",
};

export default function MixedUsePage() {
  const items = projects.filter((p) => p.category === "Mixed-Use");

  return (
    <>
      <PageBanner
        eyebrow="MIXED-USE OPPORTUNITIES"
        title="Vertical communities blending retail, residences, hospitality and offices."
        description="Mixed-use masterplans marketed by Apex Holdings — designed to function as integrated neighbourhoods in their own right."
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Mixed-Use" }]}
      />

      <section className="section bg-slate-50/40">
        <div className="container-x">
          {items.length === 0 ? (
            <p className="text-slate-500 italic">
              No mixed-use projects currently in the marketed portfolio.
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
        eyebrow="INTERESTED IN A MIXED-USE OPPORTUNITY?"
        title="Discuss components, sizes and timing with our team."
        primary={{ label: "Enquire Now", href: "/contact" }}
        secondary={{ label: "All Projects", href: "/projects" }}
      />
    </>
  );
}
