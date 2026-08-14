import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Building2, MapPin, ArrowUpRight } from "lucide-react";

const featured = [
  {
    name: "Project A — Heights Residency",
    city: "Islamabad",
    desc: "A residential project with a focus on long-term livability, accessibility and well-considered shared spaces.",
    features: [
      "Residential apartments",
      "Family-friendly layouts",
      "Secure environment",
      "On-route amenities",
    ],
  },
  {
    name: "Project B — Garden Apartments",
    city: "Lahore",
    desc: "Apartments arranged around landscaped communal space, with configuration options for families and individuals.",
    features: [
      "Apartments configuration",
      "Communal gardens",
      "Practical amenities",
      "Family-oriented",
    ],
  },
  {
    name: "Project C — Commercial Plaza",
    city: "Karachi",
    desc: "A commercial project suited for office and retail tenants, located in an active commercial corridor.",
    features: ["Commercial units", "Retail frontage", "Parking provision", "High-traffic location"],
  },
];

export default function HoldingsFeatured() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="FEATURED PROJECTS"
          title="Selected Highlights."
          subtitle="A small selection of projects from our portfolio. Detailed information is available on request."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {featured.map((p) => (
            <div key={p.name} className="bg-cream flex h-full flex-col">
              <div className="bg-navy relative aspect-[16/10] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(242,169,0,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,.25) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
                  <Building2 size={36} className="text-gold" />
                  <p className="text-gold/70 mt-3 text-[10px] tracking-[.2em] uppercase">
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="text-charcoal/65 inline-flex items-center gap-1 text-xs">
                  <MapPin size={12} className="text-gold" /> {p.city}
                </p>
                <h3 className="font-display text-navy mt-2 text-2xl">{p.name}</h3>
                <p className="text-charcoal/65 mt-3 text-sm leading-6">{p.desc}</p>

                <ul className="border-navy/10 text-charcoal/70 mt-5 space-y-2 border-t pt-5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="bg-gold mt-2 h-1 w-1 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-charcoal/40 mt-4 text-[10px] italic">
                  Representative project
                </p>

                <a
                  href="#site-visits"
                  className="text-navy hover:text-gold mt-5 inline-flex items-center gap-1 text-xs font-semibold tracking-[.18em] uppercase"
                >
                  View Details <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
