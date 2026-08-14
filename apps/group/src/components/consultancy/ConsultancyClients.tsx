import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import {
  Crown,
  Rocket,
  Briefcase,
  TrendingUp,
  Users,
  Stethoscope,
  Building,
  UsersRound,
} from "lucide-react";

const profiles = [
  {
    icon: Crown,
    name: "High-Net-Worth Individuals",
    desc: "Sophisticated individuals with complex financial positions.",
  },
  {
    icon: Rocket,
    name: "Entrepreneurs",
    desc: "Founders and operators building and scaling businesses.",
  },
  {
    icon: Briefcase,
    name: "Business Owners",
    desc: "Established business owners planning beyond the next quarter.",
  },
  {
    icon: TrendingUp,
    name: "Investors",
    desc: "Active or prospective investors seeking structured guidance.",
  },
  {
    icon: Users,
    name: "Families",
    desc: "Families coordinating across generations, geographies and assets.",
  },
  {
    icon: Stethoscope,
    name: "Professionals",
    desc: "Senior professionals with concentrated or evolving financial situations.",
  },
  {
    icon: Building,
    name: "Corporate Clients",
    desc: "Select corporate clients needing senior-level financial thinking.",
  },
  {
    icon: UsersRound,
    name: "Family Business Owners",
    desc: "Owners balancing the family, the business and the future.",
  },
];

export default function ConsultancyClients() {
  return (
    <section className="bg-cream py-28">
      <Container>
        <SectionHeading
          eyebrow="WHO WE SERVE"
          title="Clients We Work With."
          subtitle="Our consultancy practice works with a limited number of clients whose situations genuinely benefit from senior financial thinking."
        />

        <div className="bg-navy/10 mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map(({ icon: Icon, name, desc }) => (
            <div key={name} className="group hover:bg-cream bg-white p-7 transition">
              <div className="border-gold text-gold group-hover:bg-gold group-hover:text-navy inline-flex h-12 w-12 items-center justify-center border transition">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-navy mt-6 text-xl">{name}</h3>
              <p className="text-charcoal/65 mt-2 text-sm leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
