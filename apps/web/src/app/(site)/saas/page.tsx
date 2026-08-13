import { Card, OriginBadge, Section, SectionHeading } from "@apex/ui";
import Link from "next/link";
import { getProducts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata = {
  title: "SaaS Products",
  description:
    "Software products built and operated by Apex Global Tech Solution. Each one states its provenance.",
  alternates: { canonical: absoluteUrl("/saas") },
};

export default async function SaasIndexPage() {
  const products = await getProducts();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Apex SaaS"
          title="Products we build, run and support"
          lede="Two live platforms today. Each declares whether we built it, operate it, or run it as third-party open source — because a platform you cannot verify is a platform you cannot trust."
        />
      </Section>

      <Section tone="page">
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <Card key={p.slug} as="article" interactive className="flex flex-col gap-4 p-8">
              <div>
                <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                  {p.category}
                </p>
                <h2 className="mt-2 text-2xl">{p.name}</h2>
                <p className="mt-1 text-[var(--ink-secondary)]">{p.tagline}</p>
              </div>

              <p className="text-[var(--ink-secondary)]">{p.summary}</p>

              <OriginBadge
                origin={p.origin}
                upstreamName={p.upstreamName}
                upstreamUrl={p.upstreamUrl}
                upstreamLicense={p.upstreamLicense}
              />

              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
                <Link
                  href={`/saas/${p.slug}`}
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  Explore {p.name} →
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
      </Section>
    </>
  );
}
