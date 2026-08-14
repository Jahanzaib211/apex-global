import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const stats = [
  { label: "Projects Marketed", value: "—" },
  { label: "Cities", value: "—" },
  { label: "Developers Partnered", value: "—" },
  { label: "Years in Market", value: "—" },
];

export default function HoldingsAbout() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-5 lg:gap-20">
          <div className="lg:col-span-3">
            <SectionHeading
              eyebrow="ABOUT APEX HOLDINGS"
              title="Real Estate, Operated With Long-Term Thinking."
            />
            <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
              <p>
                Apex Holdings is the Group&apos;s real estate business. We are currently focused on
                marketing a curated portfolio of residential, commercial and mixed-use projects
                across Pakistan, working with credible developers to bring inventory to qualified
                buyers.
              </p>
              <p>
                Looking ahead, Apex Holdings is preparing for future self-owned project development.
                The direction is deliberate: build a track record in marketing and partnerships
                first, then transition toward projects we own and operate ourselves. This is the
                long-term plan, executed with patience.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="border-navy/10 border bg-white p-6">
                  <p className="font-display text-navy text-4xl">{s.value}</p>
                  <p className="text-charcoal/60 mt-2 text-xs font-semibold tracking-[.18em] uppercase">
                    {s.label}
                  </p>
                  <p className="text-gold mt-3 text-[10px] tracking-[.2em] uppercase">
                    Verified by Apex
                  </p>
                </div>
              ))}
            </div>
            <p className="text-charcoal/45 mt-4 text-xs italic">
              Specific metrics are verified annually and shared with qualified enquiries.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
