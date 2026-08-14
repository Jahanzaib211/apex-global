"use client";

import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { services } from "@/data/content";
import * as Icons from "lucide-react";

const serviceIcons = [Icons.Building2, Icons.Target, Icons.TrendingUp, Icons.Megaphone];
const reasons = [
  {
    icon: Icons.Briefcase,
    title: "Real-estate focus",
    text: "A specialist partner built around property markets and buyer behaviour.",
  },
  {
    icon: Icons.Award,
    title: "Commercial discipline",
    text: "Clear objectives, accountable execution and decisions tied to outcomes.",
  },
  {
    icon: Icons.Shield,
    title: "Trust by design",
    text: "Straightforward communication for developers, buyers and partners.",
  },
  {
    icon: Icons.Sparkles,
    title: "Joined-up thinking",
    text: "One connected team across strategy, demand, sales and digital.",
  },
];
const steps = [
  {
    n: "01",
    title: "Discover",
    text: "We understand the project, market, audience and commercial ambition.",
  },
  {
    n: "02",
    title: "Strategy",
    text: "We turn insight into a focused positioning, plan and measurable priorities.",
  },
  {
    n: "03",
    title: "Execute",
    text: "Our teams activate the work across channels, touchpoints and sales moments.",
  },
  {
    n: "04",
    title: "Report",
    text: "We track what matters, share the signal and improve the next move.",
  },
];

export default function ServicesPage() {
  return (
    <div>
      <PageBanner
        eyebrow="SERVICES"
        title="How Apex Holdings brings real-estate projects to market."
        description="Four interlocking capabilities — marketing, project marketing, sales & lead generation, digital — that let developers focus on building while we focus on demand."
        breadcrumbs={[{ label: "Services" }]}
      />
      <section className="section bg-white">
        <div className="container-x">
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">WHAT WE DO</span>
            <h2 className="font-display mt-3 text-3xl font-bold lg:text-5xl">
              One partner, from attention to action.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service, i) => {
              const Icon = serviceIcons[i]!;
              return (
                <article
                  key={service.slug}
                  className="group hover:border-gold-400 hover:shadow-card border border-slate-200 p-7 transition-all duration-300 lg:p-9"
                >
                  <div className="flex items-start justify-between">
                    <div className="bg-gold-50 text-gold-500 border-gold-400/30 flex h-14 w-14 items-center justify-center border">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="tracking-wide-2 text-xs text-slate-400">0{i + 1}</span>
                  </div>
                  <h3 className="font-display mt-8 text-2xl font-bold">{service.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{service.intro}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="tracking-wide-1 text-ink group-hover:text-gold-500 mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase"
                  >
                    Read more <Icons.ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section bg-grid bg-slate-50">
        <div className="container-x">
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">OUR METHOD</span>
            <h2 className="font-display mt-3 text-3xl font-bold lg:text-5xl">How We Work</h2>
          </div>
          <div className="grid gap-0 border-y border-slate-200 md:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.n}
                className="border-slate-200 py-8 first:pl-0 md:border-r md:pr-7 md:pl-7 md:last:border-r-0"
              >
                <span className="text-gold-500 text-sm font-semibold">{step.n}</span>
                <h3 className="font-display mt-6 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-x">
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">WHY APEX</span>
            <h2 className="font-display mt-3 text-3xl font-bold lg:text-5xl">
              Built for the realities of property.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text }) => (
              <article key={title} className="border-gold-400 border-t-2 pt-6">
                <Icon className="text-gold-500 h-6 w-6" />
                <h3 className="font-display mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        variant="dark"
        title="Let's build something together."
        primary={{ label: "Partner with us", href: "/partner" }}
        secondary={{ label: "Contact Apex", href: "/contact" }}
      />
    </div>
  );
}
