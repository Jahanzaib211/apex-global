import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
const cards = [
  ["Tech Solution", "Explore digital capability", "/companies/tech-solution"],
  ["Outsourcing", "Explore customer operations", "/companies/outsourcing"],
  ["Tours & Travels", "Explore purposeful journeys", "/companies/tours-travels"],
  ["Holdings", "Explore long-term assets", "/companies/holdings"],
  ["Financial Consultancy", "Explore financial perspective", "/consultancy"],
];
export default function EcosystemCrossDiscovery() {
  return (
    <section className="bg-cream py-20">
      <Container>
        <SectionHeading eyebrow="Cross-Discovery" title="One Need Can Open Another Door." />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([title, desc, href]) => (
            <Link
              href={href ?? "#"}
              key={title}
              className="border-navy/10 hover:border-gold border bg-white p-5 transition hover:-translate-y-1"
            >
              <p className="font-display text-navy text-xl">{title}</p>
              <p className="text-charcoal/55 mt-2 text-xs">{desc}</p>
              <span className="text-gold mt-5 block text-xs font-semibold">Visit →</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
