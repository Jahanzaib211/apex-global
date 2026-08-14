import Container from "@/components/Container";
export default function SearchHero() {
  return (
    <section className="bg-navy pt-40 pb-20 text-white">
      <Container>
        <p className="text-gold mb-5 text-xs font-semibold tracking-[.25em] uppercase">Search</p>
        <h1 className="font-display text-5xl md:text-7xl">Search Apex Group.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          Find a company, capability or page across the Apex ecosystem.
        </p>
      </Container>
    </section>
  );
}
