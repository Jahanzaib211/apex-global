"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { leadership } from "@/data/content";

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

export default function LeadershipPage() {
  return (
    <>
      <PageBanner
        eyebrow="OUR LEADERSHIP"
        title="The team behind Apex Holdings."
        description="A multi-disciplinary team combining real-estate expertise, marketing discipline and operational rigour."
        breadcrumbs={[{ label: "About", href: "/about" }, { label: "Leadership" }]}
        bg="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Hero statement */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-x py-20 lg:py-28">
          <div className="max-w-4xl">
            <span className="eyebrow mb-5 block">Apex Holdings · Leadership</span>
            <h2 className="font-display text-ink text-3xl leading-[1.15] font-bold sm:text-4xl lg:text-5xl xl:text-6xl">
              Our leadership team brings together decades of combined experience in{" "}
              <span className="text-gold-500">real-estate marketing, sales, finance</span> and{" "}
              <span className="text-gold-500">operations</span> across Pakistan.
            </h2>
            <div className="mt-10 flex items-center gap-4">
              <span className="bg-gold-400 h-px w-16" aria-hidden />
              <p className="tracking-wide-2 text-sm font-medium text-slate-500 uppercase">
                Founded in Pakistan · Built for the long term
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership grid — LARGER cards */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="mb-14 flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow mb-4 block">The People</span>
              <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                Meet the team leading Apex Holdings.
              </h2>
            </div>
            <Link
              href="/about"
              className="tracking-wide-1 text-gold-500 hover:text-ink hidden items-center gap-2 text-sm font-semibold uppercase transition-colors md:inline-flex"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to About
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {leadership.map((m, idx) => (
              <article
                key={m.name}
                className="shadow-card hover:shadow-card-hover border-gold-400 group relative border-t-2 bg-white p-8 transition-shadow duration-500 lg:p-10"
              >
                {/* subtle index watermark */}
                <span
                  className="font-display absolute top-6 right-7 text-5xl font-bold text-slate-100 select-none"
                  aria-hidden
                >
                  0{idx + 1}
                </span>

                <div className="flex items-start gap-6">
                  <Monogram name={m.name} size={108} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-ink text-2xl font-bold lg:text-3xl">
                      {m.name}
                    </h3>
                    <p className="tracking-wide-2 text-gold-500 mt-1 text-xs font-semibold uppercase">
                      {m.role}
                    </p>
                  </div>
                </div>

                <p className="mt-7 text-[15px] leading-relaxed text-slate-600">{m.bio}</p>

                <div className="mt-7 flex items-center justify-between border-t border-slate-200 pt-6">
                  <span className="tracking-wide-2 inline-flex items-center gap-2 text-xs text-slate-500 uppercase">
                    <Sparkles className="text-gold-400 h-3 w-3" />
                    Pakistan
                  </span>
                  <Link
                    href="/contact"
                    className="tracking-wide-1 text-ink hover:text-gold-500 inline-flex items-center gap-2 text-sm font-semibold uppercase transition-colors"
                  >
                    Connect
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* small architectural visual divider */}
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
                alt="Working environment"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="bg-ink flex flex-col justify-center p-10 text-white lg:p-14">
              <span className="eyebrow !text-gold-400 mb-4 block">Our Practice</span>
              <h3 className="font-display text-2xl leading-tight font-bold lg:text-3xl">
                Disciplined. Transparent. Built for the long term.
              </h3>
              <p className="mt-5 text-[15px] leading-relaxed text-slate-300">
                The Apex Holdings leadership team approaches every project with the same standards:
                clear information, honest timelines, and decisions that protect both the buyer and
                the partner we are working with.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow="Get in Touch"
        title="Speak with our team."
        description="Have a question for our leadership, or interested in exploring a partnership? Our team is ready to talk."
        primary={{ label: "Contact Us", href: "/contact" }}
        secondary={{ label: "See Our Vision", href: "/about/vision" }}
      />
    </>
  );
}
