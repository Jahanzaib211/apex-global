"use client";

import { useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { submitToursBooking } from "./actions";

const services = [
  "Pakistan Car Rental",
  "Saudi Car Rental",
  "Hajj Package",
  "Umrah Package",
  "Custom Package",
  "Group Package",
];

const source = "Apex Global Tours & Travels";

export default function ToursBooking() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: services[0] ?? "",
    travelDate: "",
    passengers: "",
    departureCity: "",
    message: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitToursBooking({ ...form, source });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="bg-white py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading
              eyebrow="BOOKING"
              title="Plan Your Journey With Apex."
              subtitle="Share a few details and our team will respond with availability, package options and next steps. Required fields are marked."
            />
            <div className="border-gold text-charcoal/70 mt-8 space-y-3 border-l-2 pl-5 text-sm leading-6">
              <p>Source-tagged enquiries reach our travel desk within one business day.</p>
              <p className="text-charcoal/45 text-xs italic">
                For urgent or sensitive matters, please request a call back in your message.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="border-gold bg-cream border p-10 text-center">
                <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
                  Thank you
                </p>
                <h3 className="font-display text-navy mt-3 text-3xl">
                  Your enquiry has been received.
                </h3>
                <p className="text-charcoal/70 mt-4 text-sm leading-6">
                  Our travel desk will contact you using the details you provided. If you do not
                  hear from us within one business day, please check your spam folder or follow up
                  via the contact page.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="bg-cream grid gap-4 p-8 md:p-10">
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
                  <Field label="Service Type" required>
                    <select
                      required
                      value={form.serviceType}
                      onChange={(e) => update("serviceType", e.target.value)}
                      className={inputClass}
                    >
                      {services.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Travel Date">
                    <input
                      type="date"
                      value={form.travelDate}
                      onChange={(e) => update("travelDate", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Passengers">
                    <input
                      inputMode="numeric"
                      value={form.passengers}
                      onChange={(e) => update("passengers", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Departure City">
                    <input
                      value={form.departureCity}
                      onChange={(e) => update("departureCity", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Message">
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-charcoal/45 text-[10px] tracking-[.18em] uppercase">
                    Source: Apex Global Tours &amp; Travels
                  </p>
                  <Button type="submit" variant="primary" size="md">
                    {submitting ? "Sending…" : "Send Enquiry"}
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
