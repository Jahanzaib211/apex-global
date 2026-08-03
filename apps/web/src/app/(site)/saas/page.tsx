import { Card, OriginBadge, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Apex SaaS",
  description:
    "Technology products built to solve real business problems — each one live, supported, and stating its provenance.",
  alternates: { canonical: absoluteUrl("/saas") },
};

export default async function SaasPage() {
  const products = await getProducts();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Apex SaaS"
          title="Technology products built to solve real business problems"
          lede="Everything here is running, supported, and something we can show you. Each product states whether we built it or derived it, and from what."
        />
      </Section>

      <Section tone="page">
        <div className={`grid gap-6 ${products.length > 1 ? "md:grid-cols-2" : "max-w-3xl"}`}>
          {products.map((p) => (
            <Card key={p.slug} as="article" interactive className="flex flex-col gap-4 p-8">
              <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                {p.category}
              </p>
              <h2 className="text-2xl">
                <Link href={`/saas/${p.slug}`}>{p.name}</Link>
              </h2>
              <p className="font-medium text-[var(--ink-secondary)]">{p.tagline}</p>
              <p className="text-[var(--ink-secondary)]">{p.summary}</p>

              <OriginBadge
                origin={p.origin}
                upstreamName={p.upstreamName}
                upstreamUrl={p.upstreamUrl}
                upstreamLicense={p.upstreamLicense}
              />

              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-3">
                <Link
                  href={`/saas/${p.slug}`}
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  Product details →
                </Link>
                {p.isPubliclyReachable && p.publicUrl ? (
                  <a
                    href={p.publicUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-amber-700)] underline-offset-4 hover:underline"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[var(--color-success-500)]"
                    />
                    See it live
                  </a>
                ) : null}
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-sm text-[var(--ink-muted)]">
          We only list products we can both demonstrate and support. Work that is still in
          development does not appear here until it is neither.
        </p>
      </Section>
    </>
  );
}
