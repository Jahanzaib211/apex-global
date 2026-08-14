import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Layers, Compass, TrendingUp, BookOpen, Building } from "lucide-react";

const pillars = [
  {
    icon: Layers,
    title: "Diversified Exposure",
    desc: "Work that crosses sectors — you see how different businesses operate, not just one narrow lane.",
  },
  {
    icon: Compass,
    title: "Entrepreneurial Culture",
    desc: "Small enough to move quickly, mature enough to do it with care. Ownership is expected and supported.",
  },
  {
    icon: TrendingUp,
    title: "Long-Term Growth",
    desc: "We measure careers in years, not quarters. Internal mobility and skill-building are part of the plan.",
  },
  {
    icon: BookOpen,
    title: "Multi-Sector Learning",
    desc: "Cross-business projects, paired mentoring, and the chance to learn from operators in adjacent fields.",
  },
  {
    icon: Building,
    title: "Group-Level Stability",
    desc: "The diversified Group structure means varied career paths and a steady footing through market cycles.",
  },
];

export default function CareersIntro() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="WHY APEX"
          title="What Makes Apex a Different Place to Work."
          subtitle="A working environment shaped by the fact that we operate more than one kind of business — and value people who can think across boundaries."
        />

        <div className="bg-navy/10 mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="bg-white p-6">
                <Icon className="text-gold" size={24} />
                <h3 className="font-display text-navy mt-5 text-xl">{p.title}</h3>
                <p className="text-charcoal/65 mt-2 text-sm leading-6">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
