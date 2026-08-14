import Container from "../Container";

export default function MissionVision() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="border-navy/10 border bg-white p-10 md:p-14">
            <div className="bg-gold mb-5 h-1 w-12" />
            <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
              OUR MISSION
            </p>
            <h3 className="font-editorial text-navy mt-3 text-4xl leading-tight md:text-5xl">
              Our Mission
            </h3>
            <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
              <p>
                To build and grow specialized businesses that serve customers with clarity,
                consistency and care.
              </p>
              <p>
                We do this by combining the focus of a specialist with the support of a group —
                investing patiently in people, operations and partnerships, and growing a connected
                ecosystem that creates value for clients, partners and the wider communities we
                operate in.
              </p>
            </div>
          </article>

          <article className="border-navy/10 border bg-white p-10 md:p-14">
            <div className="bg-gold mb-5 h-1 w-12" />
            <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">OUR VISION</p>
            <h3 className="font-editorial text-navy mt-3 text-4xl leading-tight md:text-5xl">
              Our Vision
            </h3>
            <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
              <p>
                To become a leading diversified group — Pakistan-rooted and globally connected —
                recognized for the quality of its companies, the discipline of its growth and the
                trust it builds with every customer.
              </p>
              <p>
                We see a future where the Apex name quietly anchors a portfolio of businesses that
                set a standard in their respective fields, each one strengthened by being part of
                something larger.
              </p>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
