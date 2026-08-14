"use client";

import { useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Check, Send, AlertCircle, Paperclip, Lock } from "lucide-react";
import { submitPartnershipEnquiry } from "./actions";

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
  "Bangladesh",
  "Sri Lanka",
  "Other",
];

const INDUSTRIES = [
  "Technology",
  "Real Estate",
  "Travel & Hospitality",
  "BPO",
  "Financial Services",
  "Professional Services",
  "Other",
];

const PARTNERSHIP_TYPES = [
  "Technology Partners",
  "Real Estate Developers",
  "Travel & Hospitality Partners",
  "Outsourcing & BPO Clients",
  "Strategic Business Partners",
  "Financial & Professional Partners",
  "Other",
];

const COMPANIES_OF_INTEREST = [
  "Tech Solution",
  "Outsourcing",
  "Tours & Travels",
  "Holdings",
  "Financial Consultancy",
  "Group",
];

const initialState = {
  fullName: "",
  company: "",
  position: "",
  email: "",
  phone: "",
  country: "",
  industry: "",
  partnershipType: "Strategic Business Partners",
  companyOfInterest: "Group",
  proposal: "",
  consent: false,
};

export default function PartnershipForm() {
  const [data, setData] = useState(initialState);
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
    if (!data.company.trim()) next.company = "Company is required.";
    if (!data.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      next.email = "Please enter a valid email.";
    if (data.proposal.trim().length < 50)
      next.proposal = "Please share at least 50 characters describing the partnership.";
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
      await submitPartnershipEnquiry(data);
      setSubmitted(true);
      setData(initialState);
    } catch {
      setServerError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full border border-navy/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-navy focus:ring-2 focus:ring-gold/40";

  return (
    <section id="partnership-form" className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="SUBMIT A PROPOSAL"
          title="Tell Us About the Partnership You Have in Mind."
          subtitle="Share a few details and we will route your proposal to the right team across the Group."
        />

        <form
          onSubmit={onSubmit}
          className="border-navy/10 bg-cream/60 mt-12 border p-8 md:p-12"
          noValidate
        >
          {submitted && (
            <div className="mb-8 flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <Check className="mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-semibold">
                  Thank you — your partnership proposal has been received.
                </p>
                <p className="mt-1 text-emerald-700">
                  The partnerships team will review your submission and reach out within the next
                  few business days.
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
            <Field label="Company" required error={errors.company}>
              <input
                className={inputBase}
                value={data.company}
                onChange={(e) => update("company", e.target.value)}
                autoComplete="organization"
              />
            </Field>
            <Field label="Position / Role">
              <input
                className={inputBase}
                value={data.position}
                onChange={(e) => update("position", e.target.value)}
                autoComplete="organization-title"
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
            <Field label="Phone">
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
            <Field label="Industry">
              <select
                className={inputBase}
                value={data.industry}
                onChange={(e) => update("industry", e.target.value)}
              >
                <option value="">Select your industry</option>
                {INDUSTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Partnership Type">
              <select
                className={inputBase}
                value={data.partnershipType}
                onChange={(e) => update("partnershipType", e.target.value)}
              >
                {PARTNERSHIP_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Company of Interest">
              <select
                className={inputBase}
                value={data.companyOfInterest}
                onChange={(e) => update("companyOfInterest", e.target.value)}
              >
                {COMPANIES_OF_INTEREST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Proposal" required error={errors.proposal}>
              <textarea
                className={`${inputBase} min-h-[180px] resize-y`}
                value={data.proposal}
                onChange={(e) => update("proposal", e.target.value)}
                placeholder="Tell us about your organization, what you offer, and what kind of partnership you have in mind."
              />
              <span className="text-charcoal/45 mt-1 block text-xs">Minimum 50 characters.</span>
            </Field>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-charcoal/70 mb-1.5 text-xs font-semibold tracking-[.15em] uppercase">
                Attachments
              </p>
              <div className="border-navy/20 text-charcoal/55 flex items-center gap-3 border border-dashed bg-white px-4 py-3 text-sm">
                <Paperclip size={16} className="text-gold" />
                <span>File upload available in the secure client portal after initial review.</span>
              </div>
            </div>
            <label className="text-charcoal/75 flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={data.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="accent-gold mt-1 h-4 w-4"
              />
              <span>
                I confirm that the information provided is accurate and I consent to Apex Group
                storing and processing this data for the purpose of evaluating this partnership
                enquiry, in accordance with the privacy policy.{" "}
                <Lock size={11} className="text-gold inline" />
                {errors.consent && (
                  <span className="mt-1 block text-xs text-red-600">{errors.consent}</span>
                )}
              </span>
            </label>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-charcoal/55 text-xs">
              We respond to every partnership proposal. Allow up to five business days for an
              initial reply.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="bg-gold text-navy inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Partnership Proposal"}
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
