"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  LandPlot,
  Castle,
  Briefcase,
  Compass,
  Shield,
  Award,
  Sparkles,
  Target,
  Check,
} from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";

export default function DevelopmentVisionPage() {
  const pillars = [
    {
      icon: LandPlot,
      title: "Land Acquisition",
      desc: "Selective, well-located land bank in primary corridors of Pakistan — acquired only after extensive diligence and long-term thesis validation.",
    },
    {
      icon: Building2,
      title: "Project Development",
      desc: "In-house design, approvals, construction and handover — every project we own is built under our supervision, with our name on it.",
    },
    {
      icon: Building2,
      title: "Residential Projects",
      desc: "Premium apartments, villas and master-planned communities designed around the long-term needs of end-user families.",
    },
    {
      icon: Briefcase,
      title: "Commercial Projects",
      desc: "Grade-A office, retail and business-district developments for corporate occupiers, institutional investors and high-growth enterprises.",
    },
    {
      icon: Castle,
      title: "Mixed-Use",
      desc: "Vertical mixed-use districts that blend residences, retail, hospitality and offices into cohesive, walkable communities.",
    },
    {
      icon: Compass,
      title: "Strategic Investments",
      desc: "Selective capital partnerships and joint ventures with aligned developers — to expand our reach without diluting the Apex standard.",
    },
  ];

  const principles = [
    {
      icon: Shield,
      title: "Disciplined",
      body: "We commit only where the location, product and economics add up. We do not chase volume.",
    },
    {
      icon: Sparkles,
      title: "Transparent",
      body: "Every claim we make is verifiable. Every project carries clear ownership, status and timeline information.",
    },
    {
      icon: Target,
      title: "Long-Term",
      body: "We are building for the next decade — not the next quarter. Our partners and buyers can plan with us accordingly.",
    },
    {
      icon: Award,
      title: "Quality",
      body: "From the masterplan to the doorknob, every decision is filtered through the same question: would we be proud of it in 20 years?",
    },
  ];

  return (
    <>
      <PageBanner
        eyebrow="OUR DEVELOPMENT VISION"
        title="The next chapter of Apex Holdings — built with discipline."
        description="A clear thesis for what we will develop, where, with whom and on what terms. Built on the credibility we have earned marketing projects — extended into ownership."
        breadcrumbs={[{ label: "Apex Developments", href: "/developments" }, { label: "Vision" }]}
        bg="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Vision statement blockquote */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-x py-20 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow mb-6 inline-block">Development Thesis</span>
            <h2 className="font-display text-ink text-3xl leading-[1.2] font-medium sm:text-4xl lg:text-5xl">
              To develop a small portfolio of{" "}
              <span className="text-gold-500 italic">landmark, well-located</span> projects in
              Pakistan&apos;s primary cities — built on the marketing discipline we have earned and
              the partnerships we continue to invest in.
            </h2>
            <div className="mt-12 flex items-center justify-center gap-4">
              <span className="bg-gold-400 h-px w-12" aria-hidden />
              <p className="tracking-wide-3 text-xs font-semibold text-slate-500 uppercase">
                Apex Developments · A measured roadmap
              </p>
              <span className="bg-gold-400 h-px w-12" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">Strategic Pillars</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Six pillars of our development roadmap.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              These are the categories and structures we will operate in as Apex Developments.
              Together they describe the shape of the company we are building toward.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <article
                key={p.title}
                className="shadow-card hover:shadow-card-hover group bg-white p-8 transition-shadow duration-500 lg:p-10"
              >
                <div className="bg-ink text-gold-400 group-hover:bg-gold-400 group-hover:text-ink mb-6 inline-flex h-12 w-12 items-center justify-center transition-colors duration-300">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-ink mb-3 text-xl font-bold">{p.title}</h3>
                <p className="text-[14px] leading-relaxed text-slate-600">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="section border-b border-slate-200 bg-white">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">Guiding Principles</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Four principles that govern every decision.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              Before a project is added to the roadmap, it is filtered through these four
              principles. They are non-negotiable.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((pr) => (
              <article
                key={pr.title}
                className="hover:border-gold-400 flex flex-col border border-slate-200 bg-white p-8 transition-colors"
              >
                <div className="bg-gold-50 border-gold-400/40 text-gold-500 mb-6 inline-flex h-12 w-12 items-center justify-center border">
                  <pr.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-ink mb-3 text-xl font-bold">{pr.title}</h3>
                <p className="flex-1 text-[14px] leading-relaxed text-slate-600">{pr.body}</p>
                <div className="tracking-wide-2 mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase">
                  <Check className="text-gold-500 h-3.5 w-3.5" /> Non-negotiable
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Where this leads */}
      <section className="bg-ink relative overflow-hidden text-white">
        <div className="bg-grid absolute inset-0 opacity-15" aria-hidden />
        <div className="container-x relative py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="eyebrow !text-gold-400 mb-4 block">Where this leads</span>
              <h2 className="font-display text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
                From marketing partner to development-led company.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-300">
                The roadmap is patient. The first Apex-developed project will be announced only when
                it is ready to be announced — and the team and structures behind it are in place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/developments/future-pipeline" className="btn-accent text-[12px]">
                  See future pipeline
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/developments/owned-projects" className="btn-ghost-light text-[12px]">
                  Owned projects
                </Link>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-7">
              {[
                {
                  title: "A small, focused portfolio.",
                  body: "We do not plan to be the largest developer in Pakistan — we plan to be among the most considered.",
                },
                {
                  title: "Partnerships over silos.",
                  body: "Where it accelerates the roadmap, we co-develop with aligned partners — never at the cost of brand or quality.",
                },
                {
                  title: "Same brand, deeper commitment.",
                  body: "Apex-developed projects will carry the same Apex name our customers have come to trust — only now on the development side as well.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="hover:border-gold-400/50 border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-colors lg:p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gold-400 text-ink inline-flex h-10 w-10 shrink-0 items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display mb-2 text-xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-slate-300">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow="Stay informed"
        title="Want to be the first to know when an Apex-developed project is announced?"
        description="Register your interest and we will keep you informed of major development milestones — quietly and without spam."
        primary={{ label: "Register Interest", href: "/contact" }}
        secondary={{ label: "See Future Pipeline", href: "/developments/future-pipeline" }}
      />
    </>
  );
}
