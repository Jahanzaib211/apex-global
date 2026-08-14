"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Plane,
  Building2,
  Briefcase,
  Route,
  ArrowRight,
  ShieldCheck,
  Car,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

const useCases = [
  {
    icon: Plane,
    title: "JED airport pickup",
    desc: "Meet-and-greet at King Abdulaziz International Airport — direct to your hotel or straight on to Makkah.",
  },
  {
    icon: Building2,
    title: "Hotel transfers",
    desc: "Drop-offs and pickups across Jeddah — Corniche, King Road, the business district and the Old Town (Al-Balad).",
  },
  {
    icon: Briefcase,
    title: "Business travel",
    desc: "Corporate runs, executive meetings, and event days — drivers familiar with Jeddah timing and parking.",
  },
  {
    icon: Route,
    title: "Intercity to / from Makkah",
    desc: "The companion Makkah ↔ Jeddah intercity service — see the dedicated block below.",
  },
];

const faqItems = [
  {
    q: "Which airport does Apex pick up from in Jeddah?",
    a: "King Abdulaziz International Airport (JED). Apex arranges meet-and-greet, luggage help, and onward transfer to your hotel or to Makkah.",
  },
  {
    q: "Can the same driver take us from JED all the way to Makkah?",
    a: "Yes. Most pilgrims arrange a Jeddah → Makkah intercity transfer with their airport pickup, so luggage and party stay together. Confirm route and stop-off points at enquiry.",
  },
  {
    q: "Is self-drive available in Jeddah?",
    a: "Yes — Jeddah is one of the cities where Apex can arrange self-drive more readily than in Makkah. International driving licence rules apply; share your dates at enquiry.",
  },
  {
    q: "How is the fare structured for a Makkah → Jeddah return after Umrah?",
    a: "Rates depend on vehicle category, party size, and pickup zone in Makkah. Apex confirms a single fare covering both legs or one-way as you prefer.",
  },
];

export default function JeddahCarRentalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <>
      <PageHero
        eyebrow="Jeddah Car Rental"
        title="Car rental in Jeddah — airport transfers and intercity to Makkah."
        subtitle="JED pickups, hotel transfers and a reliable Jeddah ↔ Makkah intercity service. Rates and vehicle categories confirmed by Apex at enquiry."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Saudi Car Rental", href: "/saudi-car-rental" },
          { label: "Jeddah" },
        ]}
        primaryCta={{ label: "Enquire — Jeddah", href: "#enquire" }}
        secondaryCta={{ label: "See Jeddah ↔ Makkah", href: "#intercity" }}
      />

      {/* USE CASES */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-12 text-center">
            <div className="eyebrow mb-3 justify-center">Common use cases</div>
            <h2 className="heading-lg mb-3">Why travellers book transport in Jeddah</h2>
            <p className="prose-body-lg mx-auto max-w-2xl">
              Jeddah is the gateway for most pilgrims — your airport pickup and your intercity to
              Makkah are usually organised together.
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

      {/* JEDDAH ↔ MAKKAH INTERCITY */}
      <section id="intercity" className="section bg-sand-100">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="eyebrow mb-3">Intercity service</div>
            <h2 className="heading-lg mb-3">Jeddah to Makkah · Makkah to Jeddah</h2>
            <p className="prose-body-lg">
              The companion service on the{" "}
              <Link
                href="/saudi-car-rental#intercity"
                className="text-gold-600 font-semibold hover:underline"
              >
                Saudi Arabia Car Rental
              </Link>{" "}
              page has the full overview. The summary below is tailored for guests arriving or
              departing via Jeddah.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card-flat p-6 lg:p-7">
              <div className="text-gold-500 mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Route size={16} /> Jeddah → Makkah
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
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Combined with
                  airport pickup to keep luggage together
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Sedan / SUV /
                  Van — assigned at enquiry
                </li>
              </ul>
            </div>

            <div className="card-flat p-6 lg:p-7">
              <div className="text-gold-500 mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Route size={16} /> Makkah → Jeddah
              </div>
              <h3 className="font-display text-navy-600 mb-3 text-xl font-semibold">
                Departure to Jeddah
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
                  <CheckCircle2 size={14} className="text-gold-500 mt-1 shrink-0" /> Easy flight-day
                  timing — drivers familiar with JED traffic
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
                Combine with an Umrah plan
              </h3>
              <p className="text-ink-400 max-w-2xl text-sm">
                Apex can wrap your Jeddah airport pickup, intercity transfer, Makkah stay and
                ziyarat into a single Umrah package — or design a fully custom plan including
                Madinah.
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
            <h2 className="heading-lg mb-3">Jeddah car rental — common questions</h2>
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
              Jeddah partner and airport-meet assignments confirmed by Apex.{" "}
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
          <h2 className="heading-lg mb-4">Plan your Jeddah transport</h2>
          <p className="prose-body-lg mx-auto mb-8 max-w-2xl">
            Share your flight number, dates, and what you need — airport pickup, Jeddah city
            transfers, or a return Jeddah ↔ Makkah intercity transfer.
          </p>
          <div className="flex justify-center">
            <EnquireButton
              mode="car"
              presetCountry="Saudi Arabia"
              presetService="Jeddah Car Rental"
              label="Enquire about Jeddah car rental"
            />
          </div>
        </div>
      </section>
    </>
  );
}
