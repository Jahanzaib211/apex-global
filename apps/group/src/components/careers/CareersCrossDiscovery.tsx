import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ArrowUpRight } from "lucide-react";

const cards = [
  { sector: "Technology", name: "Apex Global Tech Solution", href: "/companies/tech-solution" },
  { sector: "Outsourcing", name: "Apex Global Outsourcing", href: "/companies/outsourcing" },
  {
    sector: "Tours & Travels",
    name: "Apex Global Tours & Travels",
    href: "/companies/tours-travels",
  },
  { sector: "Real Estate", name: "Apex Holdings", href: "/companies/holdings" },
  {
    sector: "Financial Consultancy",
    name: "Apex Group Financial Consultancy",
    href: "/consultancy",
  },
];

export default function CareersCrossDiscovery() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="EXPLORE CAREERS AT…"
          title="Each Group Company Hires on Its Own."
          subtitle="Use the company pages to learn more about the work and the people behind each business."
        />
        <div className="bg-navy/10 mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="group hover:bg-navy block bg-white p-6 transition"
            >
              <p className="text-gold text-[10px] font-bold tracking-[.2em] uppercase">
                Explore careers at
              </p>
              <h3 className="font-display text-navy mt-6 text-xl group-hover:text-white">
                {c.name}
              </h3>
              <ArrowUpRight className="text-gold mt-4" size={16} />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
