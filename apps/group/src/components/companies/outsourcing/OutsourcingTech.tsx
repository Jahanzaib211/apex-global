import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { LineChart, PhoneCall, Activity } from "lucide-react";

const cards = [
  {
    Icon: LineChart,
    title: "CRM & Reporting",
    body: "Clean CRM hygiene, structured pipeline reporting and dashboards the leadership team can actually use.",
  },
  {
    Icon: PhoneCall,
    title: "Call Systems & Dialers",
    body: "Modern telephony and dialer infrastructure — tuned for connect rates, recording compliance and agent productivity.",
  },
  {
    Icon: Activity,
    title: "Quality Monitoring",
    body: "Call recording, transcript review and QA scorecards feeding back into coaching and process improvement.",
  },
];

export default function OutsourcingTech() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Technology"
            title="The Operational Stack Behind Every Campaign."
          />
        </div>

        <div className="text-charcoal/70 mt-8 max-w-3xl space-y-5 text-base leading-7">
          <p>
            Operations at scale live or die on the technology underneath them. CRM hygiene,
            telephony, QA tooling and reporting are treated as first-class parts of the engagement —
            not afterthoughts added after a campaign is live.
          </p>
          <p>
            Where it makes sense, we integrate with the client&apos;s existing stack. Where it
            doesn&apos;t, we operate on tooling the team owns end-to-end.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map(({ Icon, title, body }) => (
            <article
              key={title}
              className="border-navy/10 bg-cream hover:border-gold border p-7 transition hover:-translate-y-1"
            >
              <Icon className="text-gold" size={24} />
              <h3 className="font-display text-navy mt-5 text-2xl">{title}</h3>
              <p className="text-charcoal/65 mt-3 text-sm leading-6">{body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
