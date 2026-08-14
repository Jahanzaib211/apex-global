import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Globe, Smartphone, Boxes, Cable } from "lucide-react";

const cards = [
  {
    Icon: Globe,
    title: "Web Applications",
    body: "Internal tools and customer-facing applications built for clarity, performance and long-term maintainability.",
  },
  {
    Icon: Smartphone,
    title: "Mobile Applications",
    body: "iOS and Android apps — native or cross-platform — designed around the device, the user and the workflow.",
  },
  {
    Icon: Boxes,
    title: "Enterprise Systems",
    body: "Core operational systems — ERP-style platforms, internal marketplaces, ordering and fulfilment — engineered for real load.",
  },
  {
    Icon: Cable,
    title: "API & Integrations",
    body: "Stable, well-documented APIs and integration layers that connect CRMs, ERPs, payment systems and partner platforms.",
  },
];

export default function TechSoftwareDev() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Software Development"
            title="Custom Software Built Around Your Business."
          />
        </div>

        <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
          <p>
            Off-the-shelf software gives you 80% of what you need and 20% you have to live with.
            Custom software gives you the inverse — built around your workflows, your data and the
            way your team actually works.
          </p>
          <p>
            We design, build and ship software in tight, observable increments — with clear
            ownership of architecture, code quality and documentation so the system remains
            maintainable long after launch.
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
