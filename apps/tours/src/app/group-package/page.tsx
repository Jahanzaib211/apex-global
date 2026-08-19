import Link from "next/link";
import { Users, Heart, Building2, Briefcase, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Group Hajj & Umrah Packages",
  description:
    "Group Hajj and Umrah packages for families, communities, organizations, and corporate travelers — with group coordination and dedicated support.",
};

const AUDIENCES = [
  {
    icon: Heart,
    title: "Families",
    description: "Multi-generational families traveling together for a shared spiritual journey.",
  },
  {
    icon: Users,
    title: "Friends",
    description: "Groups of friends coordinating a pilgrimage together with shared logistics.",
  },
  {
    icon: Building2,
    title: "Community Groups",
    description:
      "Mosques, religious societies, and community associations organizing collectively.",
  },
  {
    icon: Award,
    title: "Organizations",
    description: "NGOs and institutions arranging pilgrimages for their members or beneficiaries.",
  },
  {
    icon: Briefcase,
    title: "Corporate",
    description: "Companies and partners coordinating meaningful group travel experiences.",
  },
];

const ARRANGE = [
  "Group accommodation (adjoining rooms, shared floors where possible)",
  "Group transportation (airport, intercity, Ziyarat)",
  "Group coordination (single point of contact throughout)",
  "On-ground support (reachable team across Makkah and Madinah)",
  "Dedicated travel expert (assigned to your group from enquiry to return)",
];

const SIZES = [
  {
    tier: "Small",
    size: "5–10 travelers",
    hotel: "Standard / Premium commonly chosen",
    coord: "Single coordinator, group transfers",
    support: "Dedicated travel expert",
  },
  {
    tier: "Medium",
    size: "11–20 travelers",
    hotel: "Standard / Premium / Luxury",
    coord: "Coordinator plus on-ground lead",
    support: "Dedicated travel expert",
  },
  {
    tier: "Large",
    size: "21–40 travelers",
    hotel: "Block bookings across tiers",
    coord: "Multi-person coordination team",
    support: "Dedicated travel expert + on-ground liaison",
  },
  {
    tier: "Very Large",
    size: "40+ travelers",
    hotel: "Custom hotel arrangements",
    coord: "Tailored coordination plan",
    support: "Dedicated team + structured on-ground support",
  },
];

export default function GroupPackagePage() {
  return (
    <>
      <PageHero
        eyebrow="Group Packages"
        title="Group Hajj & Umrah packages — for families, communities, and organizations."
        subtitle="Carefully organized group travel with shared coordination, dedicated support, and arrangements scaled to your group size."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hajj & Umrah", href: "/hajj-umrah" },
          { label: "Group Packages" },
        ]}
      />

      {/* Target audience */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-3">Who it is for</div>
            <h2 className="heading-lg mb-3">Pilgrimage travel, organized together</h2>
            <p className="prose-body-lg">
              Group packages work best when one point of contact can coordinate across many
              travelers. We bring that coordination to your group.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {AUDIENCES.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="card p-5 text-center">
                  <div className="bg-gold-100 text-gold-600 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-navy-600 mb-1.5 text-lg font-semibold">
                    {a.title}
                  </h3>
                  <p className="text-ink-400 text-sm leading-relaxed">{a.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What we arrange */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <div className="eyebrow mb-3">What we arrange</div>
              <h2 className="heading-lg mb-5">A single team handles the coordination</h2>
              <p className="prose-body-lg">
                Group pilgrimages succeed when logistics are managed. Our team handles the moving
                pieces so your group can focus on the journey.
              </p>
            </div>
            <ul className="space-y-3">
              {ARRANGE.map((item) => (
                <li
                  key={item}
                  className="border-sand-200 bg-sand-100 flex items-start gap-3 rounded-xl border p-4"
                >
                  <span className="bg-gold-100 text-gold-700 mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full">
                    <CheckCircle2 size={16} />
                  </span>
                  <span className="text-ink-500 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tier table */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow mb-3">Group sizes</div>
            <h2 className="heading-lg mb-3">How we scale coordination by group size</h2>
            <p className="prose-body-lg">
              Arrangements and support scale with your group. Specific hotels, transport, and
              on-ground plans are confirmed at enquiry.
            </p>
          </div>

          <div className="border-sand-200 shadow-soft overflow-hidden rounded-2xl border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-navy-600 text-white">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold">Group size</th>
                  <th className="px-5 py-4 text-left font-semibold">Tier</th>
                  <th className="px-5 py-4 text-left font-semibold">Typical accommodation</th>
                  <th className="px-5 py-4 text-left font-semibold">Coordination</th>
                  <th className="px-5 py-4 text-left font-semibold">Support</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s, i) => (
                  <tr key={s.tier} className={i % 2 === 0 ? "bg-white" : "bg-sand-100"}>
                    <td className="text-navy-600 px-5 py-4 font-semibold">{s.size}</td>
                    <td className="text-ink-500 px-5 py-4">{s.tier}</td>
                    <td className="text-ink-500 px-5 py-4">{s.hotel}</td>
                    <td className="text-ink-500 px-5 py-4">{s.coord}</td>
                    <td className="text-ink-500 px-5 py-4">{s.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-ink-400 mt-4 text-xs">
            Pricing is not listed here — it is shared in your personal proposal based on dates,
            hotel tier, and group size.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-navy-grad text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3">Plan a group journey</div>
          <h2 className="heading-lg mb-4 text-white">Tell us about your group</h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            Share your group size, intended dates, and any preferences. Our team will respond with a
            tailored group proposal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <EnquireButton mode="group" presetService="Group" label="Plan Our Group Journey" />
            <Link href="/custom-package" className="btn-secondary">
              Build a custom package <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
