import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  {
    n: "01",
    name: "Understand",
    desc: "Listening carefully to your situation, objectives and constraints before proposing anything.",
  },
  {
    n: "02",
    name: "Analyze",
    desc: "Reviewing relevant financial and business information with rigour and discretion.",
  },
  {
    n: "03",
    name: "Strategize",
    desc: "Identifying priorities, opportunities and areas that warrant careful attention.",
  },
  {
    n: "04",
    name: "Coordinate",
    desc: "Working alongside your existing advisors or qualified partners as the situation requires.",
  },
  {
    n: "05",
    name: "Review",
    desc: "Returning to the picture periodically, adjusting as life and markets evolve.",
  },
];

export default function ConsultancyApproach() {
  return (
    <section className="bg-white py-28">
      <Container>
        <SectionHeading
          eyebrow="OUR APPROACH"
          title="Understand → Analyze → Strategize → Coordinate → Review."
          subtitle="A simple sequence, applied seriously. The approach is designed to bring structure to financial complexity without rushing it."
        />

        <div className="mt-16">
          {/* Desktop horizontal connector */}
          <div className="relative">
            <div
              className="bg-gold/30 absolute top-6 right-0 left-0 hidden h-px lg:block"
              aria-hidden="true"
            />
            <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-5">
              {steps.map((s) => (
                <div key={s.n} className="relative">
                  <div className="border-gold font-display text-gold relative z-10 mx-auto flex h-12 w-12 items-center justify-center border bg-white text-base lg:mx-0">
                    {s.n}
                  </div>
                  <h3 className="font-display text-navy mt-5 text-2xl">{s.name}</h3>
                  <p className="text-charcoal/65 mt-3 text-sm leading-6">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
