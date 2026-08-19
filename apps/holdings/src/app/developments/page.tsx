import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  LandPlot,
  Compass,
  Sparkles,
  Check,
  Briefcase,
  Castle,
} from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Developments",
  description:
    "From marketing projects to building our own. The Apex Holdings development track, its current stage and what comes next.",
};

export default function DevelopmentsPage() {
  const horizons = [
    {
      num: "01",
      title: "Today",
      heading: "Real Estate Marketing + Project Portfolio",
      desc: "We partner with developers to position, market and sell well-curated projects across Pakistan. This is our core — and where we earn our reputation every day in the market.",
      icon: Building2,
      pill: "Active",
    },
    {
      num: "02",
      title: "Tomorrow",
      heading: "Real Estate Development + Ownership",
      desc: "We are methodically building the structures, capital relationships and in-house capabilities to develop and own landmark projects of our own — on a deliberate timeline.",
      icon: LandPlot,
      pill: "In preparation",
    },
    {
      num: "03",
      title: "Long Term",
      heading: "A Diversified Real Estate Company",
      desc: "The destination: a diversified, multi-vertical real estate company combining marketing excellence, owned developments and select investment vehicles — built for long-term value.",
      icon: Compass,
      pill: "Ambition",
    },
  ];

  const classifications = [
    {
      label: "Marketed by Apex Holdings",
      tag: "Most projects",
      tone: "navy" as const,
      desc: "The project is developed by an independent developer partner. Apex Holdings is the appointed marketing and sales counterpart — responsible for positioning, lead generation and bookings.",
      icon: Briefcase,
    },
    {
      label: "Developed by Apex Holdings",
      tag: "Apex-owned",
      tone: "gold" as const,
      desc: "Apex Holdings is the developer of record. We control the land, design, approvals, construction and handover — with our name on the project.",
      icon: Building2,
    },
    {
      label: "Developed in Partnership With Apex Holdings",
      tag: "Co-developed",
      tone: "navy" as const,
      desc: "A joint venture or partnership structure in which Apex Holdings co-develops alongside a partner — sharing capital, risk and execution responsibility.",
      icon: Castle,
    },
  ];

  return (
    <>
      <PageBanner
        eyebrow="APEX DEVELOPMENTS"
        title="From marketing projects to building our own."
        description="A measured evolution from project marketing to development and ownership — built on the credibility we earn every day in the market."
        breadcrumbs={[{ label: "Apex Developments" }]}
        bg="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Three Horizons */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">The Three Horizons</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              A measured, three-horizon plan.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              Apex Holdings is being built in three deliberate phases — each preparing the ground
              for the next. Our development roadmap mirrors this same discipline.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {horizons.map((h) => (
              <article
                key={h.num}
                className="shadow-card hover:shadow-card-hover group relative flex flex-col bg-white p-8 transition-shadow duration-500 lg:p-10"
              >
                <div className="mb-6 flex items-baseline justify-between">
                  <span className="font-display text-gold-400 text-7xl leading-none font-bold lg:text-8xl">
                    {h.num}
                  </span>
                  <span className="tracking-wide-2 border-gold-400 text-ink bg-gold-50 inline-flex items-center gap-1.5 border px-3 py-1 text-[10px] font-medium uppercase">
                    <span className="bg-gold-500 h-1.5 w-1.5 rounded-full" />
                    {h.pill}
                  </span>
                </div>

                <div className="bg-ink text-gold-400 group-hover:bg-gold-400 group-hover:text-ink mb-6 inline-flex h-12 w-12 items-center justify-center transition-colors duration-300">
                  <h.icon className="h-6 w-6" />
                </div>

                <p className="tracking-wide-2 mb-2 text-xs font-semibold text-slate-500 uppercase">
                  {h.title}
                </p>
                <h3 className="font-display text-ink mb-5 text-2xl leading-snug font-bold lg:text-3xl">
                  {h.heading}
                </h3>
                <p className="flex-1 text-[15px] leading-relaxed text-slate-600">{h.desc}</p>

                <div className="relative mt-8 h-px overflow-hidden bg-slate-200">
                  <div className="bg-gold-400 absolute inset-y-0 left-0 w-12" aria-hidden />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial split — Today's emphasis / Tomorrow's emphasis */}
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <span className="eyebrow mb-4 block">Today&apos;s Emphasis</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl">
              The marketing seat.
            </h2>
            <div className="bg-gold-400 mt-6 h-px w-16" aria-hidden />
            <p className="mt-6 text-[15px] leading-relaxed text-slate-600">
              Apex Holdings operates today as a structured marketing and sales counterpart for
              carefully selected real estate projects. We sit in the seat closest to the buyer — and
              closest to the developer&apos;s commercial reality. Every project on our books is
              vetted, positioned and brought to market with the discipline we want to be known by.
            </p>
            <ul className="mt-7 space-y-3 text-[14px] text-slate-600">
              {[
                "Positioning, brand & launch strategy",
                "Multi-channel lead generation",
                "Site visit coordination & conversion",
                "CRM-driven follow-up & reporting",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Check className="text-gold-500 mt-0.5 h-4 w-4 shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-ink relative overflow-hidden p-10 text-white lg:p-14">
              <div className="bg-grid absolute inset-0 opacity-15" aria-hidden />
              <div className="relative">
                <span className="eyebrow !text-gold-400 mb-4 block">Tomorrow&apos;s Emphasis</span>
                <h3 className="font-display text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
                  The development seat.
                </h3>
                <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-300">
                  Our move into development is not a pivot — it is an extension. We are building the
                  capabilities, governance and capital relationships to develop and own projects of
                  our own, without compromising the rigour that defines us today.
                </p>

                <ol className="mt-10 space-y-6">
                  {[
                    {
                      step: "01",
                      heading: "Land Acquisition",
                      note: "Selective, well-located land bank in primary corridors.",
                    },
                    {
                      step: "02",
                      heading: "Project Development",
                      note: "In-house design, approvals, construction and handover.",
                    },
                    {
                      step: "03",
                      heading: "Mixed-Use & Residential",
                      note: "Anchor categories where we can build long-term brand.",
                    },
                    {
                      step: "04",
                      heading: "Strategic Investments",
                      note: "Selective capital partnerships with aligned developers.",
                    },
                  ].map((s) => (
                    <li
                      key={s.step}
                      className="border-gold-400 flex items-start gap-5 border-l-2 pl-5"
                    >
                      <span className="font-display text-gold-400 mt-0.5 text-2xl leading-none font-bold">
                        {s.step}
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold text-white">{s.heading}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">{s.note}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-10">
                  <Link
                    href="/developments/vision"
                    className="tracking-wide-1 text-gold-400 inline-flex items-center gap-2 text-[12px] font-semibold uppercase transition-colors hover:text-white"
                  >
                    Read the development vision
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What counts as 'Apex Developed'? */}
      <section className="section border-y border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">Classification</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              What counts as &lsquo;Apex Developed&rsquo;?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              We classify every project we list according to a strict, transparent system. You will
              always know whether the project is marketed by us, developed by us, or co-developed in
              partnership.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {classifications.map((c) => (
              <article
                key={c.label}
                className="shadow-card hover:shadow-card-hover flex flex-col bg-white p-8 transition-shadow duration-500 lg:p-10"
              >
                <div
                  className={`mb-7 inline-flex h-12 w-12 items-center justify-center ${
                    c.tone === "gold" ? "bg-gold-400 text-ink" : "bg-ink text-gold-400"
                  }`}
                >
                  <c.icon className="h-6 w-6" />
                </div>
                <span
                  className={`tracking-wide-2 mb-4 inline-block self-start px-2.5 py-1 text-[10px] font-semibold uppercase ${
                    c.tone === "gold"
                      ? "bg-gold-50 text-ink border-gold-400 border"
                      : "bg-ink text-gold-400"
                  }`}
                >
                  {c.tag}
                </span>
                <h3 className="font-display text-ink mb-4 text-xl leading-snug font-bold">
                  {c.label}
                </h3>
                <p className="flex-1 text-[14px] leading-relaxed text-slate-600">{c.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Sparkles className="text-gold-500 h-4 w-4" />
            <span>
              Every project page on the Apex Holdings site carries its classification clearly — no
              ambiguity.
            </span>
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow="Apex Developments"
        title="Be part of the journey."
        description="Whether you are an investor, a partner developer or a future teammate — the best time to be in conversation with us is before the first project breaks ground."
        primary={{ label: "Partner With Us", href: "/partner" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
