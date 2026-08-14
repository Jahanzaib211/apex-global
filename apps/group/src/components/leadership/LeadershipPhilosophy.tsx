import Container from "../Container";
import SectionHeading from "../SectionHeading";
import { Telescope, ShieldCheck, Wrench, Clock } from "lucide-react";

const pillars = [
  {
    icon: Telescope,
    title: "Vision-Led",
    desc: "We lead with a clear long-term vision, then work back to the practical steps that get us there.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity-First",
    desc: "Every decision begins with the question of whether it is the right thing to do — for customers, partners and team.",
  },
  {
    icon: Wrench,
    title: "Builder Mindset",
    desc: "We are builders at heart: hands-on, practical and willing to do the unglamorous work that compounds over time.",
  },
  {
    icon: Clock,
    title: "Long-Term Orientation",
    desc: "We measure success in years. Patient capital and patient relationships are how we grow.",
  },
];

export default function LeadershipPhilosophy() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="LEADERSHIP PHILOSOPHY"
          title="How We Lead."
          subtitle="Four principles quietly shape how Apex Group makes decisions, hires, partners and grows."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className="border-navy/10 hover:border-gold border bg-white p-8 transition hover:-translate-y-1"
              >
                <Icon className="text-gold" size={28} />
                <h3 className="font-display text-navy mt-10 text-2xl">{p.title}</h3>
                <p className="text-charcoal/65 mt-3 text-sm leading-6">{p.desc}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
