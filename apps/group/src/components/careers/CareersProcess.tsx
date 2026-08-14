import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  {
    n: "01",
    title: "Application Review",
    desc: "Our careers team reviews every submission against the role and the broader business need.",
  },
  {
    n: "02",
    title: "Initial Conversation",
    desc: "A short call to learn more about you, your work, and what you are looking for next.",
  },
  {
    n: "03",
    title: "Practical Assessment",
    desc: "A role-relevant exercise or case discussion — designed to reflect the actual work.",
  },
  {
    n: "04",
    title: "Final Discussion",
    desc: "A conversation with the hiring manager and, where relevant, a cross-functional panel.",
  },
  {
    n: "05",
    title: "Offer & Onboarding",
    desc: "A clear offer, structured onboarding, and a partner to help you settle into the team.",
  },
];

export default function CareersProcess() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="OUR HIRING PROCESS"
          title="From Application to Offer."
          subtitle="A predictable, transparent sequence — designed to respect your time and give you a clear view of how decisions are made."
        />

        <div className="bg-navy/10 mt-14 grid gap-px md:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="bg-white p-7">
              <div className="font-display text-gold text-4xl">{s.n}</div>
              <h3 className="font-display text-navy mt-5 text-xl">{s.title}</h3>
              <p className="text-charcoal/65 mt-2 text-sm leading-6">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
