import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ClipboardCheck, Radar, KeyRound, FileCheck2 } from "lucide-react";

const cards = [
  {
    Icon: ClipboardCheck,
    title: "Security Assessment",
    body: "Baseline reviews against real-world threat models — covering infrastructure, applications, identity posture and third-party risk.",
  },
  {
    Icon: Radar,
    title: "Threat Monitoring",
    body: "Continuous monitoring and detection across endpoints, identity and network — with alerting that humans can actually act on.",
  },
  {
    Icon: KeyRound,
    title: "Identity & Access",
    body: "Identity-first controls, least-privilege access, MFA enforcement and clean joiner/mover/leaver flows across the organization.",
  },
  {
    Icon: FileCheck2,
    title: "Compliance Support",
    body: "Pragmatic support for common frameworks and customer-driven audits — focused on evidence that holds up, not checkbox theatre.",
  },
];

export default function TechCybersecurity() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading eyebrow="Cybersecurity" title="Protect. Detect. Respond." />
        </div>

        <div className="text-charcoal/70 mt-8 max-w-3xl space-y-5 text-base leading-7">
          <p>
            Security is approached as an operating discipline — not a feature list. The work is
            grounded in current threat models, the organization&apos;s actual exposure and the
            regulatory environment it operates in.
          </p>
          <p>
            From baseline assessments through to continuous monitoring and incident response, every
            layer is designed around reducing real risk — with controls that are sustainable for the
            team that has to live with them.
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
