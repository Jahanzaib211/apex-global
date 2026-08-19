import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, Users2, LineChart, ShieldCheck, Sparkles, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROUTE_META } from "@/lib/nav";
import { CONTACT } from "@/lib/contact";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: ROUTE_META["/about"]!.title,
  description: ROUTE_META["/about"]!.description,
  alternates: { canonical: "/about" },
  openGraph: {
    // Declaring openGraph replaces the root layout\'s entire node, which
    // dropped its image. The generated card lives at /opengraph-image.
    images: ["/opengraph-image"],
    title: ROUTE_META["/about"]!.title,
    description: ROUTE_META["/about"]!.description,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      <Navbar />

      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-20 text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> About {BRAND.shortName}
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-5xl leading-tight font-extrabold md:text-6xl">
            We build outsourced <span className="gradient-text">business operations.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-white/75">
            {BRAND.name} helps businesses expand their operational capacity without carrying the
            full cost and complexity of building large internal teams. We combine people, process,
            management and technology to deliver scalable outsourcing solutions.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> Our Story
            </div>
            <h2 className="font-display text-navy mt-4 text-3xl leading-tight font-extrabold md:text-4xl">
              Built by operators. Run for results.
            </h2>
            <div className="text-steel mt-5 space-y-4 leading-relaxed">
              <p>
                {BRAND.shortName} was built to address a recurring problem: most outsourcing
                engagements deliver manpower, not outcomes. {BRAND.shortName} was designed to
                deliver the opposite — managed business functions with clear accountability and
                measurable performance.
              </p>
              <p>
                Today we support clients across multiple regions with dedicated teams, structured
                processes, transparent reporting and a focus on the metrics that actually move a
                business forward.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Pillar
              icon={<Globe2 />}
              title="Global Delivery"
              desc="Operating across multiple time zones and markets."
            />
            <Pillar
              icon={<Users2 />}
              title="Managed Teams"
              desc="People, process and performance — under one roof."
            />
            <Pillar
              icon={<LineChart />}
              title="KPI-Driven"
              desc="Reporting, dashboards and continuous optimization."
            />
            <Pillar
              icon={<ShieldCheck />}
              title="Accountability"
              desc="Clear ownership, SLAs and outcomes baked in."
            />
          </div>
        </div>
      </section>

      <section className="section-pad bg-mist">
        <div className="container-x grid gap-6 md:grid-cols-3">
          <Value
            icon={<Award />}
            title="Quality First"
            desc="We compete on quality, reliability and execution — not on the lowest price."
          />
          <Value
            icon={<Sparkles />}
            title="Modern Operations"
            desc="AI-enabled workflows, dashboards and reporting across every engagement."
          />
          <Value
            icon={<ShieldCheck />}
            title="Confidentiality"
            desc="Client information and business data are treated as strictly confidential."
          />
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Leadership
          </div>
          <h2 className="font-display text-navy mt-3 text-3xl font-extrabold md:text-4xl">
            Built by leaders who run, not just advise.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Leader
              name="Shaikh Ahmed"
              title="Chief Executive Officer"
              desc="Entrepreneur focused on building globally scalable operating companies. Leads Apex's vision, growth and client strategy."
            />
            <Leader
              name="Operations Leadership"
              title="VP, Service Delivery"
              desc="Owns client engagements, operational KPIs and quality across all service divisions."
            />
            <Leader
              name="Growth Leadership"
              title="Head of Sales & Marketing"
              desc="Drives new client acquisition, partnerships and go-to-market across regions."
            />
          </div>
        </div>
      </section>

      <section className="from-amber2 to-amber2-light text-navy bg-gradient-to-br py-24 pb-32">
        <div className="container-x text-center">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            Let's build your growth team.
          </h2>
          <Link href="/contact" className="btn-primary mt-6">
            Talk to Our Team <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Pillar({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="border-line card-hover rounded-2xl border bg-white p-6">
      <div className="bg-navy text-amber2 flex h-11 w-11 items-center justify-center rounded-xl">
        {icon}
      </div>
      <h3 className="font-display text-navy mt-4 text-lg font-bold">{title}</h3>
      <p className="text-steel mt-2 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Value({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="border-line rounded-2xl border bg-white p-6">
      <div className="bg-amber2 text-navy flex h-11 w-11 items-center justify-center rounded-xl">
        {icon}
      </div>
      <h3 className="font-display text-navy mt-4 text-lg font-bold">{title}</h3>
      <p className="text-steel mt-2 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Leader({ name, title, desc }: { name: string; title: string; desc: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="border-line card-hover rounded-2xl border bg-white p-6">
      <div className="from-navy to-slate2 text-amber2 font-display flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold">
        {initials}
      </div>
      <h3 className="font-display text-navy mt-4 text-lg font-bold">{name}</h3>
      <div className="text-amber2-dark mt-1 text-xs font-semibold tracking-widest uppercase">
        {title}
      </div>
      <p className="text-steel mt-3 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// satisfy unused import linter in case CONTACT is unused after refactor
void CONTACT;
