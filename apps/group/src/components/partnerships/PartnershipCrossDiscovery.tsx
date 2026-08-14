import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ArrowUpRight } from "lucide-react";

const cards = [
  { sector: "Technology", name: "Apex Global Tech Solution", href: "/companies/tech-solution" },
  { sector: "Outsourcing", name: "Apex Global Outsourcing", href: "/companies/outsourcing" },
  { sector: "Real Estate", name: "Apex Holdings", href: "/companies/holdings" },
];

export default function PartnershipCrossDiscovery() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="EXPLORE MORE"
          title="Where Partnerships Often Begin."
          subtitle="Three Group businesses where partnership conversations most commonly start."
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
              <ArrowUpRight className="text-gold mt-5" size={18} />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
