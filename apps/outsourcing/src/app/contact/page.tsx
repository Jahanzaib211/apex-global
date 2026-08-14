"use client";

import { useState } from "react";
import { ArrowRight, Mail, Phone, MapPin, Globe, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT, CONTACT_LINKS } from "@/lib/contact";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  resources: string;
  industry: string;
  startDate: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  service: "",
  resources: "",
  industry: "",
  startDate: "",
  message: "",
};

const SERVICE_OPTIONS = [
  "Business Process Outsourcing",
  "Customer Experience",
  "Telesales",
  "Sales Development / Lead Generation",
  "Digital Marketing",
  "Back-Office Operations",
  "Dedicated Remote Teams",
  "Staffing Solutions",
] as const;

const RESOURCES_OPTIONS = ["1–5", "6–15", "16–50", "50+", "Not sure yet"] as const;
const INDUSTRY_OPTIONS = [
  "Technology / SaaS",
  "E-commerce",
  "Healthcare",
  "Financial Services",
  "Real Estate",
  "Logistics",
  "Retail",
  "Hospitality",
  "Education",
  "Other",
] as const;
const START_OPTIONS = [
  "Within 2 weeks",
  "Within a month",
  "1–3 months",
  "3+ months",
  "Exploring",
] as const;

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refId, setRefId] = useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { ok?: boolean; error?: string; receivedAt?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setRefId(data.receivedAt ?? null);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-white">
      <Navbar />

      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-12 text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Contact
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-5xl leading-tight font-extrabold md:text-6xl">
            Let's design <span className="gradient-text">your engagement.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Tell us what you need to scale. We'll come back within one business day with a tailored
            proposal.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <aside className="space-y-5 lg:col-span-1">
            <div className="bg-mist border-line rounded-2xl border p-6">
              <h2 className="font-display text-navy font-bold">Talk to a specialist</h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-amber2-dark mt-0.5" aria-hidden />
                  <a href={CONTACT_LINKS.mailto} className="text-navy hover:text-amber2-dark">
                    {CONTACT.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-amber2-dark mt-0.5" aria-hidden />
                  <a href={CONTACT_LINKS.tel} className="text-navy hover:text-amber2-dark">
                    {CONTACT.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-amber2-dark mt-0.5" aria-hidden />
                  <span className="text-steel">
                    {CONTACT.address.line1} · {CONTACT.address.line2}
                    <br />
                    {CONTACT.address.region}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Globe size={16} className="text-amber2-dark mt-0.5" aria-hidden />
                  <span className="text-steel">{CONTACT.hours}</span>
                </li>
              </ul>
            </div>

            <div className="bg-navy rounded-2xl p-6 text-white">
              <div className="text-amber2 text-xs font-semibold tracking-widest uppercase">
                Response Time
              </div>
              <div className="font-display mt-3 text-2xl font-extrabold">
                {CONTACT.responseTime}
              </div>
              <p className="mt-2 text-sm text-white/75">{CONTACT.responseTimeDetail}</p>
            </div>
          </aside>

          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-mist border-line rounded-2xl border p-10 text-center">
                <CheckCircle2 size={48} className="text-amber2-dark mx-auto" aria-hidden />
                <h2 className="font-display text-navy mt-4 text-2xl font-extrabold">
                  Thanks, {form.name || "we've got it"}.
                </h2>
                <p className="text-steel mx-auto mt-3 max-w-lg">
                  Your enquiry has been received. A specialist from the {form.service || "relevant"}{" "}
                  team will reach out within one business day.
                </p>
                {refId && (
                  <p className="text-steel mt-2 text-xs">
                    Reference: <span className="font-mono">{refId}</span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setRefId(null);
                    setForm(EMPTY);
                  }}
                  className="btn-ghost mt-6"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="border-line space-y-5 rounded-2xl border bg-white p-6 md:p-8"
                noValidate
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    id="name"
                    label="Full Name *"
                    value={form.name}
                    onChange={(v) => update("name", v)}
                    required
                  />
                  <Field
                    id="company"
                    label="Company *"
                    value={form.company}
                    onChange={(v) => update("company", v)}
                    required
                  />
                  <Field
                    id="email"
                    label="Work Email *"
                    type="email"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    required
                  />
                  <Field
                    id="phone"
                    label="Phone / WhatsApp *"
                    value={form.phone}
                    onChange={(v) => update("phone", v)}
                    required
                  />
                  <Field
                    id="country"
                    label="Country *"
                    value={form.country}
                    onChange={(v) => update("country", v)}
                    required
                  />
                  <Select
                    id="service"
                    label="Service Required *"
                    value={form.service}
                    onChange={(v) => update("service", v)}
                    options={[...SERVICE_OPTIONS]}
                    required
                  />
                  <Select
                    id="resources"
                    label="Number of Resources"
                    value={form.resources}
                    onChange={(v) => update("resources", v)}
                    options={[...RESOURCES_OPTIONS]}
                  />
                  <Select
                    id="industry"
                    label="Industry"
                    value={form.industry}
                    onChange={(v) => update("industry", v)}
                    options={[...INDUSTRY_OPTIONS]}
                  />
                  <Select
                    id="startDate"
                    label="Expected Start Date"
                    value={form.startDate}
                    onChange={(v) => update("startDate", v)}
                    options={[...START_OPTIONS]}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-navy mb-1.5 block text-sm font-semibold">
                    Tell us about your requirements
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={5}
                    placeholder="What are you trying to achieve? Any specific volume, market or campaign details?"
                    className="form-field border-line bg-mist text-navy placeholder-steel w-full rounded-lg border px-4 py-3 text-sm transition focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center text-base disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden /> Submitting...
                    </>
                  ) : (
                    <>
                      Request a Proposal <ArrowRight size={18} aria-hidden />
                    </>
                  )}
                </button>
                {errorMsg && (
                  <p role="alert" className="text-center text-sm text-red-600">
                    {errorMsg}
                  </p>
                )}
                <p className="text-steel text-center text-xs">
                  By submitting this form you agree to our confidentiality practices. Your
                  information is treated as strictly confidential.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-navy mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="form-field border-line bg-mist text-navy focus:border-navy w-full rounded-lg border px-4 py-3 text-sm transition focus:bg-white focus:outline-none"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  required?: boolean;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-navy mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="form-field border-line bg-mist text-navy focus:border-navy w-full rounded-lg border px-4 py-3 text-sm transition focus:bg-white focus:outline-none"
      >
        <option value="" disabled hidden>
          Select...
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
