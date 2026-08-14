"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Car,
  ShieldCheck,
  FileCheck,
  Wallet,
  Fuel,
  Navigation,
  Route,
  KeyRound,
  Phone,
  Calendar,
  BadgeCheck,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

const conditions = [
  {
    icon: Calendar,
    title: "Rental duration",
    body: "Daily, weekly and monthly rentals. Minimum rental period and extensions are confirmed by Apex before booking based on your dates and pickup city.",
  },
  {
    icon: FileCheck,
    title: "Required documents",
    body: "Valid driving licence, CNIC or passport and a second form of ID. International visitors may need an International Driving Permit — Apex will advise.",
  },
  {
    icon: Wallet,
    title: "Security deposit",
    body: "A refundable security deposit is held before handover. The amount depends on the vehicle category and is confirmed in your quotation.",
  },
  {
    icon: Route,
    title: "Mileage policy",
    body: "Mileage limits and per-kilometre charges beyond the included allowance are shared in writing before you confirm.",
  },
  {
    icon: Fuel,
    title: "Fuel policy",
    body: "Vehicles are handed over with a full tank and expected back with a full tank. Alternative arrangements are agreed in advance.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance and coverage",
    body: "Basic insurance is included. Comprehensive coverage, excess reduction and roadside assistance are optional add-ons — Apex explains each option at booking.",
  },
];

const categories = [
  {
    name: "Economy",
    capacity: "4–5 passengers",
    luggage: "2 small + 1 large",
    use: "City driving, short hops, daily commute",
    icon: Car,
  },
  {
    name: "Sedan",
    capacity: "4–5 passengers",
    luggage: "2–3 large",
    use: "Intercity comfort, business meetings, airport runs",
    icon: Car,
  },
  {
    name: "SUV",
    capacity: "5–7 passengers",
    luggage: "3–4 large",
    use: "Family trips, hill stations, longer intercity routes",
    icon: Car,
  },
  {
    name: "Executive",
    capacity: "4 passengers",
    luggage: "2–3 large",
    use: "Client hosting, VIP movement, formal occasions",
    icon: Car,
  },
  {
    name: "Luxury",
    capacity: "4 passengers",
    luggage: "2–3 large",
    use: "Weddings, special occasions, premium leisure drives",
    icon: Car,
  },
  {
    name: "Van",
    capacity: "7–12 passengers",
    luggage: "5–8 large",
    use: "Group travel, tours, corporate teams, airport shuttles",
    icon: Car,
  },
];

const steps = [
  {
    icon: Phone,
    title: "Enquire",
    description: "Share pickup city, dates, vehicle category and licence details.",
  },
  {
    icon: BadgeCheck,
    title: "Confirm",
    description: "Apex confirms the vehicle, rental terms, deposit and handover time in writing.",
  },
  {
    icon: KeyRound,
    title: "Pick up",
    description:
      "Inspect the car together, sign the agreement, complete the deposit and drive away.",
  },
  {
    icon: ShieldCheck,
    title: "Return",
    description:
      "Drop the vehicle back at the agreed location. Deposit is released after inspection.",
  },
];

const faqs = [
  {
    q: "Do I need an International Driving Permit?",
    a: "Pakistani licence holders can drive on their local licence. Visitors are advised to carry an International Driving Permit alongside their home-country licence — Apex confirms the exact requirement for your nationality at enquiry.",
  },
  {
    q: "Can I take the car out of the pickup city?",
    a: "Intercity and out-of-city travel is allowed with prior approval. Some categories may have route restrictions which are shared in the rental agreement.",
  },
  {
    q: "What happens if the car breaks down?",
    a: "Roadside assistance is available on every rental. Contact the Apex support number in your agreement and we will arrange assistance or a replacement vehicle.",
  },
  {
    q: "Is there an age limit for self-drive rentals?",
    a: "The standard minimum age is 21 with at least one year of valid driving experience. Apex confirms eligibility for your specific booking.",
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

export default function SelfDriveCarRentalPage() {
  return (
    <>
      <PageHero
        eyebrow="Pakistan Car Rental"
        title="Self-drive car rental — travel on your own schedule."
        subtitle="Pick up a clean, inspected vehicle and drive yourself. Terms, deposit and coverage are confirmed by Apex in writing before you book."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Car Rentals", href: "/pakistan-car-rental" },
          { label: "Self-Drive" },
        ]}
      />

      {/* Conditions */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <div className="eyebrow mb-3 justify-center">Important to know</div>
            <h2 className="heading-lg">Rental conditions, in plain language.</h2>
            <p className="prose-body mt-3">
              Self-drive rentals come with a few standard policies. Everything below is confirmed by
              Apex before booking — no surprises on pickup day.
            </p>
          </div>

          <div className="bg-gold-50 border-gold-200 mx-auto mb-10 flex max-w-3xl items-start gap-3 rounded-xl border px-5 py-4">
            <ShieldAlert size={20} className="text-gold-600 mt-0.5 shrink-0" />
            <p className="text-navy-600 text-sm font-medium">
              Terms confirmed by Apex before booking — including the exact deposit, mileage
              allowance and insurance options for your chosen vehicle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {conditions.map((c) => (
              <div key={c.title} className="card p-6">
                <div className="bg-gold-100 text-gold-600 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <c.icon size={22} />
                </div>
                <h3 className="font-display text-navy-600 mb-2 text-lg font-semibold">{c.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle categories */}
      <section className="section bg-sand-100">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3 justify-center">Choose your category</div>
            <h2 className="heading-lg">Six categories, one simple process.</h2>
            <p className="prose-body mt-3">
              Pick the category that suits your trip — Apex confirms the specific vehicle,
              transmission and fuel type at handover.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.name} className="card flex flex-col p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="bg-navy-50 text-navy-600 flex h-12 w-12 items-center justify-center rounded-xl">
                    <cat.icon size={24} />
                  </div>
                  <span className="badge-navy">{cat.name}</span>
                </div>
                <h3 className="font-display text-navy-600 mb-3 text-2xl font-semibold">
                  {cat.name}
                </h3>
                <dl className="text-ink-500 mb-5 flex-1 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-gold-500 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-navy-600 font-semibold">Capacity</dt>
                      <dd className="text-ink-400">{cat.capacity}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-gold-500 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-navy-600 font-semibold">Luggage</dt>
                      <dd className="text-ink-400">{cat.luggage}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-gold-500 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-navy-600 font-semibold">Typical use</dt>
                      <dd className="text-ink-400">{cat.use}</dd>
                    </div>
                  </div>
                </dl>
                <EnquireButton
                  mode="car"
                  presetCountry="Pakistan"
                  presetService={`Self-Drive — ${cat.name}`}
                  label={`Enquire about ${cat.name}`}
                  variant="secondary"
                  fullWidth
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How self-drive works */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3 justify-center">How self-drive works</div>
            <h2 className="heading-lg">From enquiry to keys in hand.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="card relative p-6">
                <div className="bg-gold-400 text-navy-700 shadow-gold absolute -top-3 -left-3 flex h-9 w-9 items-center justify-center rounded-full font-bold">
                  {i + 1}
                </div>
                <div className="bg-gold-100 text-gold-600 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
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
            <h2 className="heading-lg">Self-drive questions, answered.</h2>
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
          <div className="eyebrow !text-gold-400 mb-3 justify-center">Ready to drive?</div>
          <h2 className="heading-lg mb-4 !text-white">Take the wheel with Apex.</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/85">
            Send your dates, pickup city and licence details — Apex confirms a vehicle category,
            deposit and handover slot in writing.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <EnquireButton
              mode="car"
              presetCountry="Pakistan"
              presetService="Self-Drive"
              label="Enquire — self-drive"
            />
            <Link href="/car-rental-with-driver" className="btn-secondary">
              Prefer with driver? <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">
              <FileCheck size={16} className="text-gold-400" /> Clear rental agreement
            </span>
            <span className="inline-flex items-center gap-2">
              <Navigation size={16} className="text-gold-400" /> Roadside assistance
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-gold-400" /> Reply within one working day
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
