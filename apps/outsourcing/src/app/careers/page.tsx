"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  Users2,
  Heart,
  TrendingUp,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROUTE_META } from "@/lib/nav";

const TEAMS = [
  "All",
  "Customer Experience",
  "Sales",
  "Marketing",
  "Operations",
  "Quality",
] as const;
type Team = (typeof TEAMS)[number];

type Role = {
  title: string;
  type: string;
  shift: string;
  location: string;
  team: Team;
};

const ROLES: Role[] = [
  {
    title: "Customer Support Agent",
    type: "Full-time",
    shift: "Day / Night",
    location: "On-site / Remote",
    team: "Customer Experience",
  },
  {
    title: "Telesales Agent",
    type: "Full-time",
    shift: "Day / Evening",
    location: "On-site / Remote",
    team: "Sales",
  },
  {
    title: "Sales Development Representative",
    type: "Full-time",
    shift: "Day",
    location: "On-site / Remote",
    team: "Sales",
  },
  {
    title: "Lead Generation Specialist",
    type: "Full-time",
    shift: "Day",
    location: "On-site / Remote",
    team: "Sales",
  },
  {
    title: "Digital Marketing Specialist",
    type: "Full-time",
    shift: "Day",
    location: "Remote",
    team: "Marketing",
  },
  {
    title: "Social Media Manager",
    type: "Full-time",
    shift: "Day",
    location: "Remote",
    team: "Marketing",
  },
  {
    title: "Virtual Assistant",
    type: "Full-time / Part-time",
    shift: "Flexible",
    location: "Remote",
    team: "Operations",
  },
  {
    title: "Back-Office Executive",
    type: "Full-time",
    shift: "Day",
    location: "On-site / Remote",
    team: "Operations",
  },
  {
    title: "Team Lead",
    type: "Full-time",
    shift: "Day / Rotational",
    location: "On-site",
    team: "Operations",
  },
  {
    title: "Quality Analyst",
    type: "Full-time",
    shift: "Day",
    location: "On-site / Remote",
    team: "Quality",
  },
  {
    title: "Operations Manager",
    type: "Full-time",
    shift: "Day",
    location: "On-site",
    team: "Operations",
  },
];

export default function CareersPage() {
  const [filter, setFilter] = useState<Team>("All");
  const filtered = filter === "All" ? ROLES : ROLES.filter((r) => r.team === filter);

  return (
    <main className="bg-white">
      <Navbar />

      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-20 text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Careers
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-5xl leading-tight font-extrabold md:text-6xl">
            Build your career at <span className="gradient-text">Apex.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Join a global team that supports some of the fastest-growing businesses in the world. We
            hire for attitude, train for skill and promote from within.
          </p>
        </div>
      </section>

      <section className="bg-mist border-line border-b py-12">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Perk
            icon={<TrendingUp />}
            title="Growth"
            desc="Structured career paths and internal mobility."
          />
          <Perk
            icon={<Users2 />}
            title="Global Teams"
            desc="Work with colleagues across multiple regions."
          />
          <Perk
            icon={<Award />}
            title="Training"
            desc="Continuous learning and certification programs."
          />
          <Perk
            icon={<Heart />}
            title="Benefits"
            desc="Competitive compensation and supportive culture."
          />
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x">
          <div
            className="mb-10 flex flex-wrap gap-2 pb-6"
            role="tablist"
            aria-label="Filter roles by team"
          >
            {TEAMS.map((t) => {
              const active = filter === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(t)}
                  className={`focus-visible:ring-amber2-dark rounded-full border px-5 py-2.5 text-sm font-semibold transition focus-visible:ring-2 focus-visible:outline-none ${
                    active
                      ? "bg-navy border-navy shadow-soft text-white"
                      : "text-navy border-line hover:border-navy hover:bg-mist bg-white"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {filtered.map((r) => (
              <article
                key={r.title}
                className="border-line hover:border-amber2 flex flex-col gap-4 rounded-2xl border bg-white p-5 transition md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="text-amber2-dark text-xs font-semibold tracking-wider uppercase">
                    {r.team}
                  </div>
                  <h3 className="font-display text-navy mt-1 text-lg font-bold">{r.title}</h3>
                  <div className="text-steel mt-2 flex flex-wrap gap-3 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase size={12} aria-hidden /> {r.type}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} aria-hidden /> {r.shift}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} aria-hidden /> {r.location}
                    </span>
                  </div>
                </div>
                <Link href="/contact" className="btn-primary text-sm">
                  Apply Now <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>

          <div className="bg-mist border-line mt-14 rounded-3xl border p-10 text-center">
            <h3 className="font-display text-navy text-2xl font-extrabold">Don't see your role?</h3>
            <p className="text-steel mt-3">
              Send us your CV — we'll reach out when a matching role opens.
            </p>
            <Link href="/contact" className="btn-primary mt-6">
              Submit Your CV <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Perk({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="border-line rounded-xl border bg-white p-5">
      <div className="bg-amber2/15 text-amber2-dark flex h-10 w-10 items-center justify-center rounded-lg">
        {icon}
      </div>
      <h3 className="font-display text-navy mt-3 font-bold">{title}</h3>
      <p className="text-steel mt-1 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// satisfy unused-import lint if ROUTE_META becomes unused after refactor
void ROUTE_META;
