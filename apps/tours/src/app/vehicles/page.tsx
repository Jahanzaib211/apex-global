"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Car,
  Users,
  Luggage,
  Fuel,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  BadgeCheck,
  KeyRound,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

type Category = "All" | "Economy" | "Sedan" | "Executive" | "SUV" | "Luxury" | "Van";

interface Vehicle {
  name: string;
  category: Exclude<Category, "All">;
  capacity: string;
  luggage: string;
  transmission: string;
  fuel: string;
  withDriver: boolean;
  selfDrive: boolean;
  use: string;
}

const VEHICLES: Vehicle[] = [
  {
    name: "Compact Hatchback",
    category: "Economy",
    capacity: "4–5",
    luggage: "2 small + 1 large",
    transmission: "Auto",
    fuel: "Petrol",
    withDriver: true,
    selfDrive: true,
    use: "City driving, short hops, daily commute",
  },
  {
    name: "Mid-size Sedan",
    category: "Sedan",
    capacity: "4–5",
    luggage: "2–3 large",
    transmission: "Auto",
    fuel: "Petrol",
    withDriver: true,
    selfDrive: true,
    use: "Intercity comfort, business meetings, airport runs",
  },
  {
    name: "Premium Sedan",
    category: "Executive",
    capacity: "4",
    luggage: "2–3 large",
    transmission: "Auto",
    fuel: "Petrol",
    withDriver: true,
    selfDrive: false,
    use: "Client hosting, VIP movement, formal occasions",
  },
  {
    name: "Family SUV",
    category: "SUV",
    capacity: "5–7",
    luggage: "3–4 large",
    transmission: "Auto",
    fuel: "Petrol / Diesel",
    withDriver: true,
    selfDrive: true,
    use: "Family trips, hill stations, longer intercity routes",
  },
  {
    name: "Luxury Saloon",
    category: "Luxury",
    capacity: "4",
    luggage: "2–3 large",
    transmission: "Auto",
    fuel: "Petrol",
    withDriver: true,
    selfDrive: false,
    use: "Weddings, special occasions, premium leisure drives",
  },
  {
    name: "Passenger Van",
    category: "Van",
    capacity: "7–12",
    luggage: "5–8 large",
    transmission: "Auto",
    fuel: "Diesel",
    withDriver: true,
    selfDrive: true,
    use: "Group travel, tours, corporate teams, airport shuttles",
  },
];

const FILTERS: Category[] = ["All", "Economy", "Sedan", "Executive", "SUV", "Luxury", "Van"];

function FilterChips({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {FILTERS.map((f) => {
        const isActive = f === active;
        return (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              isActive
                ? "bg-navy-600 border-navy-600 shadow-navy text-white"
                : "text-navy-600 border-sand-200 hover:border-gold-400 hover:text-gold-600 bg-white"
            }`}
            aria-pressed={isActive}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}

function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <div className="card flex flex-col p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="bg-gold-100 text-gold-600 flex h-12 w-12 items-center justify-center rounded-xl">
          <Car size={24} />
        </div>
        <span className="badge-navy">{v.category}</span>
      </div>

      <h3 className="font-display text-navy-600 mb-1 text-2xl font-semibold">{v.name}</h3>
      <p className="text-ink-400 mb-5 text-sm">{v.use}</p>

      <dl className="mb-5 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Users size={16} className="text-gold-500 mt-0.5 shrink-0" />
          <div>
            <dt className="text-navy-600 font-semibold">Capacity</dt>
            <dd className="text-ink-400">{v.capacity} passengers</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Luggage size={16} className="text-gold-500 mt-0.5 shrink-0" />
          <div>
            <dt className="text-navy-600 font-semibold">Luggage</dt>
            <dd className="text-ink-400">{v.luggage}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 size={16} className="text-gold-500 mt-0.5 shrink-0" />
          <div>
            <dt className="text-navy-600 font-semibold">Transmission</dt>
            <dd className="text-ink-400">{v.transmission}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Fuel size={16} className="text-gold-500 mt-0.5 shrink-0" />
          <div>
            <dt className="text-navy-600 font-semibold">Fuel</dt>
            <dd className="text-ink-400">{v.fuel}</dd>
          </div>
        </div>
      </dl>

      <div className="mb-5 flex flex-wrap gap-2">
        {v.withDriver && <span className="badge-gold">With driver</span>}
        {v.selfDrive && <span className="badge-gold">Self-drive</span>}
      </div>

      <div className="border-sand-200 mt-auto border-t pt-5">
        <p className="text-navy-600 mb-4 text-sm font-semibold">Rate on request</p>
        <EnquireButton
          mode="car"
          presetCountry="Pakistan"
          presetService={`Fleet — ${v.name}`}
          label="Request details"
          variant="secondary"
          fullWidth
        />
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const [filter, setFilter] = useState<Category>("All");

  const filtered = useMemo(
    () => (filter === "All" ? VEHICLES : VEHICLES.filter((v) => v.category === filter)),
    [filter],
  );

  return (
    <>
      <PageHero
        eyebrow="Vehicle Fleet"
        title="Our vehicle fleet"
        subtitle="Categories and availability confirmed by Apex at enquiry time."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Car Rentals", href: "/pakistan-car-rental" },
          { label: "Vehicle Fleet" },
        ]}
      />

      {/* Filter bar */}
      <section className="section-tight border-sand-200 border-b bg-white">
        <div className="container-page">
          <div className="mb-6 text-center">
            <div className="eyebrow mb-2 justify-center">Browse the fleet</div>
            <h2 className="heading-md">Filter by category</h2>
          </div>
          <FilterChips active={filter} onChange={setFilter} />
        </div>
      </section>

      {/* Vehicle grid */}
      <section className="section bg-sand-100">
        <div className="container-page">
          {filtered.length === 0 ? (
            <div className="text-ink-400 py-12 text-center">
              No vehicles match this filter. Try another category.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <VehicleCard key={v.name} v={v} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Important notice */}
      <section className="section-tight bg-white">
        <div className="container-narrow">
          <div className="bg-sand-100 border-sand-200 flex items-start gap-4 rounded-2xl border p-6 md:p-7">
            <div className="bg-navy-600 text-gold-400 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-display text-navy-600 mb-1.5 text-xl font-semibold">
                Before you book
              </h3>
              <p className="text-ink-400 leading-relaxed">
                Actual vehicles, models, availability and rates are confirmed by Apex based on your
                dates and pickup city. Share your trip details and we will match the right vehicle
                to your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-navy-grad grain text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3 justify-center">Confirm a vehicle</div>
          <h2 className="heading-lg mb-4 !text-white">Tell us about your trip.</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/85">
            Dates, pickup city, passengers and luggage — Apex will match the right vehicle category
            and confirm availability in writing.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <EnquireButton mode="car" presetCountry="Pakistan" label="Enquire about a vehicle" />
            <Link href="/pakistan-car-rental" className="btn-secondary">
              Back to car rentals <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={16} className="text-gold-400" /> With driver available
            </span>
            <span className="inline-flex items-center gap-2">
              <KeyRound size={16} className="text-gold-400" /> Self-drive available
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
