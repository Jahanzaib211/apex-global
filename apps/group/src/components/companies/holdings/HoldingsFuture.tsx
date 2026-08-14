import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

export default function HoldingsFuture() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeading eyebrow="FUTURE VISION" title="Where Apex Holdings Is Going." />
          </div>
          <div className="text-charcoal/75 space-y-5 text-base leading-7 lg:col-span-2">
            <p>
              The next phase of Apex Holdings is about depth, not breadth. We are deepening our
              project curation — taking on fewer projects but working more closely with each
              developer partner, ensuring every project we market is well-conceived, properly priced
              and supported through to completion.
            </p>
            <p>
              We are building partnerships with credible developers across Pakistan. The intention
              is to be a long-term marketing and sales partner rather than a transactional channel —
              the kind of partner developers call when they want the project done right.
            </p>
            <p>
              Over time, we plan to expand into additional cities, prioritizing markets where the
              Group has operational roots and where demand fundamentals support sustainable
              development. Each new geography will be entered with patience and on the basis of real
              market evidence, not projection.
            </p>
            <p>
              The most important part of the vision is the eventual transition to self-developed
              projects. Apex Holdings will move into self-owned development when the operational
              foundation, capital readiness and partner ecosystem make it sensible to do so — and
              not before.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
