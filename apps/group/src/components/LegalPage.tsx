import Link from "next/link";
import Button from "@/components/Button";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { url } from "@/lib/site-url";
import { jsonLdProps } from "@apex/site-kit/json-ld";

export type LegalSection = {
  title: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
  callout?: boolean;
};

export function LegalHero({
  title,
  subtitle = "Last updated: [Month Day, Year]",
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-navy pt-36 pb-20 text-white">
      <Container>
        <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">LEGAL</p>
        <h1 className="font-display mt-5 max-w-4xl text-5xl leading-none md:text-7xl">{title}</h1>
        <p className="mt-7 text-base text-white/65">{subtitle}</p>
        <nav aria-label="Breadcrumb" className="mt-10 text-xs text-white/45">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span className="text-gold mx-3">/</span>
          {title.replace(".", "")}
        </nav>
      </Container>
    </section>
  );
}

export function LegalContent({
  intro,
  sections,
  disclaimer = true,
}: {
  intro: React.ReactNode;
  sections: LegalSection[];
  disclaimer?: boolean;
}) {
  return (
    <section className="bg-cream py-20 md:py-28">
      <Container>
        <article className="mx-auto max-w-4xl">
          <div className="border-gold font-editorial text-slate mb-14 border-l-2 pl-6 text-2xl leading-9 md:text-3xl">
            {intro}
          </div>
          {sections.map((section) => (
            <section
              key={section.title}
              className={`mb-12 ${section.callout ? "border-gold/60 border bg-white/60 p-7 md:p-9" : ""}`}
            >
              <h2 className="font-display text-navy text-3xl md:text-4xl">{section.title}</h2>
              <div className="text-slate/85 [&_h3]:font-editorial [&_h3]:text-navy mt-5 space-y-4 text-sm leading-7 md:text-base [&_h3]:pt-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1">
                {section.content}
                {section.children}
              </div>
            </section>
          ))}
          {disclaimer && (
            <div className="border-gold bg-navy border-2 p-7 text-white md:p-9">
              <h2 className="font-display text-gold text-2xl">Important legal review notice</h2>
              <p className="mt-4 text-sm leading-7 text-white/75">
                This Privacy Policy is provided as a general framework. Apex Group operates in
                multiple jurisdictions and may need to tailor data handling to specific legal
                requirements. The final policy must be reviewed and approved by qualified legal
                counsel before launch.
              </p>
            </div>
          )}
        </article>
      </Container>
    </section>
  );
}

export function LegalCTA({
  title = "Questions About Your Privacy?",
  primary = "Contact Apex",
  secondary = "Request Data Access",
  secondaryHref = "/contact",
}: {
  title?: string;
  primary?: string;
  secondary?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="bg-navy py-20 text-white md:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            light
            eyebrow="LET'S CONNECT"
            title={title}
            subtitle="Our team is ready to help with the next considered step."
          />
          <div className="flex flex-wrap gap-3">
            <Button href="/contact">{primary}</Button>
            <Button href={secondaryHref} variant="outline-gold">
              {secondary}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function WebPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return (
    <script
      type="application/ld+json"
      {...jsonLdProps({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name,
        description,
        url: url(path),
      })}
    />
  );
}
