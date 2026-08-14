import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Target, PenLine, Gauge } from "lucide-react";

const cards = [
  {
    Icon: Target,
    title: "Performance Marketing",
    body: "Paid acquisition programmes across search, social and display — set up around clear conversion metrics, not vanity traffic.",
  },
  {
    Icon: PenLine,
    title: "Content & SEO",
    body: "Editorial and search programmes that compound over time — built around topics the audience actually searches for.",
  },
  {
    Icon: Gauge,
    title: "Campaign Operations",
    body: "The operational layer behind every campaign — assets, trafficking, tracking, reporting and continuous optimization.",
  },
];

export default function OutsourcingMarketing() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Marketing"
              title="Digital Marketing and Customer Acquisition."
            />
            <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
              <p>
                Marketing operations are designed around the customer acquisition journey — from
                first impression to qualified enquiry. Paid, organic and operational marketing run
                with shared measurement, not in separate silos.
              </p>
              <p>
                Campaigns are built to be repeatable, with creative, targeting and reporting kept
                close enough that the team can actually act on what the data is showing.
              </p>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            {cards.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="border-navy/10 hover:border-gold border bg-white p-6 transition"
              >
                <Icon className="text-gold" size={22} />
                <h3 className="font-display text-navy mt-4 text-xl">{title}</h3>
                <p className="text-charcoal/65 mt-2 text-sm leading-6">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
