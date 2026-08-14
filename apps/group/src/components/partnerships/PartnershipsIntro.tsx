import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

export default function PartnershipsIntro() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="WHY PARTNER WITH APEX"
          title="A Group With Multi-Sector Reach."
          subtitle="A diversified group creates partnership possibilities that single-vertical operators rarely can."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="text-charcoal/75 space-y-5 text-base leading-8">
            <p>
              Apex Group operates specialized businesses across technology, outsourcing, travel,
              real estate and financial consultancy. Each operates with its own focus and team;
              together they form a coordinated ecosystem of capability.
            </p>
            <p>
              For a partner, that coordination translates into fewer handoffs, more context sharing,
              and a counterpart who can think across sectors — not just within one narrow lane.
              Whether you are a technology provider, a property developer, a travel supplier, or a
              BPO client, you engage with a Group that already understands the business language of
              several other industries.
            </p>
          </div>
          <div className="text-charcoal/75 space-y-5 text-base leading-8">
            <p>
              We invest in long-term collaborations. Our preference is for partners who think in
              years, not transactions — and who value shared infrastructure, mutual reputation, and
              quiet, professional execution over short-term wins.
            </p>
            <p>
              We do not chase every opportunity. We focus on partnerships where there is genuine
              alignment, where each side can bring something the other cannot easily build alone,
              and where the work can be measured in outcomes rather than activity.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
