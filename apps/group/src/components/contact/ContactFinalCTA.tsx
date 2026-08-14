import Container from "@/components/Container";
import Button from "@/components/Button";
import { ArrowRight } from "lucide-react";

export default function ContactFinalCTA() {
  return (
    <section className="bg-navy relative overflow-hidden py-24 text-white">
      <div className="border-gold/25 absolute -top-20 -right-20 h-64 w-64 rotate-45 border" />
      <div className="border-gold/15 absolute -bottom-32 left-10 h-64 w-64 rounded-full border" />
      <Container className="relative">
        <p className="text-gold text-xs font-semibold tracking-[.3em] uppercase">Next step</p>
        <h2 className="font-display mt-5 max-w-3xl text-4xl leading-[1.05] md:text-6xl">
          Prefer a <span className="text-gold">Direct Conversation?</span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
          A few alternate starting points depending on what you have in mind.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#contact-form" variant="primary" size="lg">
            Schedule a Call
          </Button>
          <Button href="/consultancy" variant="secondary" size="lg">
            Request Financial Consultancy
          </Button>
          <Button href="/companies" variant="outline-gold" size="lg">
            View Our Companies <ArrowRight size={14} />
          </Button>
        </div>
      </Container>
    </section>
  );
}
