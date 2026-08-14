"use client";

import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { services } from "@/data/content";
import { ArrowRight, Check } from "lucide-react";

export function ServiceDetail({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;
  return (
    <div>
      <PageBanner
        eyebrow={service.title.toUpperCase()}
        title={service.intro}
        breadcrumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}
      />
      <section className="section bg-white">
        <div className="container-x grid items-start gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-24">
          <div>
            <span className="eyebrow">THE OPPORTUNITY</span>
            <p className="font-display text-ink mt-5 text-3xl leading-tight font-semibold lg:text-4xl">
              {service.intro}
            </p>
          </div>
          <div className="border-gold-400 border-l-2 pl-7">
            <span className="eyebrow">CAPABILITIES</span>
            <ul className="mt-6 space-y-4">
              {service.capabilities.map((capability) => (
                <li key={capability} className="flex gap-3 text-slate-700">
                  <Check className="text-gold-500 mt-0.5 h-5 w-5 shrink-0" />
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">WHAT IT DELIVERS</span>
            <h2 className="font-display mt-3 text-3xl font-bold lg:text-5xl">
              Outcomes that move the project forward.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.outcomes.map((outcome, i) => (
              <article key={outcome} className="min-h-44 border border-slate-200 bg-white p-7">
                <span className="text-gold-500 text-sm font-semibold">0{i + 1}</span>
                <h3 className="font-display mt-8 text-xl font-bold">{outcome}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-tight bg-white">
        <div className="container-x">
          <div className="bg-gold-50 flex flex-col justify-between gap-5 border border-slate-200 p-7 sm:flex-row sm:items-center lg:p-9">
            <div>
              <span className="eyebrow">PORTFOLIO NOTE</span>
              <h2 className="font-display mt-2 text-2xl font-bold lg:text-3xl">
                Used across our entire marketed portfolio.
              </h2>
            </div>
            <Link href="/projects" className="btn-ghost shrink-0">
              Explore projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <CTASection
        variant="dark"
        title="Discuss this for your project"
        primary={{ label: "Start a conversation", href: `/contact?service=${service.slug}` }}
        secondary={{ label: "Partner with us", href: "/partner" }}
      />
    </div>
  );
}
