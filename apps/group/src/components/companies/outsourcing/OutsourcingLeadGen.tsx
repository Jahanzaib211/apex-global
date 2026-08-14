import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ListChecks, Search, Filter, CalendarCheck2 } from "lucide-react";

const cards = [
  {
    Icon: ListChecks,
    title: "List Building",
    body: "Targeted contact lists built to the ICP — with sourcing, enrichment and verification baked into the process.",
  },
  {
    Icon: Search,
    title: "Prospecting",
    body: "Multi-channel prospecting across email, LinkedIn and phone — sequenced to keep touchpoints relevant, not noisy.",
  },
  {
    Icon: Filter,
    title: "Qualification",
    body: "Discovery and qualification using frameworks that match how your sales team actually closes — BANT, MEDDIC or your own.",
  },
  {
    Icon: CalendarCheck2,
    title: "Appointment Setting",
    body: "Meetings booked, confirmed and held — with the right context passed to your closers before the call.",
  },
];

export default function OutsourcingLeadGen() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Lead Generation"
            title="From Prospect to Qualified Opportunity."
          />
        </div>

        <div className="text-charcoal/70 mt-8 max-w-3xl space-y-5 text-base leading-7">
          <p>
            Lead generation is a system, not a campaign. Lists, sequences, qualification and handoff
            are designed as one continuous flow so that prospects entering the funnel reach sales as
            real opportunities, not unqualified noise.
          </p>
          <p>
            We work with the client&apos;s ICP, sales motion and tooling — and keep improving the
            system based on what actually converts, not what looks busy in a dashboard.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ Icon, title, body }) => (
            <article
              key={title}
              className="border-navy/10 bg-cream hover:border-gold border p-6 transition hover:-translate-y-1"
            >
              <Icon className="text-gold" size={22} />
              <h3 className="font-display text-navy mt-5 text-xl">{title}</h3>
              <p className="text-charcoal/65 mt-3 text-sm leading-6">{body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
