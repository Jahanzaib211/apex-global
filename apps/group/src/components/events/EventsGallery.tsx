import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const tiles = [
  { title: "Apex Group Annual Summit 2024", caption: "Group-level gathering · Karachi" },
  { title: "Tech Solution Client Briefing", caption: "Sector briefing · Online" },
  { title: "Umrah Program Highlights", caption: "Pilgrimage · Makkah & Madinah" },
  { title: "Holdings Project Launch", caption: "Real estate · Lahore" },
  { title: "Financial Planning Webinar", caption: "Educational · Online" },
  { title: "Outsourcing Industry Conference", caption: "Industry event · Riyadh" },
  { title: "Outsourcing Team Offsite", caption: "Internal · Karachi" },
  { title: "Tours Partner Showcase", caption: "Hospitality partners · Dubai" },
];

export default function EventsGallery() {
  return (
    <section id="event-gallery" className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="EVENT GALLERY"
          title="Highlights From Past Events."
          subtitle="A small selection of recent programs, conferences and internal moments — the visible side of work that mostly happens off-camera."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <figure key={t.title} className="border-navy/10 border bg-white">
              <div className="bg-navy relative aspect-[4/3] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(242,169,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,0.10) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <span className="bg-navy/80 text-gold absolute top-3 right-3 inline-flex items-center px-2 py-1 text-[9px] font-semibold tracking-[.2em] uppercase backdrop-blur"></span>
              </div>
              <figcaption className="p-4">
                <p className="text-navy text-sm font-semibold">{t.title}</p>
                <p className="text-charcoal/55 mt-1 text-xs">{t.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
