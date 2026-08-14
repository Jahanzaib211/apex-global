"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Church,
  Plane,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
  Route,
  ShieldCheck,
  Car,
  Clock,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

const useCases = [
  {
    icon: Church,
    title: "Ziyarat transport",
    desc: "Visits to the holy sites around Makkah — coordinated with prayer times and hotel pickup.",
  },
  {
    icon: Users,
    title: "Family travel",
    desc: "Multi-generational family groups needing a van or two SUVs with a vetted driver.",
  },
  {
    icon: Building2,
    title: "Hotel-to-Haram transfers",
    desc: "Scheduled shuttles between your hotel and the Masjid al-Haram, timed around prayers.",
  },
  {
    icon: Plane,
    title: "Airport pickup from Jeddah",
    desc: "JED airport meet-and-greet, direct drop-off at your Makkah hotel — onward Jeddah connection if needed.",
  },
];

const faqItems = [
  {
    q: "Do drivers hold Makkah permits?",
    a: "Yes — Apex arranges vehicles and drivers through licensed partners with valid Makkah entry permits. Permit and vehicle details are confirmed at enquiry.",
  },
  {
    q: "Can the same vehicle take us Makkah → Jeddah after Umrah?",
    a: "Yes. Many pilgrim groups book a Makkah stay with driver, then a one-way Makkah → Jeddah transfer straight to JED airport. See the intercity service block above.",
  },
  {
    q: "Is self-drive available in Makkah?",
    a: "Self-drive is restricted in central Makkah zones. We typically recommend with-driver for hotel and ziyarat movements, and self-drive only for outer Makkah day trips — confirm at enquiry.",
  },
  {
    q: "How far in advance should we book?",
    a: "During Hajj and Ramadan, as early as possible. Outside peak periods, 3–7 days is usually enough. Apex confirms partner availability at enquiry.",
  },
];

export default function MakkahCarRentalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <>
      <PageHero
        eyebrow="Makkah Car Rental"
        title="Car rental in Makkah — for Umrah, ziyarat and family visits."
        subtitle="Licensed drivers for the holy city, plus seamless Makkah ↔ Jeddah transfers. Rates and vehicle categories confirmed by Apex at enquiry."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Saudi Car Rental", href: "/saudi-car-rental" },
          { label: "Makkah" },
        ]}
        primaryCta={{ label: "Enquire — Makkah", href: "#enquire" }}
        secondaryCta={{ label: "See Makkah ↔ Jeddah service", href: "#intercity" }}
      />

      {/* USE CASES */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-12 text-center">
            <div className="eyebrow mb-3 justify-center">Common use cases</div>
            <h2 className="heading-lg mb-3">Why travellers book transport in Makkah</h2>
            <p className="prose-body-lg mx-auto max-w-2xl">
              Makkah runs on a different rhythm — restricted zones, prayer-time traffic, and
              pilgrimage logistics. Apex plans around all of it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u) => {
              const Icon = u.icon;
              return (
                <div key={u.title} className="card p-6">
                  <div className="bg-gold-100 text-gold-600 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-navy-600 mb-2 text-lg font-semibold">
                    {u.title}
                  </h3>
                  <p className="text-ink-400 text-sm leading-relaxed">{u.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAKKAH ↔ JEDDAH INTERCITY (Makkah page version) */}
      <section id="intercity" className="section bg-sand-100">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="eyebrow mb-3">Intercity service</div>
            <h2 className="heading-lg mb-3">Makkah to Jeddah · Jeddah to Makkah</h2>
            <p className="prose-body-lg">
              The companion service on the{" "}
              <Link
                href="/saudi-car-rental#intercity"
                className="text-gold-600 font-semibold hover:underline"
              >
                Saudi Arabia Car Rental
              </Link>{" "}
              page has the full overview. The summary below is tailored for guests staying in
              Makkah.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card-flat p-6 lg:p-7">
              <div className="text-gold-500 mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Route size={16} /> Makkah → Jeddah
              </div>
              <h3 className="font-display text-navy-600 mb-3 text-xl font-semibold">
                Departure from Makkah
              </h3>
              <ul className="text-ink-400 space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Pickup from
                  your Makkah hotel
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Drop at Jeddah
                  hotel or JED airport
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Sedan / SUV /
                  Van — assigned at enquiry
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Rate confirmed
                  by Apex, on request
                </li>
              </ul>
            </div>

            <div className="card-flat p-6 lg:p-7">
              <div className="text-gold-500 mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Route size={16} className="-scale-x-100" /> Jeddah → Makkah
              </div>
              <h3 className="font-display text-navy-600 mb-3 text-xl font-semibold">
                Arrival into Makkah
              </h3>
              <ul className="text-ink-400 space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> JED airport
                  meet-and-greet
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Direct drop-off
                  at Makkah hotel or designated zone
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Late-night
                  arrivals supported
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Rate confirmed
                  by Apex, on request
                </li>
              </ul>
            </div>
          </div>

          {/* Cross-link CTAs */}
          <div className="card-flat mt-10 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between lg:p-7">
            <div>
              <h3 className="font-display text-navy-600 mb-1 text-xl font-semibold">
                Pair this with an Umrah itinerary
              </h3>
              <p className="text-ink-400 max-w-2xl text-sm">
                Apex can wrap airport pickup, intercity transfer, Makkah stay and ziyarat into a
                single Umrah package — or design a fully custom plan.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/umrah-packages" className="btn-primary">
                Umrah Packages <ArrowRight size={16} />
              </Link>
              <Link href="/custom-package" className="btn-ghost">
                Custom Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-3 justify-center">FAQ</div>
            <h2 className="heading-lg mb-3">Makkah car rental — common questions</h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div key={item.q} className="card-flat overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-display text-navy-600 text-base font-semibold sm:text-lg">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-gold-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="text-ink-400 -mt-1 px-5 pb-5 text-sm leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-sand-100 border-sand-200 border-y">
        <div className="container-page flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="text-ink-500 flex items-center gap-3">
            <div className="text-navy-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
              <ShieldCheck size={20} />
            </div>
            <p className="text-sm leading-relaxed">
              Makkah permits and partner assignments confirmed by Apex.{" "}
              <span className="text-navy-600 font-semibold">Saudi regulations apply.</span>
            </p>
          </div>
          <div className="text-ink-400 flex items-center gap-2 text-sm">
            <Clock size={16} className="text-gold-500" />
            <span className="flex items-center gap-1">
              <Car size={14} /> Or browse{" "}
              <Link
                href="/saudi-car-rental"
                className="text-gold-600 font-semibold hover:underline"
              >
                all Saudi cities
              </Link>
              <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </section>

      {/* ENQUIRE CTA */}
      <section id="enquire" className="section bg-sand-grad">
        <div className="container-narrow text-center">
          <div className="eyebrow mb-3 justify-center">Send an enquiry</div>
          <h2 className="heading-lg mb-4">Plan your Makkah transport</h2>
          <p className="prose-body-lg mx-auto mb-8 max-w-2xl">
            Share your dates, group size, and what you need — ziyarat, hotel transfers, airport
            pickup, or a Makkah → Jeddah intercity transfer.
          </p>
          <div className="flex justify-center">
            <EnquireButton
              mode="car"
              presetCountry="Saudi Arabia"
              presetService="Makkah Car Rental"
              label="Enquire about Makkah car rental"
            />
          </div>
        </div>
      </section>
    </>
  );
}
