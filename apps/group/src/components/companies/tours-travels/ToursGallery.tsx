import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Image as ImageIcon } from "lucide-react";

const tiles = [
  { caption: "Makkah — Group Hajj 2024" },
  { caption: "Intercity Transfer — Northern Pakistan" },
  { caption: "Umrah Family — Ramadan" },
  { caption: "Corporate Fleet — Islamabad" },
  { caption: "Madinah — Ziyarat" },
  { caption: "Jeddah Airport Pickup" },
  { caption: "Community Group Travel" },
  { caption: "Northern Areas Scenic Route" },
];

export default function ToursGallery() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="GALLERY"
          title="Moments From Our Journeys."
          subtitle="A selection of moments from recent journeys. Gallery content is curated and updated over time."
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
