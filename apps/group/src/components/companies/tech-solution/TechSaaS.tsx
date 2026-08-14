import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Layers, Plug, BarChart3 } from "lucide-react";

const cards = [
  {
    Icon: Layers,
    title: "Multi-Tenant Architecture",
    body: "Tenant isolation, configurable workspaces and predictable performance as customer bases grow.",
  },
  {
    Icon: Plug,
    title: "API-First Design",
    body: "Public and internal APIs that make products easy to integrate, extend and embed in partner stacks.",
  },
  {
    Icon: BarChart3,
    title: "Usage Analytics",
    body: "Product analytics, billing signals and admin telemetry built in from the first release.",
  },
];

export default function TechSaaS() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading eyebrow="SaaS" title="Scalable SaaS Products and Platforms." />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="text-charcoal/70 space-y-5 text-base leading-7 lg:col-span-7">
            <p>
              We build and operate SaaS products designed to scale cleanly — from early customers to
              thousands of tenants — without accumulating the architectural debt that slows teams
              down later.
            </p>
            <p>
              Subscription models, role-based access, billing boundaries and feature flags are
              treated as first-class concerns. Integrations are designed API-first so that products
              slot into existing stacks and partner ecosystems without bespoke glue code on every
              engagement.
            </p>
            <p>
              Where appropriate, products are instrumented for usage analytics and product-led
              growth signals from day one — so adoption and retention are measurable, not assumed.
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
