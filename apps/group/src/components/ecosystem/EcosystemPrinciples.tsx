import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
const principles = [
  [
    "✦",
    "Independent Operation",
    "Each company stays accountable to its own sector, clients and capabilities.",
  ],
  [
    "◈",
    "Shared Standards",
    "Quality, integrity and thoughtful execution create a common baseline.",
  ],
  ["◌", "Cross-Sector Insight", "Different businesses bring useful perspective to the same table."],
  ["↗", "Long-Term Alignment", "The Group is built for durable value, not short-term noise."],
  ["+", "Group-Level Support", "Shared relationships and support help each company move further."],
];
export default function EcosystemPrinciples() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading eyebrow="Operating Principles" title="How Our Companies Work Together." />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {principles.map(([icon, title, desc]) => (
            <article key={title} className="border-navy/10 border p-6">
              <span className="font-display text-gold text-3xl">{icon}</span>
              <h3 className="font-display text-navy mt-5 text-2xl">{title}</h3>
              <p className="text-charcoal/60 mt-3 text-sm leading-6">{desc}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
