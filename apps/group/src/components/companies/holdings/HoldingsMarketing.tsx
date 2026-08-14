import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Megaphone, Users, Handshake, ClipboardCheck } from "lucide-react";

const services = [
  {
    icon: Megaphone,
    title: "Project Promotion",
    desc: "Coordinated marketing campaigns that put credible projects in front of qualified audiences through the right channels.",
  },
  {
    icon: Users,
    title: "Lead Management",
    desc: "Structured enquiry handling, qualification and follow-up so that developers spend time on serious buyers.",
  },
  {
    icon: Handshake,
    title: "Buyer Engagement",
    desc: "Walkthroughs, site visits and information sessions that help buyers make confident, well-informed decisions.",
  },
  {
    icon: ClipboardCheck,
    title: "Sales Coordination",
    desc: "Coordination between developers, buyers and partners throughout the sales process — including documentation and closing.",
  },
];

export default function HoldingsMarketing() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="REAL ESTATE MARKETING"
          title="Project Marketing That Elevates the Developer and the Buyer."
          subtitle="Apex Holdings works as a long-term marketing partner to developers — building project narratives, generating qualified leads and managing buyer engagement with operational discipline."
        />
        <div className="bg-navy/10 mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group hover:bg-cream bg-white p-7 transition">
              <div className="border-gold text-gold group-hover:bg-gold group-hover:text-navy inline-flex h-12 w-12 items-center justify-center border transition">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-navy mt-6 text-xl">{title}</h3>
              <p className="text-charcoal/65 mt-3 text-sm leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
