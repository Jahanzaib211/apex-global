import Container from "../Container";
import SectionHeading from "../SectionHeading";

const directions = [
  {
    eyebrow: "WHERE WE ARE TODAY",
    title: "A Diversified Group, Steady By Design",
    body: "Apex Group today operates five specialized businesses — technology, outsourcing, travel, real estate and financial consultancy — connected by a shared operating philosophy and a long-term commitment to quality. Each company is run with the focus of a specialist; the Group provides shared standards, relationships and direction.",
  },
  {
    eyebrow: "WHERE WE'RE GOING",
    title: "Deeper, Broader, More Connected",
    body: "The next chapter of Apex is about deepening the businesses we have, broadening the Group with carefully selected new ventures, and exploring international partnerships that extend the reach of every company. Growth at Apex is patient — we would rather be excellent in a few areas than average in many.",
  },
  {
    eyebrow: "HOW WE GET THERE",
    title: "Long-Term Thinking, Disciplined Execution",
    body: "We get there the same way we have always moved: long-term thinking, disciplined execution and a willingness to invest patiently in people, partnerships and operations. The Group will continue to be built on relationships that compound, on standards that endure and on the quiet conviction that good work eventually speaks for itself.",
  },
];

export default function GroupDirection() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="THE PATH FORWARD"
          title="Direction of the Group."
          subtitle="A simple way to read where Apex Group is, where it is going and how it intends to get there."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {directions.map((d) => (
            <article key={d.title} className="border-navy/10 bg-cream border p-8">
              <p className="text-gold text-[10px] font-bold tracking-[.2em] uppercase">
                {d.eyebrow}
              </p>
              <h3 className="font-display text-navy mt-5 text-2xl leading-tight">{d.title}</h3>
              <p className="text-charcoal/70 mt-4 text-sm leading-6">{d.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
