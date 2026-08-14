import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
export default function CompaniesIndexFuture() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Looking Ahead"
          title="More Companies Will Join the Group."
          subtitle="Apex is designed to expand thoughtfully. Future companies will add new sector capability while connecting to the same shared standards and long-term vision."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {[
            "Tech Solution",
            "Outsourcing",
            "Tours & Travels",
            "Holdings",
            "Financial Consultancy",
          ].map((c) => (
            <div key={c} className="bg-navy p-5 text-center text-xs text-white">
              Apex {c}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
