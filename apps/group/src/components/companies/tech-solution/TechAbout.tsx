import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const stats = [
  { label: "Years in Tech" },
  { label: "Products Delivered" },
  { label: "Industries Served" },
  { label: "Engineers" },
];

export default function TechAbout() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="About Apex Global Tech Solution"
              title="A Technology Partner for the Modern Enterprise."
              subtitle="Apex Global Tech Solution brings together product engineering, IT services and applied AI under one operating company — so clients get a single accountable partner, not a sprawl of vendors."
            />
            <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
              <p>
                Our model is built around outcomes. Engagements are shaped around the business
                problem first — workflows, data, constraints and the operating reality of the team —
                and only then translated into the right mix of software, platforms and managed
                services.
              </p>
              <p>
                From early-stage products to established enterprises modernizing legacy systems, the
                team works as an embedded extension of our clients — combining architecture,
                engineering, security and delivery discipline to ship work that holds up in
                production.
              </p>
            </div>
          </div>

          <div>
            <div className="border-navy/10 bg-cream border p-8">
              <p className="text-slate text-[10px] font-bold tracking-[.2em] uppercase">
                Verified by Apex
              </p>
              <p className="font-editorial text-navy mt-2 text-xl">
                Operating footprint at a glance
              </p>
              <p className="text-charcoal/55 mt-2 text-xs leading-6">
                Verified metrics are published on the Group profile once available.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                {stats.map((s) => (
                  <div key={s.label} className="border-navy/10 border-t pt-5">
                    <div className="font-display text-gold text-5xl leading-none">—</div>
                    <p className="text-slate mt-3 text-[11px] font-bold tracking-[.18em] uppercase">
                      {s.label}
                    </p>
                    <p className="text-charcoal/40 mt-1 text-[10px] tracking-[.15em] uppercase">
                      Verified by Apex
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
