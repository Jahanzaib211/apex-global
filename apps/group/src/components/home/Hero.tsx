import Container from "@/components/Container";
import Button from "./Button";

/**
 * Hero — the apex group's front page.
 *
 * Changes (Apex Web Tweaks, 2026-08-13):
 *   1. The decorative "Scroll to explore" indicator at the bottom is now a
 *      real, clickable, smooth-scroll anchor to the first content section.
 *      The previous version rendered the text as a non-interactive `<span>`
 *      which invited a click and did nothing.
 *   2. All primary CTAs use the `<Button>` helper, which honours
 *      `prefers-reduced-motion` (no smooth scroll when the user asked for
 *      less motion) and updates the URL hash without a page jump.
 *
 * The header is `fixed` at the top (`z-50`), so any anchor target needs
 * `scroll-margin-top` — set on each section id, not on the hero itself.
 */
export default function Hero() {
  return (
    <section className="bg-navy relative flex min-h-screen items-center overflow-hidden pt-20 text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,169,0,.2) 1px, transparent 1px),linear-gradient(90deg, rgba(242,169,0,.2) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="bg-gold/10 absolute top-20 -right-40 h-[32rem] w-[32rem] rounded-full blur-3xl" />
      <Container className="relative py-24">
        <p className="text-gold mb-6 text-xs font-semibold tracking-[.3em] uppercase">
          Apex Group of Companies
        </p>
        <h1 className="font-display max-w-5xl text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
          One Group.
          <br />
          <span className="text-gold">Multiple Businesses.</span>
          <br />
          One Vision.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
          Apex Group of Companies brings together specialized businesses across technology,
          outsourcing, travel and real estate, with Group-level financial consultancy supporting
          individuals, entrepreneurs and businesses with strategic guidance.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="#companies" anchor variant="primary" size="lg">
            Explore Our Companies
          </Button>
          <Button href="#contact" anchor variant="secondary" size="lg">
            Talk to Apex
          </Button>
          <Button href="#contact" anchor variant="outline-gold" size="lg">
            Request Financial Consultancy
          </Button>
        </div>
      </Container>
      <a
        href="#companies"
        className="hover:text-gold focus-visible:ring-gold focus-visible:ring-offset-navy absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[.2em] text-white/45 uppercase transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Scroll to explore the rest of the page"
      >
        <span>Scroll to explore</span>
        <span aria-hidden className="bg-gold h-10 w-px" />
      </a>
    </section>
  );
}
