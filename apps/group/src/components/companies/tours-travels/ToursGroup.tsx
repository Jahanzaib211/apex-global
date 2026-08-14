import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Users, Heart, Building } from "lucide-react";

const groups = [
  {
    icon: Users,
    title: "Family Travel",
    desc: "Multi-generational family trips, with vehicle sizes, hotel configurations and pace planned around children and elders.",
  },
  {
    icon: Heart,
    title: "Community & Religious Groups",
    desc: "Organized group travel for mosques, churches and community organizations — including religious study trips and pilgrimages.",
  },
  {
    icon: Building,
    title: "Corporate & Institutional Groups",
    desc: "Group arrangements for corporate off-sites, institutional delegations and educational travel, with single-account coordination.",
  },
];

export default function ToursGroup() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="GROUP PACKAGES"
          title="Travel Designed for Organized Groups."
          subtitle="Group travel requires different operational thinking. We work with families, communities and institutions to plan and execute journeys that respect the dynamics of the group."
        />
        <div className="bg-navy/10 mt-12 grid gap-px md:grid-cols-3">
          {groups.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group hover:bg-cream bg-white p-8 transition">
              <div className="border-gold text-gold inline-flex h-12 w-12 items-center justify-center border">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-navy mt-6 text-2xl">{title}</h3>
              <p className="text-charcoal/65 mt-3 text-sm leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
