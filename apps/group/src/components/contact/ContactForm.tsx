"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Check, Send, Mail, Phone, MessageCircle, AlertCircle } from "lucide-react";
import { submitGroupContact } from "./actions";

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

const COMPANIES = [
  "Apex Global Tech Solution",
  "Apex Global Outsourcing",
  "Apex Global Tours & Travels",
  "Apex Holdings",
  "Apex Group Financial Consultancy",
  "General Group Enquiry",
];

const ENQUIRY_TYPES = [
  "General Corporate",
  "Technology",
  "Outsourcing",
  "Travel",
  "Real Estate",
  "Financial Consultancy",
  "Partnership",
  "Media",
  "Careers",
  "Other",
];

const initialState = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  interestedCompany: "General Group Enquiry",
  enquiryType: "General Corporate",
  service: "",
  message: "",
  preferredContact: "Email",
};

export default function ContactForm() {
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  /**
   * Preselect the enquiry type from `?type=` so the Direct Channels cards can
   * route here. Those cards used to be `mailto:` links to per-team addresses
   * that do not exist as mailboxes; they now deep-link to this form with the
   * right team already chosen.
   *
   * Read from `window.location` in an effect rather than `useSearchParams` so
   * the page stays statically prerenderable without a Suspense boundary.
   */
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("type");
    if (requested && (ENQUIRY_TYPES as readonly string[]).includes(requested)) {
      setData((d) => ({ ...d, enquiryType: requested }));
    }
  }, []);

  const update = (key: keyof typeof initialState, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!data.fullName.trim()) next.fullName = "Full name is required.";
    if (!data.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      next.email = "Please enter a valid email address.";
    if (data.message.trim().length < 20)
      next.message = "Please share at least 20 characters so we can route this properly.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitGroupContact(data);
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
    <section id="contact-form" className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="GET IN TOUCH"
          title="Send Us a Message."
          subtitle="Tell us a little about your enquiry and we will route it to the right team across the Group."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr,1fr]">
          <form
            onSubmit={onSubmit}
            className="border-navy/10 border bg-white p-8 shadow-sm md:p-12"
            noValidate
          >
            {submitted && (
              <div className="mb-8 flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <Check className="mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="font-semibold">Thank you — your enquiry has been received.</p>
                  <p className="mt-1 text-emerald-700">
                    A member of our team will be in touch within the timeframe indicated for your
                    selected channel.
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
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </Field>
              <Field label="Company / Organization">
                <input
                  className={inputBase}
                  value={data.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Company or organization"
                  autoComplete="organization"
                />
              </Field>
              <Field label="Email" required error={errors.email}>
                <input
                  type="email"
                  className={inputBase}
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone">
                <input
                  className={inputBase}
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+92 300 0000000"
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
              <Field label="Interested Company">
                <select
                  className={inputBase}
                  value={data.interestedCompany}
                  onChange={(e) => update("interestedCompany", e.target.value)}
                >
                  {COMPANIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Enquiry Type">
                <select
                  className={inputBase}
                  value={data.enquiryType}
                  onChange={(e) => update("enquiryType", e.target.value)}
                >
                  {ENQUIRY_TYPES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Service (optional)">
                <input
                  className={inputBase}
                  value={data.service}
                  onChange={(e) => update("service", e.target.value)}
                  placeholder="Specific service or product"
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Message" required error={errors.message}>
                <textarea
                  className={`${inputBase} min-h-[160px] resize-y`}
                  value={data.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us a little about your enquiry, what you are exploring, and any context that would help us respond well."
                />
              </Field>
            </div>

            <fieldset className="mt-6">
              <legend className="text-charcoal/70 text-xs font-semibold tracking-[.18em] uppercase">
                Preferred Contact Method
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {[
                  { v: "Email", icon: Mail },
                  { v: "Phone", icon: Phone },
                  { v: "WhatsApp", icon: MessageCircle },
                ].map(({ v, icon: Icon }) => {
                  const active = data.preferredContact === v;
                  return (
                    <label
                      key={v}
                      className={`flex cursor-pointer items-center gap-2 border px-4 py-2 text-sm transition ${
                        active
                          ? "border-navy bg-navy text-white"
                          : "border-navy/20 text-charcoal hover:border-navy/40 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredContact"
                        value={v}
                        checked={active}
                        onChange={() => update("preferredContact", v)}
                        className="sr-only"
                      />
                      <Icon size={14} />
                      {v}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-charcoal/55 text-xs">
                By submitting this form you agree to be contacted by Apex Group regarding your
                enquiry. We do not share your details with third parties.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gold text-navy inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send Enquiry"}
                <Send size={14} />
              </button>
            </div>
          </form>

          <aside className="border-navy/10 border bg-white p-8 md:p-10">
            <h3 className="font-display text-navy text-2xl">Before you write…</h3>
            <p className="text-charcoal/65 mt-4 text-sm leading-6">
              A few quick notes that help us route your enquiry to the right team faster.
            </p>
            <ul className="text-charcoal/75 mt-6 space-y-5 text-sm">
              {[
                'If your enquiry relates to a specific Group company, select it from the "Interested Company" field — it routes automatically.',
                "Partnership and media enquiries are handled by dedicated teams. Use the dropdowns to flag this.",
                "For time-sensitive matters, mention a preferred callback window in the message field.",
                "We respond to every enquiry. Allow at least one business day for a first reply.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="bg-gold mt-1 h-1.5 w-1.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="border-navy/10 mt-8 border-t pt-6">
              <p className="text-gold text-[10px] font-semibold tracking-[.2em] uppercase">
                Direct Channels
              </p>
              <p className="text-charcoal/70 mt-3 text-sm">
                For sensitive or confidential matters, please use the direct channel options on the
                page below — these are monitored by the relevant team.
              </p>
            </div>
          </aside>
        </div>
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
