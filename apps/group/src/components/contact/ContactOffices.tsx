import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Building2, MapPin, Phone, Mail, ExternalLink } from "lucide-react";

const offices = [
  {
    city: "Karachi",
    label: "Headquarters",
    address: "Address available on request",
    phone: "+92 XXX XXXXXXX",
    email: "karachi@apexgroup.pk",
    maps: "https://www.google.com/maps/search/?api=1&query=Karachi+Pakistan",
  },
  {
    city: "Lahore",
    label: "Regional Office",
    address: "Address available on request",
    phone: "+92 XXX XXXXXXX",
    email: "lahore@apexgroup.pk",
    maps: "https://www.google.com/maps/search/?api=1&query=Lahore+Pakistan",
  },
  {
    city: "Riyadh",
    label: "Regional Office",
    address: "Address available on request",
    phone: "+966 XXX XXXXXXX",
    email: "riyadh@apexgroup.pk",
    maps: "https://www.google.com/maps/search/?api=1&query=Riyadh+Saudi+Arabia",
  },
];

export default function ContactOffices() {
  return (
    <section id="our-presence" className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="OUR PRESENCE"
          title="Where Apex Operates."
          subtitle="Our offices serve as coordination points for the Group and its companies. Final addresses and contact numbers are confirmed on first direct enquiry."
        />

        <div className="bg-navy/10 mt-14 grid gap-px md:grid-cols-3">
          {offices.map((o) => (
            <div key={o.city} className="bg-white p-8">
              <div className="text-gold flex items-center gap-3">
                <Building2 size={20} />
                <span className="text-[10px] font-semibold tracking-[.2em] uppercase">
                  {o.label}
                </span>
              </div>
              <h3 className="font-display text-navy mt-6 text-3xl">{o.city}</h3>

              <ul className="text-charcoal/70 mt-8 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="text-gold mt-0.5 shrink-0" size={16} />
                  <span>{o.address}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="text-gold mt-0.5 shrink-0" size={16} />
                  <span>
                    {o.phone}{" "}
                    <span className="text-charcoal/40 ml-1 text-[10px] tracking-[.15em] uppercase">
                      Placeholder — to be updated
                    </span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail className="text-gold mt-0.5 shrink-0" size={16} />
                  <span>{o.email}</span>
                </li>
              </ul>

              <a
                href={o.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy hover:text-gold mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase"
              >
                Get Directions <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>

        <p className="text-charcoal/50 mt-8 text-xs">
          Office phone numbers and full street addresses are placeholder entries and will be
          finalized in the public directory.
        </p>
      </Container>
    </section>
  );
}
