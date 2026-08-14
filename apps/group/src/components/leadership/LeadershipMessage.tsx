import Container from "../Container";

const paragraphs = [
  "When I started Apex Group, the aim was simple: to build a small portfolio of businesses that I would be proud to put my name behind. Each business was to be focused, practical and run by people who care about the work. The Group was the connective tissue — a shared operating philosophy, shared standards and a long-term commitment to doing things properly.",
  "Today, that idea has grown into a diversified ecosystem spanning technology, outsourcing, travel, real estate and financial consultancy. Each company in the Group leads with the depth of a specialist, while benefiting from being connected to a wider network of relationships, knowledge and ambition. We grow carefully, but we do grow.",
  "At the heart of everything we do is a quiet commitment to the customer. Whether the work is in software, in operations, in planning a journey or in offering strategic guidance, our standard is the same: clarity, consistency and care. That is how trust is built, and trust is the only durable advantage any business can earn.",
  "We are Pakistan-rooted, and we are proud of that. Our identity, our people and our long-term horizon are shaped by this country. At the same time, we are globally connected — learning from the wider world, partnering across borders and carrying an ambition that does not stop at any single market.",
  "The path forward is to keep building — patiently, with discipline and with the same humility we have carried since the beginning. Thank you for taking the time to learn about Apex Group. If our work resonates with you, we would welcome a conversation.",
];

export default function LeadershipMessage() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="bg-gold mb-5 h-1 w-12" />
          <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
            A MESSAGE FROM LEADERSHIP
          </p>
          <h2 className="font-editorial text-navy mt-3 text-5xl leading-tight md:text-6xl">
            A Message From Leadership.
          </h2>

          <div className="text-charcoal/80 mt-10 space-y-7 text-base leading-8">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="border-navy/10 mt-12 border-t pt-6">
            <p className="font-editorial text-navy text-2xl">Shaikh Ahmed</p>
            <p className="text-slate mt-1 text-xs tracking-[.2em] uppercase">
              Chief Executive Officer — Apex Group of Companies
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
