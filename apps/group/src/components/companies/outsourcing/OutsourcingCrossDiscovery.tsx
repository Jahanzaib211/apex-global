import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ArrowUpRight } from "lucide-react";

const others = [
  {
    name: "Apex Global Tech Solution",
    body: "SaaS, IT services, AI, cloud and software development for the modern enterprise.",
  },
  {
    name: "Apex Global Tours & Travels",
    body: "Travel planning and bookings — corporate, group and leisure, supported end to end.",
  },
  {
    name: "Apex Holdings",
    body: "A considered approach to real estate and long-term value across the Group.",
  },
];

export default function OutsourcingCrossDiscovery() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Explore More from Apex"
            title="Other Ways Apex Can Support You."
          />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {others.map((o) => (
            <a
              key={o.name}
              href="#contact"
              className="group border-navy/10 bg-cream hover:border-gold flex h-full flex-col border p-7 transition hover:-translate-y-1"
            >
              <h3 className="font-display text-navy text-2xl">{o.name}</h3>
              <p className="text-charcoal/65 mt-3 flex-1 text-sm leading-6">{o.body}</p>
              <span className="text-navy group-hover:text-gold mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                Learn more <ArrowUpRight size={14} />
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
