import Link from "next/link";
import Container from "@/components/Container";
export default function CompaniesIndexHero() {
  return (
    <section className="bg-navy pt-40 pb-20 text-white">
      <Container>
        <p className="text-gold mb-5 text-xs font-semibold tracking-[.25em] uppercase">
          Our Companies
        </p>
        <h1 className="font-display max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          Specialized Businesses. Unified Vision.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65">
          Five operating companies under one Group, each focused on its own sector, all aligned to a
          shared standard of quality, integrity and long-term value.
        </p>
        <p className="mt-12 text-xs tracking-[.18em] text-white/40 uppercase">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span className="text-gold mx-3">/</span>Our Companies
        </p>
      </Container>
    </section>
  );
}
