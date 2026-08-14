import Container from "../Container";
import SectionHeading from "../SectionHeading";
import { Layers3, Compass, Telescope } from "lucide-react";

const cards = [
  {
    icon: Layers3,
    title: "Diversified Portfolio",
    desc: "Five specialized businesses operating across technology, outsourcing, travel, real estate and financial consultancy — connected, but each with its own focus and expertise.",
  },
  {
    icon: Compass,
    title: "Entrepreneurial Foundation",
    desc: "Built by builders. The Group is shaped by an entrepreneurial mindset that values curiosity, practical work and the discipline to follow through.",
  },
  {
    icon: Telescope,
    title: "Long-Term Orientation",
    desc: "Decisions are made with the next chapter in mind. We invest patiently, grow sustainably and value relationships that compound over time.",
  },
];

export default function WhoWeAre() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="WHO WE ARE"
          title="A Diversified Group Operating With One Standard."
          subtitle="Apex Group exists to bring specialist depth to each of its businesses while carrying a shared standard of quality across every customer and partner relationship."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.title}
                className="group border-navy/10 bg-cream hover:border-gold border p-8 transition hover:-translate-y-1"
              >
                <Icon className="text-gold" size={28} />
                <h3 className="font-display text-navy mt-10 text-2xl">{c.title}</h3>
                <p className="text-charcoal/65 mt-3 text-sm leading-6">{c.desc}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
