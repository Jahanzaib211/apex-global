import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Compass,
  HeartHandshake,
  Landmark,
  LineChart,
  MapPin,
  Megaphone,
  Play,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { CTASection } from "@/components/CTASection";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { events, insights, services, stats, testimonials } from "@/data/content";
import { site } from "@/data/site";
import { SpatialCanvas } from "@apex/motion/spatial-canvas";
import { TactileLink } from "@/components/tactile-link";

/* ---------------------------------------------------------------------------
 * Static content pulled from data — no fabricated numbers.
 * ------------------------------------------------------------------------ */
const heroCover =
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2200&q=80";

const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

const serviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "real-estate-marketing": Building2,
  "project-marketing": LineChart,
  "sales-lead-generation": Users,
  "digital-marketing": Megaphone,
};

const cities = [
  { name: "Lahore", note: "Headquarters · Sales Floor" },
  { name: "Karachi", note: "Coastal & High-Rise Portfolio" },
  { name: "Islamabad", note: "Diplomatic & Commercial" },
  { name: "Peshawar", note: "Emerging Frontier Market" },
];

const principles = [
  {
    icon: Compass,
    title: "Market Understanding",
    description:
      "We ground every project in a deep reading of the local market — the buyer, the developer, the price point and the narrative that earns attention.",
  },
  {
    icon: Briefcase,
    title: "Curated Portfolio",
    description:
      "Every project in the Apex portfolio is selected, not aggregated. We work with a short list of opportunities we can stand behind.",
  },
  {
    icon: Megaphone,
    title: "Professional Marketing",
    description:
      "Structured, full-funnel project marketing — the kind of discipline that turns launches into bookings and bookings into a brand.",
  },
  {
    icon: Shield,
    title: "Credibility",
    description:
      "Clear project statuses, transparent pricing notes, and sales conversations that tell the truth — even when it costs us a deal.",
  },
  {
    icon: TrendingUp,
    title: "Growth Vision",
    description:
      "From marketing partner to developer-owner — a measured, long-term trajectory toward building landmark projects of our own.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Focus",
    description:
      "A buyer experience that respects your time and your intelligence — clear communication, walkthroughs on schedule, no surprises.",
  },
];

/* ---------------------------------------------------------------------------
 * Reusable bits
 * ------------------------------------------------------------------------ */
function SectionEyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`eyebrow ${light ? "!text-gold-400" : ""} mb-4 inline-flex items-center gap-2`}
    >
      <span className="bg-gold-400 h-px w-8" />
      {children}
    </span>
  );
}

function GoldRule() {
  return <span className="bg-gold-400 block h-px w-14" />;
}

/* ---------------------------------------------------------------------------
 * 1. HERO
 * ------------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="bg-ink relative isolate overflow-hidden text-white">
      {/*
        Spatial field sits between the cover photograph and the copy, so the
        hero gains depth without losing the image the section is built around.
      */}
      <SpatialCanvas
        className="pointer-events-none absolute inset-0 z-[1]"
        density={700}
        intensity={0.65}
      />
      {/* Cover image */}
      <div className="absolute inset-0">
        <Image
          src={heroCover}
          alt="Apex Holdings — architectural cover image"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="animate-kenburns object-cover opacity-50"
        />
      </div>
      <div
        className="from-ink via-ink/85 to-ink/40 absolute inset-0 bg-gradient-to-br"
        aria-hidden
      />
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />

      {/* Gold accent line — left rail */}
      <div
        className="via-gold-400/70 absolute top-24 bottom-24 left-0 hidden w-px bg-gradient-to-b from-transparent to-transparent lg:block"
        aria-hidden
      />

      <div className="container-x relative py-28 lg:py-40">
        <div className="max-w-4xl">
          <SectionEyebrow light>{site.subTagline}</SectionEyebrow>

          <h1 className="font-display text-5xl leading-[1.05] font-bold text-white sm:text-6xl lg:text-7xl">
            <span className="block">Building Value.</span>
            <span className="text-gold-400 block font-serif font-normal italic">
              Creating Opportunities.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {site.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <TactileLink href="/projects" id="hero-cta-primary" className="btn-accent">
              Explore Projects <ArrowRight className="h-4 w-4" />
            </TactileLink>
            <Link href="/contact" className="btn-ghost-light">
              Talk to Our Team
            </Link>
          </div>

          <div className="mt-8">
            <Link
              href="/partner"
              className="tracking-wide-2 text-gold-400 hover:text-gold-300 inline-flex items-center gap-1.5 text-xs uppercase"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Partner With Us
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Small stat strip inside hero */}
        <div className="mt-16 grid max-w-3xl grid-cols-2 gap-px bg-white/10 lg:mt-24 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink/85 px-5 py-5">
              <div className="font-display text-2xl font-semibold text-white lg:text-3xl">
                {s.value}
              </div>
              <div className="tracking-wide-2 mt-1 text-[11px] text-slate-400 uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom gold hairline */}
      <div
        className="via-gold-400/40 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent"
        aria-hidden
      />

      {/* Scroll-to-explore indicator — anchors to the next section so visitors
          can keep reading without using the navigation. honour
          prefers-reduced-motion via the underlying CSS scroll-behavior on the
          html root. */}
      <a
        href="#about-strip"
        className="tracking-wide-2 hover:text-gold-400 focus-visible:ring-gold-400 focus-visible:ring-offset-ink absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] text-white/55 uppercase transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Scroll to explore the rest of the page"
      >
        <span>Scroll to explore</span>
        <span aria-hidden className="bg-gold-400/70 h-10 w-px" />
      </a>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 2. ABOUT STRIP
 * ------------------------------------------------------------------------ */
function AboutStrip() {
  return (
    <section id="about-strip" className="scroll-mt-24 bg-white">
      <div className="container-x py-20 lg:py-28">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionEyebrow>About Apex Holdings</SectionEyebrow>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              A Pakistan-based real estate company building on{" "}
              <span className="text-gold-500 font-serif font-normal italic">
                trust, transparency
              </span>{" "}
              and an earned right to develop.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="leading-relaxed text-slate-600">
              Apex Holdings connects customers and investors with carefully selected property
              opportunities across Pakistan. We market today, and we are steadily preparing for a
              future of developing landmark projects of our own. The same discipline will guide
              both.
            </p>
            <div className="mt-6">
              <GoldRule />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 3. OUR PORTFOLIO
 * ------------------------------------------------------------------------ */
function PortfolioSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="container-x py-20 lg:py-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>Our Portfolio</SectionEyebrow>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              A curated selection of marketed opportunities.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Each project below is one we are proud to put our name behind. Pricing, status and
              specifications are presented on their actual merits.
            </p>
          </div>
          <Link
            href="/projects"
            className="tracking-wide-1 text-ink hover:text-gold-500 inline-flex items-center gap-2 text-sm font-medium uppercase"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} size="lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 4. WHAT WE DO
 * ------------------------------------------------------------------------ */
function WhatWeDo() {
  return (
    <section className="bg-white">
      <div className="container-x py-20 lg:py-28">
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <SectionEyebrow>What We Do</SectionEyebrow>
          <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            Four services. One disciplined approach.
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            From positioning to lead conversion, we run the marketing playbook that lets developers
            focus on building.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc) => {
            const Icon = serviceIconMap[svc.slug] ?? Building2;
            return (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="group hover:bg-ink flex h-full flex-col bg-white p-7 transition-colors duration-500 lg:p-8"
              >
                <div className="border-gold-400 text-gold-500 group-hover:bg-gold-400 group-hover:text-ink inline-flex h-12 w-12 items-center justify-center border transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-ink mt-6 text-xl font-semibold transition-colors group-hover:text-white lg:text-2xl">
                  {svc.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 transition-colors group-hover:text-slate-300">
                  {svc.intro}
                </p>
                <div className="tracking-wide-2 text-gold-500 group-hover:text-gold-400 mt-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase">
                  Learn More
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 5. MARKET PRESENCE
 * ------------------------------------------------------------------------ */
function MarketPresence() {
  return (
    <section className="bg-ink relative isolate overflow-hidden text-white">
      <div
        className="from-navy-900 via-ink to-navy-700 absolute inset-0 bg-gradient-to-br"
        aria-hidden
      />
      <div className="bg-grid absolute inset-0 opacity-20" aria-hidden />
      <div
        className="bg-gold-400/10 absolute top-1/2 -right-32 h-[480px] w-[480px] -translate-y-1/2 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="container-x relative py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionEyebrow light>Market Presence</SectionEyebrow>
            <h2 className="font-display text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              Active across Pakistan&apos;s primary real-estate corridors.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-slate-300">
              Our footprint is deliberately focused. We work where we can operate with conviction —
              and where the buyer journey deserves a real, on-ground partner.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-px bg-white/10">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className="bg-ink/60 group hover:bg-ink/90 p-7 backdrop-blur-sm transition-colors lg:p-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="border-gold-400/50 text-gold-400 inline-flex h-10 w-10 items-center justify-center border">
                      <Landmark className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-xl font-semibold text-white lg:text-2xl">
                      {city.name}
                    </h3>
                  </div>
                  <p className="mt-3 flex items-start gap-1.5 text-sm text-slate-400">
                    <MapPin className="text-gold-400 mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{city.note}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom horizontal stat strip */}
        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 lg:mt-20 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={`mp-${s.label}`} className="flex items-baseline gap-3">
              <span className="font-display text-gold-400 text-3xl font-bold lg:text-4xl">
                {s.value}
              </span>
              <span className="tracking-wide-2 text-xs text-slate-400 uppercase">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 6. WHY APEX HOLDINGS
 * ------------------------------------------------------------------------ */
function WhyApex() {
  return (
    <section className="bg-slate-50">
      <div className="container-x py-20 lg:py-28">
        <div className="mb-14 max-w-2xl lg:mb-20">
          <SectionEyebrow>Why Apex Holdings</SectionEyebrow>
          <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            The principles that shape every project we touch.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex flex-col bg-white p-8 lg:p-10">
                <div className="flex items-center gap-4">
                  <span className="bg-gold-50 text-gold-500 border-gold-400/30 inline-flex h-12 w-12 items-center justify-center border">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-ink text-xl font-semibold lg:text-2xl">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-slate-600">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 7. VISION SECTION
 * ------------------------------------------------------------------------ */
function VisionSection() {
  return (
    <section className="bg-ink relative overflow-hidden text-white">
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />

      {/* Architectural gold rule, top-left */}
      <div
        className="from-gold-400/60 via-gold-400/10 absolute top-0 right-0 left-0 h-px bg-gradient-to-r to-transparent"
        aria-hidden
      />

      <div className="container-x relative py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <div className="text-gold-400 hidden flex-col items-center gap-4 lg:flex">
              <span className="bg-gold-400 h-12 w-px" />
              <span className="tracking-wide-3 text-xs uppercase [writing-mode:vertical-rl]">
                Our Vision
              </span>
              <span className="bg-gold-400 h-12 w-px" />
            </div>
          </div>
          <div className="lg:col-span-10">
            <SectionEyebrow light>The Road Ahead</SectionEyebrow>
            <blockquote className="font-display max-w-4xl text-3xl leading-[1.15] font-bold text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              <span className="text-gold-400 font-serif font-normal italic">
                &ldquo;From marketing partner to developer-owner —
              </span>{" "}
              a measured move into projects where we can control the full vision from land to
              handover.&rdquo;
            </blockquote>
            <p className="mt-8 max-w-2xl leading-relaxed text-slate-300">
              Our trajectory has always been deliberate: first understand the buyer, the developer
              and the market — and then earn the right to participate on the development side. That
              is the next chapter of Apex Holdings.
            </p>
            <div className="mt-10">
              <Link href="/about/vision" className="btn-accent">
                Read More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 8. EVENTS PREVIEW
 * ------------------------------------------------------------------------ */
function EventsPreview() {
  const upcoming = events.slice(0, 4);
  return (
    <section className="bg-white">
      <div className="container-x py-20 lg:py-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>Events</SectionEyebrow>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Conversations, launches and gatherings.
            </h2>
          </div>
          <Link
            href="/events"
            className="tracking-wide-1 text-ink hover:text-gold-500 inline-flex items-center gap-2 text-sm font-medium uppercase"
          >
            All Events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {upcoming.map((event) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="group card-base block overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={event.cover}
                  alt={event.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="from-ink/70 via-ink/10 absolute inset-0 bg-gradient-to-t to-transparent"
                  aria-hidden
                />
                <div className="absolute top-4 left-4">
                  <span className="pill-gold !border-white !bg-white/95">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="p-5 lg:p-6">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="text-gold-500 h-3.5 w-3.5" />
                  {event.location}
                </div>
                <h3 className="font-display text-ink group-hover:text-gold-600 line-clamp-2 text-lg font-semibold transition-colors">
                  {event.title}
                </h3>
                <div className="text-gold-500 mt-4 inline-flex items-center gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-3 w-3" />
                  View Details
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 9. LATEST UPDATES (INSIGHTS)
 * ------------------------------------------------------------------------ */
function LatestUpdates() {
  const latest = insights.slice(0, 3);
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="container-x py-20 lg:py-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>Latest Updates</SectionEyebrow>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Insights from the Apex editorial desk.
            </h2>
          </div>
          <Link
            href="/insights"
            className="tracking-wide-1 text-ink hover:text-gold-500 inline-flex items-center gap-2 text-sm font-medium uppercase"
          >
            All Insights
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {latest.map((post) => (
            <Link
              key={post.slug}
              href={`/insights/${post.slug}`}
              className="group card-base block overflow-hidden bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="pill-gold">{post.category}</span>
                </div>
              </div>
              <div className="p-6 lg:p-7">
                <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <h3 className="font-display text-ink group-hover:text-gold-600 text-xl leading-snug font-semibold transition-colors lg:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
                <div className="tracking-wide-2 text-ink group-hover:text-gold-500 mt-5 inline-flex items-center gap-1.5 border-t border-slate-100 pt-5 text-xs font-medium uppercase">
                  Read Article
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 11. TESTIMONIALS
 * ------------------------------------------------------------------------ */
function TestimonialsSection() {
  return (
    <section className="bg-white">
      <div className="container-x py-20 lg:py-28">
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <SectionEyebrow>Testimonials</SectionEyebrow>
          <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            In our customers&apos; own words.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((t, i) => (
            <figure
              key={`${t.name}-${i}`}
              className="relative border border-slate-200 bg-slate-50 p-8 lg:p-10"
            >
              <Award className="text-gold-400 h-7 w-7" />
              <blockquote className="text-ink mt-6 font-serif text-xl leading-relaxed lg:text-2xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 border-t border-slate-200 pt-6">
                <div className="font-display text-ink text-base font-semibold">{t.name}</div>
                <div className="mt-1 text-xs text-slate-500">{t.role}</div>
                {t.project && (
                  <div className="tracking-wide-2 text-gold-500 mt-3 text-[11px] uppercase">
                    {t.project}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------ */
export default function Home() {
  return (
    <div>
      <Hero />
      <AboutStrip />
      <PortfolioSection />
      <WhatWeDo />
      <MarketPresence />
      <WhyApex />
      <VisionSection />
      <EventsPreview />
      <LatestUpdates />
      <CTASection
        variant="dark"
        eyebrow="Let’s Build"
        title="Let’s Build the Future Together."
        description="Partner with Apex Holdings on your next project or explore a curated opportunity from our marketed portfolio."
        primary={{ label: "Partner With Us", href: "/partner" }}
        secondary={{ label: "Contact Our Team", href: "/contact" }}
      />
      <TestimonialsSection />
    </div>
  );
}
