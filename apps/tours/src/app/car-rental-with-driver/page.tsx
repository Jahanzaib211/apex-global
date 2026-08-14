"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Users,
  MapPin,
  Briefcase,
  Plane,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Calendar,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Award,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

const benefits = [
  {
    icon: Award,
    title: "Professional Chauffeurs",
    description: "Trained, vetted and uniformed drivers who know how to look after guests.",
  },
  {
    icon: MapPin,
    title: "Local Knowledge",
    description:
      "Drivers familiar with city routes, traffic patterns and short-cuts across Pakistan.",
  },
  {
    icon: Plane,
    title: "Airport Transfers",
    description:
      "Timely pickup and drop-off at all major airports with flight tracking on request.",
  },
  {
    icon: Briefcase,
    title: "Corporate Travel",
    description: "Discreet, punctual service for executives, delegations and visiting teams.",
  },
  {
    icon: Users,
    title: "Family Comfort",
    description: "Spacious vehicles, child seats on request and patient drivers for family trips.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description:
      "Hourly, half-day, full-day and multi-day bookings — plan around your day, not ours.",
  },
];

const infoToShare = [
  { label: "Pickup city and area" },
  { label: "Drop-off city or destination" },
  { label: "Travel date(s) and time" },
  { label: "Number of passengers" },
  { label: "Vehicle category preference" },
  { label: "Driver requirement (yes / with driver)" },
  { label: "Trip type (one-way, return, hourly, multi-day)" },
  { label: "Additional requirements (child seat, luggage, accessibility, language)" },
];

const scenarios = [
  {
    icon: Plane,
    title: "Airport run",
    description:
      "Pickup from the airport with name-board greeting, assistance with luggage and a direct drop to your hotel, office or home. Return leg booked together so your driver is already waiting.",
  },
  {
    icon: Briefcase,
    title: "Corporate day",
    description:
      "A dedicated vehicle and chauffeur on standby for a full day of meetings, client visits and office runs. Add or change destinations during the day as the schedule moves.",
  },
  {
    icon: Users,
    title: "Family intercity trip",
    description:
      "A comfortable sedan or SUV for a family of four to six travelling between cities. Rest stops and meal breaks arranged around the children's routine.",
  },
];

const faqs = [
  {
    q: "Will the driver speak English or Urdu?",
    a: "Drivers are comfortable in Urdu. English-speaking chauffeurs can be arranged on request, subject to availability in the pickup city.",
  },
  {
    q: "Can I keep the same driver for the whole trip?",
    a: "Yes. For multi-day and intercity bookings we assign a single chauffeur where the route and schedule allow it.",
  },
  {
    q: "What if my flight is delayed?",
    a: "For airport pickups we track the incoming flight. The driver adjusts the pickup time, and waiting time within a reasonable window is included.",
  },
  {
    q: "Is the driver's meal and stay included on long trips?",
    a: "Driver allowance for meals and overnight stay on intercity or multi-day trips is built into the quotation and shared with you before you confirm.",
  },
  {
    q: "Can I request a specific vehicle make or model?",
    a: "You can share a preference (sedan, SUV, executive, van) and Apex will allocate from the matching category. Specific makes and models are subject to availability.",
  },
  {
    q: "How are tolls, parking and fuel handled?",
    a: "Fuel, tolls and parking are itemised in the final invoice. For long routes, we share a clear estimate before the trip starts.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-flat overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-navy-600 text-lg font-semibold">{q}</span>
        <ChevronDown
          size={20}
          className={`text-gold-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="text-ink-400 px-5 pb-5 leading-relaxed">{a}</div>}
    </div>
  );
}

export default function CarRentalWithDriverPage() {
  return (
    <>
      <PageHero
        eyebrow="Pakistan Car Rental"
        title="Car rental with driver — sit back and travel."
        subtitle="A vetted chauffeur, a clean vehicle and the peace of mind that someone else is handling the road. Available for airport runs, intercity trips, corporate days and family travel."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Car Rentals", href: "/pakistan-car-rental" },
          { label: "With Driver" },
        ]}
      />

      {/* Benefits */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3 justify-center">Why with driver</div>
            <h2 className="heading-lg">Six reasons travellers choose a chauffeur.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="card p-6">
                <div className="bg-gold-100 text-gold-600 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <b.icon size={24} />
                </div>
                <h3 className="font-display text-navy-600 mb-2 text-xl font-semibold">{b.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to share */}
      <section className="section bg-sand-100">
        <div className="container-page">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="eyebrow mb-3">Enquiry checklist</div>
              <h2 className="heading-lg mb-4">What to share with us.</h2>
              <p className="prose-body">
                The more detail you give us, the more accurately Apex can confirm the right vehicle,
                driver and timing for your trip.
              </p>
            </div>
            <div className="lg:col-span-3">
              <ul className="card divide-sand-200 divide-y">
                {infoToShare.map((item) => (
                  <li key={item.label} className="flex items-start gap-3 p-4">
                    <CheckCircle2 size={18} className="text-gold-500 mt-0.5 shrink-0" />
                    <span className="text-ink-500 font-medium">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sample scenarios */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3 justify-center">Sample scenarios</div>
            <h2 className="heading-lg">A few trips we arrange often.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {scenarios.map((s) => (
              <div key={s.title} className="card p-6">
                <div className="bg-navy-50 text-navy-600 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <s.icon size={22} />
                </div>
                <h3 className="font-display text-navy-600 mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-sand-100">
        <div className="container-narrow">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-3 justify-center">FAQ</div>
            <h2 className="heading-lg">Questions travellers ask.</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-navy-grad grain text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3 justify-center">Plan your trip</div>
          <h2 className="heading-lg mb-4 !text-white">Book a chauffeur in three messages.</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/85">
            Send your dates, pickup city and passenger count — Apex confirms the vehicle and driver,
            and you travel without the road on your mind.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <EnquireButton
              mode="car"
              presetCountry="Pakistan"
              presetService="With driver"
              label="Enquire — with driver"
            />
            <Link href="/self-drive-car-rental" className="btn-secondary">
              Prefer self-drive? <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={16} className="text-gold-400" /> Vetted chauffeurs
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={16} className="text-gold-400" /> Insured vehicles
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={16} className="text-gold-400" /> Reply within one working day
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
