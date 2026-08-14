import Container from "@/components/Container";
import { Car, Plane, Moon } from "lucide-react";

const cards = [
  {
    icon: Car,
    title: "Local Car Rentals",
    desc: "Short- and long-term rentals across the Kingdom — ideal for business visitors, families and residents needing flexible mobility.",
  },
  {
    icon: Plane,
    title: "Airport Transfers",
    desc: "Pre-arranged pickups and drop-offs at major Saudi airports, with professional drivers and flight-aware scheduling.",
  },
  {
    icon: Moon,
    title: "Pilgrimage Transportation",
    desc: "Coordinated ground transportation for Hajj and Umrah groups, including intercity transfers between Makkah, Madinah and Jeddah.",
  },
];

export default function ToursSaudi() {
  return (
    <section className="bg-navy relative overflow-hidden py-24 text-white">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,169,0,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <Container className="relative">
        <div className="max-w-3xl">
          <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
            SAUDI ARABIA CAR RENTALS
          </p>
          <h2 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
            Reliable Transportation in the Kingdom.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-7 text-white/70">
            <p>
              Apex Global Tours &amp; Travels extends its transportation services into Saudi Arabia,
              supporting both everyday mobility and pilgrimage-related travel. From a single airport
              pickup to multi-day pilgrimage logistics, our team coordinates vehicles and drivers
              across the Kingdom.
            </p>
            <p>
              For Hajj and Umrah operators and groups, we provide structured ground transportation
              between Jeddah, Makkah and Madinah — managed with the same operating standards we
              apply to corporate and family travel.
            </p>
          </div>
        </div>

        <div className="bg-gold/20 mt-14 grid gap-px md:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-navy p-8 transition hover:bg-white/5">
              <div className="border-gold text-gold inline-flex h-12 w-12 items-center justify-center border">
                <Icon size={20} />
              </div>
              <h3 className="font-display mt-6 text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
