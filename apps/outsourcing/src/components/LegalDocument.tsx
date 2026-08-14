import Link from "next/link";
import type { LegalDocument } from "@apex/site-kit/legal";
import { Container } from "@/components/Container";

/**
 * Renders a shared legal document in this site's typography.
 *
 * The text comes from `@apex/site-kit/legal` so every Apex property publishes
 * the same wording; only presentation is per-site. This site's footer linked to
 * /privacy, /terms, /cookies and /security without any of them existing.
 */
export function LegalDocumentPage({ doc }: { doc: LegalDocument }) {
  return (
    <main className="bg-white">
      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-16 text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-40" />
        <Container className="relative">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Legal
          </div>
          <h1 className="font-display mt-4 text-4xl font-extrabold md:text-5xl">{doc.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">{doc.intro}</p>
          <nav aria-label="Breadcrumb" className="mt-8 text-xs text-white/45">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-3">/</span>
            <span>{doc.title}</span>
          </nav>
        </Container>
      </section>

      <Container>
        <div className="max-w-3xl py-16 md:py-20">
          {doc.sections.map((section, i) => (
            <section key={section.title} className="mb-12 last:mb-0">
              <h2 className="font-display text-navy text-2xl font-bold">
                <span className="text-amber2 mr-3 text-base">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              {section.body.map((p) => (
                <p key={p} className="text-steel mt-4 leading-relaxed">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((b) => (
                    <li key={b} className="text-steel flex gap-3 leading-relaxed">
                      <span className="bg-amber2 mt-2.5 h-1.5 w-1.5 flex-none rounded-full" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
