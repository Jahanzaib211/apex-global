import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SERVICES, ROUTE_META } from "@/lib/nav";

export const metadata: Metadata = {
  title: ROUTE_META["/services"]!.title,
  description: ROUTE_META["/services"]!.description,
  alternates: { canonical: "/services" },
  openGraph: {
    // Declaring openGraph replaces the root layout\'s entire node, which
    // dropped its image. The generated card lives at /opengraph-image.
    images: ["/opengraph-image"],
    title: ROUTE_META["/services"]!.title,
    description: ROUTE_META["/services"]!.description,
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <main className="bg-white">
      <Navbar />

      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-20 text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Our Services
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-5xl leading-tight font-extrabold md:text-6xl">
            Nine service divisions.{" "}
            <span className="gradient-text">Built to scale your business.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Each division can be deployed standalone or combined into a fully managed engagement.
            Every service is measured against KPIs that actually move your business.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={s.href}
              className="group border-line card-hover block rounded-2xl border bg-white p-7"
            >
              <div className="bg-navy text-amber2 group-hover:bg-amber2 group-hover:text-navy flex h-12 w-12 items-center justify-center rounded-xl transition">
                <span className="font-display font-bold">
                  {s.shortLabel.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <h2 className="font-display text-navy mt-5 text-xl font-bold">{s.title}</h2>
              <p className="text-steel mt-3 text-sm leading-relaxed">
                Explore our {s.shortLabel.toLowerCase()} service division.
              </p>
              <div className="text-amber2-dark mt-5 inline-flex items-center gap-1 text-sm font-semibold">
                Explore service <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-mist border-line border-t py-16">
        <div className="container-x text-center">
          <h2 className="font-display text-navy text-3xl font-extrabold md:text-4xl">
            Not sure which service fits?
          </h2>
          <p className="text-steel mt-3">We'll help you design the right engagement model.</p>
          <Link href="/contact" className="btn-primary mt-6">
            Talk to an Expert <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
