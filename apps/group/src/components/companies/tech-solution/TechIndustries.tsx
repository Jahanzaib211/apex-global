import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import {
  Landmark,
  Stethoscope,
  Building2,
  Plane,
  ShoppingBag,
  GraduationCap,
  Truck,
  Briefcase,
} from "lucide-react";

const industries = [
  {
    Icon: Landmark,
    name: "Banking & Finance",
    note: "Workflow automation, secure portals and compliance-aware platforms.",
  },
  {
    Icon: Stethoscope,
    name: "Healthcare",
    note: "Operational systems and patient-facing tools with privacy built in.",
  },
  {
    Icon: Building2,
    name: "Real Estate",
    note: "Listings, CRM and operations software for agencies and developers.",
  },
  {
    Icon: Plane,
    name: "Travel & Hospitality",
    note: "Booking, supplier connectivity and back-office automation.",
  },
  {
    Icon: ShoppingBag,
    name: "Retail & eCommerce",
    note: "Storefronts, integrations and fulfilment platforms that scale.",
  },
  {
    Icon: GraduationCap,
    name: "Education",
    note: "Admissions, learning platforms and admin systems for institutions.",
  },
  {
    Icon: Truck,
    name: "Logistics",
    note: "Operations dashboards, tracking integrations and partner APIs.",
  },
  {
    Icon: Briefcase,
    name: "Professional Services",
    note: "Internal tools and client-facing platforms for service firms.",
  },
];

export default function TechIndustries() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Industries Served"
            title="Cross-Sector Technology Experience."
            subtitle="Work across regulated and high-volume sectors — each engagement shaped around the operating reality of the industry."
          />
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map(({ Icon, name, note }) => (
            <a
              key={name}
              href="#contact"
              className="group border-navy/10 hover:border-gold block border bg-white p-6 transition hover:-translate-y-1"
            >
              <Icon className="text-gold" size={22} />
              <h3 className="font-display text-navy mt-5 text-xl">{name}</h3>
              <p className="text-charcoal/65 mt-3 text-sm leading-6">{note}</p>
              <span className="text-slate group-hover:text-gold mt-5 inline-flex items-center gap-2 text-[11px] font-bold tracking-[.18em] uppercase">
                How we serve them →
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
