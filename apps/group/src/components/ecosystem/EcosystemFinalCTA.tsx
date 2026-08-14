import Container from "@/components/Container";
import Button from "@/components/Button";
export default function EcosystemFinalCTA() {
  return (
    <section className="bg-navy py-20">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <h2 className="font-display text-4xl text-white md:text-5xl">Explore the Group.</h2>
        <div className="flex flex-wrap gap-3">
          <Button href="/ecosystem#the-companies">Our Companies</Button>
          <Button href="/about" variant="outline-gold">
            About Apex
          </Button>
          <Button href="/contact" variant="outline-gold">
            Contact
          </Button>
        </div>
      </Container>
    </section>
  );
}
