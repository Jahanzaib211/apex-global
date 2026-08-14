"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Briefcase,
  Plane,
  Users,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Car,
  Clock,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

const useCases = [
  {
    icon: Briefcase,
    title: "Business travel",
    desc: "Executive commutes, client meetings, and airport runs across Riyadh&apos;s financial district.",
  },
  {
    icon: Plane,
    title: "Airport (RUH)",
    desc: "Pickup and drop-off at King Khalid International Airport — timings confirmed by Apex.",
  },
  {
    icon: Users,
    title: "Family trips",
    desc: "Larger vehicles for family visits, weekend trips and multi-day rentals with a vetted driver.",
  },
  {
    icon: Calendar,
    title: "Events",
    desc: "Weddings, conferences, and city-wide event transport coordinated by Apex with our partner network.",
  },
];

const faqItems = [
  {
    q: "Is self-drive available in Riyadh?",
    a: "Yes — Riyadh is the most straightforward Saudi city for self-drive rentals. International driving licence rules apply. Vehicle category and licence requirements are confirmed at enquiry.",
  },
  {
    q: "Do drivers know the diplomatic quarter and corporate zones?",
    a: "Yes. Apex&apos;s Riyadh partners are accustomed to the Diplomatic Quarter, KAFD, King Abdullah Financial District and major hotel clusters.",
  },
  {
    q: "Can Apex handle a multi-day business itinerary?",
    a: "Yes — daily driver assignments, vehicle changes, and out-of-city trips can be arranged as one booking. Share the itinerary at enquiry.",
  },
  {
    q: "Is there a Makkah intercity service from Riyadh?",
    a: "Apex arranges city-to-city and city-to-airport transport across the Kingdom. The Makkah ↔ Jeddah intercity service is featured on the Makkah and Jeddah pages — for Riyadh → Makkah runs, please enquire and we will quote.",
  },
];

export default function RiyadhCarRentalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <>
      <PageHero
        eyebrow="Riyadh Car Rental"
        title="Car rental in Riyadh — business and family."
        subtitle="Self-drive and chauffeur options in the Kingdom's capital — for executives, families and events. Vehicle categories and rates confirmed by Apex at enquiry."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Saudi Car Rental", href: "/saudi-car-rental" },
          { label: "Riyadh" },
        ]}
        primaryCta={{ label: "Enquire — Riyadh", href: "#enquire" }}
      />

      {/* USE CASES */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-12 text-center">
            <div className="eyebrow mb-3 justify-center">Common use cases</div>
            <h2 className="heading-lg mb-3">Why travellers book transport in Riyadh</h2>
            <p className="prose-body-lg mx-auto max-w-2xl">
              Riyadh is vast — many journeys that look short take longer than expected, so a driver
              or a self-drive vehicle saves hours across the week.
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
                  <p
                    className="text-ink-400 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: u.desc }}
                  />
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
            <div>
              <h3 className="font-display text-navy-600 mb-1 text-xl font-semibold">
                Travelling on to the holy sites?
              </h3>
              <p className="text-ink-400 max-w-xl text-sm">
                Apex arranges Riyadh → Jeddah → Makkah → Madinah multi-city itineraries. See the
                Makkah and Jeddah pages for the intercity service details.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/saudi-car-rental/makkah" className="btn-ghost">
                Makkah page
              </Link>
              <Link href="/saudi-car-rental/jeddah" className="btn-ghost">
                Jeddah page
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
            <h2 className="heading-lg mb-3">Riyadh car rental — common questions</h2>
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
                    <div
                      className="text-ink-400 -mt-1 px-5 pb-5 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.a }}
                    />
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
              Riyadh partner and rates confirmed by Apex.{" "}
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
          <h2 className="heading-lg mb-4">Plan your Riyadh transport</h2>
          <p className="prose-body-lg mx-auto mb-8 max-w-2xl">
            Share your dates, party size, and what you need — self-drive weekly rental, business
            meetings, airport pickup at RUH, or a multi-day event transport.
          </p>
          <div className="flex justify-center">
            <EnquireButton
              mode="car"
              presetCountry="Saudi Arabia"
              presetService="Riyadh Car Rental"
              label="Enquire about Riyadh car rental"
            />
          </div>
        </div>
      </section>
    </>
  );
}
