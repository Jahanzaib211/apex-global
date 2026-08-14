"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Check,
  Send,
  MapPin,
  Users,
  Car,
  Phone,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { projects } from "@/data/projects";

interface FormState {
  name: string;
  phone: string;
  whatsapp: boolean;
  email: string;
  preferredDate: string;
  preferredTime: string;
  project: string;
  visitors: string;
  transport: boolean;
  message: string;
}

const initialForm: FormState = {
  name: "",
  phone: "",
  whatsapp: true,
  email: "",
  preferredDate: "",
  preferredTime: "11:00",
  project: projects[0]?.name ?? "Other / Not Specific",
  visitors: "2",
  transport: false,
  message: "",
};

const inputBase =
  "w-full bg-white border border-slate-300 px-4 py-3 text-[14px] text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors";
const labelBase = "text-[11px] tracking-wide-2 uppercase font-semibold text-slate-600 block mb-2";

const projectOptions = [...projects.slice(0, 3).map((p) => p.name), "Other / Not Specific"];

const expect = [
  {
    icon: Car,
    title: "Pickup Coordination",
    body: "Where transport is requested, we coordinate a pickup from a convenient location at the agreed time.",
  },
  {
    icon: ShieldCheck,
    title: "Safety Briefing",
    body: "A short on-site safety and conduct briefing at arrival — hard hats and visitor badges provided where required.",
  },
  {
    icon: MapPin,
    title: "On-Site Presentation",
    body: "A guided walkthrough of the project, key amenities, sample units and the masterplan context.",
  },
  {
    icon: Phone,
    title: "Follow-Up",
    body: "A post-visit follow-up with pricing, payment plans, documentation checklist and next steps if you wish to proceed.",
  },
];

export default function SiteVisitPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/site-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`submit_failed_${res.status}`);
      setSubmitted(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setSubmitError("Booking could not be sent. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageBanner
        eyebrow="SITE VISIT"
        title="Schedule a visit to a project of your choice."
        description="Book a guided site visit at your convenience. Our team will coordinate a property consultant and confirm logistics — typically within one working day."
        breadcrumbs={[{ label: "Site Visit" }]}
        bg="https://images.unsplash.com/photo-1503387762-592deb58ef7e?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Booking form section */}
      <section className="section border-b border-slate-200 bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left intro */}
            <div className="lg:col-span-4">
              <span className="eyebrow mb-4 block">Book a Visit</span>
              <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                Tell us when, where and how many.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-slate-600">
                Fill in the form and our team will confirm your visit slot — typically within one
                working day. You will receive a confirmation by phone, email or WhatsApp based on
                your preference.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-gold-50 border-gold-400/40 text-gold-500 inline-flex h-10 w-10 shrink-0 items-center justify-center border">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="tracking-wide-2 mb-1 text-[11px] font-semibold text-slate-500 uppercase">
                      Response Time
                    </p>
                    <p className="text-ink text-[14px] font-semibold">Within 1 working day</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gold-50 border-gold-400/40 text-gold-500 inline-flex h-10 w-10 shrink-0 items-center justify-center border">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="tracking-wide-2 mb-1 text-[11px] font-semibold text-slate-500 uppercase">
                      Group Size
                    </p>
                    <p className="text-ink text-[14px] font-semibold">Up to 8 visitors per slot</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gold-50 border-gold-400/40 text-gold-500 inline-flex h-10 w-10 shrink-0 items-center justify-center border">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="tracking-wide-2 mb-1 text-[11px] font-semibold text-slate-500 uppercase">
                      Available Days
                    </p>
                    <p className="text-ink text-[14px] font-semibold">
                      Mon – Sat · 10:00 – 18:00 PKT
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-8">
              <div className="bg-slate-50 p-8 lg:p-10">
                {submitted ? (
                  <SuccessCard
                    onReset={() => {
                      setForm(initialForm);
                      setSubmitted(false);
                    }}
                  />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="sv-name" className={labelBase}>
                          Full Name <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="sv-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          className={inputBase}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="sv-phone" className={labelBase}>
                          Phone <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="sv-phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          className={inputBase}
                          placeholder="+92 300 000 0000"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mt-2 flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={form.whatsapp}
                            onChange={(e) => update("whatsapp", e.target.checked)}
                            className="accent-gold-500 h-4 w-4"
                          />
                          <span className="text-[13px] text-slate-700">
                            Same number is on WhatsApp
                          </span>
                        </label>
                      </div>
                      <div>
                        <label htmlFor="sv-email" className={labelBase}>
                          Email
                        </label>
                        <input
                          id="sv-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          className={inputBase}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="sv-date" className={labelBase}>
                          Preferred Date <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="sv-date"
                          type="date"
                          required
                          value={form.preferredDate}
                          onChange={(e) => update("preferredDate", e.target.value)}
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label htmlFor="sv-time" className={labelBase}>
                          Preferred Time <span className="text-gold-500">*</span>
                        </label>
                        <select
                          id="sv-time"
                          required
                          value={form.preferredTime}
                          onChange={(e) => update("preferredTime", e.target.value)}
                          className={inputBase + " cursor-pointer appearance-none"}
                        >
                          <option>10:00</option>
                          <option>11:00</option>
                          <option>12:00</option>
                          <option>14:00</option>
                          <option>15:00</option>
                          <option>16:00</option>
                          <option>17:00</option>
                          <option>18:00</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="sv-project" className={labelBase}>
                          Project
                        </label>
                        <select
                          id="sv-project"
                          value={form.project}
                          onChange={(e) => update("project", e.target.value)}
                          className={inputBase + " cursor-pointer appearance-none"}
                        >
                          {projectOptions.map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="sv-visitors" className={labelBase}>
                          Number of Visitors
                        </label>
                        <select
                          id="sv-visitors"
                          value={form.visitors}
                          onChange={(e) => update("visitors", e.target.value)}
                          className={inputBase + " cursor-pointer appearance-none"}
                        >
                          {["1", "2", "3", "4", "5", "6", "7", "8+"].map((n) => (
                            <option key={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={form.transport}
                          onChange={(e) => update("transport", e.target.checked)}
                          className="accent-gold-500 h-4 w-4"
                        />
                        <span className="text-[14px] text-slate-700">
                          Transportation required — please coordinate pickup
                        </span>
                      </label>
                    </div>

                    <div>
                      <label htmlFor="sv-message" className={labelBase}>
                        Anything else we should know?
                      </label>
                      <textarea
                        id="sv-message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={inputBase + " resize-y"}
                        placeholder="Accessibility, language, special requests…"
                      />
                    </div>

                    <div className="mt-4 flex flex-col items-start justify-between gap-5 border-t border-slate-200 pt-4 pt-6 sm:flex-row sm:items-center">
                      <p className="max-w-md text-[12px] leading-relaxed text-slate-500">
                        Your visit request will be confirmed by our team. By submitting, you agree
                        to be contacted for visit coordination.
                      </p>
                      {submitError && (
                        <p className="w-full text-[12px] text-red-600" role="alert">
                          {submitError}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary shrink-0 text-[12px] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? "Sending…" : "Request Visit"}
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">What to Expect</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              A well-organised, professional site visit.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              From the moment you arrive to the follow-up after — every visit is structured to give
              you the information you need without the sales pressure.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {expect.map((e, i) => (
              <article
                key={e.title}
                className="shadow-card hover:shadow-card-hover group bg-white p-8 transition-shadow duration-500"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="bg-ink text-gold-400 group-hover:bg-gold-400 group-hover:text-ink inline-flex h-12 w-12 items-center justify-center transition-colors duration-300">
                    <e.icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-gold-400 text-3xl font-bold">0{i + 1}</span>
                </div>
                <h3 className="font-display text-ink mb-3 text-lg font-bold">{e.title}</h3>
                <p className="text-[14px] leading-relaxed text-slate-600">{e.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow="Browse First"
        title="Want to see what is available before scheduling a visit?"
        description="Explore our current project portfolio to find a project worth visiting. We will coordinate a guided tour once you have shortlisted."
        primary={{ label: "See All Projects", href: "/projects" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div className="py-8 text-center lg:py-10">
      <div className="bg-gold-400 text-ink mb-6 inline-flex h-16 w-16 items-center justify-center">
        <Check className="h-8 w-8" />
      </div>
      <span className="eyebrow mb-3 inline-block">Visit Request Logged</span>
      <h3 className="font-display text-ink text-3xl leading-tight font-bold lg:text-4xl">
        Your visit is being scheduled.
      </h3>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-600">
        Our team will confirm your visit slot within one working day. Watch your phone, email or
        WhatsApp for confirmation.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/projects" className="btn-primary text-[12px]">
          See All Projects
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button type="button" onClick={onReset} className="btn-ghost text-[12px]">
          Schedule another visit
        </button>
      </div>
    </div>
  );
}
