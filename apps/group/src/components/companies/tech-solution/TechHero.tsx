import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";

export default function TechHero() {
  return (
    <section className="bg-navy relative flex min-h-[88vh] items-center overflow-hidden pt-28 pb-20 text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,169,0,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(242,169,0,.18) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="bg-gold/10 absolute top-10 -right-40 h-[30rem] w-[30rem] rounded-full blur-3xl" />
      <div className="bg-navy/40 absolute bottom-0 -left-32 h-[22rem] w-[22rem] rounded-full blur-3xl" />

      <Container className="relative">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs tracking-[.2em] text-white/45 uppercase"
        >
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span>/</span>
          <Link href="/#companies" className="hover:text-gold">
            Our Companies
          </Link>
          <span>/</span>
          <span className="text-white/70">Apex Global Tech Solution</span>
        </nav>

        <p className="text-gold mb-6 text-xs font-semibold tracking-[.3em] uppercase">
          Apex Global Tech Solution
        </p>

        <h1 className="font-display max-w-5xl text-5xl leading-[1.05] md:text-7xl">
          Technology That <span className="text-gold">Moves Businesses</span> Forward.
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-7 text-white/70 md:text-lg">
          Apex Global Tech Solution is the technology-focused company of the Group, operating across
          SaaS, IT services, software development, AI, cloud, cybersecurity and digital solutions —
          helping businesses modernize, automate and scale.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#contact" variant="primary" size="lg">
            Build Your Technology Solution
          </Button>
          <Button href="#contact" variant="outline-gold" size="lg">
            Talk to Tech
          </Button>
        </div>
      </Container>
    </section>
  );
}
