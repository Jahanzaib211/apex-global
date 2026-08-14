import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const stats = [
  { label: "Years Operating" },
  { label: "Active Campaigns" },
  { label: "Languages Supported" },
  { label: "Team Size" },
];

export default function OutsourcingAbout() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="About Apex Global Outsourcing"
              title="A Global Outsourcing Partner Built for Growth."
              subtitle="Apex Global Outsourcing exists to extend our clients' capacity — through trained teams, repeatable processes and accountable operations, across time zones and languages."
            />
            <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
              <p>
                Outsourcing is too often treated as a cost decision. We treat it as an operating
                decision — how work gets done, who owns it, and how quality is measured once a
                campaign is live.
              </p>
              <p>
                Engagements combine trained operators, defined processes and the technology needed
                to run campaigns at scale. The goal is a team that feels embedded with the client —
                not a handoff to a distant queue.
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
                Figures below are placeholders. Verified metrics are published on the Group profile
                once available.
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
