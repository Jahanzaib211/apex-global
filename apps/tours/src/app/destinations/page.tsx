import Link from "next/link";
import { ArrowRight, MapPin, Compass } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";
import { DestinationTabs } from "./_components/destination-tabs";

export const metadata = {
  title: "Destinations — Apex Global Tours & Travels",
  description:
    "Cities and routes served by Apex Global Tours & Travels across Pakistan and Saudi Arabia — car rental, transfers, and pilgrimage travel.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="Destinations we serve"
        subtitle="Cities and routes are confirmed by Apex at enquiry time. Pricing, vehicle availability, and specific pickup points are shared once your details are received."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Destinations" }]}
      />

      {/* Tabs + cities */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="eyebrow mb-3">Where we operate</div>
            <h2 className="heading-lg mb-3">Pick a country to see cities</h2>
            <p className="prose-body">
              We arrange car rentals, airport transfers, and intercity travel across both countries.
              Service availability and exact routes are confirmed with you at enquiry.
            </p>
          </div>

          <DestinationTabs />
        </div>
      </section>

      {/* Cross-border journeys */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="bg-navy-grad shadow-navy grain relative overflow-hidden rounded-2xl p-8 text-white md:p-12">
            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="eyebrow !text-gold-400 mb-3">Cross-border journeys</div>
                <h2 className="font-display mb-4 text-3xl font-semibold text-white md:text-4xl">
                  Makkah ↔ Jeddah intercity transport
                </h2>
                <p className="mb-6 max-w-2xl leading-relaxed text-white/85">
                  One of the most common routes for Umrah and Hajj travelers — direct intercity
                  transport between Makkah and Jeddah, with flexible pickup times coordinated to
                  your flight or hotel check-in. Vehicles, drivers, and luggage capacity are
                  arranged to your group size.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/saudi-car-rental" className="btn-primary">
                    Saudi car rental <ArrowRight size={16} />
                  </Link>
                  <Link href="/saudi-car-rental/makkah" className="btn-secondary">
                    Makkah service
                  </Link>
                </div>
              </div>
              <div className="hidden justify-end lg:flex">
                <div className="bg-gold-grad shadow-gold flex h-32 w-32 items-center justify-center rounded-2xl">
                  <Compass size={64} className="text-navy-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities detail CTA strip */}
      <section className="section-tight bg-sand-grad">
        <div className="container-page">
          <div className="card p-7 md:p-9">
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-3 flex items-center gap-3">
                  <div className="bg-gold-100 text-gold-600 flex h-10 w-10 items-center justify-center rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <h3 className="font-display text-navy-600 text-xl font-semibold">
                    Don&apos;t see your city?
                  </h3>
                </div>
                <p className="text-ink-400 text-sm leading-relaxed">
                  We also serve smaller cities and bespoke intercity routes on request. Tell us
                  where you need to travel and our team will confirm availability.
                </p>
              </div>
              <div className="md:text-right">
                <EnquireButton mode="general" label="Check my route" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-navy-grad text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3">Plan your route</div>
          <h2 className="heading-lg mb-4 text-white">Confirm cities and dates with our team</h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            Service availability, pricing, and exact pickup points are confirmed at enquiry. Share
            your route and dates and we&apos;ll respond with options.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <EnquireButton mode="general" label="Enquire Now" />
            <Link href="/contact" className="btn-secondary">
              Contact our team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
