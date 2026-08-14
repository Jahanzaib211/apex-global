import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  {
    n: "01",
    title: "Initial Discussion",
    desc: "A short, exploratory conversation to understand who you are, what you offer, and what kind of partnership you have in mind.",
  },
  {
    n: "02",
    title: "Alignment & Fit",
    desc: "A deeper look at values, capabilities, market fit, and the practical shape a partnership could take on both sides.",
  },
  {
    n: "03",
    title: "Framework & Agreement",
    desc: "Defining scope, structure, governance and commercial terms — clearly, in writing, with realistic timelines.",
  },
  {
    n: "04",
    title: "Launch & Operate",
    desc: "Joint go-live, defined review cadences, and a partnership rhythm that is built to last rather than to be exited.",
  },
];

export default function PartnershipProcess() {
  return (
    <section id="partnership-process" className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="OUR PROCESS"
          title="From Conversation to Collaboration."
          subtitle="Partnerships work best when expectations are clear from the start. Our process is designed to be transparent, unhurried, and grounded in specifics."
        />

        <div className="bg-navy/10 mt-14 grid gap-px md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="bg-white p-8">
              <div className="font-display text-gold text-5xl">{s.n}</div>
              <h3 className="font-display text-navy mt-6 text-2xl">{s.title}</h3>
              <p className="text-charcoal/65 mt-3 text-sm leading-6">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
