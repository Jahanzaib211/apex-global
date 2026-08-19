import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { servicesContent } from "./content";
import { SERVICE_SLUGS, type ServiceSlug } from "@/lib/nav";
import { CONTACT } from "@/lib/contact";

export function generateStaticParams(): Array<{ slug: string }> {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = servicesContent[slug];
  if (!c) return { title: "Service not found" };
  return {
    title: c.title,
    description: c.tagline,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: c.title,
      description: c.tagline,
      url: `/services/${slug}`,
    },
  };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const c = servicesContent[rawSlug];
  if (!c) notFound();
  const slug = rawSlug as ServiceSlug;

  return (
    <main className="bg-white">
      <Navbar />

      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-20 text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <div className="text-amber2 text-xs font-semibold tracking-widest uppercase">
            Service Division
          </div>
          <h1 className="font-display mt-3 max-w-4xl text-5xl leading-tight font-extrabold md:text-6xl">
            {c.heroTitle} <span className="gradient-text">{c.heroHighlight}</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-white/75">{c.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Request a Proposal <ArrowRight size={18} />
            </Link>
            <Link href="/services" className="btn-on-dark">
              All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> Overview
            </div>
            <h2 className="font-display text-navy mt-4 text-3xl font-extrabold md:text-4xl">
              {c.overviewTitle}
            </h2>
            <div className="text-steel mt-5 space-y-4 leading-relaxed">
              {c.overview.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-12">
              <div className="eyebrow">
                <span className="eyebrow-dot" /> What We Deliver
              </div>
              <h3 className="font-display text-navy mt-3 text-2xl font-bold">Core capabilities</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {c.capabilities.map((cap) => (
                  <div
                    key={cap}
                    className="bg-mist border-line flex items-start gap-2 rounded-xl border p-4"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-amber2-dark mt-0.5 shrink-0"
                      aria-hidden
                    />
                    <span className="text-navy text-sm font-medium">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <div className="eyebrow">
                <span className="eyebrow-dot" /> Approach
              </div>
              <h3 className="font-display text-navy mt-3 text-2xl font-bold">
                How an engagement runs
              </h3>
              <ol className="mt-6 space-y-3">
                {c.process.map((step, i) => (
                  <li
                    key={step.t}
                    className="border-line flex gap-4 rounded-xl border bg-white p-5"
                  >
                    <div
                      aria-hidden
                      className="bg-amber2 text-navy font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-extrabold"
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-display text-navy font-bold">{step.t}</div>
                      <div className="text-steel mt-1 text-sm">{step.d}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">
              <div className="bg-navy rounded-2xl p-6 text-white">
                <div className="text-amber2 text-xs font-semibold tracking-widest uppercase">
                  Get Started
                </div>
                <h3 className="font-display mt-2 text-xl font-bold">
                  Talk to a {shortLabel(slug)} specialist.
                </h3>
                <p className="mt-3 text-sm text-white/75">
                  Tell us your goals and we'll design the right engagement model.
                </p>
                <Link href="/contact" className="btn-primary mt-5 w-full justify-center">
                  Request a Proposal
                </Link>
              </div>

              <nav
                aria-label="Related services"
                className="bg-mist border-line rounded-2xl border p-6"
              >
                <div className="text-amber2-dark text-xs font-semibold tracking-widest uppercase">
                  Related
                </div>
                <ul className="divide-line mt-4 divide-y">
                  {c.related.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className="text-navy hover:text-amber2-dark flex items-center justify-between py-3 font-semibold transition"
                      >
                        {r.label}
                        <ArrowRight size={14} className="text-amber2-dark" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </section>

      <section className="from-amber2 to-amber2-light text-navy bg-gradient-to-br py-24 pb-32">
        <div className="container-x text-center">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            Ready to deploy {c.title}?
          </h2>
          <p className="text-navy/80 mx-auto mt-3 max-w-2xl">
            We'll help you design the team, KPIs and operating model — and launch within weeks, not
            months.
          </p>
          <Link href="/contact" className="btn-primary mt-6">
            Talk to Our Team <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/** Map a service slug to a short noun for the sidebar CTA. */
function shortLabel(slug: ServiceSlug): string {
  switch (slug) {
    case "bpo":
      return "BPO";
    case "customer-experience":
      return "CX";
    case "tele-sales":
      return "Telesales";
    case "sales-development":
      return "Lead Gen";
    case "digital-marketing":
      return "Digital Marketing";
    case "back-office":
      return "Back-Office";
    case "dedicated-teams":
      return "Dedicated Teams";
    case "staffing":
      return "Staffing";
  }
}

// satisfies unused-import linter in case CONTACT is not used after refactor
void CONTACT;
