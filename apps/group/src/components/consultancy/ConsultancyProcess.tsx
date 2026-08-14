import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  { n: "01", title: "Request", desc: "Submit a private consultation request." },
  {
    n: "02",
    title: "Discovery",
    desc: "We take time to understand your objectives and circumstances.",
  },
  { n: "03", title: "Assessment", desc: "Review of relevant financial and business information." },
  {
    n: "04",
    title: "Strategy",
    desc: "Identification of priorities, opportunities and areas requiring attention.",
  },
  {
    n: "05",
    title: "Consultation",
    desc: "Discussion of findings and possible strategic directions.",
  },
  {
    n: "06",
    title: "Ongoing Support",
    desc: "Where appropriate, continuation of the advisory relationship.",
  },
];

export default function ConsultancyProcess() {
  return (
    <section id="consultancy-process" className="bg-cream py-28">
      <Container>
        <SectionHeading
          eyebrow="OUR PROCESS"
          title="Six Steps to a Clearer Financial Picture."
          subtitle="A deliberately quiet process. Each step is taken seriously, with the time and confidentiality the situation deserves."
        />

        <div className="bg-navy/10 mt-14 grid gap-px md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-white p-8">
              <p className="font-display text-gold text-5xl">{s.n}</p>
              <h3 className="font-display text-navy mt-4 text-2xl">{s.title}</h3>
              <p className="text-charcoal/65 mt-3 text-sm leading-6">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
