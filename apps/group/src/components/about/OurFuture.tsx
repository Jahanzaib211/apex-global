import Container from "../Container";
import SectionHeading from "../SectionHeading";

export default function OurFuture() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <SectionHeading eyebrow="OUR FUTURE" title="Building for What Comes Next." />
            <div className="text-charcoal/75 mt-10 space-y-6 text-base leading-7">
              <p>
                The next chapter for Apex Group is shaped by the same principles that have guided it
                so far: thoughtful expansion, patient capital and an enduring commitment to quality.
                We plan to deepen our existing businesses, broaden the Group with carefully selected
                new ventures, and explore international partnerships that strengthen the work each
                company does.
              </p>
              <p>
                Growth at Apex is never growth for its own sake. Every new direction we take —
                whether a new sector, a new geography or a new partnership — is measured against the
                same standard: does it make the Group better, does it serve customers well, and does
                it endure. The goal is not to be the largest group in every room, but to be the one
                known for the work it leaves behind.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="border-gold border-2 bg-white p-10 md:p-12">
              <div className="bg-gold mb-5 h-1 w-10" />
              <p className="font-editorial text-navy text-3xl leading-snug md:text-4xl">
                Pakistan-rooted.
                <br />
                <span className="text-gold">Globally connected.</span>
              </p>
              <p className="text-charcoal/65 mt-6 text-sm leading-6">
                Our identity is rooted in Pakistan. Our ambition is shaped by the wider world we
                serve.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
