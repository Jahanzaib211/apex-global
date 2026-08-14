import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import {
  Cpu,
  ShoppingBag,
  Landmark,
  Stethoscope,
  Building2,
  Plane,
  GraduationCap,
  Briefcase,
} from "lucide-react";

const industries = [
  {
    Icon: Cpu,
    name: "SaaS & Technology",
    note: "Inbound support, customer success and SDR functions for software teams.",
  },
  {
    Icon: ShoppingBag,
    name: "eCommerce",
    note: "Order support, customer service and retention motions at retail pace.",
  },
  {
    Icon: Landmark,
    name: "Financial Services",
    note: "Lead qualification, back-office processing and operational support.",
  },
  {
    Icon: Stethoscope,
    name: "Healthcare",
    note: "Patient support, scheduling and administrative operations with privacy discipline.",
  },
  {
    Icon: Building2,
    name: "Real Estate",
    note: "Lead qualification, listing operations and customer follow-through.",
  },
  {
    Icon: Plane,
    name: "Travel & Hospitality",
    note: "Booking support, customer service and supplier coordination.",
  },
  {
    Icon: GraduationCap,
    name: "Education",
    note: "Admissions support, student services and operational administration.",
  },
  {
    Icon: Briefcase,
    name: "Professional Services",
    note: "Client service, scheduling and operational support for service firms.",
  },
];

export default function OutsourcingIndustries() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Industries Served"
            title="Outsourcing Across Sectors."
            subtitle="Teams trained to the rhythms, language and customer expectations of the sector they support."
          />
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map(({ Icon, name, note }) => (
            <a
              key={name}
              href="#contact"
              className="group border-navy/10 bg-cream hover:border-gold block border p-6 transition hover:-translate-y-1"
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
