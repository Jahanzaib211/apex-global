"use client";

import { useState } from "react";
import { Check, Send, AlertCircle } from "lucide-react";
import { submitEventRegistration } from "./actions";

export default function EventRegistrationForm({ eventSlug }: { eventSlug: string }) {
  const [data, setData] = useState({ fullName: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (k: keyof typeof data, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!data.fullName.trim()) next.fullName = "Full name is required.";
    if (!data.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      next.email = "Please enter a valid email.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await submitEventRegistration({ ...data, eventSlug });
      if (!result.ok) {
        setServerError("We couldn't submit that just now. Please try again in a moment, or call us if it keeps happening.");
        return;
      }
      setSubmitted(true);
      setData({ fullName: "", email: "", phone: "", notes: "" });
    } catch {
      setServerError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full border border-navy/20 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-navy focus:ring-2 focus:ring-gold/40";

  return (
    <form onSubmit={onSubmit} className="border-navy/10 border bg-white p-7 md:p-8" noValidate>
      {submitted && (
        <div className="mb-5 flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Check className="mt-0.5 shrink-0" size={16} />
          <p>Thank you — your interest has been registered. We will be in touch with details.</p>
        </div>
      )}
      {serverError && (
        <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 shrink-0" size={16} />
          <p>{serverError}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
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
        <Field label="Phone">
          <input
            className={inputBase}
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            autoComplete="tel"
          />
        </Field>
        <Field label="Company / Organization">
          <input
            className={inputBase}
            value={data.notes.split("|")[0] ?? ""}
            onChange={() => {}}
            disabled
            placeholder="Mention in Notes below"
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Notes">
          <textarea
            className={`${inputBase} min-h-[120px] resize-y`}
            value={data.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Any context, accessibility needs, or questions we should know about."
          />
        </Field>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-charcoal/55 text-xs">
          We use your details only to coordinate this event and send related updates.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="bg-gold text-navy hover:bg-navy hover:text-gold inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Register Interest"} <Send size={14} />
        </button>
      </div>
    </form>
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
