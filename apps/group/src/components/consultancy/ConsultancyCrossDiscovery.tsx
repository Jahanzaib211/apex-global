import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    sector: "Real Estate",
    name: "Apex Holdings",
    href: "/companies/holdings",
    note: "Real estate synergy",
  },
  {
    sector: "Outsourcing",
    name: "Apex Outsourcing",
    href: "/companies/outsourcing",
    note: "Business operations",
  },
  {
    sector: "Technology",
    name: "Apex Global Tech Solution",
    href: "/companies/tech-solution",
    note: "Digital wealth tools",
  },
];

export default function ConsultancyCrossDiscovery() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="EXPLORE MORE"
          title="Where Consultancy Connects to the Group."
          subtitle="Financial thinking rarely lives in isolation. Three Group businesses often sit alongside the consultancy relationship."
        />
        <div className="bg-navy/10 mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="group hover:bg-navy block bg-white p-8 transition"
            >
              <p className="text-gold text-[10px] font-bold tracking-[.2em] uppercase">
                {c.sector}
              </p>
              <h3 className="font-display text-navy mt-8 text-2xl group-hover:text-white">
                {c.name}
              </h3>
              <p className="text-charcoal/55 mt-2 text-xs tracking-[.18em] uppercase group-hover:text-white/45">
                {c.note}
              </p>
              <ArrowUpRight className="text-gold mt-5" size={18} />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
