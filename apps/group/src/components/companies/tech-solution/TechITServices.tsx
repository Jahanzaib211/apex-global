import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { MonitorSmartphone, LifeBuoy, Server, Network } from "lucide-react";

const services = [
  {
    Icon: MonitorSmartphone,
    title: "Managed IT",
    body: "Day-to-day IT ownership — endpoints, identity, asset hygiene and a predictable operating cadence for internal teams.",
  },
  {
    Icon: LifeBuoy,
    title: "Helpdesk & Support",
    body: "Tiered support with clear SLAs, knowledge-base continuity and escalation paths designed around business impact.",
  },
  {
    Icon: Server,
    title: "Infrastructure",
    body: "Hybrid infrastructure design and operations — on-premise, cloud and the often-uncomfortable space between them.",
  },
  {
    Icon: Network,
    title: "Network & Connectivity",
    body: "Office connectivity, site-to-site links and network architecture that holds up under real load, not just on paper.",
  },
];

export default function TechITServices() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading eyebrow="IT Services" title="End-to-End IT Service Architecture." />
        </div>

        <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
          <p>
            IT services are designed as one connected operating layer, not a stack of disconnected
            vendors. Helpdesk, infrastructure, networks and managed endpoints are run with shared
            ownership and shared visibility.
          </p>
          <p>
            Engagements are scoped to the actual shape of the business — office size, regulatory
            environment, in-house capability and tolerance for change. The goal is steady,
            predictable IT, not surprise overhauls.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {services.map(({ Icon, title, body }) => (
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
