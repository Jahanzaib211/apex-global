import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
export default function CompaniesIndexWhy() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="Why a Group Structure"
          title="Specialized Focus. Shared Strength."
        />
        <div className="text-charcoal/70 mt-10 max-w-4xl space-y-5 text-lg leading-8">
          <p>
            A group structure lets each company stay close to the needs, language and operating
            realities of its own sector. That focus supports sharper decisions and more relevant
            service.
          </p>
          <p>
            At the same time, shared standards create consistency across the ecosystem. Companies
            can learn from adjacent sectors, access group-level support and build relationships that
            do not exist in isolation.
          </p>
          <p>
            The structure also gives Apex room to think long term. Financial strength, disciplined
            governance and a clear operating culture provide a foundation for durable growth without
            requiring every business to look the same.
          </p>
          <p>
            As new opportunities emerge, the Group can add new companies with their own identity
            while preserving the clarity of the wider vision.
          </p>
        </div>
      </Container>
    </section>
  );
}
