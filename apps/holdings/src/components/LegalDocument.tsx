import Link from "next/link";
import type { LegalDocument } from "@apex/site-kit/legal";

/**
 * Renders a shared legal document in this site's typography.
 *
 * The text comes from `@apex/site-kit/legal` so every Apex property publishes
 * the same wording; only the presentation is per-site. Holdings previously
 * linked to /legal/privacy, /legal/terms and /legal/disclaimer from its footer
 * without any of them existing.
 */
export function LegalDocumentPage({ doc }: { doc: LegalDocument }) {
  return (
    <div className="bg-white">
      <section className="bg-navy-800 text-white">
        <div className="container-x py-24 lg:py-28">
          <span className="eyebrow !text-gold-400 mb-4 inline-block">Legal</span>
          <h1 className="font-display text-4xl leading-[1.1] font-bold sm:text-5xl lg:text-6xl">
            {doc.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">{doc.intro}</p>
          <nav aria-label="Breadcrumb" className="mt-8 text-xs text-white/45">
            <Link href="/" className="hover:text-gold-400">
              Home
            </Link>
            <span className="text-gold-400 mx-3">/</span>
            <span>{doc.title}</span>
          </nav>
        </div>
      </section>

      <section className="container-x max-w-3xl py-16 lg:py-20">
        {doc.sections.map((section, i) => (
          <section key={section.title} className="mb-12 last:mb-0">
            <h2 className="font-display text-ink text-2xl font-bold">
              <span className="text-gold-400 mr-3 text-base">
                {String(i + 1).padStart(2, "0")}
              </span>
              {section.title}
            </h2>
            {section.body.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-slate-700">
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-4 space-y-2">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-3 leading-relaxed text-slate-700">
                    <span className="bg-gold-400 mt-2.5 h-1.5 w-1.5 flex-none rounded-full" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </section>
    </div>
  );
}
