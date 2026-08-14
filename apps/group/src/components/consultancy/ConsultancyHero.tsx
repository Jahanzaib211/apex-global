import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { Lock, Compass } from "lucide-react";

export default function ConsultancyHero() {
  return (
    <section className="bg-navy relative flex min-h-[90vh] items-center overflow-hidden pt-28 text-white">
      {/* Subtle gold line pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,169,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,0.10) 1px, transparent 1px)",
          backgroundSize: "110px 110px",
        }}
      />
      <div className="bg-gold/8 absolute top-20 -right-32 h-[30rem] w-[30rem] rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-32 h-[24rem] w-[24rem] rounded-full bg-white/3 blur-3xl" />

      <Container className="relative py-16">
        <nav className="mb-8 flex items-center gap-2 text-xs tracking-[.2em] text-white/45 uppercase">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span>/</span>
          <span className="text-gold">Financial Consultancy</span>
        </nav>

        {/* Private & confidential badge */}
        <div className="border-gold/40 bg-navy/70 text-gold absolute top-6 right-4 hidden items-center gap-2 border px-4 py-2 text-[10px] font-semibold tracking-[.25em] uppercase backdrop-blur md:inline-flex lg:right-8">
          <Lock size={11} />
          Private &amp; Confidential
        </div>

        <div className="text-gold flex items-center gap-3 text-xs font-semibold tracking-[.3em] uppercase">
          <Compass size={14} />
          <span>APEX GROUP FINANCIAL CONSULTANCY</span>
        </div>

        <h1 className="font-display mt-6 max-w-5xl text-5xl leading-[1.05] md:text-7xl">
          A More Strategic View
          <br />
          <span className="text-gold">of Your Financial Future.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
          Apex Group provides strategic financial consultancy to High-Net-Worth Individuals,
          entrepreneurs, business owners and selected clients — offering a clearer view of financial
          position, assets, businesses, objectives and long-term opportunities.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="#consultancy-form" variant="primary" size="lg">
            Request a Private Consultation
          </Button>
          <Button href="#consultancy-process" variant="outline-gold" size="lg">
            Learn About the Process
          </Button>
        </div>

        <p className="mt-10 max-w-2xl text-xs leading-5 text-white/40">
          Consultancy engagements are conducted privately. Information shared is handled within a
          strictly limited, role-based access environment.
        </p>
      </Container>
    </section>
  );
}
