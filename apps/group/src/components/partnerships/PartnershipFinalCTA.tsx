import Container from "@/components/Container";
import Button from "@/components/Button";

export default function PartnershipFinalCTA() {
  return (
    <section className="bg-navy relative overflow-hidden py-24 text-white">
      <div className="border-gold/25 absolute -top-20 -right-20 h-64 w-64 rotate-45 border" />
      <div className="border-gold/15 absolute -bottom-32 left-10 h-64 w-64 rounded-full border" />
      <Container className="relative">
        <p className="text-gold text-xs font-semibold tracking-[.3em] uppercase">Closing thought</p>
        <h2 className="font-display mt-5 max-w-3xl text-4xl leading-[1.05] md:text-6xl">
          Have a Partnership <span className="text-gold">in Mind?</span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
          Two simple next steps depending on where you are in the conversation.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#partnership-form" variant="primary" size="lg">
            Submit a Proposal
          </Button>
          <Button href="/contact" variant="outline-gold" size="lg">
            Contact Apex
          </Button>
        </div>
      </Container>
    </section>
  );
}
