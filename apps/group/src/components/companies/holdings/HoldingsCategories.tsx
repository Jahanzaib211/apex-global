import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Home, Briefcase, Layers, Building, TreePine, MoreHorizontal } from "lucide-react";

const cats = [
  { icon: Home, name: "Residential", desc: "Houses, villas and family residences." },
  { icon: Briefcase, name: "Commercial", desc: "Offices, retail and commercial units." },
  { icon: Layers, name: "Mixed Use", desc: "Developments combining multiple uses." },
  { icon: Building, name: "Apartments", desc: "Apartments in residential buildings." },
  { icon: TreePine, name: "Plots", desc: "Residential and commercial plots." },
  { icon: MoreHorizontal, name: "Other", desc: "Specialty real estate categories." },
];

export default function HoldingsCategories() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="PROJECT CATEGORIES"
          title="Coverage Across Real Estate Segments."
          subtitle="Apex Holdings works across the categories our clients actually ask about."
        />
        <div className="bg-navy/10 mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {cats.map(({ icon: Icon, name, desc }) => (
            <div
              key={name}
              className="group hover:bg-cream flex items-start gap-5 bg-white p-7 transition"
            >
              <div className="border-gold text-gold inline-flex h-12 w-12 shrink-0 items-center justify-center border">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-display text-navy text-xl">{name}</h3>
                <p className="text-charcoal/65 mt-2 text-sm leading-6">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
