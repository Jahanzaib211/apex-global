import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

export default function TechCustom() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading eyebrow="Custom Solutions" title="When Off-the-Shelf Isn't Enough." />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="text-charcoal/70 space-y-5 text-base leading-7 lg:col-span-7">
            <p>
              Some problems don&apos;t fit neatly into an existing product. The workflows are
              unusual, the data is structured in a way the market doesn&apos;t support, or the
              constraints are too specific for a generic tool to absorb.
            </p>
            <p>
              For situations like these, Apex Global Tech Solution engages as a custom-build partner
              — designing and shipping software that is shaped around the actual problem, not
              adapted from a template.
            </p>
          </div>

          <div className="lg:col-span-5">
            <blockquote className="border-gold bg-cream border-l-4 p-7">
              <p className="font-editorial text-navy text-2xl leading-snug">
                “Built to your workflows. Built to your data. Built to scale.”
              </p>
              <footer className="text-slate mt-5 text-xs tracking-[.2em] uppercase">
                Apex Global Tech Solution
              </footer>
            </blockquote>
          </div>
        </div>
      </Container>
    </section>
  );
}
