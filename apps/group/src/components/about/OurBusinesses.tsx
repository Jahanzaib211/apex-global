import Container from "../Container";
import SectionHeading from "../SectionHeading";
import { ArrowUpRight, Cpu, Headphones, Plane, Building2, LineChart } from "lucide-react";

const businesses = [
  {
    icon: Cpu,
    entity: "Apex Global Tech Solution",
    sector: "Technology",
    desc: "Practical digital solutions for businesses — built with the focus of a specialist team.",
    href: "/companies/tech-solution",
  },
  {
    icon: Headphones,
    entity: "Apex Outsourcing",
    sector: "Outsourcing",
    desc: "Reliable support and operations that help teams focus on what matters most.",
    href: "/companies/outsourcing",
  },
  {
    icon: Plane,
    entity: "Apex Tours & Travels",
    sector: "Travel & Tours",
    desc: "Considered travel planning — designed for journeys with less friction and more clarity.",
    href: "/companies/tours-travels",
  },
  {
    icon: Building2,
    entity: "Apex Holdings",
    sector: "Real Estate",
    desc: "A thoughtful approach to property and long-term value across the Group's holdings.",
    href: "/companies/holdings",
  },
  {
    icon: LineChart,
    entity: "Financial Consultancy",
    sector: "Group Services",
    desc: "Strategic guidance for individuals, entrepreneurs and businesses — delivered with discretion.",
    href: "/consultancy",
  },
];

export default function OurBusinesses() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="OUR BUSINESSES"
          title="Five Specialized Areas. One Operating Philosophy."
          subtitle="Each company in the Apex Group is run with the depth of a specialist — and the support of a shared standard."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b) => {
            const Icon = b.icon;
            return (
              <article
                key={b.entity}
                className="group border-navy/10 hover:border-gold flex flex-col border bg-white p-8 transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <Icon className="text-gold" size={28} />
                  <ArrowUpRight className="text-navy/40 group-hover:text-gold transition" />
                </div>

                <p className="text-slate mt-12 text-[10px] font-bold tracking-[.2em]">
                  {b.sector.toUpperCase()}
                </p>
                <h3 className="font-display text-navy mt-3 text-2xl">{b.entity}</h3>
                <p className="text-charcoal/65 mt-3 text-sm leading-6">{b.desc}</p>

                <a
                  href={b.href}
                  className="text-navy hover:text-gold mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                >
                  Learn more <ArrowUpRight size={14} />
                </a>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
