import Container from "../Container";

const focusAreas = [
  "Entrepreneurship",
  "Diversification",
  "Long-Term Value",
  "Customer Trust",
  "Innovation",
];

export default function CEOProfile() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">GROUP CEO</p>
            <h2 className="font-display text-navy mt-3 text-5xl leading-tight md:text-6xl">
              Shaikh Ahmed
            </h2>
            <p className="font-editorial text-slate mt-3 text-2xl">
              Chief Executive Officer / Group Leadership
            </p>

            <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
              <p>
                Shaikh Ahmed is an entrepreneur focused on building diversified businesses with
                long-term intent. He founded Apex Group of Companies on the belief that specialist,
                well-led businesses — supported by a shared operating philosophy — can build more
                durable value than generalist ones.
              </p>
              <p>
                Today he leads the Group across five focused areas: technology, outsourcing, travel
                and tours, real estate and financial consultancy — guiding strategy, partnerships
                and the steady expansion of the Apex ecosystem.
              </p>
            </div>

            <div className="mt-10">
              <p className="text-slate text-xs font-semibold tracking-[.25em] uppercase">
                Focus Areas
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {focusAreas.map((f) => (
                  <span
                    key={f}
                    className="border-navy/15 text-navy border bg-white px-4 py-2 text-xs font-semibold"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-navy relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(242,169,0,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(242,169,0,.18) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative flex h-full w-full flex-col items-center justify-center text-center">
                <div className="border-gold bg-navy shadow-gold/20 flex h-44 w-44 items-center justify-center rounded-full border-2 shadow-2xl">
                  <span className="font-display text-gold text-7xl">SA</span>
                </div>
                <p className="text-gold mt-8 text-xs font-semibold tracking-[.3em] uppercase">
                  Apex Group
                </p>
                <p className="font-editorial mt-2 text-2xl text-white">Shaikh Ahmed</p>
                <p className="mt-1 text-xs tracking-[.2em] text-white/60 uppercase">Group CEO</p>
              </div>

              <div className="border-gold absolute -right-4 -bottom-4 h-20 w-20 border-2" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
