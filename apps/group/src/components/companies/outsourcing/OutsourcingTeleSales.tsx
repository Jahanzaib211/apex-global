import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Megaphone, CalendarClock, Rocket } from "lucide-react";

const cards = [
  {
    Icon: Megaphone,
    title: "Outbound Sales",
    body: "Outbound calling programmes built around qualified lists, structured talk tracks and accountable conversion metrics.",
  },
  {
    Icon: CalendarClock,
    title: "Appointment Setting",
    body: "Targeted appointment-setting motions that hand sales teams meetings worth showing up to — not noisy calendars.",
  },
  {
    Icon: Rocket,
    title: "Pipeline Acceleration",
    body: "Re-engagement, nurture cadences and follow-up sequences that move stalled opportunities back into active pipeline.",
  },
];

export default function OutsourcingTeleSales() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Tele-Sales"
              title="Sales Development and Tele-Sales Campaigns."
            />
            <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
              <p>
                Tele-sales is run as a sales function, not a calling exercise. Lists are qualified,
                talk tracks are designed around real buyer objections and performance is measured on
                meetings set and pipeline generated — not raw dials.
              </p>
              <p>
                Whether the goal is new logo acquisition, re-engagement of a dormant book or filling
                top-of-funnel for an in-house team, the engagement is shaped around the outcome the
                client cares about.
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
