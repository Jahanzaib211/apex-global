import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Image as ImageIcon } from "lucide-react";

const tiles = [
  { caption: "Project Exterior — Sample View" },
  { caption: "Sales Office" },
  { caption: "Site Visit — Islamabad" },
  { caption: "Floor Plans — Sample" },
  { caption: "Project Walkthrough" },
  { caption: "Construction Progress" },
  { caption: "Community Amenities" },
  { caption: "Marketing Collateral" },
];

export default function HoldingsGallery() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="GALLERY"
          title="Project and Corporate Imagery."
          subtitle="A selection of project visuals and corporate moments. Full project imagery is shared with qualified enquiries."
        />

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {tiles.map((t, idx) => (
            <div
              key={t.caption}
              className={`border-navy/10 bg-navy relative overflow-hidden border ${
                idx === 0
                  ? "col-span-2 row-span-2 aspect-square md:col-span-2 md:row-span-2"
                  : "aspect-square"
              }`}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(242,169,0,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,.25) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white/80">
                <ImageIcon size={28} className="text-gold/80" />
                <p className="text-gold/70 mt-3 text-[10px] tracking-[.2em] uppercase"></p>
                <p className="font-editorial mt-2 text-sm">{t.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
