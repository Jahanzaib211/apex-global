"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Send,
  Check,
  MapPin,
  Clock,
  Briefcase,
  Sparkles,
  Mail,
  Building2,
} from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { careers } from "@/data/content";

interface FormState {
  name: string;
  email: string;
  phone: string;
  cover: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  cover: "",
};

const inputBase =
  "w-full bg-white border border-slate-300 px-4 py-3 text-[14px] text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors";
const labelBase = "text-[11px] tracking-wide-2 uppercase font-semibold text-slate-600 block mb-2";

export default function CareerDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const career = careers.find((c) => c.slug === slug);

  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!career) {
    return (
      <>
        <PageBanner
          eyebrow="CAREERS"
          title="Role not found."
          description="The role you are looking for could not be found or has been filled."
          breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: "Not Found" }]}
        />
        <section className="section bg-white">
          <div className="container-x mx-auto max-w-2xl text-center">
            <Sparkles className="text-gold-500 mx-auto mb-5 h-10 w-10" />
            <h2 className="font-display text-ink mb-4 text-3xl font-bold">
              This role may have been filled.
            </h2>
            <p className="mb-8 text-slate-600">
              Browse our other open positions or send us a speculative application.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/careers" className="btn-primary text-[12px]">
                All Open Roles
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact?subject=careers" className="btn-ghost text-[12px]">
                Speculative Application
              </Link>
            </div>
          </div>
        </section>
        <CTASection
          variant="dark"
          eyebrow="Open Roles"
          title="See all the roles currently open at Apex Holdings."
          primary={{ label: "View All Roles", href: "/careers" }}
          secondary={{ label: "Contact", href: "/contact" }}
        />
      </>
    );
  }

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: career.title }),
      });
      if (!res.ok) throw new Error(`submit_failed_${res.status}`);
      setSubmitted(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setSubmitError("Could not submit your application. Please email us instead.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageBanner
        eyebrow={career.department.toUpperCase()}
        title={career.title}
        description={career.summary}
        breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: career.title }]}
        bg="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Detail 2-col */}
      <section className="section border-b border-slate-200 bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left — large block with department/location/type pills */}
            <div className="lg:col-span-5">
              <div className="bg-ink p-10 text-white lg:p-12">
                <div className="bg-gold-400 text-ink mb-6 inline-flex h-12 w-12 items-center justify-center">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="eyebrow !text-gold-400 mb-3 block">{career.department}</span>
                {/*
                  The role title is already the page's <h1>, rendered by
                  PageBanner. Repeating it verbatim as an <h2> gave the page two
                  headings with identical text, which reads to a screen reader
                  as two sections about the same thing. This card summarises the
                  role, so it gets a heading that says that.
                */}
                <h2 className="font-display mb-7 text-3xl leading-tight font-bold text-white lg:text-4xl">
                  Role at a glance
                </h2>

                <div className="space-y-4 border-t border-white/10 pt-7">
                  <MetaRow icon={Building2} label="Department" value={career.department} />
                  <MetaRow icon={MapPin} label="Location" value={career.location} />
                  <MetaRow icon={Clock} label="Type" value={career.type} />
                </div>

                <div className="mt-10 border-t border-white/10 pt-7">
                  <p className="tracking-wide-2 mb-3 text-[11px] font-semibold text-slate-400 uppercase">
                    Get in touch
                  </p>
                  <div className="flex items-start gap-3">
                    <Mail className="text-gold-400 mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-[14px] text-slate-300">
                      careers@holdings.apexgroupcompanies.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — responsibilities */}
            <div className="lg:col-span-7">
              <span className="eyebrow mb-4 block">The Role</span>
              <h2 className="font-display text-ink mb-5 text-3xl leading-tight font-bold sm:text-4xl">
                What you will be doing.
              </h2>
              <p className="text-[15px] leading-relaxed text-slate-600">{career.summary}</p>

              <ul className="mt-8 space-y-4">
                {career.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-4">
                    <span className="bg-gold-400 text-ink inline-flex h-7 w-7 shrink-0 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="pt-1 text-[15px] leading-relaxed text-slate-700">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="eyebrow mb-4 block">Requirements</span>
              <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                What we are looking for.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                We hire for craft, attitude and discipline. If you meet most — but not all — of the
                requirements below, we would still like to hear from you.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-5">
                {career.requirements.map((r, i) => (
                  <li key={r} className="shadow-card flex items-start gap-5 bg-white p-6 lg:p-7">
                    <span className="font-display text-gold-400 shrink-0 text-2xl leading-none font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-[15px] leading-relaxed text-slate-700">{r}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section className="section border-b border-slate-200 bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="eyebrow mb-4 block">Apply</span>
              <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                Ready to apply?
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-slate-600">
                Submit your details and a short cover note. Our talent team reviews every
                application personally and responds within five working days.
              </p>

              <div className="border-gold-400 mt-10 border-l-2 bg-slate-50 p-6">
                <Sparkles className="text-gold-500 mb-2 h-5 w-5" />
                <p className="text-[13px] leading-relaxed text-slate-600">
                  No cover letter? No problem — a few honest lines about why this role interests you
                  is more than enough.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-slate-50 p-8 lg:p-10">
                {submitted ? (
                  <ApplySuccess
                    onReset={() => {
                      setForm(initialForm);
                      setSubmitted(false);
                    }}
                  />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="ap-name" className={labelBase}>
                          Full Name <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="ap-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          className={inputBase}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="ap-email" className={labelBase}>
                          Email <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="ap-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          className={inputBase}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="ap-phone" className={labelBase}>
                        Phone
                      </label>
                      <input
                        id="ap-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={inputBase}
                        placeholder="+92 300 000 0000"
                      />
                    </div>

                    <div>
                      <label htmlFor="ap-cover" className={labelBase}>
                        Cover Letter
                      </label>
                      <textarea
                        id="ap-cover"
                        rows={6}
                        value={form.cover}
                        onChange={(e) => update("cover", e.target.value)}
                        className={inputBase + " resize-y"}
                        placeholder="Why this role? What excites you about Apex Holdings? A few honest lines are perfect."
                      />
                    </div>

                    <div className="mt-4 flex flex-col items-start justify-between gap-5 border-t border-slate-200 pt-2 pt-6 sm:flex-row sm:items-center">
                      <p className="max-w-md text-[12px] leading-relaxed text-slate-500">
                        By submitting, you agree to our talent team reviewing your application. We
                        respond within five working days.
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
                        {submitting ? "Sending…" : "Submit Application"}
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

      <CTASection
        variant="dark"
        eyebrow="More Roles"
        title="See all the roles currently open at Apex Holdings."
        description="If this role is not the right fit, browse our other open positions across departments and locations."
        primary={{ label: "All Open Roles", href: "/careers" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-gold-400 inline-flex h-9 w-9 shrink-0 items-center justify-center bg-white/10">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="tracking-wide-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase">
          {label}
        </p>
        <p className="text-[14px] leading-snug font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function ApplySuccess({ onReset }: { onReset: () => void }) {
  return (
    <div className="py-8 text-center lg:py-10">
      <div className="bg-gold-400 text-ink mb-6 inline-flex h-16 w-16 items-center justify-center">
        <Check className="h-8 w-8" />
      </div>
      <span className="eyebrow mb-3 inline-block">Application Received</span>
      <h3 className="font-display text-ink text-3xl leading-tight font-bold lg:text-4xl">
        Thank you for applying.
      </h3>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-600">
        Your application has been logged with our talent team. We will review your profile and
        respond within five working days.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/careers" className="btn-primary text-[12px]">
          All Open Roles
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button type="button" onClick={onReset} className="btn-ghost text-[12px]">
          Submit another application
        </button>
      </div>
    </div>
  );
}
