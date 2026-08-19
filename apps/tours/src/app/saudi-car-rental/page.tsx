import Link from "next/link";
import {
  MapPin,
  Car,
  Plane,
  Users,
  Briefcase,
  Calendar,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  BadgeCheck,
  Route,
  Church,
  Building2,
  Compass,
  ChevronRight,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Saudi Car Rental — Makkah, Madinah, Jeddah",
  description:
    "Car rental across Saudi Arabia — Makkah, Madinah, Jeddah, Riyadh. Self-drive and chauffeur options for pilgrims, families, and business travellers, plus reliable Makkah ↔ Jeddah intercity transport.",
};

const cities = [
  {
    id: "makkah",
    name: "Makkah",
    icon: Church,
    blurb:
      "The spiritual centre of the Kingdom — Umrah, Hajj, and ziyarat visits require careful, licensed transport.",
    services: ["With driver", "Airport transfer", "Ziyarat transport", "Intercity to Jeddah"],
    href: "/saudi-car-rental/makkah",
  },
  {
    id: "madinah",
    name: "Madinah",
    icon: Compass,
    blurb:
      "Masjid an-Nabawi visits, ziyarat of the historic sites, and family stays — Apex arranges licensed drivers who know the holy city.",
    services: ["With driver", "Ziyarat transport", "Family travel", "Airport pickup"],
    href: "/saudi-car-rental/madinah",
  },
  {
    id: "jeddah",
    name: "Jeddah",
    icon: Plane,
    blurb:
      "King Abdulaziz International Airport (JED) is the main gateway — pickups, hotel transfers, and intercity runs to Makkah.",
    services: ["Airport transfer", "Self-drive", "With driver", "Intercity to Makkah"],
    href: "/saudi-car-rental/jeddah",
  },
  {
    id: "riyadh",
    name: "Riyadh",
    icon: Building2,
    blurb:
      "The Kingdom&apos;s capital — corporate travel, family trips, and event transport across the city and to surrounding regions.",
    services: ["Self-drive", "With driver", "Airport transfer", "Business & events"],
    href: "/saudi-car-rental/riyadh",
  },
];

const serviceTypes = [
  {
    icon: Car,
    title: "Self-Drive",
    desc: "Independent travellers and residents who prefer to drive themselves. Category and confirm at enquiry.",
  },
  {
    icon: Users,
    title: "With Driver",
    desc: "A licensed, vetted chauffeur for Umrah logistics, business meetings, or family days out.",
  },
  {
    icon: Plane,
    title: "Airport Transfer",
    desc: "Pickup and drop-off at JED (Jeddah), MED (Madinah) and RUH (Riyadh). Schedule confirmed at enquiry.",
  },
  {
    icon: Route,
    title: "Intercity Travel",
    desc: "Makkah ↔ Jeddah, Madinah ↔ Jeddah, city-to-city runs for pilgrim groups and family travellers.",
  },
  {
    icon: Church,
    title: "Pilgrimage Transport",
    desc: "Ziyarat transport in and around Makkah and Madinah — coordinated with hotel and prayer times.",
  },
  {
    icon: Briefcase,
    title: "Business & Events",
    desc: "Corporate accounts, conferences, and event transport in Riyadh, Jeddah and beyond.",
  },
];

const bookingSteps = [
  {
    icon: MapPin,
    title: "Choose location",
    text: "Select Saudi Arabia, then your city — Makkah, Madinah, Jeddah, or Riyadh.",
  },
  {
    icon: Car,
    title: "Choose vehicle",
    text: "Pick a category (Sedan, SUV, Van) and decide: self-drive or with driver.",
  },
  {
    icon: Calendar,
    title: "Select dates",
    text: "Share pickup date, time, and approximate rental duration.",
  },
  {
    icon: CheckCircle2,
    title: "Submit request",
    text: "Send the short enquiry form — WhatsApp or request callback.",
  },
  {
    icon: BadgeCheck,
    title: "Confirmation",
    text: "Apex confirms availability, vehicle, partner assignment, and fare.",
  },
];

export default function SaudiCarRentalPage() {
  return (
    <>
      <PageHero
        eyebrow="Saudi Arabia Car Rental"
        title="Car rental across Saudi Arabia — Makkah, Madinah, Jeddah, Riyadh."
        subtitle="Self-drive and chauffeur options for pilgrims, families, and business travellers. Cities and fleet confirmed by Apex at enquiry time."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Car Rentals", href: "/pakistan-car-rental" },
          { label: "Saudi Arabia" },
        ]}
        primaryCta={{ label: "Send an Enquiry", href: "#enquire" }}
        secondaryCta={{ label: "View Cities", href: "#cities" }}
      />

      {/* CITY GRID */}
      <section id="cities" className="section bg-sand-100">
        <div className="container-page">
          <div className="mb-12 text-center">
            <div className="eyebrow mb-3 justify-center">Cities we serve</div>
            <h2 className="heading-lg mb-3">Pick a Saudi city to begin</h2>
            <p className="prose-body-lg mx-auto max-w-2xl">
              Each city has its own quirks — Makkah&apos;s restricted zones, Jeddah&apos;s airport
              timing, Madinah&apos;s ziyarat circuits. Apex coordinates the right partner for each.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.id} href={c.href} className="card group flex flex-col gap-3 p-6">
                  <div className="bg-gold-100 text-gold-600 group-hover:bg-gold-grad group-hover:text-navy-700 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-navy-600 text-xl font-semibold">{c.name}</h3>
                  <p className="text-ink-400 flex-1 text-sm leading-relaxed">{c.blurb}</p>
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {c.services.map((s) => (
                      <li
                        key={s}
                        className="text-navy-600 bg-navy-50 border-navy-100 rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="text-gold-500 group-hover:text-gold-600 mt-2 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2">
                    View {c.name} <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICE TYPES */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-12 text-center">
            <div className="eyebrow mb-3 justify-center">Service types</div>
            <h2 className="heading-lg mb-3">What Apex arranges in Saudi Arabia</h2>
            <p className="prose-body-lg mx-auto max-w-2xl">
              Self-drive and chauffeur services are operated through Apex&apos;s licensed partner
              network in each city. Specific make, model and fare are confirmed at enquiry — Saudi
              regulations and seasonal demand apply.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceTypes.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="card flex flex-col gap-3 p-6 lg:p-7">
                  <div className="bg-gold-100 text-gold-600 flex h-12 w-12 items-center justify-center rounded-xl">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-navy-600 text-xl font-semibold">{s.title}</h3>
                  <p className="text-ink-400 flex-1 text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAKKAH ↔ JEDDAH INTERCITY — PROMINENT */}
      <section id="intercity" className="section bg-navy-grad relative overflow-hidden text-white">
        <div className="grain absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container-page relative">
          <div className="max-w-3xl">
            <div className="eyebrow !text-gold-400 mb-3">Featured intercity service</div>
            <h2 className="heading-lg mb-3 text-white">
              Makkah to Jeddah · Jeddah to Makkah intercity transport
            </h2>
            <p className="text-lg leading-relaxed text-white/85">
              Reliable intercity transfers between the two holy cities for pilgrims and visitors.
              Operated by Apex&apos;s licensed partner network — confirmed at enquiry.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Makkah → Jeddah */}
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur lg:p-8">
              <div className="text-gold-400 mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Route size={16} /> Makkah → Jeddah
              </div>
              <h3 className="font-display mb-4 text-2xl font-semibold">Departure from Makkah</h3>

              <div className="mb-4">
                <div className="mb-2 text-xs font-semibold tracking-wider text-white/60 uppercase">
                  Typical use cases
                </div>
                <ul className="space-y-1.5 text-sm text-white/85">
                  <li className="flex gap-2">
                    <ChevronRight size={14} className="text-gold-400 mt-1 shrink-0" /> Pilgrims
                    returning after Umrah with a flight from Jeddah (JED)
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight size={14} className="text-gold-400 mt-1 shrink-0" /> Family groups
                    heading to Jeddah for a hotel or sea-side stay
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight size={14} className="text-gold-400 mt-1 shrink-0" /> Business
                    travellers flying out of JED after a Makkah stay
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <div className="mb-2 text-xs font-semibold tracking-wider text-white/60 uppercase">
                  Vehicle options
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Sedan", "SUV", "Van"].map((v) => (
                    <span
                      key={v}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-gold-400 mb-2 text-xs font-semibold tracking-wider uppercase">
                    Included
                  </div>
                  <ul className="space-y-1.5 text-sm text-white/85">
                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="text-gold-400 mt-0.5 shrink-0" /> Licensed
                      driver
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="text-gold-400 mt-0.5 shrink-0" /> Pickup
                      from Makkah hotel or designated point
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="text-gold-400 mt-0.5 shrink-0" /> Drop-off
                      at Jeddah hotel or JED airport
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold tracking-wider text-white/60 uppercase">
                    Not included
                  </div>
                  <ul className="space-y-1.5 text-sm text-white/75">
                    <li className="flex gap-2">— Meals &amp; stops en route</li>
                    <li className="flex gap-2">— Personal &amp; luggage insurance</li>
                    <li className="flex gap-2">
                      — Makkah / Jeddah city permits (handled by driver)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
                <div className="text-sm text-white/70">Rate</div>
                <div className="badge-gold">On request</div>
              </div>
            </div>

            {/* Jeddah → Makkah */}
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur lg:p-8">
              <div className="text-gold-400 mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Route size={16} className="-scale-x-100" /> Jeddah → Makkah
              </div>
              <h3 className="font-display mb-4 text-2xl font-semibold">Arrival into Makkah</h3>

              <div className="mb-4">
                <div className="mb-2 text-xs font-semibold tracking-wider text-white/60 uppercase">
                  Typical use cases
                </div>
                <ul className="space-y-1.5 text-sm text-white/85">
                  <li className="flex gap-2">
                    <ChevronRight size={14} className="text-gold-400 mt-1 shrink-0" /> Pilgrims
                    arriving at JED and proceeding straight to Makkah for Umrah
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight size={14} className="text-gold-400 mt-1 shrink-0" /> Families
                    landing late evening with luggage and elders
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight size={14} className="text-gold-400 mt-1 shrink-0" /> Hajj period
                    arrivals routed via Jeddah to the holy sites
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <div className="mb-2 text-xs font-semibold tracking-wider text-white/60 uppercase">
                  Vehicle options
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Sedan", "SUV", "Van"].map((v) => (
                    <span
                      key={v}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-gold-400 mb-2 text-xs font-semibold tracking-wider uppercase">
                    Included
                  </div>
                  <ul className="space-y-1.5 text-sm text-white/85">
                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="text-gold-400 mt-0.5 shrink-0" /> JED
                      airport meet &amp; greet
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="text-gold-400 mt-0.5 shrink-0" /> Licensed
                      driver, Makkah-permitted vehicle
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 size={14} className="text-gold-400 mt-0.5 shrink-0" /> Drop-off
                      at Makkah hotel or designated zone
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold tracking-wider text-white/60 uppercase">
                    Not included
                  </div>
                  <ul className="space-y-1.5 text-sm text-white/75">
                    <li className="flex gap-2">— Stops for food / shopping en route</li>
                    <li className="flex gap-2">— Personal &amp; luggage insurance</li>
                    <li className="flex gap-2">— Umrah visa processing</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
                <div className="text-sm text-white/70">Rate</div>
                <div className="badge-gold">On request</div>
              </div>
            </div>
          </div>

          {/* Cross-link CTAs */}
          <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-white/15 bg-white/5 p-6 md:flex-row md:items-center md:justify-between lg:p-7">
            <div>
              <h3 className="font-display mb-1 text-xl font-semibold text-white">
                Plan the whole pilgrimage trip
              </h3>
              <p className="max-w-2xl text-sm text-white/80">
                Combine Makkah ↔ Jeddah transport with an Umrah package or a fully customised
                itinerary — including Makkah, Madinah and ziyarat.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/umrah-packages" className="btn-primary">
                Umrah Packages <ArrowRight size={16} />
              </Link>
              <Link href="/custom-package" className="btn-secondary">
                Custom Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW BOOKING WORKS */}
      <section className="section bg-sand-100">
        <div className="container-page">
          <div className="mb-12 text-center">
            <div className="eyebrow mb-3 justify-center">Booking workflow</div>
            <h2 className="heading-lg mb-3">How booking works with Apex</h2>
            <p className="prose-body-lg mx-auto max-w-2xl">
              Apex confirms every detail before confirmation — vehicle category, partner city,
              pickup logistics, and fare — because Saudi regulations and pilgrim schedules leave no
              room for guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {bookingSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="card p-5">
                  <div className="text-gold-500 mb-3 text-xs font-bold tracking-wider">
                    STEP {i + 1}
                  </div>
                  <div className="bg-gold-100 text-gold-600 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display text-navy-600 mb-1 text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-ink-400 text-sm leading-relaxed">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-sand-200 border-y bg-white">
        <div className="container-page flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="text-ink-500 flex items-center gap-3">
            <div className="bg-navy-50 text-navy-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <ShieldCheck size={20} />
            </div>
            <p className="text-sm leading-relaxed">
              Cities and rates confirmed by Apex at enquiry time.{" "}
              <span className="text-navy-600 font-semibold">Saudi regulations apply</span> —
              licences, permits, and seasonal availability are handled by Apex.
            </p>
          </div>
          <div className="text-ink-400 flex items-center gap-2 text-sm">
            <Clock size={16} className="text-gold-500" />
            Typical response within a few hours, in-sha-Allah.
          </div>
        </div>
      </section>

      {/* ENQUIRE CTA */}
      <section id="enquire" className="section bg-sand-grad">
        <div className="container-narrow text-center">
          <div className="eyebrow mb-3 justify-center">Send an enquiry</div>
          <h2 className="heading-lg mb-4">Tell Apex where and when</h2>
          <p className="prose-body-lg mx-auto mb-8 max-w-2xl">
            Whether it&apos;s a self-drive week in Riyadh, a Hajj-season airport pickup at JED, or a
            return Makkah → Jeddah transfer after Umrah — Apex will reply with options and a
            confirmed rate.
          </p>
          <div className="flex justify-center">
            <EnquireButton
              mode="car"
              presetCountry="Saudi Arabia"
              label="Enquire about Saudi car rental"
              openOnMount
            />
          </div>
        </div>
      </section>
    </>
  );
}
