import Container from "../Container";
import Button from "../Button";
export default function FinalCTA() {
  return (
    <section className="bg-navy relative overflow-hidden py-24 text-white">
      <div className="border-gold/30 absolute -top-20 -right-20 h-64 w-64 rotate-45 border" />
      <div className="border-gold/20 absolute -bottom-32 left-10 h-64 w-64 rounded-full border" />
      <Container className="relative">
        <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
          The next chapter starts here
        </p>
        <h2 className="font-display mt-5 text-5xl md:text-7xl">
          Let&apos;s Build
          <br />
          <span className="text-gold">What&apos;s Next.</span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
          Whether you are exploring a partnership, planning a journey or looking for strategic
          guidance, there is a place to start a conversation.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="#companies" variant="primary" size="lg">
            Explore Our Companies
          </Button>
          <Button href="#contact" variant="secondary" size="lg">
            Contact Apex
          </Button>
          <Button href="#contact" variant="outline-gold" size="lg">
            Request Financial Consultancy
          </Button>
        </div>
      </Container>
    </section>
  );
}
