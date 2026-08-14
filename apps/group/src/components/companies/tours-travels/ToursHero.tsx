import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { Compass, MapPin } from "lucide-react";

export default function ToursHero() {
  return (
    <section className="bg-navy relative flex min-h-[88vh] items-center overflow-hidden pt-28 text-white">
      {/* Compass/world pattern background */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(242,169,0,0.18) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(242,169,0,0.12) 0%, transparent 50%), linear-gradient(rgba(242,169,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,0.08) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 80px 80px, 80px 80px",
        }}
      />
      <div className="bg-gold/10 absolute top-10 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl" />
      <div className="absolute bottom-10 -left-32 h-[24rem] w-[24rem] rounded-full bg-white/5 blur-3xl" />

      <Container className="relative py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs tracking-[.2em] text-white/45 uppercase">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span>/</span>
          <a href="#companies" className="hover:text-gold">
            Companies
          </a>
          <span>/</span>
          <span className="text-gold">Apex Global Tours &amp; Travels</span>
        </nav>

        <div className="text-gold flex items-center gap-3 text-xs font-semibold tracking-[.3em] uppercase">
          <Compass size={14} />
          <span>APEX GLOBAL TOURS &amp; TRAVELS</span>
        </div>

        <h1 className="font-display mt-6 max-w-5xl text-5xl leading-[1.05] md:text-7xl">
          Your Journey.
          <br />
          <span className="text-gold">Our Responsibility.</span>
        </h1>

        <p className="font-editorial mt-6 text-2xl text-white/75 md:text-3xl">
          Travel. Mobility. Pilgrimage.
        </p>

        <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
          Car rentals and transportation in Pakistan and Saudi Arabia, Hajj and Umrah packages, and
          customized group travel — delivered with care, safety and operational discipline.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#booking" variant="primary" size="lg">
            Plan Your Journey
          </Button>
          <Button href="#booking" variant="outline-gold" size="lg">
            Request a Custom Package
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs tracking-[.2em] text-white/40 uppercase">
          <span className="inline-flex items-center gap-2">
            <MapPin size={12} className="text-gold" /> Pakistan
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={12} className="text-gold" /> Saudi Arabia
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={12} className="text-gold" /> Hajj &amp; Umrah
          </span>
        </div>
      </Container>
    </section>
  );
}
