import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Building2, MapPin, Phone, ExternalLink, ArrowUpRight } from "lucide-react";
import { DEFAULT_BRANDS } from "@apex/site-kit/brand";

const BRAND = DEFAULT_BRANDS["apex-group"]!;

/**
 * Every card used to render `+92 XXX XXXXXXX` with the words "Placeholder — to
 * be updated" beside it, a `support@` address that is not a real mailbox, and a
 * footnote admitting the whole block was placeholder data.
 *
 * Now: the registered office carries the real address and the group phone,
 * both from `@apex/site-kit/brand` (mirroring the Tech settings table). The two
 * regional offices carry no invented street address or phone — they route to
 * the contact form, which is the channel that provably reaches someone.
 */
type Office = {
  city: string;
  label: string;
  address?: string;
  phone?: string;
  maps: string;
};

const offices: Office[] = [
  {
    city: "Lahore",
    label: "Registered Office",
    address: BRAND.contactAddress,
    phone: BRAND.contactPhone,
    maps: "https://www.google.com/maps/search/?api=1&query=Lake+City+Lahore+Pakistan",
  },
  {
    city: "Karachi",
    label: "Regional Office",
    maps: "https://www.google.com/maps/search/?api=1&query=Karachi+Pakistan",
  },
  {
    city: "Riyadh",
    label: "Regional Office",
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
          subtitle="Our offices serve as coordination points for the Group and its companies. Regional office addresses are confirmed on first direct enquiry."
        />

        <div className="bg-navy/10 mt-14 grid gap-px md:grid-cols-3">
          {offices.map((o) => (
            <div key={o.city} className="flex flex-col bg-white p-8">
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
                  <span>{o.address ?? "Address available on request"}</span>
                </li>
                {o.phone && (
                  <li className="flex gap-3">
                    <Phone className="text-gold mt-0.5 shrink-0" size={16} />
                    <a href={`tel:${o.phone.replace(/\s+/g, "")}`} className="hover:text-gold">
                      {o.phone}
                    </a>
                  </li>
                )}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href={o.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy hover:text-gold inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase"
                >
                  Get Directions <ExternalLink size={12} />
                </a>
                {!o.phone && (
                  <Link
                    href="/contact#contact-form"
                    className="text-navy hover:text-gold inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase"
                  >
                    Contact This Office <ArrowUpRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
