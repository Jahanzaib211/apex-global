import Container from "../Container";
import SectionHeading from "../SectionHeading";
import { ShieldCheck, Award, Lightbulb, Scale, Users, Briefcase, Telescope } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    name: "Integrity",
    desc: "We do what we say. Trust is built through honesty, transparency and a refusal to cut corners.",
  },
  {
    icon: Award,
    name: "Excellence",
    desc: "We aim for the standard we would want as a customer — and we keep refining until we reach it.",
  },
  {
    icon: Lightbulb,
    name: "Innovation",
    desc: "We stay curious, ask better questions and look for practical, useful ways to improve.",
  },
  {
    icon: Scale,
    name: "Accountability",
    desc: "We own our work — its outcomes, its lessons and the responsibility to do better next time.",
  },
  {
    icon: Users,
    name: "Customer Focus",
    desc: "Every decision starts from the customer's perspective: their needs, their context, their time.",
  },
  {
    icon: Briefcase,
    name: "Professionalism",
    desc: "We bring rigor, preparation and respect to every interaction — internal and external.",
  },
  {
    icon: Telescope,
    name: "Long-Term Thinking",
    desc: "We measure success in years, not quarters — and we build for what comes next.",
  },
];

export default function OurValues() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="OUR VALUES"
          title="Principles That Guide Every Decision."
          subtitle="The same standards run through every Apex business — quietly shaping how we work, who we partner with and what we are willing to be known for."
        />

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.name} className="border-navy/15 border-t pt-6">
                <Icon className="text-gold" size={26} />
                <h3 className="font-display text-navy mt-5 text-2xl">{v.name}</h3>
                <p className="text-charcoal/65 mt-2 text-sm leading-6">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
