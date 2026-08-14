import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
const cards = [
  ["Tech Solution", "Digital capability", "/companies/tech-solution"],
  ["Outsourcing", "Customer operations", "/companies/outsourcing"],
  ["Tours & Travels", "Purposeful journeys", "/companies/tours-travels"],
  ["Holdings", "Long-term assets", "/companies/holdings"],
  ["Financial Consultancy", "Financial perspective", "/consultancy"],
];
export default function CompaniesIndexCrossDiscovery() {
  return (
    <section className="bg-cream py-20">
      <Container>
        <SectionHeading eyebrow="Cross-Discovery" title="A Wider View Can Be Useful." />
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
