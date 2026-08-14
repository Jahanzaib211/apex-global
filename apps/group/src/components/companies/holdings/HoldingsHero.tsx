import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { Building2 } from "lucide-react";

export default function HoldingsHero() {
  return (
    <section className="bg-navy relative flex min-h-[88vh] items-center overflow-hidden pt-28 text-white">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,169,0,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,.18) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="bg-gold/10 absolute top-10 -left-32 h-[28rem] w-[28rem] rounded-full blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-[24rem] w-[24rem] rounded-full bg-white/5 blur-3xl" />

      <Container className="relative py-16">
        <nav className="mb-8 flex items-center gap-2 text-xs tracking-[.2em] text-white/45 uppercase">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span>/</span>
          <a href="/companies" className="hover:text-gold">
            Companies
          </a>
          <span>/</span>
          <span className="text-gold">Apex Holdings</span>
        </nav>

        <div className="text-gold flex items-center gap-3 text-xs font-semibold tracking-[.3em] uppercase">
          <Building2 size={14} />
          <span>APEX HOLDINGS</span>
        </div>

        <h1 className="font-display mt-6 max-w-5xl text-5xl leading-[1.05] md:text-7xl">
          Building Value.
          <br />
          <span className="text-gold">Creating Opportunities.</span>
        </h1>

        <p className="font-editorial mt-6 text-2xl text-white/75 md:text-3xl">
          Real estate, operated with long-term thinking.
        </p>

        <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
          Apex Holdings is the Group&apos;s real estate business — currently focused on marketing a
          curated portfolio of projects across Pakistan, with a long-term direction toward
          self-owned development and strategic real estate growth.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#portfolio" variant="primary" size="lg">
            Explore Our Projects
          </Button>
          <Button href="#site-visits" variant="outline-gold" size="lg">
            Book a Site Visit
          </Button>
        </div>
      </Container>
    </section>
  );
}
