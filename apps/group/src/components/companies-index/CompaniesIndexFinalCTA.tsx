import Container from "@/components/Container";
import Button from "@/components/Button";
export default function CompaniesIndexFinalCTA() {
  return (
    <section className="bg-navy py-20">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <h2 className="font-display max-w-xl text-4xl text-white md:text-5xl">
          Find the Right Company for Your Need.
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button href="/contact">Contact Apex</Button>
          <Button href="/consultancy" variant="outline-gold">
            Request Financial Consultancy
          </Button>
          <Button href="/about" variant="outline-gold">
            About the Group
          </Button>
        </div>
      </Container>
    </section>
  );
}
