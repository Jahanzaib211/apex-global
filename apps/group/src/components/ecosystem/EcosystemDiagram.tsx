"use client";
import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
const companies = [
  {
    name: "Tech Solution",
    short: "Technology",
    desc: "Digital products, SaaS thinking and practical technology solutions for modern businesses.",
    services: "SaaS · Product development · Digital systems",
    href: "/companies/tech-solution",
  },
  {
    name: "Outsourcing",
    short: "Outsourcing",
    desc: "Structured customer operations that help organizations serve people with consistency.",
    services: "BPO · Telesales · Customer support",
    href: "/companies/outsourcing",
  },
  {
    name: "Tours & Travels",
    short: "Travel",
    desc: "Purposeful journeys, pilgrimage support and travel logistics designed around care.",
    services: "Hajj & Umrah · Travel · Car rentals",
    href: "/companies/tours-travels",
  },
  {
    name: "Holdings",
    short: "Real Estate",
    desc: "Long-term thinking across property, assets and opportunities with durable value.",
    services: "Real estate · Property · Investments",
    href: "/companies/holdings",
  },
  {
    name: "Financial Consultancy",
    short: "Advisory",
    desc: "Clear financial perspective for businesses, investors and high-net-worth individuals.",
    services: "Advisory · Strategy · HNWI support",
    href: "/consultancy",
  },
];
export default function EcosystemDiagram() {
  const [active, setActive] = useState<(typeof companies)[number] | null>(null);
  return (
    <section className="py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
          <div className="relative mx-auto flex min-h-[560px] w-full max-w-3xl items-center justify-center">
            <div className="border-gold/20 absolute h-72 w-72 rounded-full border md:h-96 md:w-96" />
            <div className="border-gold bg-navy font-display shadow-gold/20 z-10 flex h-48 w-48 items-center justify-center rounded-full border-2 p-8 text-center text-xl text-white shadow-2xl">
              APEX GROUP
              <br />
              OF COMPANIES
            </div>
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 items-center gap-4 md:grid-cols-3 md:grid-rows-2">
              {companies.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setActive(c)}
                  className={`text-navy hover:border-gold border bg-white p-5 text-center text-sm font-semibold transition hover:-translate-y-1 hover:shadow-xl ${i === 0 ? "md:col-start-2 md:row-start-1" : i === 1 ? "md:col-start-3 md:row-start-1" : i === 2 ? "md:col-start-3 md:row-start-2" : i === 3 ? "md:col-start-1 md:row-start-2" : "md:col-start-1 md:row-start-1"}`}
                >
                  <span className="text-gold block text-[10px] tracking-wider uppercase">
                    {c.short}
                  </span>
                  <span className="mt-2 block">Apex {c.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="border-gold min-h-[260px] border-l-2 bg-white p-7 shadow-sm">
            <p className="text-gold text-xs tracking-[.2em] uppercase">
              {active ? "Selected company" : "Explore a company"}
            </p>
            <h2 className="font-display text-navy mt-3 text-3xl">
              {active ? `Apex ${active.name}` : "Five businesses. One direction."}
            </h2>
            <p className="text-charcoal/65 mt-4 leading-7">
              {active
                ? active.desc
                : "Select a node to see how each specialized company contributes to the wider Group."}
            </p>
            {active && (
              <>
                <p className="text-navy/50 mt-5 text-xs font-semibold tracking-wider uppercase">
                  {active.services}
                </p>
                <Link
                  href={active.href}
                  className="text-navy decoration-gold mt-6 inline-block text-sm font-semibold underline decoration-2 underline-offset-8"
                >
                  Learn more →
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
