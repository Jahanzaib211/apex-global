import { Briefcase, Compass, Heart, Building2, Users, ArrowRight } from "lucide-react";
import { ApplicationForm } from "./_components/application-form";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Careers",
  description:
    "Build a career in travel, transportation, and pilgrimage services at Apex Global Tours & Travels.",
};

const WHY = [
  {
    icon: Compass,
    title: "Travel industry exposure",
    description:
      "Work across car rental, airport transfer, intercity, and pilgrimage travel — gaining broad operational exposure within one role.",
  },
  {
    icon: Building2,
    title: "Group-level backing",
    description:
      "Apex Tours & Travels is part of the Apex Group of Companies, sharing governance, compliance, and operational standards with sibling businesses.",
  },
  {
    icon: Heart,
    title: "Customer-first culture",
    description:
      "Our promise — your journey, our responsibility — applies to our team too. We invest in training, support, and clear escalation paths.",
  },
];

const ROLES = [
  {
    title: "Travel Consultant",
    team: "Sales & Operations",
    location: "Pakistan · Saudi Arabia",
    type: "Full-time",
    summary:
      "Handle inbound travel enquiries, prepare quotes, and convert leads into confirmed bookings across car rental and pilgrimage.",
  },
  {
    title: "Customer Support",
    team: "Customer Experience",
    location: "Pakistan · Saudi Arabia",
    type: "Full-time",
    summary:
      "Be the first point of contact for travelers before, during, and after their journey — via WhatsApp, phone, and email.",
  },
  {
    title: "Operations Executive",
    team: "Operations",
    location: "Pakistan · Saudi Arabia",
    type: "Full-time",
    summary:
      "Coordinate vehicle assignment, driver scheduling, and on-ground logistics across multiple cities and routes.",
  },
  {
    title: "Tour Coordinator",
    team: "Pilgrimage Operations",
    location: "Pakistan · Saudi Arabia",
    type: "Full-time",
    summary:
      "Plan end-to-end Hajj and Umrah journeys — hotels, transport, visa, and on-ground support — for individuals and groups.",
  },
  {
    title: "Marketing Executive",
    team: "Marketing",
    location: "Pakistan · Saudi Arabia",
    type: "Full-time",
    summary:
      "Own brand, content, and channel initiatives that introduce Apex to new travelers across our markets.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Send your CV",
    description:
      "Email your CV to our hiring team with the role title in the subject line. A short cover note is appreciated.",
  },
  {
    n: "02",
    title: "Review",
    description:
      "Our team reviews every application. Shortlisted candidates hear back within two weeks of submission.",
  },
  {
    n: "03",
    title: "Interview",
    description:
      "Selected candidates are invited for a conversation with the hiring manager and a member of the leadership team.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Careers at Apex"
        subtitle="Build a career in travel, transportation and pilgrimage services — backed by the Apex Group of Companies."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />

      {/* Why work with us */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3">Why work with us</div>
            <h2 className="heading-lg">A place to build a career in travel</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {WHY.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="card p-7 text-center">
                  <div className="bg-gold-100 text-gold-600 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-display text-navy-600 mb-3 text-xl font-semibold">
                    {w.title}
                  </h3>
                  <p className="text-ink-400 text-sm leading-relaxed">{w.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mb-10 max-w-3xl">
            <div className="eyebrow mb-3">Open roles</div>
            <h2 className="heading-lg mb-3">Current opportunities</h2>
            <p className="prose-body">
              We hire across Pakistan and Saudi Arabia. Specific office location is confirmed during
              the interview process. Apply by emailing your CV — the address is on each role card.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((r) => (
              <div key={r.title} className="card flex flex-col p-6 lg:p-7">
                <div className="mb-4 flex items-start justify-between">
                  <div className="bg-navy-50 text-navy-600 flex h-11 w-11 items-center justify-center rounded-xl">
                    <Briefcase size={20} />
                  </div>
                  <span className="badge-gold">{r.type}</span>
                </div>
                <h3 className="font-display text-navy-600 mb-2 text-lg font-semibold">{r.title}</h3>
                <div className="text-ink-300 mb-4 flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Users size={12} /> {r.team}
                  </span>
                </div>
                <p className="text-ink-400 mb-5 flex-1 text-sm leading-relaxed">{r.summary}</p>
                <div className="text-ink-300 mb-5 text-xs">
                  <span className="text-ink-500 font-semibold">Location:</span> {r.location}
                </div>
                {/*
                  A plain <a>, not next/link: the form reads ?role= in a mount
                  effect, and a client-side navigation would not remount it, so
                  the role would silently fail to preselect. This page is a
                  server component, so an onClick handler is not an option
                  either.
                */}
                <a
                  href={`/careers?role=${encodeURIComponent(r.title)}#apply`}
                  className="btn-ghost w-full"
                >
                  Apply <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to apply */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3">How to apply</div>
            <h2 className="heading-lg">Three simple steps</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="card relative overflow-hidden p-7">
                <div className="font-display text-gold-300 mb-3 text-5xl font-semibold">{s.n}</div>
                <h3 className="font-display text-navy-600 mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>

          <div id="apply" className="mt-12 scroll-mt-28">
            <ApplicationForm roles={ROLES.map((r) => r.title)} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-navy-grad text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3">Don&apos;t see your role?</div>
          <h2 className="heading-lg mb-4 text-white">We&apos;re always open to good people</h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            If your background doesn&apos;t match a current opening but you think you&apos;d be a
            great fit for Apex, send us your CV anyway.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <EnquireButton mode="general" label="Send a general enquiry" />
            <a href="#apply" className="btn-secondary">
              Apply with a general application
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
