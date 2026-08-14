import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
const current = [
  "Tech Solution",
  "Outsourcing",
  "Tours & Travels",
  "Holdings",
  "Financial Consultancy",
];
export default function EcosystemFuture() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Future Companies"
          title="The Ecosystem Is Designed to Grow."
          subtitle="The architecture supports new Apex companies without rebuilding the Group story. Future businesses can join with their own sector focus while keeping a clear connection to the wider ecosystem."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {current.map((c) => (
            <div key={c} className="bg-navy p-4 text-center text-xs text-white">
              Apex {c}
            </div>
          ))}
          {["06", "07", "08"].map((c) => (
            <div
              key={c}
              className="border-gold text-navy border border-dashed p-4 text-center text-xs"
            >
              Company {c}
              <span className="text-navy/45 mt-1 block text-[10px]">To be announced</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
