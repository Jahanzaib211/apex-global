import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Cpu, Building2, Plane, Users, Compass, Briefcase, Sparkles } from "lucide-react";

const types = [
  {
    icon: Cpu,
    title: "Technology Partners",
    desc: "Software, platform and infrastructure providers whose capabilities extend what we deliver to our technology clients.",
  },
  {
    icon: Building2,
    title: "Real Estate Developers",
    desc: "Developers, brokers and project owners exploring collaboration across our holdings, investments and consultancy work.",
  },
  {
    icon: Plane,
    title: "Travel & Hospitality Partners",
    desc: "Hotels, ground operators, airlines and on-ground service providers who help us deliver quality travel experiences.",
  },
  {
    icon: Users,
    title: "Outsourcing & BPO Clients",
    desc: "Organizations evaluating managed operations, back-office support, and structured delivery partnerships across borders.",
  },
  {
    icon: Compass,
    title: "Strategic Business Partners",
    desc: "Sector-aligned partners exploring co-developed services, joint go-to-market efforts, or long-running operating relationships.",
  },
  {
    icon: Briefcase,
    title: "Financial & Professional Partners",
    desc: "Accounting, legal, advisory and wealth-structuring partners whose work complements our financial consultancy practice.",
  },
  {
    icon: Sparkles,
    title: "Other",
    desc: "A partnership that does not fit the categories above. Use this to introduce a collaboration we have not yet considered.",
  },
];

export default function PartnershipTypes() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="PARTNERSHIP TYPES"
          title="How We Collaborate."
          subtitle="A short map of the partnership categories we engage with. Each has its own rhythm, expectations, and form of value exchange."
        />

        <div className="bg-navy/10 mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="group hover:bg-navy bg-white p-7 transition">
                <Icon className="text-gold" size={26} />
                <h3 className="font-display text-navy mt-6 text-xl group-hover:text-white">
                  {t.title}
                </h3>
                <p className="text-charcoal/65 mt-3 text-sm leading-6 group-hover:text-white/65">
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
