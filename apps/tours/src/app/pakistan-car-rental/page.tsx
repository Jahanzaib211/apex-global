import Link from "next/link";
import {
  Car,
  Plane,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  BadgeCheck,
  Route,
  Phone,
  Award,
  KeyRound,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Pakistan Car Rental — With Driver or Self-Drive",
  description:
    "Apex Global Tours & Travels offers car rental across Pakistan — airport transfers, intercity, corporate and family travel with driver or self-drive. Cities and fleet confirmed at enquiry.",
};

const included = [
  {
    icon: Users,
    title: "With Driver",
    description:
      "Sit back and travel. Apex assigns a vetted chauffeur for airport runs, intercity trips and full-day bookings.",
  },
  {
    icon: KeyRound,
    title: "Self-Drive",
    description:
      "Prefer the wheel? Pick up a clean, inspected vehicle and travel on your own schedule.",
  },
  {
    icon: Plane,
    title: "Airport Transfers",
    description:
      "Reliable pickup and drop-off at all major Pakistan airports with meet-and-greet on request.",
  },
  {
    icon: Briefcase,
    title: "Corporate Travel",
    description:
      "Daily, weekly or project-based mobility for executives, teams and visiting delegations.",
  },
];

const useCases = [
  {
    icon: Users,
    title: "Family Travel",
    description: "Comfortable, spacious vehicles for weddings, holidays and reunions.",
  },
  {
    icon: Route,
    title: "Intercity",
    description: "One-way or return journeys between major cities, planned around your schedule.",
  },
  {
    icon: Briefcase,
    title: "Business",
    description: "Punctual executive transport for meetings, site visits and client hosting.",
  },
  {
    icon: Calendar,
    title: "Events",
    description: "Coordinated transport for conferences, sports fixtures and private events.",
  },
  {
    icon: MapPin,
    title: "Tourism",
    description: "Hill stations, heritage sites and northern routes with experienced drivers.",
  },
  {
    icon: Award,
    title: "Executive",
    description: "Premium cars and trained chauffeurs for VIP movement and delegations.",
  },
];

const steps = [
  {
    icon: Phone,
    title: "Enquire",
    description: "Share your dates, pickup city, passengers and the kind of trip you have in mind.",
  },
  {
    icon: BadgeCheck,
    title: "Confirm",
    description: "Apex confirms the vehicle category, driver or self-drive option and the booking.",
  },
  {
    icon: Car,
    title: "Travel",
    description: "Your vehicle arrives ready — clean, fuelled and on time. We handle the road.",
  },
  {
    icon: ShieldCheck,
    title: "Support",
    description:
      "Our team stays reachable throughout your trip for changes, extensions or assistance.",
  },
];

export default function PakistanCarRentalPage() {
  return (
    <>
      <PageHero
        eyebrow="Pakistan Car Rental"
        title="Car rental across Pakistan — with driver or self-drive."
        subtitle="Airport transfers, intercity travel, corporate and family trips. Cities and fleet confirmed by Apex at enquiry time."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Car Rentals", href: "/pakistan-car-rental" },
          { label: "Pakistan" },
        ]}
      />

      {/* What's included */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3 justify-center">What&apos;s included</div>
            <h2 className="heading-lg">One service, four ways to move.</h2>
            <p className="prose-body mt-3">
              Whether you want a chauffeur at the wheel or you prefer driving yourself, Apex
              organises the right vehicle for the right trip.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {included.map((item) => (
              <div key={item.title} className="card p-6">
                <div className="bg-gold-100 text-gold-600 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <item.icon size={24} />
                </div>
                <h3 className="font-display text-navy-600 mb-2 text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="text-ink-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section bg-sand-100">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3 justify-center">Use cases</div>
            <h2 className="heading-lg">Built for the trips Pakistan actually takes.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((u) => (
              <div key={u.title} className="card p-6">
                <div className="bg-navy-50 text-navy-600 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <u.icon size={22} />
                </div>
                <h3 className="font-display text-navy-600 mb-1.5 text-lg font-semibold">
                  {u.title}
                </h3>
                <p className="text-ink-400 text-sm leading-relaxed">{u.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3 justify-center">How it works</div>
            <h2 className="heading-lg">A simple, four-step journey.</h2>
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

      {/* Trust strip */}
      <section className="section-tight bg-sand-100 border-sand-200 border-y">
        <div className="container-page">
          <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row md:text-left">
            <div className="bg-navy-600 text-gold-400 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
              <ShieldCheck size={22} />
            </div>
            <p className="text-navy-600 text-lg font-semibold">
              Cities and fleet confirmed by Apex at enquiry time.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-sell CTA */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="eyebrow mb-3 justify-center">Also available</div>
            <h2 className="heading-lg">Travel further with Apex.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Link href="/saudi-car-rental" className="card group flex flex-col p-7">
              <span className="badge-navy mb-3 self-start">Cross-border</span>
              <h3 className="font-display text-navy-600 mb-2 text-2xl font-semibold">
                Saudi Arabia car rental
              </h3>
              <p className="text-ink-400 mb-5 flex-1 leading-relaxed">
                Makkah, Madinah, Jeddah and Riyadh — chauffeur and self-drive options for Umrah,
                Hajj and business travel.
              </p>
              <span className="text-gold-500 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2">
                Explore Saudi rentals <ArrowRight size={14} />
              </span>
            </Link>
            <Link href="/custom-package" className="card group flex flex-col p-7">
              <span className="badge-navy mb-3 self-start">Tailor-made</span>
              <h3 className="font-display text-navy-600 mb-2 text-2xl font-semibold">
                Custom package
              </h3>
              <p className="text-ink-400 mb-5 flex-1 leading-relaxed">
                Combine car rental with Umrah, Hajj, tours or a multi-city itinerary — planned
                exactly the way you want it.
              </p>
              <span className="text-gold-500 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2">
                Build a custom package <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-navy-grad grain text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3 justify-center">Ready when you are</div>
          <h2 className="heading-lg mb-4 !text-white">Tell us where you need to go.</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/85">
            Share your trip details and Apex will confirm cities, vehicles and pricing for your
            specific request.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <EnquireButton mode="car" presetCountry="Pakistan" label="Enquire about car rental" />
            <Link href="/vehicles" className="btn-secondary">
              View vehicle fleet <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-gold-400" /> No commitment to enquire
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
