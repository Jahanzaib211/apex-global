import { ButtonLink, Mark } from "@apex/ui";
import Link from "next/link";

/**
 * Homepage hero.
 *
 * Server-rendered, zero JavaScript. The animated brand geometry is pure CSS on
 * an inline SVG — no canvas, no WebGL bundle, nothing that can push the LCP
 * past the 2.0s budget that paid traffic is billed against. Motion is confined
 * to a slow drift and is removed entirely under prefers-reduced-motion by the
 * global rule in the design system.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-navy-900)] text-[var(--color-canvas-100)]">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />

      {/* Oversized brand mark as the backdrop. Decorative, hidden from AT. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[12%] top-1/2 -z-10 hidden w-[62%] -translate-y-1/2 opacity-[0.07] md:block"
      >
        <Mark variant="inverse" className="h-auto w-full" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full opacity-25 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-amber-500), transparent 70%)" }}
      />

      <div className="container-page relative py-20 md:py-26 lg:py-30">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--border-inverse)] px-3.5 py-1.5 text-2xs font-medium uppercase tracking-[0.16em] text-[var(--color-navy-200)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-amber-500)]" />
            Global SaaS &amp; technology company
          </p>

          <h1 className="text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Global Technology.
            <br />
            Intelligent Solutions.
            <br />
            <span className="text-[var(--color-amber-500)]">Built to Scale.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--color-navy-200)]">
            Apex Global Tech Solution builds SaaS products and delivers intelligent technology
            solutions across software, AI, cloud, cybersecurity and IT infrastructure — helping
            businesses operate smarter and scale faster.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/contact" size="lg">
              Talk to our technology team
            </ButtonLink>
            <ButtonLink href="/solutions" size="lg" variant="inverse">
              Explore our solutions
            </ButtonLink>
            <Link
              href="/saas"
              className="inline-flex h-13 items-center px-2 text-base font-medium text-[var(--color-navy-200)] underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Explore SaaS products →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
