"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Award,
  Shield,
  Target,
  TrendingUp,
  Users,
  HeartHandshake,
  MapPin,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Check,
  Megaphone,
} from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { leadership, faqs } from "@/data/content";
import { site } from "@/data/site";

// ---------- helpers ----------

function Pill({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return <span className={gold ? "pill-gold" : "pill"}>{children}</span>;
}

function Monogram({ name, size = 96 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  return (
    <div
      className="bg-ink text-gold-400 font-display border-gold-400/30 flex shrink-0 items-center justify-center rounded-full border-2 font-semibold"
      style={{ width: size, height: size, fontSize: size / 2.6 }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

// ---------- page ----------

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const cities = [
    {
      name: "Lahore",
      note: "Our headquarters and primary operations hub across Punjab.",
    },
    {
      name: "Karachi",
      note: "Active project marketing across the city's leading corridors.",
    },
    {
      name: "Islamabad",
      note: "Curated opportunities across the capital and select suburbs.",
    },
    {
      name: "Multan",
      note: "Growing footprint with select residential and plot offerings.",
    },
  ];

  const pillars = [
    {
      icon: Target,
      title: "Market Understanding",
      desc: "Years of working closely with Pakistan's property buyers have shaped a deep, working understanding of what each market rewards.",
    },
    {
      icon: Briefcase,
      title: "Portfolio",
      desc: "A carefully selected mix of residential, commercial, mixed-use and plot opportunities across the country's primary cities.",
    },
    {
      icon: Megaphone,
      title: "Professional Marketing",
      desc: "Disciplined marketing infrastructure — positioning, performance, content and CRM — that turns good projects into well-known ones.",
    },
    {
      icon: Shield,
      title: "Credibility",
      desc: "Honest project information, transparent communication and a long-term orientation that compounds trust project after project.",
    },
    {
      icon: TrendingUp,
      title: "Growth Vision",
      desc: "We are building toward a future where Apex Holdings develops and owns landmark projects of its own.",
    },
    {
      icon: HeartHandshake,
      title: "Customer Focus",
      desc: "Every project is filtered through one question first: would we recommend it to our own family?",
    },
  ];

  return (
    <>
      {/* 1. Page Banner */}
      <PageBanner
        eyebrow="ABOUT APEX HOLDINGS"
        title="A credible Pakistan-based real estate company with a long-term vision."
        description={site.description}
        breadcrumbs={[{ label: "About" }]}
        bg="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2000&q=80"
      />

      {/* 2. Company Story */}
      <section className="section bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="eyebrow mb-4 block">Our Story</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              A focused firm, built one project at a time.
            </h2>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-slate-600">
              <p>
                Apex Holdings is a Pakistan-based real estate company built on a clear premise: real
                estate decisions are among the largest a family or investor will make — and they
                deserve to be presented with discipline, transparency and care.
              </p>
              <p>
                Today, our work sits primarily in the marketing and promotion of carefully selected
                real estate projects across Pakistan. We partner with developers to position their
                offerings, build brand presence, generate qualified demand and convert it into
                bookings. In parallel, we are methodically building the structures, capital
                relationships and in-house capabilities that will allow us to expand into
                development and ownership of our own projects — on a deliberate timeline.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Pill gold>
                <Sparkles className="h-3 w-3" /> Marketing-led today
              </Pill>
              <Pill>
                <Building2 className="h-3 w-3" /> Building toward development
              </Pill>
              <Pill>
                <Users className="h-3 w-3" /> Pakistan-wide
              </Pill>
            </div>
          </div>

          {/* Architectural image with gold frame */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80"
                alt="Architectural facade"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Gold frame accent */}
            <div
              className="border-gold-400 absolute -right-6 -bottom-6 -z-10 hidden h-full w-full border-2 lg:block"
              aria-hidden
            />
            <div
              className="bg-ink absolute -right-3 -bottom-3 hidden px-5 py-3 text-white lg:block"
              aria-hidden
            >
              <p className="font-display tracking-wide-1 text-sm font-semibold">
                Pakistan-based · Long-term oriented
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission / Vision / Values */}
      <section className="section border-y border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">Foundations</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Mission, vision and the values that guide our work.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              Three short statements that explain what we do, where we are headed and the principles
              we hold ourselves to.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {/* Mission */}
            <article className="shadow-card hover:shadow-card-hover border-gold-400 border-t-2 bg-white p-8 transition-shadow duration-500 lg:p-10">
              <div className="bg-gold-50 border-gold-400/40 text-gold-500 mb-6 inline-flex h-12 w-12 items-center justify-center border">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-display text-ink mb-4 text-2xl font-bold">Mission</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
                To connect customers and investors with carefully selected real estate opportunities
                across Pakistan — through honest information, professional marketing and a buying
                experience that earns long-term trust.
              </p>
            </article>

            {/* Vision */}
            <article className="shadow-card hover:shadow-card-hover border-gold-400 border-t-2 bg-white p-8 transition-shadow duration-500 lg:p-10">
              <div className="bg-gold-50 border-gold-400/40 text-gold-500 mb-6 inline-flex h-12 w-12 items-center justify-center border">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-ink mb-4 text-2xl font-bold">Vision</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
                To evolve into a development-led real estate company — owning and delivering
                landmark projects of our own, while remaining a trusted partner for the developers
                and investors we work with today.
              </p>
            </article>

            {/* Values */}
            <article className="shadow-card hover:shadow-card-hover border-gold-400 border-t-2 bg-white p-8 transition-shadow duration-500 lg:p-10">
              <div className="bg-gold-50 border-gold-400/40 text-gold-500 mb-6 inline-flex h-12 w-12 items-center justify-center border">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-display text-ink mb-4 text-2xl font-bold">Values</h3>
              <ul className="space-y-2 text-[14px] text-slate-600">
                {[
                  "Trust",
                  "Credibility",
                  "Opportunity",
                  "Growth",
                  "Professionalism",
                  "Real-Estate Expertise",
                  "Long-Term Vision",
                ].map((v) => (
                  <li key={v} className="flex items-start gap-2">
                    <Check className="text-gold-500 mt-0.5 h-4 w-4 shrink-0" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 4. Market Presence — Dark Navy */}
      <section className="bg-ink relative overflow-hidden text-white">
        <div className="bg-grid absolute inset-0 opacity-15" aria-hidden />
        <div className="container-x relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="eyebrow !text-gold-400 mb-4 block">Market Presence</span>
            <h2 className="font-display text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              Active across Pakistan's primary real-estate corridors.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
              Our project portfolio and partner network span four major cities — each with its own
              buyer profile, pricing logic and on-ground reality.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((c) => (
              <div
                key={c.name}
                className="bg-ink group hover:bg-navy-700 p-8 transition-colors duration-300 lg:p-10"
              >
                <MapPin className="text-gold-400 mb-5 h-6 w-6" />
                <h3 className="font-display mb-3 text-2xl font-bold text-white">{c.name}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Leadership */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">Leadership</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              The team behind Apex Holdings.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              A multi-disciplinary team combining real-estate expertise, marketing discipline and
              operational rigour.
            </p>
            <div className="mt-7">
              <Link
                href="/about/leadership"
                className="tracking-wide-1 text-gold-500 hover:text-ink inline-flex items-center gap-2 text-sm font-semibold uppercase transition-colors"
              >
                See full leadership page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((m) => (
              <article
                key={m.name}
                className="hover:border-gold-400 flex flex-col border border-slate-200 bg-white p-7 transition-colors"
              >
                <Monogram name={m.name} size={72} />
                <h3 className="font-display text-ink mt-5 text-lg font-bold">{m.name}</h3>
                <p className="tracking-wide-2 text-gold-500 mt-1 text-xs uppercase">{m.role}</p>
                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-slate-600">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Apex Holdings */}
      <section className="section border-y border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">Why Apex Holdings</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Six pillars that shape every project we market.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              These are the disciplines we bring to every project we touch — and the reasons
              partners and buyers choose to work with us.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <article
                key={p.title}
                className="shadow-card hover:shadow-card-hover group bg-white p-8 transition-shadow duration-500"
              >
                <div className="bg-ink text-gold-400 group-hover:bg-gold-400 group-hover:text-ink mb-6 inline-flex h-12 w-12 items-center justify-center transition-colors duration-300">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-ink mb-3 text-xl font-bold">{p.title}</h3>
                <p className="text-[14px] leading-relaxed text-slate-600">{p.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/about/why-apex" className="btn-ghost text-[12px]">
              See all six pillars in depth
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CTA — Dark variant */}
      <CTASection
        variant="dark"
        eyebrow="Careers"
        title="Want to work with us?"
        description="Apex Holdings is building a team that takes real estate seriously. If that sounds like you, we'd like to hear from you."
        primary={{ label: "View Careers", href: "/careers" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />

      {/* 8. FAQ */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="eyebrow mb-4 block">Frequently Asked</span>
              <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                Questions, answered.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">
                A few of the questions we hear most often. For anything else, our team is one
                message away.
              </p>
              <div className="mt-8">
                <Link href="/contact" className="btn-primary text-[12px]">
                  Ask a question
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <ul className="divide-y divide-slate-200 border-y border-slate-200">
                {faqs.map((f, idx) => {
                  const open = openFaq === idx;
                  return (
                    <li key={f.q}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : idx)}
                        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                        aria-expanded={open}
                      >
                        <span
                          className={`font-display text-lg font-semibold transition-colors lg:text-xl ${
                            open ? "text-gold-500" : "text-ink group-hover:text-gold-500"
                          }`}
                        >
                          {f.q}
                        </span>
                        <ChevronDown
                          className={`text-gold-500 mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className="grid transition-all duration-300 ease-out"
                        style={{
                          gridTemplateRows: open ? "1fr" : "0fr",
                          opacity: open ? 1 : 0,
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="pr-12 pb-6 text-[15px] leading-relaxed text-slate-600">
                            {f.a}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
