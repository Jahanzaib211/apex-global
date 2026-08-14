import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
type CompanyRow = [name: string, sector: string, description: string, chips: string[]];
const companies: CompanyRow[] = [
  [
    "Apex Global Tech Solution",
    "Technology",
    "Digital products and technology systems designed to make modern businesses more capable.",
    ["SaaS", "Product Development", "Digital Systems", "Automation"],
  ],
  [
    "Apex Global Outsourcing",
    "Outsourcing",
    "Customer operations and support services structured around consistency, clarity and care.",
    ["BPO", "Telesales", "Customer Support", "Operations"],
  ],
  [
    "Apex Tours & Travels",
    "Travel & Pilgrimage",
    "Travel support that helps people move with confidence, including pilgrimage journeys and logistics.",
    ["Hajj & Umrah", "Travel Planning", "Car Rentals", "Logistics"],
  ],
  [
    "Apex Holdings",
    "Holdings & Real Estate",
    "A long-term platform for property, assets and opportunities that create durable value.",
    ["Real Estate", "Property", "Investments", "Asset Strategy"],
  ],
  [
    "Apex Financial Consultancy",
    "Financial Advisory",
    "Financial perspective for businesses, investors and high-net-worth individuals.",
    ["Advisory", "Strategy", "HNWI Support", "Planning"],
  ],
];
export default function EcosystemCompanies() {
  return (
    <section id="the-companies" className="bg-white py-24">
      <Container>
        <SectionHeading eyebrow="The Companies" title="Each Company, In Its Own Right." />
        <div className="mt-14 space-y-5">
          {companies.map(([name, sector, desc, chips], i) => (
            <article
              key={name}
              className={`border-navy/10 grid gap-8 border p-7 md:grid-cols-[220px_1fr] md:p-10 ${i % 2 ? "md:ml-16" : "md:mr-16"}`}
            >
              <div>
                <p className="text-gold text-xs font-semibold tracking-[.18em] uppercase">
                  {sector}
                </p>
                <h3 className="font-display text-navy mt-3 text-3xl">{name}</h3>
              </div>
              <div>
                <p className="text-charcoal/70 max-w-2xl leading-7">{desc}</p>
                <p className="text-charcoal/60 mt-4 max-w-2xl leading-7">
                  This company operates with its own focus while benefiting from the standards,
                  relationships and long-term perspective of the wider Group.
                </p>
                <p className="text-charcoal/60 mt-4 max-w-2xl leading-7">
                  Further company information, capabilities and case studies will be added as the
                  Group content system develops.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(chips as string[]).map((c) => (
                    <span
                      key={c}
                      className="border-navy/15 text-navy/70 border px-3 py-1.5 text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <Link
                  href={
                    i === 4
                      ? "/consultancy"
                      : `/companies/${["tech-solution", "outsourcing", "tours-travels", "holdings"][i]}`
                  }
                  className="text-navy decoration-gold mt-7 inline-block text-sm font-semibold underline decoration-2 underline-offset-8"
                >
                  Visit company page →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
