import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ListChecks,
  Users,
  BookOpen,
  Award,
  Phone,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ServiceCard } from "@/components/service-card";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Hajj & Umrah Packages",
  description:
    "Carefully organized Hajj and Umrah packages — group, custom, and family journeys with transparent inclusions and on-ground support.",
};

const PACKAGES = [
  {
    icon: Compass,
    title: "Umrah Packages",
    description:
      "Flexible Umrah packages with transparent inclusions, multiple durations, and accommodation tiers to suit your budget.",
    href: "/umrah-packages",
    badge: "Popular",
  },
  {
    icon: BookOpen,
    title: "Hajj Packages",
    description:
      "Carefully organized Hajj journeys covering visa, accommodation, and the days of Hajj with full coordination support.",
    href: "/hajj-packages",
  },
  {
    icon: Sparkles,
    title: "Custom Package",
    description:
      "Build a pilgrimage around your travelers, dates, hotel preference, and budget — designed by our team for you.",
    href: "/custom-package",
  },
  {
    icon: Users,
    title: "Group Package",
    description:
      "For families, communities, and organizations traveling together — with group coordination and dedicated support.",
    href: "/group-package",
  },
];

const TRANSPARENCY = [
  {
    title: "Included",
    icon: CheckCircle2,
    color: "text-[#1F8A4C] bg-[#E8F6EE] border-[#C9E8D5]",
    items: [
      "Accommodation in Makkah and Madinah as per booked tier",
      "Visa processing support (where applicable)",
      "Return air ticket (confirmed at booking)",
      "Ground transportation between cities and key sites",
      "On-ground support from our local team",
    ],
  },
  {
    title: "Not Included",
    icon: ShieldCheck,
    color: "text-navy-600 bg-navy-50 border-navy-100",
    items: [
      "Personal expenses (shopping, laundry, calls)",
      "Meals unless explicitly stated in your package",
      "Travel insurance (recommended but not included)",
      "Vaccination or medical test costs",
      "Any service not specifically listed in your confirmation",
    ],
  },
  {
    title: "Optional",
    icon: Sparkles,
    color: "text-gold-700 bg-gold-50 border-gold-200",
    items: [
      "Ziaraat (religious site visits) and guided tours",
      "Upgraded hotel tier or room category",
      "Additional nights before or after the main package",
      "Special meals (veg, halal premium, dietary options)",
      "Travel insurance add-on",
    ],
  },
  {
    title: "Important Conditions",
    icon: ListChecks,
    color: "text-ink-500 bg-ink-50 border-ink-100",
    items: [
      "Visa rules change frequently — confirm with the relevant embassy before booking",
      "Package details, hotels and flights are confirmed at the time of booking",
      "Prices vary by season, group size, and hotel tier",
      "Standard cancellation policy applies (see terms at enquiry)",
      "Valid passport with required validity is the guest&apos;s responsibility",
    ],
  },
];

const TRUST = [
  {
    icon: ListChecks,
    title: "Carefully Organized",
    description:
      "Every itinerary is reviewed by our team before confirmation. We focus on logistics so you can focus on worship.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Inclusions",
    description:
      "Every package lists what is included, not included, and optional — no surprise charges at confirmation.",
  },
  {
    icon: Award,
    title: "Local Transport Network",
    description:
      "Our fleet and partner network in Pakistan and Saudi Arabia support airport, intercity, and Ziyarat transfers.",
  },
  {
    icon: Phone,
    title: "Customer-First Support",
    description:
      "A real person from the Apex team is reachable throughout your journey — before, during, and after travel.",
  },
];

export default function HajjUmrahOverviewPage() {
  return (
    <>
      <PageHero
        eyebrow="Hajj & Umrah"
        title="Plan your pilgrimage with carefully organized travel packages."
        subtitle="Group, custom, and family journeys — built around your dates, group size, and accommodation preferences."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hajj & Umrah" }]}
      />

      {/* Package categories */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3">Choose your journey</div>
            <h2 className="heading-lg mb-3">Pilgrimage packages for every traveler</h2>
            <p className="prose-body">
              Whether you are traveling solo, with family, or arranging a large group, we organize
              the logistics so your focus stays on the pilgrimage itself.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map((p) => (
              <ServiceCard
                key={p.href}
                icon={p.icon}
                title={p.title}
                description={p.description}
                href={p.href}
                badge={p.badge}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Transparency block */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-10 max-w-3xl">
            <div className="eyebrow mb-3">Transparency built in</div>
            <h2 className="heading-lg mb-3">What every Apex pilgrimage package tells you</h2>
            <p className="prose-body-lg">
              We do not list attractive prices and hide the rest. Every package is shared with a
              clear breakdown of what is included, what is not, what is optional, and the conditions
              that apply. If anything is unclear, ask us before you confirm.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {TRANSPARENCY.map((col) => {
              const Icon = col.icon;
              return (
                <div key={col.title} className="card p-6 lg:p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${col.color}`}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="font-display text-navy-600 text-xl font-semibold">
                      {col.title}
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {col.items.map((item) => (
                      <li key={item} className="text-ink-500 flex gap-2.5 text-sm leading-relaxed">
                        <span className="text-gold-500 mt-1.5 flex-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="border-sand-200 bg-sand-100 text-ink-500 mt-8 rounded-2xl border p-5 text-sm">
            <strong className="text-navy-600">Please note:</strong> inclusions above are
            illustrative. Your final confirmation will list exactly what is included in your
            specific package, hotel, and date.
          </div>
        </div>
      </section>

      {/* Why book with Apex */}
      <section className="section-tight bg-sand-grad">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="eyebrow mb-3">Why book with Apex</div>
            <h2 className="heading-lg">A responsible promise for every pilgrimage</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="card p-6 text-center">
                  <div className="bg-gold-100 text-gold-600 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display text-navy-600 mb-2 text-lg font-semibold">
                    {t.title}
                  </h3>
                  <p className="text-ink-400 text-sm leading-relaxed">{t.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-navy-grad text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3">Ready to plan?</div>
          <h2 className="heading-lg mb-4 text-white">Tell us your dates and travelers</h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            Share a few details and our team will share an outline itinerary and inclusions for your
            pilgrimage. No obligation, no hidden charges.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <EnquireButton mode="pilgrimage" label="Plan My Pilgrimage" />
            <Link href="/umrah-packages" className="btn-secondary">
              Browse Umrah options <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
