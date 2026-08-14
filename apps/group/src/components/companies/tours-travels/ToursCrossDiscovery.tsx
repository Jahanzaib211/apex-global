import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ArrowUpRight } from "lucide-react";

const cards = [
  { sector: "Technology", name: "Apex Global Tech Solution", href: "/companies/tech-solution" },
  { sector: "Outsourcing", name: "Apex Outsourcing", href: "/companies/outsourcing" },
  { sector: "Real Estate", name: "Apex Holdings", href: "/companies/holdings" },
];

export default function ToursCrossDiscovery() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="EXPLORE MORE"
          title="Other Apex Businesses."
          subtitle="Travel often sits inside a wider set of needs. Explore the Group's other companies."
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
              <h3 className="font-display text-navy mt-10 text-2xl group-hover:text-white">
                {c.name}
              </h3>
              <ArrowUpRight className="text-gold mt-5" size={18} />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
