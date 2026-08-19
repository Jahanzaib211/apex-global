import Link from "next/link";
import {
  Users,
  Sparkles,
  BookOpen,
  User,
  Compass,
  Crown,
  Calendar,
  Building2,
  Plane,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Umrah Packages",
  description:
    "Flexible, transparent Umrah packages — group, custom, family, economy, and premium — plus a private airport-transfer option for travellers arranging their own stay.",
};

const CATEGORIES = [
  {
    icon: Users,
    title: "Group Umrah",
    description: "Travel with fellow pilgrims on shared dates and accommodation.",
    duration: "7–14 nights",
    departure: "Major Pakistan cities — admin to set",
    hotel: "Economy / Standard / Premium / Luxury — selected by guest",
    transport: "Group transfers (private upgrade available)",
  },
  {
    icon: Sparkles,
    title: "Custom Umrah",
    description: "Build your own itinerary with full flexibility on dates and stay.",
    duration: "Any duration — on request",
    departure: "Any city — on request",
    hotel: "Any tier — guest to choose",
    transport: "Private or shared — guest to choose",
  },
  {
    icon: BookOpen,
    title: "Family Umrah",
    description: "Family-friendly arrangements with adjoining rooms and flexible meals.",
    duration: "7–14 nights",
    departure: "Major Pakistan cities — admin to set",
    hotel: "Standard / Premium commonly chosen",
    transport: "Private family vehicle",
  },
  {
    icon: User,
    title: "Private Airport Transfer",
    description:
      "For travellers arranging their own Umrah — we handle the airport-to-hotel and return transfers in both Pakistan and Saudi Arabia, with private vehicles and meet-and-greet.",
    duration: "One-way or return",
    departure: "Any Pakistan or Saudi city",
    hotel: "N/A — transfer-only",
    transport: "Private sedans, SUVs, and vans on request",
  },
  {
    icon: Compass,
    title: "Economy Umrah",
    description: "Value-focused packages with comfortable, no-frills arrangements.",
    duration: "7–10 nights",
    departure: "Major Pakistan cities — admin to set",
    hotel: "Economy tier",
    transport: "Shared group transfers",
  },
  {
    icon: Crown,
    title: "Premium Umrah",
    description: "Higher-tier hotels, private transfers, and concierge-level support.",
    duration: "7–14 nights",
    departure: "Any city — on request",
    hotel: "Premium / Luxury tier",
    transport: "Private vehicle with dedicated driver",
  },
];

const TRANSPARENCY = [
  {
    title: "Included",
    color: "text-[#1F8A4C] bg-[#E8F6EE] border-[#C9E8D5]",
    items: [
      "Return air ticket (economy class unless upgraded)",
      "Hotel accommodation in Makkah and Madinah as per booked tier",
      "Umrah visa processing support",
      "Ground transportation (airport, intercity, key sites)",
      "On-ground support from Apex team",
    ],
  },
  {
    title: "Not Included",
    color: "text-navy-600 bg-navy-50 border-navy-100",
    items: [
      "Personal expenses and shopping",
      "Meals unless explicitly included in your package",
      "Travel insurance",
      "Medical or vaccination costs",
      "Anything not specifically listed in your booking confirmation",
    ],
  },
  {
    title: "Optional",
    color: "text-gold-700 bg-gold-50 border-gold-200",
    items: [
      "Ziaraat (religious site visits) with guided support",
      "Room upgrades (higher floor, haram view, suite)",
      "Additional nights before or after the main package",
      "Special meals (dietary, kid-friendly)",
      "Travel insurance add-on",
    ],
  },
  {
    title: "Conditions",
    color: "text-ink-500 bg-ink-50 border-ink-100",
    items: [
      "Visa requirements change — confirm with the relevant embassy",
      "Final hotels and flights confirmed at booking",
      "Pricing varies by season, group size, and tier",
      "Standard cancellation policy applies",
      "Valid passport and required documents are the guest&apos;s responsibility",
    ],
  },
];

const STEPS = [
  {
    n: "01",
    title: "Share your requirements",
    text: "Tell us travelers, dates, preferred hotel tier, and departure city.",
  },
  {
    n: "02",
    title: "Receive a proposal",
    text: "Our team sends an outline itinerary with inclusions and indicative pricing.",
  },
  {
    n: "03",
    title: "Confirm with advance",
    text: "Approve the proposal and pay the advance to block hotels and flights.",
  },
  {
    n: "04",
    title: "Visa and documents",
    text: "We support visa processing and share a checklist of required documents.",
  },
  {
    n: "05",
    title: "Travel with support",
    text: "On-ground team is reachable throughout your journey until you return home.",
  },
];

const FAQS = [
  {
    q: "How long is a typical Umrah package?",
    a: "Packages commonly range from 7 to 14 nights, but can be shorter or longer based on your preference. Tell us your dates and we will design around them.",
  },
  {
    q: "Can I choose my hotel and travel dates?",
    a: "Yes. Custom packages let you choose hotel tier, dates, and number of nights. For group packages, dates are fixed and disclosed at the time of enquiry.",
  },
  {
    q: "Do you handle visa processing?",
    a: "We support visa processing as part of the package. Final approval is granted by the relevant authority — we cannot guarantee issuance, but we manage the application on your behalf.",
  },
  {
    q: "What is the payment structure?",
    a: "A typical package requires an advance to block hotels and flights, with the balance due before travel. Exact installments are shared in your proposal.",
  },
  {
    q: "What if I need to cancel?",
    a: "Our standard cancellation policy applies. Specific terms depend on the hotel, airline, and visa rules attached to your booking. We share the full terms at enquiry.",
  },
];

export default function UmrahPackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Umrah Packages"
        title="Umrah packages — flexible, transparent, carefully organized."
        subtitle="Group, custom, family, economy, and premium Umrah packages — plus a private airport-transfer option. Clear inclusions and a real person to support you throughout."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hajj & Umrah", href: "/hajj-umrah" },
          { label: "Umrah Packages" },
        ]}
      />

      {/* Categories */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-3">Package categories</div>
            <h2 className="heading-lg mb-3">Choose how you want to travel</h2>
            <p className="prose-body-lg">
              Each category below is a starting point. Exact accommodation, dates, and pricing are
              confirmed at the time of booking.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const fields = [
                { icon: Calendar, label: "Duration", value: c.duration },
                { icon: Plane, label: "Departure", value: c.departure },
                { icon: Building2, label: "Hotel tier", value: c.hotel },
                { icon: Plane, label: "Transport", value: c.transport, rotate: true },
              ];
              return (
                <div key={c.title} className="card flex flex-col p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="bg-gold-100 text-gold-600 flex h-11 w-11 items-center justify-center rounded-xl">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display text-navy-600 text-xl font-semibold">{c.title}</h3>
                  </div>
                  <p className="text-ink-400 mb-4 text-sm leading-relaxed">{c.description}</p>
                  <dl className="mt-auto space-y-2.5 text-sm">
                    {fields.map((f) => {
                      const FIcon = f.icon;
                      return (
                        <div key={f.label} className="flex gap-2">
                          <FIcon
                            size={16}
                            className={`text-gold-500 flex-none mt-0.5${f.rotate ? "rotate-45" : ""}`}
                          />
                          <div>
                            <dt className="text-navy-600 font-semibold">{f.label}</dt>
                            <dd className="text-ink-400">{f.value}</dd>
                          </div>
                        </div>
                      );
                    })}
                  </dl>
                  <div className="border-sand-200 mt-5 flex items-center justify-between border-t pt-4">
                    <div className="text-ink-400 text-xs">
                      Starting from —{" "}
                      <span className="text-navy-600 font-semibold">on request</span>
                    </div>
                    <EnquireButton
                      mode="pilgrimage"
                      presetService={`Umrah — ${c.title}`}
                      label="Request Details"
                      variant="secondary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparency table for one example package */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-10 max-w-3xl">
            <div className="eyebrow mb-3">Example breakdown</div>
            <h2 className="heading-lg mb-3">What a typical Umrah package includes</h2>
            <p className="prose-body-lg">
              Final inclusions are confirmed in your personal booking confirmation. The table below
              shows the categories we share with every guest.
            </p>
          </div>

          <div className="border-sand-200 shadow-soft overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-navy-600 text-white">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold">Included</th>
                  <th className="px-5 py-4 text-left font-semibold">Not Included</th>
                  <th className="px-5 py-4 text-left font-semibold">Optional</th>
                  <th className="px-5 py-4 text-left font-semibold">Conditions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {TRANSPARENCY.map((col) => (
                    <td key={col.title} className="border-sand-200 border-t px-5 py-5 align-top">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${col.color} mb-3`}
                      >
                        {col.title}
                      </div>
                      <ul className="text-ink-500 space-y-1.5">
                        {col.items.map((it) => (
                          <li key={it} className="flex gap-2">
                            <span className="text-gold-500 mt-1.5 flex-none">•</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Booking process */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-3">Booking process</div>
            <h2 className="heading-lg mb-3">5 steps from enquiry to travel</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s) => (
              <div key={s.n} className="card p-5">
                <div className="text-gold-500 font-display mb-2 text-2xl font-semibold">{s.n}</div>
                <h3 className="font-display text-navy-600 mb-1.5 text-lg font-semibold">
                  {s.title}
                </h3>
                <p className="text-ink-400 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-3">FAQs</div>
            <h2 className="heading-lg">Frequently asked questions</h2>
          </div>
          <div className="divide-sand-200 border-sand-200 divide-y rounded-2xl border bg-white">
            {FAQS.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="font-display text-navy-600 text-base font-semibold">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className="text-gold-500 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="text-ink-400 mt-3 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* end */}

      {/* CTA */}
      <section className="section bg-navy-grad text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3">Plan your Umrah</div>
          <h2 className="heading-lg mb-4 text-white">Tell us your dates and travelers</h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            We will share an outline itinerary with inclusions and an indicative price for your
            preferred category.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <EnquireButton mode="pilgrimage" presetService="Umrah" label="Request Umrah Details" />
            <Link href="/custom-package" className="btn-secondary">
              Build a custom package <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
