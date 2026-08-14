import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Car, UserCheck, Building2, MapPin, Briefcase } from "lucide-react";

const services = [
  {
    icon: Car,
    title: "Self-Drive Rentals",
    desc: "Vehicles available for clients who prefer to drive themselves — flexible daily, weekly and monthly rental options.",
  },
  {
    icon: UserCheck,
    title: "With-Driver Rentals",
    desc: "Professional drivers for business travel, family trips and visitors unfamiliar with local roads.",
  },
  {
    icon: Building2,
    title: "Local & City Transfers",
    desc: "Point-to-point city transfers, hourly hire and on-call transportation within major Pakistani cities.",
  },
  {
    icon: MapPin,
    title: "Intercity Travel",
    desc: "Long-distance transportation between cities, with vetted drivers and pre-planned routes.",
  },
  {
    icon: Briefcase,
    title: "Corporate Transportation",
    desc: "Dedicated vehicles and standing arrangements for organizations with regular movement needs.",
  },
];

export default function ToursPakistan() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="PAKISTAN CAR RENTALS"
          title="Transportation Across Pakistan."
          subtitle="From daily city transfers to intercity travel and corporate fleets, Apex Global Tours & Travels operates transportation services across Pakistan with the operational discipline that the Group brings to every business."
        />

        <div className="bg-navy/10 mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group hover:bg-cream bg-white p-8 transition">
              <div className="border-gold text-gold group-hover:bg-gold group-hover:text-navy inline-flex h-12 w-12 items-center justify-center border transition">
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
