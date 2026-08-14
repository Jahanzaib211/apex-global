"use client";

import { useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { submitSiteVisit } from "./actions";

const projectOptions = [
  "Project A — Heights Residency (Islamabad)",
  "Project B — Garden Apartments (Lahore)",
  "Project C — Commercial Plaza (Karachi)",
  "Project D — Riverside Plots (Multan)",
  "Project E — Mixed-Use Square (Islamabad)",
  "Project F — Boulevard Homes (Faisalabad)",
  "Other / Not Sure",
];

const timeSlots = ["Morning", "Afternoon", "Evening"];
const source = "Apex Holdings";

export default function HoldingsSiteVisits() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    project: projectOptions[0] ?? "",
    preferredDate: "",
    preferredTime: timeSlots[0] ?? "",
    visitors: "",
    notes: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await submitSiteVisit({ ...form, source });
      if (!result.ok) {
        setError("We couldn't submit that just now. Please try again in a moment, or call us if it keeps happening.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="site-visits" className="bg-white py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading
              eyebrow="SITE VISITS"
              title="Book a Site Visit."
              subtitle="Tell us which project you would like to see and when. Our team will confirm the visit and share location details."
            />
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="border-gold bg-cream border p-10 text-center">
                <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
                  Thank you
                </p>
                <h3 className="font-display text-navy mt-3 text-3xl">
                  Your site visit request has been received.
                </h3>
                <p className="text-charcoal/70 mt-4 text-sm leading-6">
                  Our team will confirm the visit and share logistics. If you do not hear from us
                  within one business day, please reach out via the contact page.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="bg-cream grid gap-4 p-8 md:p-10">
                {error && (
                  <p
                    role="alert"
                    className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  >
                    {error}
                  </p>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name" required>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email" required>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Phone" required>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Project" required>
                    <select
                      value={form.project}
                      onChange={(e) => update("project", e.target.value)}
                      className={inputClass}
                    >
                      {projectOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Preferred Date">
                    <input
                      type="date"
                      value={form.preferredDate}
                      onChange={(e) => update("preferredDate", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Preferred Time">
                    <select
                      value={form.preferredTime}
                      onChange={(e) => update("preferredTime", e.target.value)}
                      className={inputClass}
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Number of Visitors">
                    <input
                      inputMode="numeric"
                      value={form.visitors}
                      onChange={(e) => update("visitors", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-charcoal/45 text-[10px] tracking-[.18em] uppercase">
                    Source: Apex Holdings
                  </p>
                  <Button type="submit" variant="primary" size="md">
                    {submitting ? "Sending…" : "Request Site Visit"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

const inputClass =
  "w-full border border-navy/20 bg-white px-3 py-3 text-sm text-charcoal focus:border-gold focus:outline-none";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-charcoal/70 mb-2 block text-xs font-semibold tracking-[.18em] uppercase">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
