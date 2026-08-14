import Link from "next/link";
import Container from "@/components/Container";
import { Briefcase, ArrowRight } from "lucide-react";

export default function CareersHero() {
  return (
    <section className="bg-navy relative flex min-h-[80vh] items-center overflow-hidden pt-32 text-white">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,169,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,0.10) 1px, transparent 1px)",
          backgroundSize: "110px 110px",
        }}
      />
      <div className="bg-gold/10 absolute top-20 -right-32 h-[30rem] w-[30rem] rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-32 h-[24rem] w-[24rem] rounded-full bg-white/5 blur-3xl" />

      <Container className="relative py-16">
        <nav className="mb-8 flex items-center gap-2 text-xs tracking-[.2em] text-white/45 uppercase">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span>/</span>
          <span className="text-gold">Careers</span>
        </nav>

        <div className="text-gold flex items-center gap-3 text-xs font-semibold tracking-[.3em] uppercase">
          <Briefcase size={14} />
          <span>CAREERS</span>
        </div>

        <h1 className="font-display mt-6 max-w-5xl text-5xl leading-[1.05] md:text-7xl">
          Build a Career With <span className="text-gold">Apex.</span>
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-7 text-white/70 md:text-lg">
          Join a diversified group where your work contributes to specialized businesses across
          technology, outsourcing, travel, real estate and financial consultancy.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#vacancies"
            className="bg-gold text-navy inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition hover:bg-white"
          >
            See Open Roles <ArrowRight size={16} />
          </a>
          <a
            href="#careers-application"
            className="border-gold/60 text-gold hover:bg-gold hover:text-navy inline-flex items-center gap-2 border bg-transparent px-6 py-3 text-sm font-semibold transition"
          >
            Submit General Application
          </a>
        </div>
      </Container>
    </section>
  );
}
