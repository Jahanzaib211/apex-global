import Link from "next/link";
import { Users, Sparkles, Calendar, Building2, Plane, ArrowRight, ChevronDown } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Hajj Packages",
  description:
    "Carefully organized Hajj packages with visa support, accommodation, and on-ground coordination for the days of Hajj.",
};

const CATEGORIES = [
  {
    icon: Users,
    title: "Group Hajj",
    description:
      "Travel with fellow pilgrims on scheduled Hajj dates with shared coordination and group accommodation.",
    duration: "Approx. 12–18 nights — admin to set per departure",
    departure: "Major Pakistan cities — admin to set",
    hotel: "Standard / Premium commonly chosen",
    transport: "Group transfers covering Makkah, Madinah, and Hajj sites",
  },
  {
    icon: Sparkles,
    title: "Custom Hajj",
    description:
      "Designed around your travelers, dates, and hotel preference — with support for visa, accommodation, and Hajj days.",
    duration: "Any duration — on request",
    departure: "Any city — on request",
    hotel: "Any tier — guest to choose",
    transport: "Private or shared — guest to choose",
  },
];

const TRANSPARENCY = [
  {
    title: "Included",
    color: "text-[#1F8A4C] bg-[#E8F6EE] border-[#C9E8D5]",
    items: [
      "Hajj visa processing support (where applicable)",
      "Return air ticket (economy unless upgraded)",
      "Accommodation in Makkah, Madinah, and Hajj sites as per booked tier",
      "Ground transportation between cities and Hajj sites",
      "On-ground support from Apex team during Hajj days",
    ],
  },
  {
    title: "Not Included",
    color: "text-navy-600 bg-navy-50 border-navy-100",
    items: [
      "Personal expenses and shopping",
      "Meals unless explicitly included in your package",
      "Travel insurance",
      "Vaccination or medical test costs",
      "Anything not specifically listed in your booking confirmation",
    ],
  },
  {
    title: "Optional",
    color: "text-gold-700 bg-gold-50 border-gold-200",
    items: [
      "Upgraded hotel tier or room category",
      "Additional nights in Makkah or Madinah pre/post Hajj",
      "Ziaraat (religious site visits) with guided support",
      "Special meals (dietary, kid-friendly)",
      "Travel insurance add-on",
    ],
  },
  {
    title: "Conditions",
    color: "text-ink-500 bg-ink-50 border-ink-100",
    items: [
      "Hajj visa rules change annually — confirm with the relevant authority",
      "Final hotels, flights, and Hajj logistics confirmed at booking",
      "Pricing varies by season, group size, and tier",
      "Standard cancellation policy applies",
      "Valid passport and required documents are the guest&apos;s responsibility",
    ],
  },
];

const STEPS = [
  {
    n: "01",
    title: "Share requirements",
    text: "Tell us travelers, preferred dates, hotel tier, and departure city.",
  },
  {
    n: "02",
    title: "Receive proposal",
    text: "Our team sends an outline itinerary with inclusions and indicative pricing.",
  },
  {
    n: "03",
    title: "Visa support",
    text: "We guide you through visa documents and submit on your behalf where applicable.",
  },
  {
    n: "04",
    title: "Confirm and prepare",
    text: "Advance payment blocks hotels and flights; we share a preparation checklist.",
  },
  {
    n: "05",
    title: "Travel with support",
    text: "Our team supports you across Makkah, Madinah, Mina, Arafat, and Muzdalifah.",
  },
];

const FAQS = [
  {
    q: "How far in advance should I book Hajj?",
    a: "Hajj bookings typically open well in advance of the season. Reach out early so we can plan accommodation, flights, and visa documents with you.",
  },
  {
    q: "Do you arrange Hajj visa processing?",
    a: "We support visa processing as part of the package. Final approval is granted by the relevant authority — we manage the application and documentation on your behalf.",
  },
  {
    q: "How are the days of Hajj handled?",
    a: "Our team coordinates accommodation and transportation across the key Hajj sites including Mina, Arafat, and Muzdalifah. Specific arrangements and tenting are confirmed at booking.",
  },
  {
    q: "Can I travel with my family on a group Hajj?",
    a: "Yes. Group Hajj packages work well for families. Tell us your group size and we will propose arrangements that suit your needs.",
  },
  {
    q: "What if I have mobility or health needs?",
    a: "Share your requirements at enquiry. We will coordinate accessible arrangements where available and discuss honest expectations with you.",
  },
];

export default function HajjPackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hajj Packages"
        title="Hajj packages — carefully organized for the pilgrimage of a lifetime."
        subtitle="Group and custom Hajj arrangements with visa support, accommodation, and on-ground coordination across the days of Hajj."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hajj & Umrah", href: "/hajj-umrah" },
          { label: "Hajj Packages" },
        ]}
      />

      {/* Categories */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-3">Hajj categories</div>
            <h2 className="heading-lg mb-3">Two ways to organize your Hajj</h2>
            <p className="prose-body-lg">
              Group Hajj follows scheduled dates with shared coordination. Custom Hajj lets you
              decide travelers, dates, and hotel tier.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="card flex flex-col p-6 lg:p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="bg-gold-100 text-gold-600 flex h-12 w-12 items-center justify-center rounded-xl">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display text-navy-600 text-2xl font-semibold">{c.title}</h3>
                  </div>
                  <p className="text-ink-400 mb-5 text-sm leading-relaxed">{c.description}</p>
                  <dl className="mt-auto space-y-3 text-sm">
                    <div className="flex gap-2.5">
                      <Calendar size={16} className="text-gold-500 mt-0.5 flex-none" />
                      <div>
                        <dt className="text-navy-600 font-semibold">Duration</dt>
                        <dd className="text-ink-400">{c.duration}</dd>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <Plane size={16} className="text-gold-500 mt-0.5 flex-none" />
                      <div>
                        <dt className="text-navy-600 font-semibold">Departure</dt>
                        <dd className="text-ink-400">{c.departure}</dd>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <Building2 size={16} className="text-gold-500 mt-0.5 flex-none" />
                      <div>
                        <dt className="text-navy-600 font-semibold">Hotel tier</dt>
                        <dd className="text-ink-400">{c.hotel}</dd>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <Plane size={16} className="text-gold-500 mt-0.5 flex-none rotate-45" />
                      <div>
                        <dt className="text-navy-600 font-semibold">Transport</dt>
                        <dd className="text-ink-400">{c.transport}</dd>
                      </div>
                    </div>
                  </dl>
                  <div className="border-sand-200 mt-6 flex items-center justify-between border-t pt-5">
                    <div className="text-ink-400 text-xs">
                      Starting from —{" "}
                      <span className="text-navy-600 font-semibold">on request</span>
                    </div>
                    <EnquireButton
                      mode="pilgrimage"
                      presetService={`Hajj — ${c.title}`}
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

      {/* Transparency table */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-10 max-w-3xl">
            <div className="eyebrow mb-3">Example breakdown</div>
            <h2 className="heading-lg mb-3">What a Hajj package typically covers</h2>
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

      {/* Process */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-3">Booking process</div>
            <h2 className="heading-lg mb-3">5 steps from enquiry to Hajj day</h2>
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

      {/* CTA */}
      <section className="section bg-navy-grad text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3">Plan your Hajj</div>
          <h2 className="heading-lg mb-4 text-white">Talk to our Hajj team</h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            Share your travelers and intended dates. Our team will respond with the latest
            arrangements, inclusions, and next steps.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <EnquireButton mode="pilgrimage" presetService="Hajj" label="Request Hajj Details" />
            <Link href="/custom-package" className="btn-secondary">
              Build a custom Hajj <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
