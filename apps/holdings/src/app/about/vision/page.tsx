"use client";

import { Building2, Briefcase, Compass, Quote, Sparkles } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";

export default function VisionPage() {
  const horizons = [
    {
      num: "01",
      title: "Today",
      heading: "Real Estate Marketing + Project Portfolio",
      desc: "We partner with developers to position, market and sell well-curated projects across Pakistan's primary cities. This is our core — and where we earn our reputation.",
      icon: Briefcase,
      pill: "Active today",
    },
    {
      num: "02",
      title: "Tomorrow",
      heading: "Real Estate Development + Ownership",
      desc: "We are methodically building the structures, capital relationships and in-house capabilities to develop and own landmark projects of our own — on a deliberate timeline.",
      icon: Building2,
      pill: "In preparation",
    },
    {
      num: "03",
      title: "Long Term",
      heading: "A Diversified Real Estate Company",
      desc: "The destination: a diversified, multi-vertical real estate company combining marketing excellence, owned developments and select investment vehicles — built for long-term value.",
      icon: Compass,
      pill: "Long-term ambition",
    },
  ];

  return (
    <>
      <PageBanner
        eyebrow="OUR VISION"
        title="Building toward development and ownership."
        description="How Apex Holdings is structured to evolve from marketing projects to building our own — with discipline and on a deliberate timeline."
        breadcrumbs={[{ label: "About", href: "/about" }, { label: "Vision" }]}
        bg="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Vision Statement — large serif blockquote */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-x py-20 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow mb-6 inline-block">Vision Statement</span>
            <Quote className="text-gold-400 mx-auto mb-6 h-10 w-10" aria-hidden />
            <blockquote className="font-display text-ink text-3xl leading-[1.2] font-medium sm:text-4xl lg:text-5xl xl:text-6xl">
              To evolve from being{" "}
              <span className="text-gold-500 italic">Pakistan\'s most trusted</span> project
              marketing partner into a development-led real estate company —
              <span className="mt-3 block">
                building landmark projects of our own, on our terms, over time.
              </span>
            </blockquote>

            <div className="mt-12 flex items-center justify-center gap-4">
              <span className="bg-gold-400 h-px w-12" aria-hidden />
              <p className="tracking-wide-3 text-xs font-semibold text-slate-500 uppercase">
                Apex Holdings · Established in Pakistan
              </p>
              <span className="bg-gold-400 h-px w-12" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* Three Horizons */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">The Three Horizons</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              A measured, three-horizon plan.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              We are not in a rush. Apex Holdings is being built in three deliberate phases — each
              preparing the ground for the next.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {horizons.map((h) => (
              <article
                key={h.num}
                className="shadow-card hover:shadow-card-hover group relative flex flex-col bg-white p-8 transition-shadow duration-500 lg:p-10"
              >
                {/* large number */}
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

                {/* bottom gold accent line */}
                <div className="relative mt-8 h-px overflow-hidden bg-slate-200">
                  <div className="bg-gold-400 absolute inset-y-0 left-0 w-12" aria-hidden />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What This Means for Partners */}
      <section className="bg-ink relative overflow-hidden text-white">
        <div className="bg-grid absolute inset-0 opacity-15" aria-hidden />
        <div className="container-x relative py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="eyebrow !text-gold-400 mb-4 block">Partner Lens</span>
              <h2 className="font-display text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
                What this means for the partners we work with.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-300">
                Whether you are a developer, an investor or a strategic ally — our trajectory
                directly affects how we partner today.
              </p>
            </div>

            <div className="space-y-5 lg:col-span-7">
              {[
                {
                  title: "A partner that understands your side of the table.",
                  body: "Because we are preparing to develop ourselves, we sit closer to the developer's decision-making than a typical marketing agency — and that empathy shows up in our work.",
                },
                {
                  title: "Marketing that builds long-term brand value.",
                  body: "We do not optimise only for the next quarter. We build brand equity that compounds across your projects — and across ours.",
                },
                {
                  title: "A roadmap that opens doors, not closes them.",
                  body: "As we move into development, our marketing partners become potential co-development allies. Today's relationship can become tomorrow's joint venture.",
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
        eyebrow="Partnerships"
        title="Partner with us as we build."
        description="Whether you are a developer, investor or strategic ally, we would like to explore what we can build together."
        primary={{ label: "Partner With Us", href: "/partner" }}
        secondary={{ label: "See Our Projects", href: "/projects" }}
      />
    </>
  );
}
