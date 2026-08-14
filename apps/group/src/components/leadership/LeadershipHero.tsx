import Container from "../Container";
import Link from "next/link";

export default function LeadershipHero() {
  return (
    <section className="bg-navy relative flex min-h-[70vh] items-center overflow-hidden pt-32 pb-20 text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,169,0,.2) 1px, transparent 1px),linear-gradient(90deg, rgba(242,169,0,.2) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="bg-gold/10 absolute top-20 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl" />
      <Container className="relative">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex items-center gap-2 text-xs tracking-[.25em] text-white/55 uppercase"
        >
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-gold">Leadership</span>
        </nav>
        <p className="text-gold mb-6 text-xs font-semibold tracking-[.3em] uppercase">LEADERSHIP</p>
        <h1 className="font-display max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          A Message From
          <br />
          <span className="text-gold">Leadership.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
          Apex Group is guided by a long-term vision and an entrepreneurial commitment to building
          sustainable businesses.
        </p>
      </Container>
    </section>
  );
}
