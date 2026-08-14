import Container from "@/components/Container";
import Button from "@/components/Button";

export default function HoldingsFinalCTA() {
  return (
    <section className="bg-navy relative overflow-hidden py-24 text-white">
      <div className="border-gold/30 absolute -top-20 -right-20 h-64 w-64 rotate-45 border" />
      <div className="border-gold/20 absolute -bottom-32 left-10 h-64 w-64 rounded-full border" />
      <Container className="relative">
        <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
          Find your next property
        </p>
        <h2 className="font-display mt-5 max-w-3xl text-5xl md:text-7xl">
          Find Your
          <br />
          <span className="text-gold">Next Property.</span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
          Whether you are buying, investing or exploring a partnership, Apex Holdings will help you
          take the next step with care.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="#portfolio" variant="primary" size="lg">
            Explore Our Projects
          </Button>
          <Button href="#site-visits" variant="secondary" size="lg">
            Book a Site Visit
          </Button>
          <Button href="/consultancy" variant="outline-gold" size="lg">
            Speak With an Advisor
          </Button>
        </div>
      </Container>
    </section>
  );
}
