import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ShieldCheck, Award, Lightbulb, Scale, Users, Briefcase, Telescope } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    name: "Integrity",
    desc: "Honesty, transparency, and a refusal to cut corners.",
  },
  { icon: Award, name: "Excellence", desc: "Aiming for the standard we would want as a customer." },
  {
    icon: Lightbulb,
    name: "Innovation",
    desc: "Asking better questions and looking for practical improvements.",
  },
  { icon: Scale, name: "Accountability", desc: "Owning our work — its outcomes and its lessons." },
  {
    icon: Users,
    name: "Customer Focus",
    desc: "Every decision starts from the customer perspective.",
  },
  {
    icon: Briefcase,
    name: "Professionalism",
    desc: "Rigor, preparation and respect in every interaction.",
  },
  {
    icon: Telescope,
    name: "Long-Term Thinking",
    desc: "Measuring success in years, not quarters.",
  },
];

export default function CareersValues() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="OUR VALUES"
          title="How We Work."
          subtitle="The same standards run through every Apex business — quietly shaping how we hire, develop, and grow people."
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
