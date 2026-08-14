import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Phone, Mail, AtSign, HeartHandshake } from "lucide-react";

const cards = [
  {
    Icon: Phone,
    title: "Voice Support",
    body: "Inbound and outbound voice teams with structured call handling, quality reviews and clear escalation paths.",
  },
  {
    Icon: Mail,
    title: "Email & Chat",
    body: "Async support operations with disciplined response times, tone-of-voice consistency and clean ticket hygiene.",
  },
  {
    Icon: AtSign,
    title: "Social CX",
    body: "Brand-aligned responses across social channels, with appropriate tone and routing for sensitive issues.",
  },
  {
    Icon: HeartHandshake,
    title: "Customer Success",
    body: "Onboarding, retention and lifecycle touchpoints that keep customers engaged past the point of sale.",
  },
];

export default function OutsourcingCX() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Customer Experience"
            title="Customer Support and Engagement That Builds Trust."
          />
        </div>

        <div className="text-charcoal/70 mt-8 max-w-3xl space-y-5 text-base leading-7">
          <p>
            Customer experience is the part of your business customers remember. We staff and
            operate support teams that handle real conversations — across voice, email, chat and
            social — with discipline and empathy.
          </p>
          <p>
            Every channel is run with clear ownership, documented standards and quality review so
            the experience stays consistent as volumes grow.
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
