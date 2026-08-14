import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const stats = [
  { label: "Fleet Vehicles", placeholder: "—" },
  { label: "Pilgrims Served", placeholder: "—" },
  { label: "Cities Covered", placeholder: "—" },
  { label: "Years Operating", placeholder: "—" },
];

export default function ToursAbout() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-5 lg:gap-20">
          <div className="lg:col-span-3">
            <SectionHeading
              eyebrow="ABOUT APEX GLOBAL TOURS & TRAVELS"
              title="Mobility and Pilgrimage, Operated With Care."
            />
            <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
              <p>
                Apex Global Tours &amp; Travels is the Group&apos;s travel and transportation
                business — built on the discipline of getting people and groups to the right place,
                safely and on time. We operate car rentals and ground transportation across Pakistan
                and Saudi Arabia, and arrange Hajj and Umrah journeys with the seriousness these
                trips deserve.
              </p>
              <p>
                Whether it is a self-drive rental in Islamabad, an airport transfer in Riyadh, a
                family Umrah in Ramadan or a fully managed Hajj group, we approach every booking
                with the same operating principles: vetted vehicles, professional drivers, clear
                itineraries, and a single point of accountability from enquiry to return.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="border-navy/10 border bg-white p-6">
                  <p className="font-display text-navy text-4xl">{s.placeholder}</p>
                  <p className="text-charcoal/60 mt-2 text-xs font-semibold tracking-[.18em] uppercase">
                    {s.label}
                  </p>
                  <p className="text-gold mt-3 text-[10px] tracking-[.2em] uppercase">
                    Verified by Apex
                  </p>
                </div>
              ))}
            </div>
            <p className="text-charcoal/45 mt-4 text-xs italic">
              Specific metrics verified annually. Placeholders shown for privacy.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
