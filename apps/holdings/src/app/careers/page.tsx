"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Award,
  MapPin,
  Clock,
  ChevronDown,
  Building2,
} from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { careers } from "@/data/content";

const whyApex = [
  {
    icon: TrendingUp,
    title: "Real Estate Growth",
    body: "Work at the centre of one of Pakistan's most dynamic sectors, on projects that compound in value and reputation.",
  },
  {
    icon: Building2,
    title: "Structured Environment",
    body: "A disciplined operating environment with clear processes, real ownership and zero tolerance for chaos masquerading as urgency.",
  },
  {
    icon: GraduationCap,
    title: "Learning Culture",
    body: "On-the-job mentorship, structured training and exposure to the full real-estate value chain — from marketing to development.",
  },
  {
    icon: Award,
    title: "Performance-linked Rewards",
    body: "Compensation and progression tied to the impact you create — not the years you have spent in a chair.",
  },
];

export default function CareersPage() {
  const [openRole, setOpenRole] = useState<string | null>(null);

  return (
    <>
      <PageBanner
        eyebrow="CAREERS"
        title="Build a career at Apex Holdings."
        description="We hire people who combine craft with discipline — across sales, marketing, operations and finance. If that sounds like you, we would like to hear from you."
        breadcrumbs={[{ label: "Careers" }]}
        bg="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Why Apex */}
      <section className="section border-b border-slate-200 bg-white">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">Why Apex</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Four reasons the right people join us.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              We are a young, fast-growing company with the discipline of an established one. That
              combination is rare — and it is the reason the right people stay.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyApex.map((w) => (
              <article
                key={w.title}
                className="hover:shadow-card-hover group border border-slate-200 bg-slate-50 p-8 transition-all duration-500 hover:bg-white"
              >
                <div className="bg-ink text-gold-400 group-hover:bg-gold-400 group-hover:text-ink mb-6 inline-flex h-12 w-12 items-center justify-center transition-colors duration-300">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-ink mb-3 text-lg font-bold">{w.title}</h3>
                <p className="text-[14px] leading-relaxed text-slate-600">{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">Open Roles</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              {careers.length} roles currently open.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              Click any role to view the full description, responsibilities and requirements. When
              you are ready, apply directly through the role page.
            </p>
          </div>

          <div className="mt-12 border-t border-slate-200">
            {careers.map((c) => {
              const open = openRole === c.slug;
              return (
                <div key={c.slug} className="border-b border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenRole(open ? null : c.slug)}
                    className="group flex w-full flex-col gap-4 px-6 py-6 text-left transition-colors hover:bg-slate-50 lg:flex-row lg:items-center lg:gap-6 lg:px-8 lg:py-7"
                    aria-expanded={open}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="tracking-wide-2 mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase">
                        <span className="text-gold-500">{c.department}</span>
                        <span className="opacity-50">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {c.location}
                        </span>
                      </div>
                      <h3 className="font-display text-ink group-hover:text-gold-500 text-xl leading-snug font-bold transition-colors lg:text-2xl">
                        {c.title}
                      </h3>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="tracking-wide-2 inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 uppercase">
                        <Clock className="h-3 w-3" />
                        {c.type}
                      </span>
                      <ChevronDown
                        className={`text-gold-500 h-5 w-5 transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: open ? "1fr" : "0fr",
                      opacity: open ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pt-2 pb-8 lg:px-8 lg:pb-10">
                        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
                          <div className="lg:col-span-2">
                            <p className="text-[15px] leading-relaxed text-slate-600">
                              {c.summary}
                            </p>
                            <div className="mt-6">
                              <p className="tracking-wide-2 mb-3 text-[11px] font-semibold text-slate-500 uppercase">
                                Key Responsibilities
                              </p>
                              <ul className="space-y-2 text-[14px] text-slate-600">
                                {c.responsibilities.slice(0, 3).map((r) => (
                                  <li key={r} className="flex items-start gap-2">
                                    <span className="bg-gold-500 mt-2 h-1.5 w-1.5 shrink-0" />
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div>
                            <p className="tracking-wide-2 mb-3 text-[11px] font-semibold text-slate-500 uppercase">
                              What we are looking for
                            </p>
                            <ul className="space-y-2 text-[14px] text-slate-600">
                              {c.requirements.slice(0, 3).map((r) => (
                                <li key={r} className="flex items-start gap-2">
                                  <span className="bg-gold-500 mt-2 h-1.5 w-1.5 shrink-0" />
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
                          <Link href={`/careers/${c.slug}`} className="btn-primary text-[12px]">
                            View role &amp; apply
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/contact?subject=careers+${encodeURIComponent(c.title)}`}
                            className="btn-ghost text-[12px]"
                          >
                            Talk to our team
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <CTASection
        variant="dark"
        eyebrow="Don't see your role?"
        title="If you don't see a role that fits — we still want to hear from you."
        description="Apex Holdings is growing and we are always interested in exceptional people across sales, marketing, operations and finance."
        primary={{ label: "Get in Touch", href: "/contact?subject=careers" }}
        secondary={{ label: "Why Apex", href: "/about" }}
      />
    </>
  );
}
