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

export default function ContactCrossDiscovery() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="EXPLORE THE GROUP"
          title="Visit a Company Page."
          subtitle="If you already know which Apex business your enquiry relates to, you can reach it directly."
        />

        <div className="bg-navy/10 mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="group hover:bg-navy block bg-white p-6 transition"
            >
              <p className="text-gold text-[10px] font-bold tracking-[.2em] uppercase">
                {c.sector}
              </p>
              <h3 className="font-display text-navy mt-6 text-xl group-hover:text-white">
                {c.name}
              </h3>
              <p className="text-navy group-hover:text-gold mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-[.18em] uppercase">
                Visit page <ArrowUpRight size={12} />
              </p>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
