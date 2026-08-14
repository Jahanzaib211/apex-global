import Container from "../Container";
import SectionHeading from "../SectionHeading";

export default function OurStory() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="OUR STORY"
              title="Built Through Vision. Grown Through Diversification."
            />
            <div className="text-charcoal/75 mt-10 space-y-6 text-base leading-7">
              <p>
                Apex Group of Companies was formed with a clear conviction: that specialized,
                well-led businesses build more durable value than generalist ones. From that
                foundation, the Group has grown to operate across five focused areas — technology,
                outsourcing, travel and tours, real estate, and financial consultancy — each run
                with the depth of a specialist and the support of a shared operating philosophy.
              </p>
              <p>
                What unites these businesses is not a sector but an approach. We are builders at
                heart: entrepreneurial in our thinking, patient in our capital, and committed to the
                long-term relationships that allow each company in the Group to grow on its own
                terms. Today, Apex Group continues to expand — adding new ventures, deepening
                existing ones and quietly shaping the next chapter of diversified growth from
                Pakistan.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-navy relative h-full min-h-[420px] overflow-hidden p-10 text-white">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(242,169,0,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(242,169,0,.18) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="border-gold/50 bg-gold/10 inline-flex items-center gap-2 border px-4 py-2">
                    <span className="text-gold text-[10px] font-bold tracking-[.25em] uppercase">
                      EST.
                    </span>
                    <span className="font-display text-gold text-sm">Apex Group</span>
                  </div>
                </div>

                <div>
                  <div className="bg-gold mb-6 h-px w-20" />
                  <p className="font-editorial text-3xl leading-snug text-white md:text-4xl">
                    Building Businesses.
                    <br />
                    Creating Value.
                    <br />
                    <span className="text-gold">Shaping the Future.</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-gold absolute -right-6 -bottom-6 hidden h-24 w-24 border-2 lg:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}
