import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { LockKeyhole, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Button from "./Button";

/**
 * Apex group -> company cards. Each non-consultancy card links to the
 * dedicated `/companies/<slug>` page (not `#contact`). Previously the cards
 * hard-coded `href="#contact"` so every "Explore" click jumped straight to
 * the contact form, hiding the company pages themselves.
 */

const companies = [
  {
    name: "Technology Solution",
    sector: "TECHNOLOGY",
    href: "/companies/tech-solution",
    desc: "Digital solutions shaped around practical business needs.",
  },
  {
    name: "Outsourcing",
    sector: "OUTSOURCING",
    href: "/companies/outsourcing",
    desc: "Reliable support and operations that help teams focus on what matters.",
  },
  {
    name: "Tours & Travels",
    sector: "TRAVEL & TOURS",
    href: "/companies/tours-travels",
    desc: "Thoughtful travel planning for journeys with less friction.",
  },
  {
    name: "Holdings",
    sector: "REAL ESTATE",
    href: "/companies/holdings",
    desc: "A considered approach to property and long-term value.",
  },
] as const;

export default function OurCompanies() {
  return (
    <section id="companies" className="scroll-mt-24 bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="OUR COMPANIES"
          title="Specialized Businesses. Unified Vision."
          subtitle="Explore the distinct companies that make up the Apex ecosystem."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {companies.map((c, i) => (
            <article
              key={c.href}
              className="group border-navy/10 bg-cream hover:border-gold min-h-[270px] border p-8 transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <span className="text-gold text-[10px] font-bold tracking-[.2em]">
                  0{i + 1} / {c.sector}
                </span>
                <ArrowUpRight className="text-navy/40 group-hover:text-gold transition" />
              </div>
              <h3 className="font-display text-navy mt-20 text-3xl">Apex {c.name}</h3>
              <p className="text-charcoal/60 mt-3 max-w-sm text-sm leading-6">{c.desc}</p>
              <Link
                href={c.href}
                className="text-navy hover:text-gold mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
              >
                Explore <ArrowUpRight size={14} />
              </Link>
            </article>
          ))}
        </div>

        <article className="border-gold bg-navy mt-4 border-2 p-8 text-white md:flex md:items-center md:justify-between md:p-10">
          <div>
            <span className="border-gold/60 text-gold inline-flex items-center gap-2 border px-3 py-1 text-[10px] tracking-widest uppercase">
              <LockKeyhole size={12} /> Private & Confidential
            </span>
            <h3 className="font-display mt-6 text-3xl">Financial Consultancy</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Strategic guidance for individuals, entrepreneurs and businesses. Consultancy is
              subject to scope, suitability and applicable professional standards; no outcome is
              guaranteed.
            </p>
          </div>
          <Button href="#contact" anchor variant="primary" className="mt-8 shrink-0 md:mt-0">
            Start a Conversation
          </Button>
        </article>
      </Container>
    </section>
  );
}
