import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Database, ClipboardList, Cog } from "lucide-react";

const cards = [
  {
    Icon: Database,
    title: "Data Entry & Management",
    body: "Accurate, audited data entry and ongoing data management — with checks built in, not bolted on.",
  },
  {
    Icon: ClipboardList,
    title: "Order Processing",
    body: "End-to-end order processing with the controls needed to keep fulfilment accurate at volume.",
  },
  {
    Icon: Cog,
    title: "Admin & Coordination",
    body: "The administrative work that keeps a business moving — scheduling, coordination, document handling and follow-through.",
  },
];

export default function OutsourcingBackOffice() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Operational Support"
              title="Back-Office and Administrative Operations."
            />
            <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
              <p>
                Back-office operations are rarely visible, but they&apos;re often the difference
                between a business that scales and one that doesn&apos;t. We handle the structured
                work that accumulates — reliably, accurately and with clear ownership.
              </p>
              <p>
                Each engagement is scoped around throughput, accuracy targets and the systems in use
                — so the work integrates cleanly instead of creating a parallel process.
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
