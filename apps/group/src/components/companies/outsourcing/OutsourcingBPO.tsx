import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { PhoneIncoming, PhoneOutgoing, GitBranch } from "lucide-react";

const cards = [
  {
    Icon: PhoneIncoming,
    title: "Inbound Support",
    body: "Customer service operations designed around response quality, first-contact resolution and clean escalation paths.",
  },
  {
    Icon: PhoneOutgoing,
    title: "Outbound Operations",
    body: "Outbound campaigns — sales, retention, surveys, win-back — run with trained teams and accountable performance metrics.",
  },
  {
    Icon: GitBranch,
    title: "Process Standardization",
    body: "Documented SOPs, quality scorecards and operating cadences so the work is repeatable across teams and shifts.",
  },
];

export default function OutsourcingBPO() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="BPO"
            title="Inbound and Outbound Business Process Outsourcing."
          />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="text-charcoal/70 space-y-5 text-base leading-7 lg:col-span-7">
            <p>
              Business Process Outsourcing is most useful when it is treated as a long-running
              operating function — not a transactional cost line. Engagements are built around clear
              processes, trained operators and ongoing quality work.
            </p>
            <p>
              From inbound customer service to outbound campaigns and back-office processes, the
              work is shaped around your volumes, SLAs and the experience you want your customers to
              have.
            </p>
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
