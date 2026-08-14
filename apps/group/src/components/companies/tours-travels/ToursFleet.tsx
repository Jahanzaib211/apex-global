import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { Car } from "lucide-react";

const fleet = [
  { type: "Sedan", seats: "4 Seats", desc: "Business travel and small family transfers." },
  { type: "SUV", seats: "7 Seats", desc: "Family groups and intercity travel with luggage." },
  { type: "Van", seats: "12 Seats", desc: "Larger families and small group movements." },
  { type: "Coaster", seats: "22 Seats", desc: "Group transfers and pilgrimage transportation." },
];

export default function ToursFleet() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="VEHICLE PORTFOLIO"
          title="A Fleet for Every Journey."
          subtitle="Our fleet spans the categories our clients actually need — from single-passenger business transfers to group-sized coaches. Specific makes and models are provided on request based on availability."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fleet.map((v) => (
            <div key={v.type} className="flex h-full flex-col bg-white">
              {/* Placeholder image block */}
              <div className="bg-navy relative aspect-[4/3] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(242,169,0,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,.3) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
                  <Car size={36} className="text-gold" />
                  <p className="text-gold mt-3 text-xs tracking-[.18em] uppercase">{v.type}</p>
                  <p className="mt-1 text-[10px] text-white/45">Placeholder image</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-navy text-2xl">
                  {v.type} — <span className="text-charcoal/60">{v.seats}</span>
                </h3>
                <p className="text-charcoal/65 mt-2 text-sm leading-6">{v.desc}</p>

                <dl className="border-navy/10 mt-4 space-y-2 border-t pt-4 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-charcoal/50 tracking-[.15em] uppercase">Make / Model</dt>
                    <dd className="text-navy font-semibold">On request</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal/50 tracking-[.15em] uppercase">Transmission</dt>
                    <dd className="text-navy font-semibold">Automatic</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal/50 tracking-[.15em] uppercase">Pricing</dt>
                    <dd className="text-gold font-semibold">Pricing on request</dd>
                  </div>
                </dl>

                <p className="text-charcoal/40 mt-3 text-[10px] italic">
                  Placeholder — example fleet entry
                </p>

                <div className="mt-5">
                  <Button href="#booking" variant="outline-gold" size="sm" className="w-full">
                    Check Availability
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
