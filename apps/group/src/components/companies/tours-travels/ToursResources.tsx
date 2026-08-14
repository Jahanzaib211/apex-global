import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { BookOpen, ArrowUpRight } from "lucide-react";

const guides = [
  {
    title: "Visa Requirements",
    summary: "Overview of visa categories, processing times and supporting documents.",
  },
  {
    title: "What to Pack for Hajj",
    summary: "A practical packing guide covering clothing, health items and documents.",
  },
  {
    title: "Travel Insurance Guidance",
    summary: "Considerations for travel and medical insurance, including pilgrimage coverage.",
  },
  {
    title: "Health & Safety Tips",
    summary: "Pre-departure health checks, vaccinations and on-the-ground safety guidance.",
  },
];

export default function ToursResources() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="TRAVEL RESOURCES"
          title="Helpful Information Before You Go."
          subtitle="Plain-language guides to help you prepare for your journey. Placeholder content — these guides are being developed and will be available soon."
        />

        <div className="bg-navy/10 mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((g) => (
            <div
              key={g.title}
              className="group hover:bg-cream flex h-full flex-col bg-white p-7 transition"
            >
              <div className="border-gold text-gold inline-flex h-10 w-10 items-center justify-center border">
                <BookOpen size={18} />
              </div>
              <h3 className="font-display text-navy mt-5 text-xl">{g.title}</h3>
              <p className="text-charcoal/65 mt-3 flex-1 text-sm leading-6">{g.summary}</p>
              <p className="text-gold mt-4 text-[10px] tracking-[.2em] uppercase">
                Placeholder — coming soon
              </p>
              <a
                href="#booking"
                className="text-navy hover:text-gold mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-[.18em] uppercase"
              >
                Read guide <ArrowUpRight size={12} />
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
