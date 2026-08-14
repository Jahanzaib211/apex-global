import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Heart,
  Building2,
  ArrowRight,
  Compass,
  Users,
  Briefcase,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "About Us — Apex Global Tours & Travels",
  description:
    "Apex Global Tours & Travels (Pvt) Ltd provides reliable car rental services in Pakistan and Saudi Arabia, alongside carefully organized Hajj and Umrah packages.",
};

const VALUES = [
  {
    icon: Award,
    title: "Premium Service",
    description:
      "Professional chauffeurs, well-maintained vehicles, and carefully vetted accommodation — quality you can feel at every step.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Inclusions",
    description:
      "Every quote lists what is included, what is not, and what is optional. We do not hide charges behind attractive headlines.",
  },
  {
    icon: Heart,
    title: "Customer-First",
    description:
      "A real person from the Apex team is reachable throughout your journey — before, during, and after travel.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Apex"
        title="Travel. Mobility. Pilgrimage."
        subtitle="Apex Global Tours & Travels (Pvt) Ltd provides reliable car rental services in Pakistan and Saudi Arabia, alongside carefully organized Hajj and Umrah packages."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="section bg-sand-grad">
        <div className="container-narrow">
          <div className="eyebrow mb-3">Our story</div>
          <h2 className="heading-lg mb-6">
            A trusted travel partner across Pakistan and Saudi Arabia
          </h2>
          <div className="text-ink-400 space-y-5 text-lg leading-relaxed">
            <p>
              Apex Global Tours &amp; Travels is part of the Apex Group of Companies — a
              multi-vertical group operating in technology, outsourcing, tourism, and investments.
              The tours &amp; travels division was created to bring that group-level operational
              discipline to two areas where travelers need it most: everyday mobility, and
              once-in-a-lifetime pilgrimage journeys.
            </p>
            <p>
              On the mobility side, we arrange car rentals across Pakistan and the Kingdom of Saudi
              Arabia — with driver, self-drive, airport transfers, and intercity travel. Our network
              covers the routes our customers actually travel: between cities, to airports, and to
              the holy sites. Vehicles are maintained, chauffeurs are trained, and pricing is shared
              in writing before you confirm.
            </p>
            <p>
              On the pilgrimage side, we organize Hajj and Umrah packages with the same discipline —
              transparent inclusions, clear conditions, and on-ground support throughout the
              journey. We work with families, communities, and individual travelers, and we
              customize packages where a fixed itinerary does not fit. Our promise is simple: your
              journey, our responsibility.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3">Mission · Vision · Values</div>
            <h2 className="heading-lg">What we promise every traveler</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card p-7 text-center">
                  <div className="bg-gold-100 text-gold-600 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-display text-navy-600 mb-3 text-xl font-semibold">
                    {v.title}
                  </h3>
                  <p className="text-ink-400 text-sm leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section bg-sand-grad">
        <div className="container-narrow">
          <div className="eyebrow mb-3">Leadership</div>
          <h2 className="heading-lg mb-8">Meet the team behind Apex</h2>

          <div className="card p-7 lg:p-9">
            <div className="flex flex-col items-start gap-7 md:flex-row">
              {/* Avatar placeholder */}
              <div className="flex-none">
                <div className="bg-navy-grad shadow-navy flex h-28 w-28 items-center justify-center rounded-2xl text-white">
                  <Users size={48} className="text-gold-400" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-display text-navy-600 text-2xl font-semibold">Shaikh Ahmed</h3>
                <div className="text-gold-500 mt-1 mb-4 text-sm font-semibold">
                  Chief Executive Officer, Apex Group of Companies
                </div>
                <p className="prose-body-lg">
                  Shaikh Ahmed leads the Apex Group of Companies, which spans four subsidiaries:
                  Apex Global Tech Solution, Apex Global Outsourcing, Apex Global Tours &amp;
                  Travels, and Apex Holdings. Under his leadership, the group has built a reputation
                  for disciplined operations, transparent client communication, and customer-first
                  service across every vertical. The tours &amp; travels division reflects that same
                  standard — applying group-level governance to mobility and pilgrimage services so
                  travelers receive the quality and reliability they expect from a larger
                  organization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group context strip */}
      <section className="section-tight bg-white">
        <div className="container-page">
          <div className="bg-navy-grad shadow-navy rounded-2xl p-8 text-center text-white md:p-10">
            <div className="eyebrow !text-gold-400 mb-3">Part of Apex Group of Companies</div>
            <h2 className="font-display mb-3 text-2xl font-semibold text-white md:text-3xl">
              Group-level backing, local-level care
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-white/85">
              Apex Tours &amp; Travels operates alongside the group&apos;s other subsidiaries,
              sharing governance, compliance, and operational standards.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="badge-gold !border-white/20 !bg-white/10 !text-white">
                <Briefcase size={12} /> Tech
              </span>
              <span className="badge-gold !border-white/20 !bg-white/10 !text-white">
                <Users size={12} /> Outsourcing
              </span>
              <span className="badge-gold !border-white/20 !bg-white/10 !text-white">
                <Compass size={12} /> Tours &amp; Travels
              </span>
              <span className="badge-gold !border-white/20 !bg-white/10 !text-white">
                <Building2 size={12} /> Holdings
              </span>
            </div>
            <div className="mt-3 text-xs text-white/60">
              Tech · Outsourcing · Tours &amp; Travels · Holdings
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-sand-grad">
        <div className="container-narrow text-center">
          <div className="eyebrow mb-3">Talk to our team</div>
          <h2 className="heading-lg mb-4">Ready to plan your journey?</h2>
          <p className="prose-body-lg mx-auto mb-7 max-w-2xl">
            Whether you need a vehicle for a week in Lahore, an intercity transfer in the Kingdom,
            or a fully arranged pilgrimage — share your details and our team will respond.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <EnquireButton mode="general" label="Enquire Now" />
            <Link href="/contact" className="btn-ghost">
              Contact our team <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
