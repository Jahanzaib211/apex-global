import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ArrowUpRight, BadgeAlert } from "lucide-react";

const cases = [
  {
    tag: "Banking & Finance",
    headline: "Banking Workflow Automation",
    outcome:
      "Streamlined a multi-step back-office workflow behind a unified operations console. Built to integrate with existing core systems without disrupting live operations.",
    slug: "banking-workflow-automation",
  },
  {
    tag: "Travel & Hospitality",
    headline: "Hospitality Booking Platform",
    outcome:
      "Designed and shipped a booking platform with supplier connectivity and admin tooling — focused on operational clarity rather than surface-level features.",
    slug: "hospitality-booking-platform",
  },
];

export default function TechCaseStudies() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Case Studies"
            title="Selected Engagements."
            subtitle="Anonymized examples representative of the kind of work we do. Detailed case studies will be added over time."
          />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <article
              key={c.slug}
              className="border-navy/10 bg-cream relative flex h-full flex-col border p-8"
            >
              <span className="border-gold/40 text-slate inline-flex w-fit items-center gap-2 border bg-white px-3 py-1 text-[10px] font-semibold tracking-[.15em] uppercase">
                <BadgeAlert size={12} className="text-gold" />
                Placeholder — anonymized example
              </span>

              <p className="text-gold mt-6 text-[10px] font-bold tracking-[.2em] uppercase">
                {c.tag}
              </p>
              <h3 className="font-display text-navy mt-3 text-2xl">{c.headline}</h3>
              <p className="text-charcoal/65 mt-3 text-sm leading-6">{c.outcome}</p>

              <a
                href={`/companies/tech-solution/case-studies/${c.slug}`}
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
