"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Compass,
  Users,
  Plane,
  Church,
  ArrowRight,
  ShieldCheck,
  Car,
  Clock,
  Building2,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

const useCases = [
  {
    icon: Church,
    title: "Masjid an-Nabawi visits",
    desc: "Hotel-to-Masjid transport on your schedule, timed around the five prayers and Jumu&apos;ah.",
  },
  {
    icon: Compass,
    title: "Ziyarat in Madinah",
    desc: "Visits to the seven mosques, Uhud, Quba, and the historic sites around the city.",
  },
  {
    icon: Plane,
    title: "Airport pickup (MED)",
    desc: "Prince Mohammad bin Abdulaziz International Airport (MED) pickups and drop-offs.",
  },
  {
    icon: Users,
    title: "Family stays",
    desc: "Larger vehicles for multi-generational families — drivers familiar with elders and luggage.",
  },
];

const faqItems = [
  {
    q: "Is there a Makkah ↔ Madinah intercity service on this page?",
    a: "This page is focused on transport inside and around Madinah. The Makkah ↔ Jeddah intercity service is featured on the Makkah and Jeddah city pages, and on the Saudi Arabia Car Rental overview.",
  },
  {
    q: "Are women-only driver options available?",
    a: "Subject to partner availability in Madinah — share your requirement at enquiry and Apex will try to match an appropriate driver and vehicle.",
  },
  {
    q: "How long is a typical ziyarat round?",
    a: "A standard ziyarat circuit of the main Madinah sites takes a half-day. Apex confirms duration, vehicle, and rate at enquiry.",
  },
  {
    q: "Can we add a Madinah stay to a Makkah Umrah package?",
    a: "Yes — typical Umrah itineraries include both cities. Ask Apex about Umrah packages or a fully custom plan.",
  },
];

export default function MadinahCarRentalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <>
      <PageHero
        eyebrow="Madinah Car Rental"
        title="Car rental in Madinah — for ziyarat, prayer visits and family stays."
        subtitle="Licensed drivers for Masjid an-Nabawi visits, ziyarat circuits, and airport pickups at MED. Rates and vehicle categories confirmed by Apex at enquiry."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Saudi Car Rental", href: "/saudi-car-rental" },
          { label: "Madinah" },
        ]}
        primaryCta={{ label: "Enquire — Madinah", href: "#enquire" }}
      />

      {/* USE CASES */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-12 text-center">
            <div className="eyebrow mb-3 justify-center">Common use cases</div>
            <h2 className="heading-lg mb-3">Why travellers book transport in Madinah</h2>
            <p className="prose-body-lg mx-auto max-w-2xl">
              Madinah is calmer than Makkah but the ziyarat circuit is wide — having a licensed
              driver saves hours of navigation.
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

      {/* CROSS-LINK BAND */}
      <section className="bg-sand-100">
        <div className="container-page py-10">
          <div className="border-sand-200 flex flex-col gap-5 rounded-2xl border bg-white p-6 md:flex-row md:items-center md:justify-between lg:p-8">
            <div className="flex items-start gap-4">
              <div className="bg-gold-100 text-gold-600 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="font-display text-navy-600 mb-1 text-xl font-semibold">
                  Also planning Makkah?
                </h3>
                <p className="text-ink-400 max-w-xl text-sm">
                  The Makkah city page covers hotel-to-Haram transfers, ziyarat, and the Makkah ↔
                  Jeddah intercity service — useful if your trip includes both holy cities.
                </p>
              </div>
            </div>
            <Link href="/saudi-car-rental/makkah" className="btn-ghost shrink-0">
              View Makkah page <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-3 justify-center">FAQ</div>
            <h2 className="heading-lg mb-3">Madinah car rental — common questions</h2>
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
              Madinah partner assignments and rates confirmed by Apex.{" "}
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
          <h2 className="heading-lg mb-4">Plan your Madinah transport</h2>
          <p className="prose-body-lg mx-auto mb-8 max-w-2xl">
            Share your dates, group size, and what you need — Masjid visits, ziyarat, MED airport
            pickup, or a multi-day Madinah stay with driver.
          </p>
          <div className="flex justify-center">
            <EnquireButton
              mode="car"
              presetCountry="Saudi Arabia"
              presetService="Madinah Car Rental"
              label="Enquire about Madinah car rental"
            />
          </div>
        </div>
      </section>
    </>
  );
}
