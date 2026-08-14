"use client";

import { useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Check, Send, AlertCircle, Paperclip, Lock } from "lucide-react";
import { submitCareersApplication } from "./actions";
import type { Vacancy } from "./CareersFilter";

const COUNTRIES = [
  "Pakistan",
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Bahrain",
  "Kuwait",
  "Oman",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "India",
  "Other",
];

const COMPANIES = [
  "Apex Global Tech Solution",
  "Apex Global Outsourcing",
  "Apex Global Tours & Travels",
  "Apex Holdings",
  "Apex Group Financial Consultancy",
  "Apex Group Office",
];

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  position: "",
  companyOfInterest: "Apex Group Office",
  coverLetter: "",
  linkedin: "",
  consent: false,
};

export default function CareersApplication({
  selectedVacancy,
  clearSelected,
}: {
  selectedVacancy?: Vacancy | null;
  clearSelected?: () => void;
}) {
  const [data, setData] = useState({
    ...initialState,
    position: selectedVacancy?.title ?? "",
    companyOfInterest: selectedVacancy?.companyLabel ?? "Apex Group Office",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = <K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key as string]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key as string];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!data.fullName.trim()) next.fullName = "Full name is required.";
    if (!data.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      next.email = "Please enter a valid email.";
    if (!data.phone.trim()) next.phone = "Phone is required.";
    if (data.coverLetter.trim().length < 100)
      next.coverLetter = "Please share at least 100 characters about your background and interest.";
    if (!data.consent) next.consent = "Please confirm you accept the privacy terms.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await submitCareersApplication(data);
      if (!result.ok) {
        setServerError("We couldn't submit that just now. Please try again in a moment, or call us if it keeps happening.");
        return;
      }
      setSubmitted(true);
      setData({ ...initialState });
      clearSelected?.();
    } catch {
      setServerError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full border border-navy/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-navy focus:ring-2 focus:ring-gold/40";

  return (
    <section id="careers-application" className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="APPLY"
          title="Submit Your Application."
          subtitle="Send us your details and a short cover letter. We respond to every serious application."
        />

        {selectedVacancy && (
          <div className="border-gold/30 mt-8 flex items-start justify-between gap-4 border bg-white p-5 text-sm">
            <div>
              <p className="text-gold text-[10px] font-semibold tracking-[.2em] uppercase">
                Applying For
              </p>
              <p className="font-display text-navy mt-1 text-xl">{selectedVacancy.title}</p>
              <p className="text-charcoal/60 text-xs">
                {selectedVacancy.companyLabel} · {selectedVacancy.location}
              </p>
            </div>
            <button
              onClick={clearSelected}
              className="text-navy hover:text-gold text-[10px] font-semibold tracking-[.18em] uppercase"
            >
              Clear
            </button>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="border-navy/10 mt-8 border bg-white p-8 md:p-12"
          noValidate
        >
          {submitted && (
            <div className="mb-8 flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <Check className="mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-semibold">Thank you — your application has been received.</p>
                <p className="mt-1 text-emerald-700">
                  The careers team will review your profile and reach out if there is a match.
                </p>
              </div>
            </div>
          )}
          {serverError && (
            <div className="mb-8 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <p>{serverError}</p>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full Name" required error={errors.fullName}>
              <input
                className={inputBase}
                value={data.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input
                type="email"
                className={inputBase}
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone" required error={errors.phone}>
              <input
                className={inputBase}
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                autoComplete="tel"
              />
            </Field>
            <Field label="Country">
              <select
                className={inputBase}
                value={data.country}
                onChange={(e) => update("country", e.target.value)}
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Position">
              <input
                className={inputBase}
                value={data.position}
                onChange={(e) => update("position", e.target.value)}
                placeholder="Role or area of interest"
              />
            </Field>
            <Field label="Company of Interest">
              <select
                className={inputBase}
                value={data.companyOfInterest}
                onChange={(e) => update("companyOfInterest", e.target.value)}
              >
                {COMPANIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Cover Letter" required error={errors.coverLetter}>
              <textarea
                className={`${inputBase} min-h-[180px] resize-y`}
                value={data.coverLetter}
                onChange={(e) => update("coverLetter", e.target.value)}
                placeholder="Tell us about your background, what you are looking for, and what brought you to Apex."
              />
              <span className="text-charcoal/45 mt-1 block text-xs">Minimum 100 characters.</span>
            </Field>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-charcoal/70 mb-1.5 text-xs font-semibold tracking-[.15em] uppercase">
                CV Upload
              </p>
              <div className="border-navy/20 text-charcoal/55 flex items-center gap-3 border border-dashed bg-white px-4 py-3 text-sm">
                <Paperclip size={16} className="text-gold" />
                <span>Upload via secure portal after initial review.</span>
              </div>
            </div>
            <Field label="LinkedIn / Profile URL (optional)">
              <input
                className={inputBase}
                value={data.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/your-handle"
              />
            </Field>
          </div>

          <label className="text-charcoal/75 mt-5 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={data.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className="accent-gold mt-1 h-4 w-4"
            />
            <span>
              I confirm that the information provided is accurate and I consent to Apex Group
              storing and processing this data for recruitment purposes.{" "}
              <Lock size={11} className="text-gold inline" />
              {errors.consent && (
                <span className="mt-1 block text-xs text-red-600">{errors.consent}</span>
              )}
            </span>
          </label>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-charcoal/55 text-xs">
              We respond to every application. Shortlisted candidates hear from us within ten
              business days.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="bg-gold text-navy inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Application"}
              <Send size={14} />
            </button>
          </div>
        </form>
      </Container>
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-charcoal/70 mb-1.5 block text-xs font-semibold tracking-[.15em] uppercase">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
