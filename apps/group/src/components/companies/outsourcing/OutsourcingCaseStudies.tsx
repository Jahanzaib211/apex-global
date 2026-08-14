import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ArrowUpRight, BadgeAlert } from "lucide-react";

const cases = [
  {
    tag: "SaaS & Technology",
    headline: "SaaS Inbound Support Operations",
    outcome:
      "Stood up a multi-shift inbound support operation for a software company — focused on first-contact resolution and structured escalation into the in-house engineering team.",
    slug: "saas-inbound-support-operations",
  },
  {
    tag: "Financial Services",
    headline: "Financial Services Lead Qualification",
    outcome:
      "Built and ran an SDR pod qualifying inbound interest against a defined ICP — handing warmed, contextualized meetings to the client closing team.",
    slug: "financial-services-lead-qualification",
  },
];

export default function OutsourcingCaseStudies() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Case Studies"
            title="Selected Engagements."
            subtitle="Anonymized examples representative of the kind of work we run. Detailed case studies will be added over time."
          />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <article
              key={c.slug}
              className="border-navy/10 relative flex h-full flex-col border bg-white p-8"
            >
              <span className="border-gold/40 bg-cream text-slate inline-flex w-fit items-center gap-2 border px-3 py-1 text-[10px] font-semibold tracking-[.15em] uppercase">
                <BadgeAlert size={12} className="text-gold" />
                Placeholder — anonymized example
              </span>

              <p className="text-gold mt-6 text-[10px] font-bold tracking-[.2em] uppercase">
                {c.tag}
              </p>
              <h3 className="font-display text-navy mt-3 text-2xl">{c.headline}</h3>
              <p className="text-charcoal/65 mt-3 text-sm leading-6">{c.outcome}</p>

              <a
                href={`/companies/outsourcing/case-studies/${c.slug}`}
                className="text-navy hover:text-gold mt-auto inline-flex items-center gap-2 pt-6 text-xs font-bold tracking-widest uppercase"
              >
                Read more <ArrowUpRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
