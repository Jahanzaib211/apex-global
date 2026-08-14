import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  PhoneCall,
  Users2,
  Briefcase,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Building2,
  CheckCircle2,
  Layers,
  BarChart3,
  Cpu,
  Zap,
  Award,
  CheckCheck,
  Rocket,
  LineChart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SERVICES, ROUTE_META } from "@/lib/nav";
import { BRAND } from "@/lib/brand";
import { SpatialCanvas } from "@apex/motion/spatial-canvas";
import { TactileLink } from "@/components/tactile-link";

void ROUTE_META;

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />

      {/* HERO */}
      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-24 text-white">
        <SpatialCanvas className="pointer-events-none absolute inset-0" density={760} />
        <div className="bg-hero-grid absolute inset-0 opacity-60" />
        <div className="bg-amber2/20 absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl" />
        <div className="bg-amber2/10 absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl" />

        <div className="container-x relative">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="eyebrow">
                <span className="eyebrow-dot" /> Why {BRAND.shortName}
              </div>
              <h1 className="font-display mt-5 text-5xl leading-[1.05] font-extrabold md:text-6xl lg:text-7xl">
                A Global Outsourcing Partner{" "}
                <span className="gradient-text">Built for Growth.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
                Scale your sales, customer experience, marketing and business operations with
                dedicated teams and professionally managed outsourcing solutions.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <TactileLink href="/contact" id="hero-cta-primary" className="btn-primary">
                  Talk to Our Team <ArrowRight size={18} />
                </TactileLink>
                <Link href="/services" className="btn-on-dark">
                  Explore Our Services
                </Link>
                <Link href="/services/dedicated-teams" className="btn-on-dark">
                  Build Your Team
                </Link>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-6">
                <Stat n="9+" l="Service Divisions" />
                <Stat n="14+" l="Industries Served" />
                <Stat n="24/7" l="Global Operations" />
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <HeroVisual />
            </div>
          </div>
        </div>
        {/* Scroll-to-explore indicator — anchors to the trust strip below. */}
        <a
          href="#osourc-trust"
          aria-label="Scroll to explore the rest of the page"
          className="hover:text-amber2 focus-visible:ring-amber2 focus-visible:ring-offset-navy-dark absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.18em] text-white/55 uppercase transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span>Scroll to explore</span>
          <span aria-hidden className="bg-amber2/60 h-10 w-px" />
        </a>
      </section>

      {/* TRUST STRIP — GLOBAL CAPABILITY */}
      <section id="osourc-trust" className="bg-mist border-line scroll-mt-24 border-y py-12">
        <div className="container-x">
          <p className="text-steel text-center text-xs font-semibold tracking-[0.2em] uppercase">
            Trusted by businesses operating across
          </p>
          <div className="text-navy/80 mt-6 flex flex-wrap justify-center gap-x-12 gap-y-4">
            {[
              "North America",
              "Europe",
              "Middle East",
              "Asia-Pacific",
              "United Kingdom",
              "GCC Markets",
            ].map((r) => (
              <div key={r} className="flex items-center gap-2 font-semibold">
                <Globe2 size={16} className="text-amber2" /> {r}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="max-w-3xl">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> What We Do
            </div>
            <h2 className="font-display text-navy mt-4 text-4xl font-extrabold md:text-5xl">
              Nine service divisions. <span className="gradient-text">One growth engine.</span>
            </h2>
            <p className="text-steel mt-5 text-lg leading-relaxed">
              Apex is not a basic staffing company. We deliver integrated outsourcing solutions that
              combine people, process, technology and management — so each engagement operates as a
              true extension of your business.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <ServiceCard
                key={s.slug}
                icon={<Briefcase />}
                title={s.title}
                desc={`Explore our ${s.shortLabel.toLowerCase()} service division.`}
                href={s.href}
              />
            ))}
            <ServiceCard
              icon={<Sparkles />}
              title="AI-Enabled Operations"
              desc="Transcription, summarization, lead scoring, QA monitoring and agent assistance."
              href="/services"
            />
          </div>
        </div>
      </section>

      {/* WHY OUTSOURCE */}
      <section className="section-pad bg-mist">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="eyebrow">
                <span className="eyebrow-dot" /> Why Apex
              </div>
              <h2 className="font-display text-navy mt-4 text-4xl leading-tight font-extrabold md:text-5xl">
                We don't just provide people. <br />
                <span className="gradient-text">We build operations.</span>
              </h2>
              <p className="text-steel mt-5 text-lg leading-relaxed">
                Most outsourcing providers supply manpower. Apex delivers managed business functions
                — accountable, measurable and built around the KPIs that actually move your
                business.
              </p>
              <div className="mt-7">
                <Link href="/about" className="btn-primary">
                  Learn About Apex <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {whyItems.map((w) => (
                <div
                  key={w.title}
                  className="border-line card-hover rounded-2xl border bg-white p-6"
                >
                  <div className="bg-navy text-amber2 flex h-11 w-11 items-center justify-center rounded-xl">
                    {w.icon}
                  </div>
                  <h3 className="font-display text-navy mt-4 text-lg font-bold">{w.title}</h3>
                  <p className="text-steel mt-2 text-sm leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUTSOURCING MODELS */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow justify-center">
              <span className="eyebrow-dot" /> Solutions
            </div>
            <h2 className="font-display text-navy mt-4 text-4xl font-extrabold md:text-5xl">
              Engagement models for <span className="gradient-text">every stage of growth.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ModelCard
              title="Dedicated Team"
              desc="A team that works exclusively on your business, fully aligned with your goals and operations."
              icon={<Users2 />}
            />
            <ModelCard
              title="Managed Outsourcing"
              desc="Apex runs people, processes and performance end-to-end with KPIs and reporting."
              icon={<ShieldCheck />}
            />
            <ModelCard
              title="Project-Based"
              desc="A focused team assembled around a defined project with clear deliverables."
              icon={<Briefcase />}
            />
            <ModelCard
              title="Campaign Outsourcing"
              desc="Resources deployed for a specific sales or marketing campaign with measurable ROI."
              icon={<Rocket />}
            />
            <ModelCard
              title="Hybrid Model"
              desc="Blend of your internal team and Apex resources for maximum flexibility."
              icon={<Layers />}
            />
            <ModelCard
              title="Staff Augmentation"
              desc="Skilled individual contributors embedded directly into your workflows."
              icon={<Sparkles />}
            />
          </div>
        </div>
      </section>

      {/* SALES & REVENUE GROWTH */}
      <section className="section-pad bg-navy relative overflow-hidden text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-30" />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> Sales & Revenue Growth
            </div>
            <h2 className="font-display mt-4 text-4xl leading-tight font-extrabold md:text-5xl">
              Turn conversations into customers.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              Apex builds and runs sales operations that generate pipeline, qualify leads, set
              appointments and close revenue. From cold calling to full SDR teams, we operate as an
              extension of your sales organization.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "B2B & B2C Telesales",
                "Cold calling & qualification",
                "Appointment setting",
                "Pipeline building",
                "Upsell & cross-sell",
                "Customer reactivation",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-white/85">
                  <CheckCircle2 size={18} className="text-amber2" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Link href="/services/tele-sales" className="btn-primary">
                Explore Telesales <ArrowRight size={18} />
              </Link>
              <Link href="/services/sales-development" className="btn-on-dark">
                Sales Development
              </Link>
            </div>
          </div>
          <div>
            <FunnelVisual />
          </div>
        </div>
      </section>

      {/* MARKETING FUNNEL */}
      <section className="section-pad bg-mist">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow justify-center">
              <span className="eyebrow-dot" /> Marketing & Customer Acquisition
            </div>
            <h2 className="font-display text-navy mt-4 text-4xl font-extrabold md:text-5xl">
              From attention to revenue — <span className="gradient-text">under one partner.</span>
            </h2>
            <p className="text-steel mt-5 text-lg">
              Strategy → Audience → Content → Advertising → Lead Generation → Telesales →
              Appointment → Conversion → Follow-up.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {[
              "Strategy",
              "Audience",
              "Content",
              "Advertising",
              "Lead Generation",
              "Telesales",
              "Appointment",
              "Conversion",
              "Follow-up",
              "Retention",
            ].map((s, i) => (
              <div key={s} className="border-line rounded-xl border bg-white p-4 text-center">
                <div className="text-amber2-dark text-xs font-semibold">STEP {i + 1}</div>
                <div className="font-display text-navy mt-1 font-bold">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow">
                <span className="eyebrow-dot" /> Industries
              </div>
              <h2 className="font-display text-navy mt-4 text-4xl font-extrabold md:text-5xl">
                Built for the sectors <span className="gradient-text">that move the world.</span>
              </h2>
            </div>
            <Link
              href="/industries"
              className="text-navy hover:text-amber2-dark inline-flex items-center gap-2 font-semibold"
            >
              All industries <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            {[
              "Technology",
              "E-commerce",
              "Healthcare",
              "Financial Services",
              "Real Estate",
              "Logistics",
              "Retail",
              "Hospitality",
              "Professional Services",
              "Education",
              "Startups",
              "SMBs",
              "Enterprise",
            ].map((i) => (
              <Link
                href="/industries"
                key={i}
                className="bg-mist text-navy border-line hover:border-amber2 hover:bg-amber2/10 rounded-xl border p-4 text-center text-sm font-semibold transition"
              >
                {i}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="section-pad bg-mist">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow">
                <span className="eyebrow-dot" /> Case Studies
              </div>
              <h2 className="font-display text-navy mt-4 text-4xl font-extrabold md:text-5xl">
                Real engagements. <span className="gradient-text">Measurable outcomes.</span>
              </h2>
              <p className="text-steel mt-4">
                Detailed case studies are published with client permission. Anonymized examples are
                available on request.
              </p>
            </div>
            <Link href="/case-studies" className="btn-ghost">
              View Case Studies <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <CasePlaceholder
              industry="SaaS Technology"
              title="SDR engine for a North American SaaS scale-up"
            />
            <CasePlaceholder
              industry="E-commerce"
              title="CX outsourcing for a UK-based DTC brand"
            />
            <CasePlaceholder
              industry="Financial Services"
              title="Lead generation for a Middle East fintech"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow justify-center">
              <span className="eyebrow-dot" /> How It Works
            </div>
            <h2 className="font-display text-navy mt-4 text-4xl font-extrabold md:text-5xl">
              From discovery to delivery — <span className="gradient-text">in five steps.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[
              {
                n: "01",
                t: "Discover",
                d: "Understand your business, goals and operational requirements.",
              },
              { n: "02", t: "Design", d: "Create the right outsourcing model and team structure." },
              {
                n: "03",
                t: "Build",
                d: "Recruit, train and prepare the team for your operations.",
              },
              {
                n: "04",
                t: "Launch",
                d: "Start operations with defined KPIs and transparent reporting.",
              },
              {
                n: "05",
                t: "Optimize",
                d: "Continuously review performance and improve the operation.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="border-line card-hover relative rounded-2xl border bg-white p-6"
              >
                <div aria-hidden className="text-amber2-dark font-display text-2xl font-extrabold">
                  {s.n}
                </div>
                <h3 className="font-display text-navy mt-3 text-lg font-bold">{s.t}</h3>
                <p className="text-steel mt-2 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY & OPERATIONS */}
      <section className="section-pad bg-navy-dark relative overflow-hidden text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-20" />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> Technology & Operations
            </div>
            <h2 className="font-display mt-4 text-4xl leading-tight font-extrabold md:text-5xl">
              People deliver the service. <br />
              <span className="gradient-text">Technology makes it scalable.</span>
            </h2>
            <p className="mt-5 text-lg text-white/75">
              Modern CRM, dialers, call recording, monitoring, workforce management, ticketing,
              analytics and AI assistance — engineered so every engagement is transparent,
              accountable and measurable.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "CRM & Dialers",
                "Call Recording & QA",
                "Workforce Management",
                "Ticketing & SLAs",
                "Analytics Dashboards",
                "AI Assistance",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-white/85">
                  <Cpu size={16} className="text-amber2" />
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <DashboardMock />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad from-amber2 via-amber2-light to-amber2 text-navy bg-gradient-to-br pb-32">
        <div className="container-x text-center">
          <div className="mx-auto max-w-3xl">
            <Sparkles size={28} className="mx-auto" />
            <h2 className="font-display mt-4 text-4xl leading-tight font-extrabold md:text-6xl">
              Let's build your growth team.
            </h2>
            <p className="text-navy/80 mt-5 text-lg">
              Tell us what you need to scale. We'll design the team, the process and the engagement
              model — and show you exactly how it will run.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-on-amber">
                Talk to an Outsourcing Expert <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/services" className="btn-ghost">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display gradient-text text-3xl font-extrabold">{n}</div>
      <div className="mt-1 text-xs tracking-wider text-white/70 uppercase">{l}</div>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group border-line card-hover block rounded-2xl border bg-white p-6"
    >
      <div className="bg-navy text-amber2 group-hover:bg-amber2 group-hover:text-navy flex h-12 w-12 items-center justify-center rounded-xl transition">
        {icon}
      </div>
      <h3 className="font-display text-navy mt-5 text-lg font-bold">{title}</h3>
      <p className="text-steel mt-2 text-sm leading-relaxed">{desc}</p>
      <div className="text-amber2-dark mt-4 inline-flex items-center gap-1 text-sm font-semibold">
        Learn more <ArrowRight size={14} aria-hidden />
      </div>
    </Link>
  );
}

function ModelCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="border-line card-hover rounded-2xl border bg-white p-6">
      <div className="bg-amber2/15 text-amber2-dark flex h-11 w-11 items-center justify-center rounded-xl">
        {icon}
      </div>
      <h3 className="font-display text-navy mt-4 text-lg font-bold">{title}</h3>
      <p className="text-steel mt-2 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function CasePlaceholder({ industry, title }: { industry: string; title: string }) {
  return (
    <div className="border-line card-hover overflow-hidden rounded-2xl border bg-white">
      <div className="from-navy via-slate2 to-navy-dark relative h-40 bg-gradient-to-br">
        <div className="bg-hero-grid absolute inset-0 opacity-30" />
        <Building2
          size={48}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30"
          aria-hidden
        />
      </div>
      <div className="p-5">
        <div className="text-amber2-dark text-xs font-semibold tracking-wider uppercase">
          {industry}
        </div>
        <h3 className="font-display text-navy mt-2 font-bold">{title}</h3>
        <div className="text-steel mt-3 text-sm">
          Full case study available on request — client identifying details protected.
        </div>
      </div>
    </div>
  );
}

const whyItems = [
  {
    title: "Global Delivery",
    icon: <Globe2 size={20} />,
    desc: "Supporting international businesses and markets with regional compliance awareness.",
  },
  {
    title: "Experienced Teams",
    icon: <Award size={20} />,
    desc: "Professionally trained resources aligned to your industry, tools and processes.",
  },
  {
    title: "Managed Performance",
    icon: <LineChart size={20} />,
    desc: "KPIs, dashboards and reporting — not just supplying headcount.",
  },
  {
    title: "Flexible Scaling",
    icon: <TrendingUp size={20} />,
    desc: "Scale up or down based on real-time demand and campaign performance.",
  },
  {
    title: "Cost Efficiency",
    icon: <BarChart3 size={20} />,
    desc: "Skilled teams without the full overhead of building an internal operation.",
  },
  {
    title: "True Accountability",
    icon: <ShieldCheck size={20} />,
    desc: "Clear responsibilities, SLAs and performance tracking baked into every engagement.",
  },
];

function HeroVisual() {
  return (
    <div className="relative hidden h-[460px] lg:block">
      <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur">
        <div className="bg-hero-grid absolute inset-0 opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <GlobePulse />
        </div>
      </div>
      <div className="text-navy shadow-soft border-line animate-float absolute -bottom-6 -left-6 max-w-xs rounded-xl border bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber2/15 text-amber2-dark flex h-10 w-10 items-center justify-center rounded-lg">
            <PhoneCall size={18} />
          </div>
          <div>
            <div className="text-steel text-xs tracking-wider uppercase">Telesales</div>
            <div className="font-display font-bold">Live pipeline today</div>
          </div>
        </div>
      </div>
      <div
        className="text-navy shadow-soft border-line animate-float absolute -top-4 -right-4 rounded-xl border bg-white p-4"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-navy text-amber2 flex h-10 w-10 items-center justify-center rounded-lg">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-steel text-xs tracking-wider uppercase">Conversion</div>
            <div className="font-display font-bold">+38% vs baseline</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobePulse() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="120" fill="url(#g)" />
      <circle
        cx="200"
        cy="200"
        r="100"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
      <circle
        cx="200"
        cy="200"
        r="140"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
      <circle
        cx="200"
        cy="200"
        r="170"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {[
        { x: 200, y: 110 },
        { x: 280, y: 200 },
        { x: 200, y: 290 },
        { x: 120, y: 200 },
        { x: 260, y: 130 },
        { x: 260, y: 270 },
        { x: 140, y: 130 },
        { x: 140, y: 270 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="#F5A623" />
          <circle cx={p.x} cy={p.y} r="10" fill="none" stroke="#F5A623" strokeOpacity="0.5">
            <animate attributeName="r" from="6" to="20" dur="2.5s" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              from="0.6"
              to="0"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
      {[
        [200, 110, 200, 200],
        [280, 200, 200, 200],
        [200, 290, 200, 200],
        [120, 200, 200, 200],
        [260, 130, 200, 200],
        [260, 270, 200, 200],
        [140, 130, 200, 200],
        [140, 270, 200, 200],
        [200, 110, 280, 200],
        [280, 200, 260, 270],
        [260, 270, 200, 290],
        [200, 290, 140, 270],
        [140, 270, 120, 200],
        [120, 200, 140, 130],
        [140, 130, 200, 110],
        [200, 110, 260, 130],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(245,166,35,0.4)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function FunnelVisual() {
  const stages = [
    { label: "Prospects", value: "10,000", w: "100%" },
    { label: "Contacted", value: "6,200", w: "85%" },
    { label: "Qualified", value: "1,840", w: "68%" },
    { label: "Appointments", value: "612", w: "48%" },
    { label: "Customers", value: "184", w: "28%" },
  ];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-sm tracking-wider text-white/70 uppercase">Sales Funnel · Live</div>
        <Zap size={16} className="text-amber2" />
      </div>
      <div className="space-y-3">
        {stages.map((s) => (
          <div key={s.label}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-white/85">{s.label}</span>
              <span className="font-display text-amber2 font-bold">{s.value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="from-amber2 to-amber2-light h-full rounded-full bg-gradient-to-r"
                style={{ width: s.w, transition: "width 1s" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardMock() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm tracking-wider text-white/70 uppercase">Operations Dashboard</div>
        <CheckCheck size={16} className="text-amber2" />
      </div>
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { l: "Calls Today", v: "2,184" },
          { l: "Leads", v: "612" },
          { l: "Conv. Rate", v: "8.4%" },
        ].map((m) => (
          <div key={m.l} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">{m.l}</div>
            <div className="font-display mt-1 text-2xl font-bold text-white">{m.v}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { team: "Telesales — Team A", k: "118 leads", p: 78 },
          { team: "Customer Support — Tier 1", k: "94.2% CSAT", p: 92 },
          { team: "Lead Gen — Campaign EU", k: "47 qualified", p: 64 },
          { team: "Marketing — Social", k: "12.3k reach", p: 58 },
        ].map((r) => (
          <div key={r.team} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/85">{r.team}</span>
              <span className="text-amber2 font-semibold">{r.k}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10">
              <div className="bg-amber2 h-full rounded-full" style={{ width: `${r.p}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
