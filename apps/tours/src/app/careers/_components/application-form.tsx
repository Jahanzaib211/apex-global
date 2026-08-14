"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { readAttribution } from "@/lib/attribution";

/**
 * Job application form.
 *
 * Replaces the `mailto:` links that were the entire application path on this
 * page — every one of them addressed to a mailbox that does not exist. This
 * posts to /api/careers, which forwards into the Apex CRM with attribution
 * intact and spools to disk if the CRM is unreachable.
 */
interface Props {
  /** Job titles offered in the dropdown. */
  roles: readonly string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/\S+$/i;

export function ApplicationForm({ roles }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    experience: "",
    resumeUrl: "",
    cover: "",
    company_website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  /** Preselect the role when arrived at via a card's "Apply" link. */
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("role");
    if (wanted && roles.includes(wanted)) setForm((f) => ({ ...f, role: wanted }));
  }, [roles]);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!form.email.trim()) next.email = "We need an email to reply to.";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "That email doesn't look right.";
    if (!form.role) next.role = "Please choose the role you're applying for.";
    if (form.resumeUrl.trim() && !URL_RE.test(form.resumeUrl.trim())) {
      next.resumeUrl = "Please paste a full link, starting with https://";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, attribution: readAttribution() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
    } catch {
      // Never claim success we cannot prove — the applicant needs to know to
      // try again rather than wait for a reply that is not coming.
      setServerError(
        "We couldn't submit your application just now. Please try again, or reach us on WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center" role="status">
        <CheckCircle2 className="text-gold-500 mx-auto mb-4" size={40} />
        <h3 className="font-display text-navy-600 mb-2 text-2xl font-semibold">
          Application received
        </h3>
        <p className="text-ink-400 mx-auto max-w-md text-sm leading-relaxed">
          Thank you, {form.name.split(" ")[0]}. We review applications on a rolling basis and will
          be in touch if there is a fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-7 md:p-9" noValidate>
      <h3 className="font-display text-navy-600 mb-1 text-2xl font-semibold">Apply now</h3>
      <p className="text-ink-400 mb-7 text-sm">
        Fields marked with <span aria-hidden>*</span> are required.
      </p>

      {/* Honeypot — visually hidden, not `display:none`, so bots still fill it. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label>
          Company website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company_website}
            onChange={(e) => set("company_website", e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name} htmlFor="ca-name">
          <input
            id="ca-name"
            className="field"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
          />
        </Field>

        <Field label="Email" required error={errors.email} htmlFor="ca-email">
          <input
            id="ca-email"
            type="email"
            className="field"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
          />
        </Field>

        <Field label="Phone / WhatsApp" htmlFor="ca-phone">
          <input
            id="ca-phone"
            type="tel"
            className="field"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
          />
        </Field>

        <Field label="Role" required error={errors.role} htmlFor="ca-role">
          <select
            id="ca-role"
            className="field"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
          >
            <option value="">Select a role</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
            <option value="General application">General application</option>
          </select>
        </Field>

        <Field label="Years of experience" htmlFor="ca-exp">
          <select
            id="ca-exp"
            className="field"
            value={form.experience}
            onChange={(e) => set("experience", e.target.value)}
          >
            <option value="">Select</option>
            <option>Less than 1 year</option>
            <option>1–3 years</option>
            <option>3–5 years</option>
            <option>5+ years</option>
          </select>
        </Field>

        <Field
          label="Link to your CV"
          error={errors.resumeUrl}
          htmlFor="ca-cv"
          hint="Google Drive, Dropbox or LinkedIn — make sure it's viewable."
        >
          <input
            id="ca-cv"
            type="url"
            inputMode="url"
            placeholder="https://"
            className="field"
            value={form.resumeUrl}
            onChange={(e) => set("resumeUrl", e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Why Apex?" htmlFor="ca-cover">
          <textarea
            id="ca-cover"
            rows={5}
            className="field resize-y"
            value={form.cover}
            onChange={(e) => set("cover", e.target.value)}
          />
        </Field>
      </div>

      {serverError && (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {serverError}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary mt-7 w-full sm:w-auto">
        {submitting ? "Sending…" : "Submit application"}
        {!submitting && <Send size={16} />}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && (
          <span className="text-gold-600" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="text-ink-300 mt-1.5 text-xs">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
