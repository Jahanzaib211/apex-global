import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Compass,
  MessageCircle,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { EnquireButton } from "@/components/enquire-button";
import { ServiceCard } from "@/components/service-card";
import { BRAND, WHATSAPP_LINK } from "@/lib/brand";

const heroTiles = [
  { label: "Pakistan · Self-Drive", className: "bg-navy-500" },
  { label: "Saudi Arabia · Chauffeur", className: "bg-royal-500" },
  { label: "Hajj · Group Package", className: "bg-gold-500" },
  { label: "Umrah · Custom Journey", className: "bg-sand-300 text-navy-700" },
];

const pakistanCities = [
  ["Lahore", "/pakistan-car-rental"],
  ["Karachi", "/pakistan-car-rental"],
  ["Islamabad", "/pakistan-car-rental"],
  ["Rawalpindi", "/pakistan-car-rental"],
  ["Peshawar", "/pakistan-car-rental"],
  ["Multan", "/pakistan-car-rental"],
];

const saudiCities = [
  ["Makkah", "/saudi-car-rental/makkah"],
  ["Madinah", "/saudi-car-rental/madinah"],
  ["Jeddah", "/saudi-car-rental/jeddah"],
  ["Riyadh", "/saudi-car-rental/riyadh"],
];

const clarityColumns = [
  {
    title: "Included",
    items: [
      "Accommodation as per package tier",
      "Transportation between cities as described",
      "Support details stated in the itinerary",
    ],
  },
  {
    title: "Not Included",
    items: ["Personal expenses", "Travel insurance unless specified", "Meals outside the package"],
  },
  {
    title: "Optional",
    items: ["Room upgrades", "Additional ziyarat", "Premium transport"],
  },
  {
    title: "Important Conditions",
    items: [
      "Booking conditions apply",
      "Visa requirements must be confirmed",
      "Itinerary subject to operational adjustments",
    ],
  },
];

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Enquire",
    description: "Send your requirements via WhatsApp or the enquiry form",
  },
  {
    number: "02",
    icon: CheckCircle2,
    title: "Confirm",
    description: "Apex confirms cities, dates, vehicles, hotel tier and inclusions",
  },
  {
    number: "03",
    icon: Compass,
    title: "Travel",
    description: "Enjoy your journey with on-ground support",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Support",
    description: "Continued support before, during and after travel",
  },
];

const groupCompanies = [
  ["Tech Solution", "SaaS, IT, AI, cloud, cybersecurity"],
  ["Outsourcing", "BPO, staffing, customer support, sales"],
  ["Tours & Travels", "Travel, mobility, pilgrimage"],
  ["Holdings", "Real estate marketing & development"],
];

// Renders a span, not an anchor — every call site already nests it inside a
// <Link>, which is what navigates. It took an `href` it never used; dropping
// the prop keeps the signature honest about what this component does.
function ArrowLink({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3 ${light ? "text-gold-300" : "text-gold-600"}`}
    >
      {children} <ArrowRight size={15} />
    </span>
  );
}

function CityChips({ cities }: { cities: string[][] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {cities.map(([city, href]) => (
        <Link
          key={city}
          href={href ?? "#"}
          className="badge-navy hover:bg-navy-600 transition-colors hover:text-white"
        >
          {city}
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* 1. Hero */}
      <section className="bg-navy-grad grain relative overflow-hidden">
        <div className="container-page relative grid items-center gap-12 py-20 text-white md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-32">
          <div className="animate-fade-up">
            <div className="eyebrow !text-gold-300 mb-5">Welcome to {BRAND.name}</div>
            <h1 className="heading-xl max-w-2xl !text-white">{BRAND.promise}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              Car rental across Pakistan and Saudi Arabia — plus carefully organized Hajj and Umrah
              packages. Travel with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/custom-package" className="btn-primary">
                Plan Your Journey <ArrowRight size={16} />
              </Link>
              <a href="#services" className="btn-secondary">
                Explore Services <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div className="animate-fade-up [animation-delay:150ms]">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {heroTiles.map((tile) => (
                <div
                  key={tile.label}
                  className={`${tile.className} relative flex min-h-36 items-end overflow-hidden rounded-2xl p-4 md:min-h-48 md:p-5`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="relative text-xs font-semibold tracking-wide md:text-sm">
                    {tile.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-white/55">
              (Image placeholders — real photography added by Apex)
            </p>
          </div>
        </div>
        {/* Scroll-to-explore — anchors to the Trust strip below. The fixed
            site header is accounted for by `scroll-padding-top` on the html
            root in globals.css. */}
        <a
          href="#tour-trust"
          aria-label="Scroll to explore the rest of the page"
          className="hover:text-gold-300 focus-visible:ring-gold-300 focus-visible:ring-offset-navy-700 absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.18em] text-white/55 uppercase transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span>Scroll to explore</span>
          <span aria-hidden className="bg-gold-300/70 h-10 w-px" />
        </a>
      </section>

      {/* 2. Trust strip */}
      <section id="tour-trust" className="border-sand-200 scroll-mt-24 border-b bg-white">
        <div className="container-page text-navy-600 flex flex-wrap justify-center gap-x-5 gap-y-3 py-5 text-center text-xs font-semibold tracking-wide md:text-sm">
          <span>Reliable Car Rental</span>
          <span className="text-gold-400">·</span>
          <span>Carefully Organized Packages</span>
          <span className="text-gold-400">·</span>
          <span>Transparent Inclusions</span>
          <span className="text-gold-400">·</span>
          <span>Dedicated Travel Expert</span>
          <span className="text-gold-400">·</span>
          <span>WhatsApp Support</span>
        </div>
      </section>

      {/* 3. Service pillars */}
      <section id="services" className="section bg-sand-50 scroll-mt-24">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-3">One trusted point of contact</div>
            <h2 className="heading-lg">
              Travel, mobility and pilgrimage — thoughtfully connected.
            </h2>
            <div className="divider-gold mt-5" />
          </div>
          <div className="grid gap-5 md:grid-cols-3 lg:gap-7">
            <div className="bg-navy-50 rounded-2xl p-1">
              <ServiceCard
                icon={Car}
                title="Car Rental"
                description="Pakistan and Saudi Arabia. With driver or self-drive. Airport, intercity, family and business."
                href="/pakistan-car-rental"
              />
            </div>
            <div className="bg-gold-50 rounded-2xl p-1">
              <ServiceCard
                icon={Sparkles}
                title="Hajj & Umrah"
                description="Group, custom, and family pilgrimage packages with transparent inclusions."
                href="/hajj-umrah"
              />
            </div>
            <div className="bg-sand-100 rounded-2xl p-1">
              <ServiceCard
                icon={Plane}
                title="Pilgrimage Transport"
                description="Makkah ↔ Jeddah intercity transport and airport transfers across Saudi Arabia."
                href="/saudi-car-rental"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Destinations preview */}
      <section className="section bg-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="eyebrow mb-3">Destinations</div>
            <h2 className="heading-lg">Where we operate</h2>
            <p className="prose-body-lg mt-4">
              Cities and fleet confirmed by Apex at enquiry time.
            </p>
            <div className="border-sand-200 bg-sand-50 mt-8 flex min-h-64 items-center justify-center rounded-2xl border p-8 text-center">
              <div>
                <MapPin className="text-gold-500 mx-auto mb-3" size={32} />
                <p className="font-display text-navy-600 text-lg">Map to be added by Apex</p>
                <p className="text-ink-400 mt-2 text-xs">
                  Operational coverage is confirmed at enquiry.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="heading-md mb-4 !text-2xl">Pakistan</h3>
              <CityChips cities={pakistanCities} />
            </div>
            <div>
              <h3 className="heading-md mb-4 !text-2xl">Saudi Arabia</h3>
              <CityChips cities={saudiCities} />
            </div>
            <Link
              href="/destinations"
              className="text-navy-600 hover:text-gold-600 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Explore destinations <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Makkah ↔ Jeddah intercity feature */}
      <section className="bg-navy-grad grain relative overflow-hidden text-white">
        <div className="container-page section relative">
          <div className="max-w-3xl">
            <div className="eyebrow !text-gold-300 mb-3">Saudi Arabia · Intercity transport</div>
            <h2 className="heading-lg !text-white">Makkah to Jeddah. Jeddah to Makkah.</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              Reliable intercity transport between the two holy cities — operated by Apex&apos;s
              licensed partner network, confirmed at enquiry.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              [
                "Makkah → Jeddah",
                ["Pilgrims finishing Umrah", "Visitors extending to Jeddah", "Group transfers"],
              ],
              ["Jeddah → Makkah", ["Arrival transfers", "Returning pilgrims", "Group check-ins"]],
            ].map(([title, uses]) => (
              <div
                key={title as string}
                className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm md:p-8"
              >
                <h3 className="font-display text-2xl text-white">{title as string}</h3>
                <p className="eyebrow !text-gold-300 mt-6 mb-3">Common use cases</p>
                <ul className="space-y-2 text-sm text-white/80">
                  {(uses as string[]).map((use) => (
                    <li key={use} className="flex gap-2">
                      <CheckCircle2 size={16} className="text-gold-300 mt-0.5 shrink-0" />
                      {use}
                    </li>
                  ))}
                </ul>
                <p className="eyebrow !text-gold-300 mt-6 mb-3">Vehicle options</p>
                <div className="flex flex-wrap gap-2">
                  <span className="badge-gold">Sedan</span>
                  <span className="badge-gold">SUV</span>
                  <span className="badge-gold">Van</span>
                </div>
                <p className="mt-6 text-sm font-semibold text-white">Rate on request</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/saudi-car-rental" className="btn-primary">
              Request a transfer <ArrowRight size={16} />
            </Link>
            <Link href="/umrah-packages" className="btn-secondary">
              View Umrah packages <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Hajj & Umrah preview */}
      <section className="section bg-sand-50">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="eyebrow mb-3">Pilgrimage journeys</div>
            <h2 className="heading-lg">Hajj & Umrah packages</h2>
            <p className="prose-body-lg mt-4">
              Group, custom, and family journeys — built around your dates, group size, and
              accommodation preferences.
            </p>
            <ul className="text-ink-500 mt-7 space-y-3 text-sm">
              {["Travel", "Accommodation", "Transportation", "On-ground Support"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-gold-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/hajj-umrah" className="btn-ghost mt-8">
              View packages <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Umrah Packages", "Group, custom, family, individual", "/umrah-packages", Sparkles],
              ["Hajj Packages", "Group and custom journeys", "/hajj-packages", Award],
              ["Custom Package", "Build around your needs", "/custom-package", Calendar],
              ["Group Package", "Families, communities, organizations", "/group-package", Users],
            ].map(([title, desc, href, Icon]) => (
              <Link key={title as string} href={href as string} className="group card p-6">
                <div className="bg-gold-100 text-gold-600 mb-5 flex h-10 w-10 items-center justify-center rounded-xl">
                  {Icon && <Icon size={20} />}
                </div>
                <h3 className="font-display text-navy-600 text-xl font-semibold">
                  {title as string}
                </h3>
                <p className="text-ink-400 mt-2 text-sm">{desc as string}</p>
                <ArrowLink>Explore</ArrowLink>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Transparency table */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="eyebrow mb-3">Clarity before commitment</div>
            <h2 className="heading-lg">Transparent by design.</h2>
            <p className="prose-body mt-4">
              Every package is presented with the same four-part clarity.
            </p>
          </div>
          <div className="border-sand-200 bg-sand-200 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4">
            {clarityColumns.map((column) => (
              <div key={column.title} className="bg-sand-50 p-5 md:p-6">
                <h3 className="font-display text-navy-600 text-lg font-semibold">{column.title}</h3>
                <ul className="text-ink-400 mt-5 space-y-3 text-sm">
                  {column.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 size={15} className="text-gold-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. How it works */}
      <section className="section-tight bg-navy-50">
        <div className="container-page">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-3">Simple, considered, personal</div>
            <h2 className="heading-lg">How it works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div key={number} className="relative text-center md:text-left">
                <div className="bg-gold-400 text-navy-700 shadow-gold mx-auto flex h-12 w-12 items-center justify-center rounded-full md:mx-0">
                  <Icon size={22} />
                </div>
                <p className="text-gold-600 mt-5 text-xs font-bold tracking-widest">{number}</p>
                <h3 className="font-display text-navy-600 mt-1 text-xl font-semibold">{title}</h3>
                <p className="text-ink-400 mt-2 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. About / Group context strip */}
      <section className="section bg-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="eyebrow mb-3">The wider group</div>
            <h2 className="heading-lg">Part of Apex Group of Companies</h2>
            <p className="prose-body-lg mt-5">
              Apex Global Tours & Travels is one of four subsidiaries under Apex Group of Companies,
              alongside Apex Global Tech Solution, Apex Global Outsourcing, and Apex Holdings.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {groupCompanies.map(([name, desc]) => (
              <div
                key={name}
                className={`rounded-2xl border p-5 ${name === "Tours & Travels" ? "bg-navy-600 border-navy-600 text-white" : "bg-sand-50 border-sand-200"}`}
              >
                <Building2
                  size={20}
                  className={name === "Tours & Travels" ? "text-gold-300" : "text-gold-500"}
                />
                <h3
                  className={`font-display mt-4 text-lg font-semibold ${name === "Tours & Travels" ? "text-white" : "text-navy-600"}`}
                >
                  {name}
                </h3>
                <p
                  className={`mt-2 text-xs leading-relaxed ${name === "Tours & Travels" ? "text-white/70" : "text-ink-400"}`}
                >
                  {desc}
                </p>
                {name === "Tours & Travels" && (
                  <span className="badge-gold mt-4">Current site</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="bg-navy-grad grain relative overflow-hidden text-white">
        <div className="container-narrow section relative text-center">
          <div className="eyebrow !text-gold-300 mb-4">Your next step</div>
          <h2 className="heading-lg !text-white">Ready to plan your journey?</h2>
          <p className="mt-4 text-lg text-white/75">
            Talk to a travel expert today — by WhatsApp, phone or enquiry form.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <EnquireButton mode="general" label="Plan Your Journey" />
            <a
              href={WHATSAPP_LINK("Hello Apex, I would like to plan my journey.")}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              <MessageCircle size={17} /> WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* 11. Closing line */}
      <footer className="bg-sand-50">
        <div className="container-page py-8 text-center">
          <p className="text-ink-400 text-xs leading-relaxed md:text-sm">
            {BRAND.legal} — {BRAND.tagline}. Cities, fleet, hotels, packages and rates are confirmed
            by Apex at enquiry time.
          </p>
        </div>
      </footer>
    </main>
  );
}
