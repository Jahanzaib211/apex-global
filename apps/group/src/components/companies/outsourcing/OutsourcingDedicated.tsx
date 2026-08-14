import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Users, PackageOpen, Scaling } from "lucide-react";

const cards = [
  {
    Icon: Users,
    title: "Dedicated Operators",
    body: "Full-time trained operators working exclusively on the client&apos;s account — embedded into shifts, tools and reporting.",
  },
  {
    Icon: PackageOpen,
    title: "Team-in-a-Box",
    body: "Pre-built pods for common functions — sales development, support, lead qualification — ready to deploy and scale.",
  },
  {
    Icon: Scaling,
    title: "Flexible Scaling",
    body: "Capacity that flexes with demand — ramp up during launches, scale back during quiet periods without losing institutional knowledge.",
  },
];

export default function OutsourcingDedicated() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Dedicated Teams"
            title="Offshore and Remote Teams Built Around You."
          />
        </div>

        <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
          <p>
            Dedicated teams extend in-house capacity without the overhead of direct hiring.
            Operators are trained on the client&apos;s tools, tone of voice and operating standards
            — and work as an extension of the existing team, not a separate vendor.
          </p>
          <p>
            Whether the need is a small specialist pod or a multi-shift operation, the engagement is
            built around clear ownership, measurable output and a real human manager.
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
