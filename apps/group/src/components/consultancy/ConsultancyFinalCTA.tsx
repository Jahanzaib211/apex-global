import Container from "@/components/Container";
import Button from "@/components/Button";

export default function ConsultancyFinalCTA() {
  return (
    <section className="bg-navy relative overflow-hidden py-28 text-white">
      <div className="border-gold/25 absolute -top-20 -right-20 h-64 w-64 rotate-45 border" />
      <div className="border-gold/15 absolute -bottom-32 left-10 h-64 w-64 rounded-full border" />
      <Container className="relative">
        <div className="max-w-2xl">
          <p className="text-gold text-xs font-semibold tracking-[.3em] uppercase">
            Private &amp; Considered
          </p>
          <h2 className="font-editorial mt-6 text-5xl leading-[1.05] md:text-6xl">
            Begin a Private Conversation.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
            For clients whose financial lives have grown beyond simple answers, a strategic
            conversation is often the most valuable first step.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="#consultancy-form" variant="primary" size="lg">
              Request a Private Consultation
            </Button>
            <Button href="#consultancy-process" variant="outline-gold" size="lg">
              Speak With an Advisor
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
