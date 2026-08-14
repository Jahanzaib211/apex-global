"use client";

import {
  Award,
  Briefcase,
  Target,
  Shield,
  TrendingUp,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { stats } from "@/data/content";

export default function WhyApexPage() {
  const pillars = [
    {
      icon: Target,
      title: "Market Understanding",
      desc: "Years of working closely with Pakistan's property buyers have shaped a deep, working understanding of what each market rewards — and what it doesn't.",
    },
    {
      icon: Briefcase,
      title: "Curated Portfolio",
      desc: "A carefully selected mix of residential, commercial, mixed-use and plot opportunities — never volume, only projects we can stand behind.",
    },
    {
      icon: Sparkles,
      title: "Professional Marketing",
      desc: "Disciplined marketing infrastructure — positioning, performance, content, CRM — that turns good projects into well-known, well-considered ones.",
    },
    {
      icon: Shield,
      title: "Credibility",
      desc: "Honest project information, transparent communication and a long-term orientation that compounds trust project after project.",
    },
    {
      icon: TrendingUp,
      title: "Growth Vision",
      desc: "We are building toward a future where Apex Holdings develops and owns landmark projects of its own — and brings that same rigour to every partnership.",
    },
    {
      icon: HeartHandshake,
      title: "Customer Focus",
      desc: "Every project is filtered through one question first: would we recommend it to our own family? If the answer is no, it doesn't make the portfolio.",
    },
  ];

  return (
    <>
      <PageBanner
        eyebrow="WHY APEX HOLDINGS"
        title="Six pillars that shape every project we market — and every partnership we build."
        breadcrumbs={[{ label: "About", href: "/about" }, { label: "Why Apex" }]}
        bg="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Six Pillars */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">The Six Pillars</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              The disciplines we bring to every project.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              These are the six pillars that shape how we work, how we choose projects, and how we
              partner with developers and investors. They are also the reasons our customers and
              partners choose to work with us.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, idx) => (
              <article
                key={p.title}
                className="group hover:border-gold-400 relative border border-slate-200 bg-white p-8 transition-colors lg:p-10"
              >
                {/* corner index */}
                <span
                  className="font-display tracking-wide-2 absolute top-5 right-6 text-xs font-semibold text-slate-400 uppercase"
                  aria-hidden
                >
                  0{idx + 1}
                </span>

                <div className="bg-ink text-gold-400 group-hover:bg-gold-400 group-hover:text-ink mb-7 inline-flex h-14 w-14 items-center justify-center transition-colors duration-300">
                  <p.icon className="h-7 w-7" />
                </div>

                <h3 className="font-display text-ink mb-4 text-2xl font-bold">{p.title}</h3>
                <p className="text-[15px] leading-relaxed text-slate-600">{p.desc}</p>

                {/* gold underline accent */}
                <div className="relative mt-8 h-px overflow-hidden bg-slate-200">
                  <div
                    className="bg-gold-400 absolute inset-y-0 left-0 w-10 transition-all duration-500 group-hover:w-20"
                    aria-hidden
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip — Navy */}
      <section className="bg-ink relative overflow-hidden text-white">
        <div className="bg-grid absolute inset-0 opacity-15" aria-hidden />
        <div className="container-x relative py-16 lg:py-20">
          <div className="mb-12 max-w-3xl">
            <span className="eyebrow !text-gold-400 mb-4 block">By the Numbers</span>
            <h2 className="font-display text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              The shape of the firm, today.
            </h2>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-ink group hover:bg-navy-700 p-8 transition-colors duration-300 lg:p-10"
              >
                <p className="font-display text-gold-400 mb-3 text-5xl leading-none font-bold lg:text-6xl">
                  {s.value}
                </p>
                <p className="tracking-wide-2 text-xs font-medium text-slate-300 uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-xs text-slate-400">
            Selected indicators of the firm\'s footprint. For a current, detailed snapshot, please
            reach out to our team.
          </p>
        </div>
      </section>

      {/* The Standard We Hold Ourselves To */}
      <section className="section border-y border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="eyebrow mb-4 block">Our Standard</span>
              <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                A standard our partners and customers can measure us against.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-5">
                {[
                  {
                    icon: Award,
                    title: "Quality over quantity",
                    body: "Every project we accept into the portfolio has earned its place. We would rather market fewer projects well than many projects poorly.",
                  },
                  {
                    icon: Shield,
                    title: "Honest information",
                    body: "Project statuses, timelines, and pricing are communicated as they are — not as we wish they were. Our reputation depends on it.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Long-term thinking",
                    body: "We optimise for relationships measured in years, not transactions. The same standard applies to a single enquiry or a flagship launch.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="shadow-card hover:shadow-card-hover flex items-start gap-5 bg-white p-7 transition-shadow duration-500 lg:p-8"
                  >
                    <div className="bg-gold-50 border-gold-400/40 text-gold-500 inline-flex h-12 w-12 shrink-0 items-center justify-center border">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-ink mb-2 text-xl font-bold">{item.title}</h3>
                      <p className="text-[15px] leading-relaxed text-slate-600">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow="Work With Us"
        title="Let's work together."
        description="Whether you are exploring a project, evaluating a partnership or considering a role — we would like to hear from you."
        primary={{ label: "Partner With Us", href: "/partner" }}
        secondary={{ label: "View Projects", href: "/projects" }}
      />
    </>
  );
}
