import Link from "next/link";
import Container from "@/components/Container";
export default function EcosystemHero() {
  return (
    <section className="bg-navy pt-40 pb-20 text-white">
      <Container>
        <p className="text-gold mb-5 text-xs font-semibold tracking-[.25em] uppercase">
          The Apex Ecosystem
        </p>
        <h1 className="font-display max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          How the Group Operates.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65">
          Apex Group is not a collection of unrelated companies. It is a structured ecosystem of
          specialized businesses operating under a shared vision, shared standards and shared
          long-term thinking.
        </p>
        <p className="mt-12 text-xs tracking-[.18em] text-white/40 uppercase">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span className="text-gold mx-3">/</span>Ecosystem
        </p>
      </Container>
    </section>
  );
}
