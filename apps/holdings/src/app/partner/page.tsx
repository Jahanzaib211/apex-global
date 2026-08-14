"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Handshake,
  TrendingUp,
  Network,
  Building2,
  Check,
  Send,
  Sparkles,
  Mail,
  Phone,
} from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectName: string;
  projectLocation: string;
  projectType: string;
  currentStatus: string;
  requirement: string;
  message: string;
}

const initialForm: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  projectName: "",
  projectLocation: "",
  projectType: "Residential",
  currentStatus: "Pre-launch",
  requirement: "",
  message: "",
};

const partnerTypes = [
  {
    icon: Building2,
    title: "Developer",
    body: "You are developing a project and looking for a structured, full-funnel marketing and sales counterpart to bring it to market.",
    offer:
      "End-to-end project marketing, sales operations, lead generation, CRM and on-ground activations.",
  },
  {
    icon: TrendingUp,
    title: "Investor",
    body: "You are an individual or institutional investor looking for curated property opportunities with disciplined underwriting.",
    offer:
      "A curated shortlist of vetted opportunities with transparent information and a long-term partner mindset.",
  },
  {
    icon: Network,
    title: "Channel Partner",
    body: "You are a real-estate agent, brokerage or referral network that wants access to high-quality inventory for your clients.",
    offer:
      "Channel-friendly inventory, transparent commission structures and co-marketed opportunities.",
  },
  {
    icon: Handshake,
    title: "Strategic Alliance",
    body: "You represent a brand, agency or service provider whose capabilities complement ours — and would like to explore collaboration.",
    offer:
      "Long-term alliance structures that allow us to extend our offering to partners and clients without diluting quality.",
  },
];

const inputBase =
  "w-full bg-white border border-slate-300 px-4 py-3 text-[14px] text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors";
const labelBase = "text-[11px] tracking-wide-2 uppercase font-semibold text-slate-600 block mb-2";

export default function PartnerPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/partner", {
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
      setSubmitError("Could not send your enquiry. Please email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageBanner
        eyebrow="PARTNER WITH US"
        title="Strategic collaborations for developers, investors and partners."
        description="Apex Holdings partners with developers, project owners and investor groups who want a structured marketing and sales counterpart for their real-estate projects."
        breadcrumbs={[{ label: "Partner With Us" }]}
        bg="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Partner types */}
      <section className="section border-b border-slate-200 bg-white">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4 block">Who we partner with</span>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Four ways to partner with Apex Holdings.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              Whether you are developing a project, investing in one, distributing opportunities to
              your network, or building a strategic alliance — there is a structured way to work
              with us.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {partnerTypes.map((p) => (
              <article
                key={p.title}
                className="hover:shadow-card-hover group border border-slate-200 bg-slate-50 p-8 transition-all duration-500 hover:bg-white lg:p-10"
              >
                <div className="flex items-start gap-5">
                  <div className="bg-ink text-gold-400 group-hover:bg-gold-400 group-hover:text-ink inline-flex h-12 w-12 shrink-0 items-center justify-center transition-colors duration-300">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-ink mb-3 text-2xl font-bold">{p.title}</h3>
                    <p className="mb-5 text-[14px] leading-relaxed text-slate-600">{p.body}</p>
                    <div className="border-t border-slate-200 pt-5">
                      <p className="tracking-wide-2 text-gold-500 mb-2 text-[11px] font-semibold uppercase">
                        What Apex offers
                      </p>
                      <p className="text-[14px] leading-relaxed text-slate-600">{p.offer}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="eyebrow mb-4 block">Partnership Enquiry</span>
              <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                Tell us about your project.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-slate-600">
                Share a few details about your project and your partnership intent. Our partnerships
                team reviews every enquiry personally and responds within two working days.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-gold-50 border-gold-400/40 text-gold-500 inline-flex h-10 w-10 shrink-0 items-center justify-center border">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="tracking-wide-2 mb-1 text-[11px] font-semibold text-slate-500 uppercase">
                      Email
                    </p>
                    <p className="text-ink text-[14px] font-semibold">
                      partners@holdings.apexgroupcompanies.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gold-50 border-gold-400/40 text-gold-500 inline-flex h-10 w-10 shrink-0 items-center justify-center border">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="tracking-wide-2 mb-1 text-[11px] font-semibold text-slate-500 uppercase">
                      Partnerships Desk
                    </p>
                    <p className="text-ink text-[14px] font-semibold">+92 300 000 0000</p>
                  </div>
                </div>
              </div>

              <div className="border-gold-400 mt-10 border-l-2 bg-white p-6">
                <Sparkles className="text-gold-500 mb-2 h-5 w-5" />
                <p className="text-[13px] leading-relaxed text-slate-600">
                  All enquiries are treated as confidential. We do not share your project
                  information with third parties without explicit consent.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="shadow-card bg-white p-8 lg:p-10">
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
                        <label htmlFor="name" className={labelBase}>
                          Name <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          className={inputBase}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className={labelBase}>
                          Company
                        </label>
                        <input
                          id="company"
                          type="text"
                          value={form.company}
                          onChange={(e) => update("company", e.target.value)}
                          className={inputBase}
                          placeholder="Company / Organisation"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="email" className={labelBase}>
                          Email <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          className={inputBase}
                          placeholder="you@company.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelBase}>
                          Phone <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="phone"
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
                        <label htmlFor="projectName" className={labelBase}>
                          Project Name
                        </label>
                        <input
                          id="projectName"
                          type="text"
                          value={form.projectName}
                          onChange={(e) => update("projectName", e.target.value)}
                          className={inputBase}
                          placeholder="Project / Brand name"
                        />
                      </div>
                      <div>
                        <label htmlFor="projectLocation" className={labelBase}>
                          Project Location
                        </label>
                        <input
                          id="projectLocation"
                          type="text"
                          value={form.projectLocation}
                          onChange={(e) => update("projectLocation", e.target.value)}
                          className={inputBase}
                          placeholder="City · Sector / Area"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="projectType" className={labelBase}>
                          Project Type
                        </label>
                        <select
                          id="projectType"
                          value={form.projectType}
                          onChange={(e) => update("projectType", e.target.value)}
                          className={inputBase + " cursor-pointer appearance-none"}
                        >
                          <option>Residential</option>
                          <option>Commercial</option>
                          <option>Mixed-Use</option>
                          <option>Plots & Apartments</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="currentStatus" className={labelBase}>
                          Current Status
                        </label>
                        <select
                          id="currentStatus"
                          value={form.currentStatus}
                          onChange={(e) => update("currentStatus", e.target.value)}
                          className={inputBase + " cursor-pointer appearance-none"}
                        >
                          <option>Pre-launch</option>
                          <option>Ongoing</option>
                          <option>Completed</option>
                          <option>Not yet launched</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="requirement" className={labelBase}>
                        What are you looking for from Apex?
                      </label>
                      <textarea
                        id="requirement"
                        rows={3}
                        value={form.requirement}
                        onChange={(e) => update("requirement", e.target.value)}
                        className={inputBase + " resize-y"}
                        placeholder="e.g. full-funnel marketing, sales operations, lead generation, brand launch…"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className={labelBase}>
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={inputBase + " resize-y"}
                        placeholder="Anything else you would like our partnerships team to know."
                      />
                    </div>

                    <div className="mt-4 flex flex-col items-start justify-between gap-5 border-t border-slate-200 pt-2 pt-6 sm:flex-row sm:items-center">
                      <p className="max-w-md text-[12px] leading-relaxed text-slate-500">
                        By submitting, you agree to be contacted by the Apex Holdings partnerships
                        team. We respond within two working days.
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
                        {submitting ? "Sending…" : "Send Enquiry"}
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
        eyebrow="Questions first?"
        title="Have questions before submitting an enquiry?"
        description="Our team is happy to talk through partnership structures, scope, timelines and commercials before any formal process begins."
        primary={{ label: "Contact Us", href: "/contact" }}
        secondary={{ label: "See Our Vision", href: "/about/vision" }}
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
      <span className="eyebrow mb-3 inline-block">Enquiry Received</span>
      <h3 className="font-display text-ink text-3xl leading-tight font-bold lg:text-4xl">
        Thank you — we will be in touch.
      </h3>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-600">
        Your partnership enquiry has been logged. The Apex partnerships team will review your
        details and respond within two working days.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/projects" className="btn-primary text-[12px]">
          See Our Projects
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button type="button" onClick={onReset} className="btn-ghost text-[12px]">
          Send another enquiry
        </button>
      </div>
    </div>
  );
}
