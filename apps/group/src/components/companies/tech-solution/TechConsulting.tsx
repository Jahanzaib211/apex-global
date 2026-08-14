import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Compass, FileSearch, ListChecks } from "lucide-react";

const cards = [
  {
    Icon: Compass,
    title: "Digital Strategy",
    body: "Translate business priorities into a sequenced technology agenda — what to build, what to buy, what to retire.",
  },
  {
    Icon: FileSearch,
    title: "Architecture Review",
    body: "Independent review of existing systems, integration points and data flows — with concrete recommendations, not abstract advice.",
  },
  {
    Icon: ListChecks,
    title: "Vendor Selection",
    body: "Help choosing platforms, SaaS products and implementation partners — including shortlisting, evaluation and decision frameworks.",
  },
];

export default function TechConsulting() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Technology Consulting"
              title="Strategic Guidance for Technology Decisions."
            />
            <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
              <p>
                Good technology decisions need more than vendor opinions and slide decks. They need
                a clear view of the current landscape, the trade-offs being made and the operating
                consequences downstream.
              </p>
              <p>
                Engagements are short, focused and grounded in the business context. The goal is to
                leave the client&apos;s team with a defensible decision — and the reasoning behind
                it — not a dependency on outside advisors.
              </p>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            {cards.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="border-navy/10 hover:border-gold border bg-white p-6 transition"
              >
                <Icon className="text-gold" size={22} />
                <h3 className="font-display text-navy mt-4 text-xl">{title}</h3>
                <p className="text-charcoal/65 mt-2 text-sm leading-6">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
