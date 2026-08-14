import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Workflow, FileScan, MessagesSquare } from "lucide-react";

const caps = [
  {
    Icon: Workflow,
    title: "Process Automation",
    body: "Identify the right processes to automate, design the human-in-the-loop boundaries, and ship AI-assisted workflows that survive contact with production data.",
  },
  {
    Icon: FileScan,
    title: "Intelligent Document Processing",
    body: "Extract, classify and reconcile information from contracts, invoices and forms — turning unstructured documents into structured, auditable records.",
  },
  {
    Icon: MessagesSquare,
    title: "Conversational AI",
    body: "Assistants and agents that handle real conversations with retrieval over your own knowledge — useful, grounded and observable.",
  },
];

export default function TechAI() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="AI Solutions" title="Applied AI for Real Business Outcomes." />
            <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
              <p>
                We focus on practical AI — the kind that changes how a team operates on Monday
                morning, not the kind that lives in a demo. That means automation, NLP, computer
                vision and predictive analytics tied directly into existing systems and workflows.
              </p>
              <p>
                Every AI engagement is scoped around a measurable outcome, with clear
                human-in-the-loop boundaries where they make sense. Models are evaluated against the
                actual decision being made, not abstract benchmarks.
              </p>
              <p>
                Where AI is deployed alongside people, the goal is augmentation — better decisions,
                faster cycles, cleaner data — not the theatre of replacement.
              </p>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            {caps.map(({ Icon, title, body }) => (
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
