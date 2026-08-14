import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Custom Hajj & Umrah Package — Apex Global Tours & Travels",
  description:
    "Build your pilgrimage around your travelers, dates, hotel preference, and budget — designed by the Apex team for you.",
};

const CUSTOMIZE = [
  "Hajj or Umrah",
  "Travelers",
  "Departure city",
  "Dates",
  "Number of days",
  "Hotel tier",
  "Makkah stay",
  "Madinah stay",
  "Transportation",
  "Budget",
  "Special requirements",
];

const WHY = [
  {
    icon: Sparkles,
    title: "Tailored to You",
    description: "Every detail is built around your group size, pace, and preferences.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Pricing",
    description: "Indicative pricing is shared upfront — no hidden charges at confirmation.",
  },
  {
    icon: Award,
    title: "Dedicated Expert",
    description: "A single travel expert from our team guides you from enquiry to return.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Submit requirements",
    text: "Share your travelers, dates, hotel preference, and budget via the enquiry form.",
  },
  {
    n: "02",
    title: "Receive proposal",
    text: "Our team shares an outline itinerary with inclusions and indicative pricing.",
  },
  {
    n: "03",
    title: "Confirm and travel",
    text: "Approve the proposal, pay the advance, and we organize the rest of your journey.",
  },
];

const ITINERARY = [
  {
    day: "Day 1",
    title: "Departure",
    text: "Travel from your chosen departure city to Saudi Arabia.",
  },
  {
    day: "Day 2",
    title: "Arrival in Makkah",
    text: "Check-in to your hotel in Makkah and rest before Umrah.",
  },
  {
    day: "Day 3",
    title: "Makkah",
    text: "Perform Umrah at your own pace with on-ground support available.",
  },
  {
    day: "Day 4",
    title: "Makkah",
    text: "Additional time for worship and optional Ziaraat visits.",
  },
  {
    day: "Day 5",
    title: "Travel to Madinah",
    text: "Intercity transfer to Madinah and check-in to your hotel.",
  },
  {
    day: "Day 6",
    title: "Madinah",
    text: "Time for worship and optional Ziaraat visits in Madinah.",
  },
  { day: "Day 7", title: "Return", text: "Transfer to the airport for your return flight home." },
];

const FAQS = [
  {
    q: "How do I share my requirements?",
    a: "Use the enquiry form on this page or message us on WhatsApp. Tell us as much or as little as you have — we will guide the rest.",
  },
  {
    q: "How long until I receive a proposal?",
    a: "Our team typically responds within one business day with a proposal outline or clarifying questions.",
  },
  {
    q: "Can I change the proposal after I receive it?",
    a: "Yes. The proposal is a starting point. We will revise hotels, dates, or inclusions until you are comfortable with the plan.",
  },
  {
    q: "What budget should I keep in mind?",
    a: "Pilgrimage budgets vary by season, hotel tier, and group size. Share a range and we will propose options that fit.",
  },
];

export default function CustomPackagePage() {
  return (
    <>
      <PageHero
        eyebrow="Custom Package"
        title="Build your pilgrimage around your needs."
        subtitle="Tell us your travelers, dates, hotel preference and budget — our team will design a package tailored to you."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hajj & Umrah", href: "/hajj-umrah" },
          { label: "Custom Package" },
        ]}
      />

      {/* 2-column: customize list + why custom */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Customize */}
            <div>
              <div className="eyebrow mb-3">What you can customize</div>
              <h2 className="heading-lg mb-4">Every detail, your way</h2>
              <p className="prose-body-lg mb-6">
                From the type of pilgrimage to the smallest preference, we work with your inputs to
                build a journey that fits.
              </p>
              <ul className="space-y-3">
                {CUSTOMIZE.map((item) => (
                  <li
                    key={item}
                    className="border-sand-200 bg-sand-100 flex items-center gap-3 rounded-xl border px-4 py-3"
                  >
                    <span className="bg-gold-100 text-gold-700 flex h-7 w-7 flex-none items-center justify-center rounded-full">
                      <CheckCircle2 size={16} />
                    </span>
                    <span className="text-ink-500 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Why custom */}
            <div>
              <div className="eyebrow mb-3">Why custom</div>
              <h2 className="heading-lg mb-4">Built with care, not from a template</h2>
              <p className="prose-body-lg mb-6">
                Custom packages are not a different product — they are the same careful
                organization, shaped around your specific journey.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {WHY.map((w) => {
                  const Icon = w.icon;
                  return (
                    <div key={w.title} className="card p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-gold-100 text-gold-600 flex h-12 w-12 flex-none items-center justify-center rounded-xl">
                          <Icon size={22} />
                        </div>
                        <div>
                          <h3 className="font-display text-navy-600 mb-1.5 text-lg font-semibold">
                            {w.title}
                          </h3>
                          <p className="text-ink-400 text-sm leading-relaxed">{w.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How custom works */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-3">How custom works</div>
            <h2 className="heading-lg mb-3">Three steps from idea to itinerary</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="card p-6">
                <div className="text-gold-500 font-display mb-3 text-3xl font-semibold">{s.n}</div>
                <h3 className="font-display text-navy-600 mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample itinerary */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-3">Sample itinerary</div>
            <h2 className="heading-lg mb-3">A typical week-long Umrah outline</h2>
            <p className="prose-body-lg">
              This is a generic illustration. Your custom itinerary reflects your dates, hotel tier,
              and pace.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ITINERARY.map((d) => (
              <div key={d.day} className="card p-5">
                <div className="mb-2 flex items-center gap-3">
                  <span className="badge-gold">
                    <Calendar size={12} />
                    {d.day}
                  </span>
                  <h3 className="font-display text-navy-600 text-lg font-semibold">{d.title}</h3>
                </div>
                <p className="text-ink-400 text-sm leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
          <div className="border-sand-200 bg-sand-100 text-ink-500 mt-8 rounded-2xl border p-5 text-sm">
            <strong className="text-navy-600">Note:</strong> day-by-day activities, transport
            schedules, and hotel details are confirmed in your personal proposal.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-sand-grad">
        <div className="container-narrow">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-3">FAQs</div>
            <h2 className="heading-lg">Custom package questions</h2>
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
          <div className="eyebrow !text-gold-400 mb-3">Start your custom package</div>
          <h2 className="heading-lg mb-4 text-white">Tell us what you have in mind</h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            Share your travelers, dates, hotel preference, and budget. We will come back with a
            tailored proposal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <EnquireButton
              mode="pilgrimage"
              presetService="Custom"
              label="Submit Custom Requirements"
            />
            <Link href="/umrah-packages" className="btn-secondary">
              See Umrah packages <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
