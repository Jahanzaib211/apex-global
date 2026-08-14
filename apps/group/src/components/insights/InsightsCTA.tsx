import Container from "@/components/Container";
import Button from "@/components/Button";

export default function InsightsCTA() {
  return (
    <section className="bg-navy relative overflow-hidden py-24 text-white">
      <div className="border-gold/25 absolute -top-20 -right-20 h-64 w-64 rotate-45 border" />
      <div className="border-gold/15 absolute -bottom-32 left-10 h-64 w-64 rounded-full border" />
      <Container className="relative">
        <p className="text-gold text-xs font-semibold tracking-[.3em] uppercase">
          Stay in the conversation
        </p>
        <h2 className="font-display mt-5 max-w-3xl text-4xl leading-[1.05] md:text-6xl">
          Want to Discuss a Topic <span className="text-gold">With Us?</span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
          Reach out with a topic, an opportunity, or a question. We will route it to the right team.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/contact" variant="primary" size="lg">
            Contact Apex
          </Button>
          <Button href="/consultancy" variant="outline-gold" size="lg">
            Request Financial Consultancy
          </Button>
        </div>
      </Container>
    </section>
  );
}
