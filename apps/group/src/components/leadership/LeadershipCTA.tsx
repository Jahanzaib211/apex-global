import Container from "../Container";
import Button from "../Button";

export default function LeadershipCTA() {
  return (
    <section className="bg-navy relative overflow-hidden py-24 text-white">
      <div className="border-gold/30 absolute -top-20 -right-20 h-64 w-64 rotate-45 border" />
      <div className="border-gold/20 absolute -bottom-32 left-10 h-64 w-64 rounded-full border" />
      <Container className="relative">
        <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
          Start a conversation
        </p>
        <h2 className="font-display mt-5 text-5xl md:text-7xl">
          Connect With
          <br />
          <span className="text-gold">Apex Group.</span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
          Whether you are exploring a partnership, planning a journey, or looking for strategic
          guidance — there is a place to begin a conversation with the Group.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/#contact" variant="primary" size="lg">
            Contact Apex
          </Button>
          <Button href="/consultancy" variant="outline-gold" size="lg">
            Request Financial Consultancy
          </Button>
          <Button href="/about" variant="secondary" size="lg">
            Explore Companies
          </Button>
        </div>
      </Container>
    </section>
  );
}
