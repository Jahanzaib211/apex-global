import Container from "@/components/Container";
import Button from "@/components/Button";
export default function GalleryCTA() {
  return (
    <section className="bg-navy py-20">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <h2 className="font-display max-w-xl text-4xl text-white md:text-5xl">
          Planning a Moment Worth Capturing?
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button href="/events">Discuss an Event</Button>
          <Button href="/contact" variant="outline-gold">
            Contact Apex
          </Button>
        </div>
      </Container>
    </section>
  );
}
