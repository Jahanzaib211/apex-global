import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Bell, Building2, ShieldCheck } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Apex-Owned Projects",
  description:
    "Projects developed and owned by Apex Holdings, rather than marketed on behalf of a third-party developer.",
};

export default function OwnedProjectsPage() {
  return (
    <>
      <PageBanner
        eyebrow="APEX-OWNED PROJECTS"
        title="Projects developed by Apex Holdings."
        description="Projects that Apex Holdings either develops directly or in partnership. Currently none formally launched — this page will activate when our first self-developed project breaks ground."
        breadcrumbs={[
          { label: "Apex Developments", href: "/developments" },
          { label: "Owned Projects" },
        ]}
        bg="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Empty state banner */}
      <section className="bg-white">
        <div className="container-x py-20 lg:py-28">
          <div className="bg-ink relative overflow-hidden text-white">
            {/* Gold corner accents */}
            <div
              className="border-gold-400 absolute top-0 left-0 h-20 w-20 border-t-2 border-l-2"
              aria-hidden
            />
            <div
              className="border-gold-400 absolute right-0 bottom-0 h-20 w-20 border-r-2 border-b-2"
              aria-hidden
            />
            <div className="bg-grid absolute inset-0 opacity-15" aria-hidden />

            <div className="relative mx-auto max-w-3xl px-8 py-20 text-center lg:px-20 lg:py-28">
              <div className="bg-gold-400 text-ink mb-8 inline-flex h-16 w-16 items-center justify-center">
                <Sparkles className="h-8 w-8" />
              </div>

              <span className="eyebrow !text-gold-400 mb-5 inline-block">
                No Active Projects Yet
              </span>
              <h2 className="font-display text-4xl leading-[1.1] font-bold text-white sm:text-5xl lg:text-6xl">
                Our first development.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Our first development will be announced here. Until then, this page stays
                intentionally empty — we will not pre-announce what we are not yet ready to deliver.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <Link href="/contact" className="btn-accent text-[12px]">
                  <Bell className="h-4 w-4" />
                  Notify me at launch
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/developments/future-pipeline" className="btn-ghost-light text-[12px]">
                  See future pipeline
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What this page will show */}
      <section className="section border-y border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">When this page activates</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              What will appear here when our first project launches.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              Each Apex-owned project will be presented with the same level of detail and
              transparency as the projects we currently market — with the added clarity that Apex
              Holdings is the developer of record.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Project Identity",
                body: "Name, location, category and a clear statement that Apex Holdings is the developer of record.",
              },
              {
                icon: ShieldCheck,
                title: "Status & Milestones",
                body: "Live status updates — land, approvals, construction and handover — updated as the project progresses.",
              },
              {
                icon: Sparkles,
                title: "Concept & Vision",
                body: "Design intent, masterplan principles and the long-term role the project plays in the city and our portfolio.",
              },
            ].map((b) => (
              <article
                key={b.title}
                className="shadow-card hover:shadow-card-hover group bg-white p-8 transition-shadow duration-500 lg:p-10"
              >
                <div className="bg-ink text-gold-400 group-hover:bg-gold-400 group-hover:text-ink mb-6 inline-flex h-12 w-12 items-center justify-center transition-colors duration-300">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-ink mb-3 text-xl font-bold">{b.title}</h3>
                <p className="text-[14px] leading-relaxed text-slate-600">{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow="Stay in the loop"
        title="Be the first to know when an Apex-developed project is formally announced."
        description="Our development pipeline is selective and the launch list is short. If you would like to be informed when the first project is publicly announced, register your interest."
        primary={{ label: "Register Interest", href: "/contact" }}
        secondary={{ label: "Read Vision", href: "/developments/vision" }}
      />
    </>
  );
}
