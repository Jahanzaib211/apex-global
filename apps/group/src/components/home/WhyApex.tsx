import Container from "../Container";
import SectionHeading from "../SectionHeading";
import { Compass, Layers3, Cpu, HeartHandshake, Telescope, Network } from "lucide-react";
const pillars: Array<
  [string, string, React.ComponentType<{ className?: string; size?: string | number }>]
> = [
  ["Diversified Expertise", "Focused companies bring depth across complementary sectors.", Layers3],
  ["Entrepreneurial Approach", "We stay curious, practical and close to the work.", Compass],
  ["Technology-Driven", "We use technology to make better work possible.", Cpu],
  [
    "Customer Focus",
    "Relationships are built through clarity and consistent care.",
    HeartHandshake,
  ],
  ["Long-Term Vision", "We make decisions with the next chapter in mind.", Telescope],
  ["Growing Ecosystem", "Each connection creates room for the wider group to grow.", Network],
];
export default function WhyApex() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="WHY APEX"
          title="Built on Principles That Endure."
          subtitle="A shared foundation helps each Apex business move with clarity while staying responsive to the people it serves."
        />
        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(([title, desc, Icon]) => (
            <div key={title} className="border-navy/15 border-t pt-6">
              <Icon className="text-gold" size={25} />
              <h3 className="font-display text-navy mt-5 text-2xl">{title}</h3>
              <p className="text-charcoal/60 mt-2 text-sm leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
