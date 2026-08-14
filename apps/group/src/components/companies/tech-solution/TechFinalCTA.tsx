import Container from "@/components/Container";
import Button from "@/components/Button";

export default function TechFinalCTA() {
  return (
    <section className="bg-navy relative overflow-hidden py-24 text-white">
      <div className="border-gold/30 absolute -top-20 -right-20 h-64 w-64 rotate-45 border" />
      <div className="border-gold/20 absolute -bottom-32 left-10 h-64 w-64 rounded-full border" />
      <Container className="relative">
        <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
          Apex Global Tech Solution
        </p>
        <h2 className="font-display mt-5 text-5xl md:text-7xl">
          Build Your <span className="text-gold">Technology Solution.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
          Whether you&apos;re modernizing an existing stack, shipping a new product or evaluating
          where AI fits, the right starting point is a short, focused conversation.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="#contact" variant="primary" size="lg">
            Talk to Tech
          </Button>
          <Button href="#contact" variant="secondary" size="lg">
            Request a Consultation
          </Button>
          <Button href="/#companies" variant="outline-gold" size="lg">
            Explore All Companies
          </Button>
        </div>
      </Container>
    </section>
  );
}
