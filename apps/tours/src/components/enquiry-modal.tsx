"use client";

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { WHATSAPP_LINK, BRAND } from "@/lib/brand";
import { readAttribution } from "@/lib/attribution";

type Mode = "car" | "pilgrimage" | "group" | "general";

interface Props {
  open: boolean;
  onClose: () => void;
  mode?: Mode;
  presetService?: string;
  presetCountry?: "Pakistan" | "Saudi Arabia";
}

export function EnquiryModal({
  open,
  onClose,
  mode = "general",
  presetService,
  presetCountry,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    vehicle: "",
    driveType: presetCountry ? (presetCountry === "Saudi Arabia" ? "self" : "driver") : "",
    duration: "",
    travelers: "",
    adults: "",
    children: "",
    type: presetService ?? "",
    departure: "",
    hotel: "",
    transport: "",
    budget: "",
    message: "",
  });

  if (!open) return null;

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Compose a WhatsApp-friendly summary and route the customer to WhatsApp.
    // (No backend in phase 1 — Apex team can layer a CRM endpoint in phase 2.)
    const summary = [
      `Apex Tours & Travels — Enquiry`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `WhatsApp: ${form.whatsapp || "—"}`,
      `Email: ${form.email || "—"}`,
      form.type && `Service: ${form.type}`,
      form.pickup && `Pickup: ${form.pickup}`,
      form.dropoff && `Drop-off: ${form.dropoff}`,
      form.date && `Date: ${form.date}`,
      form.time && `Time: ${form.time}`,
      form.vehicle && `Vehicle: ${form.vehicle}`,
      form.driveType && `Drive Type: ${form.driveType === "driver" ? "With Driver" : "Self-Drive"}`,
      form.duration && `Duration: ${form.duration}`,
      form.travelers && `Travelers: ${form.travelers}`,
      form.adults && `Adults: ${form.adults}`,
      form.children && `Children: ${form.children}`,
      form.departure && `Departure City: ${form.departure}`,
      form.hotel && `Hotel Preference: ${form.hotel}`,
      form.transport && `Transport: ${form.transport}`,
      form.budget && `Budget: ${form.budget}`,
      form.message && `Message: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    // Record the enquiry in the Apex CRM before handing off to WhatsApp.
    // Fire-and-forget on purpose: the customer's next step is the WhatsApp
    // window, and it must not wait on our network call or be cancelled by it.
    // Failures are swallowed here and logged server-side — an unreachable CRM
    // must never stop someone reaching a human.
    void fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        type: form.type,
        message: form.message,
        summary,
        attribution: readAttribution(),
      }),
      keepalive: true,
    }).catch(() => {});

    // Mark submitted locally then route to WhatsApp
    setSubmitted(true);
    setTimeout(() => {
      window.open(WHATSAPP_LINK(summary), "_blank", "noopener,noreferrer");
    }, 600);
  };

  const reset = () => {
    setSubmitted(false);
    setForm({
      name: "",
      phone: "",
      whatsapp: "",
      email: "",
      pickup: "",
      dropoff: "",
      date: "",
      time: "",
      vehicle: "",
      driveType: presetCountry ? (presetCountry === "Saudi Arabia" ? "self" : "driver") : "",
      duration: "",
      travelers: "",
      adults: "",
      children: "",
      type: presetService ?? "",
      departure: "",
      hotel: "",
      transport: "",
      budget: "",
      message: "",
    });
  };

  return (
    <div
      className="bg-navy-900/70 animate-fade-up fixed inset-0 z-[60] flex items-end justify-center backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="shadow-navy relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-ink-400 hover:bg-sand-100 absolute top-3 right-3 rounded-full p-2"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10">
              <CheckCircle2 className="text-[#25D366]" size={36} />
            </div>
            <h3 className="font-display text-navy-600 mb-2 text-2xl">Enquiry received</h3>
            <p className="text-ink-400 mb-6">
              We&apos;ve opened WhatsApp with your details pre-filled. A travel expert from{" "}
              {BRAND.short} will respond shortly.
            </p>
            <button
              onClick={() => {
                reset();
                onClose();
              }}
              className="btn-ghost"
            >
              Submit another enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="eyebrow mb-2">Enquiry</div>
              <h3 className="heading-md">
                {mode === "car" && "Request a vehicle"}
                {mode === "pilgrimage" && "Request a Hajj / Umrah package"}
                {mode === "group" && "Plan a group journey"}
                {mode === "general" && "Talk to a travel expert"}
              </h3>
              <p className="text-ink-400 mt-2 text-sm">
                Fields marked with <span className="text-gold-500">*</span> are required. Your
                enquiry will be sent to our team via WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Full name *</label>
                <input
                  className="field"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Phone *</label>
                <input
                  className="field"
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">WhatsApp</label>
                <input
                  className="field"
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  className="field"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </div>

            {mode === "car" && (
              <>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Pickup location *</label>
                    <input
                      className="field"
                      required
                      value={form.pickup}
                      onChange={(e) => update("pickup", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Drop-off location</label>
                    <input
                      className="field"
                      value={form.dropoff}
                      onChange={(e) => update("dropoff", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Date *</label>
                    <input
                      type="date"
                      className="field"
                      required
                      value={form.date}
                      onChange={(e) => update("date", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Time</label>
                    <input
                      type="time"
                      className="field"
                      value={form.time}
                      onChange={(e) => update("time", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Vehicle preference</label>
                    <select
                      className="field"
                      value={form.vehicle}
                      onChange={(e) => update("vehicle", e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option>Economy</option>
                      <option>Sedan</option>
                      <option>Executive</option>
                      <option>SUV</option>
                      <option>Luxury</option>
                      <option>Van / Group Transport</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Drive type</label>
                    <select
                      className="field"
                      value={form.driveType}
                      onChange={(e) => update("driveType", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="driver">With Driver</option>
                      <option value="self">Self-Drive</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="field-label">Rental duration</label>
                    <input
                      className="field"
                      placeholder="e.g. 3 days, 1 week"
                      value={form.duration}
                      onChange={(e) => update("duration", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {(mode === "pilgrimage" || mode === "group") && (
              <>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Package type *</label>
                    <select
                      className="field"
                      required
                      value={form.type}
                      onChange={(e) => update("type", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Umrah</option>
                      <option>Hajj</option>
                      <option>Custom Hajj</option>
                      <option>Custom Umrah</option>
                      <option>Group Hajj</option>
                      <option>Group Umrah</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Departure city *</label>
                    <input
                      className="field"
                      required
                      value={form.departure}
                      onChange={(e) => update("departure", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Number of travelers *</label>
                    <input
                      className="field"
                      required
                      value={form.travelers}
                      onChange={(e) => update("travelers", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Adults / Children</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="field"
                        placeholder="Adults"
                        value={form.adults}
                        onChange={(e) => update("adults", e.target.value)}
                      />
                      <input
                        className="field"
                        placeholder="Children"
                        value={form.children}
                        onChange={(e) => update("children", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Preferred dates</label>
                    <input
                      className="field"
                      placeholder="e.g. Nov 2026, flexible"
                      value={form.date}
                      onChange={(e) => update("date", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Hotel preference</label>
                    <select
                      className="field"
                      value={form.hotel}
                      onChange={(e) => update("hotel", e.target.value)}
                    >
                      <option value="">Select tier</option>
                      <option>Economy</option>
                      <option>Standard</option>
                      <option>Premium</option>
                      <option>Luxury</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="field-label">Transportation</label>
                    <select
                      className="field"
                      value={form.transport}
                      onChange={(e) => update("transport", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Private (included)</option>
                      <option>Shared</option>
                      <option>Self-arranged</option>
                      <option>Need vehicle rental too</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="field-label">Budget range (per person, optional)</label>
                    <input
                      className="field"
                      placeholder="e.g. PKR 250,000 — 400,000"
                      value={form.budget}
                      onChange={(e) => update("budget", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="mt-4">
              <label className="field-label">Message</label>
              <textarea
                className="field min-h-[100px]"
                rows={4}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us about your trip, group size, special requirements…"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="btn-primary flex-1">
                Send Enquiry
              </button>
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
            </div>
            <p className="text-ink-300 mt-4 text-center text-xs">
              By submitting, you agree to be contacted by {BRAND.short} regarding your enquiry.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
