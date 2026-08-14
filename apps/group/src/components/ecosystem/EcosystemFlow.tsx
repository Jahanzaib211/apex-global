import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
const flows = [
  ["A technology client needs outsourcing support", "Technology", "Outsourcing"],
  ["A real estate investor seeks financial advice", "Holdings", "Financial Consultancy"],
  ["A Hajj traveller wants car rentals in Saudi Arabia", "Tours & Travels", "Travel support"],
];
export default function EcosystemFlow() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow="Client Journey" title="How Clients Move Across the Group." />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {flows.map(([copy, start, end]) => (
            <article key={copy} className="border-navy/10 border bg-white p-6">
              <p className="text-charcoal/70 text-sm leading-6">{copy}</p>
              <div className="text-navy mt-8 flex items-center gap-3 text-xs font-semibold">
                <span className="bg-navy rounded-full px-3 py-2 text-white">{start}</span>
                <span className="text-gold">→</span>
                <span className="border-gold rounded-full border px-3 py-2">{end}</span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
