import Container from "@/components/Container";
import Button from "@/components/Button";
type CompanyRow = [
  name: string,
  sector: string,
  initials: string,
  description: string,
  tagline: string,
  chips: string[],
  href: string,
];
const companies: CompanyRow[] = [
  [
    "Apex Global Tech Solution",
    "Technology",
    "AGS",
    "Digital products, SaaS thinking and practical technology systems for modern businesses.",
    "Technology that makes a business more capable.",
    ["SaaS", "Product Development", "Digital Systems", "Automation", "Integrations", "Support"],
    "/companies/tech-solution",
  ],
  [
    "Apex Global Outsourcing",
    "Outsourcing",
    "AGO",
    "Customer operations and support services structured around consistency, clarity and care.",
    "Reliable operations behind better customer experiences.",
    [
      "BPO",
      "Tele-sales",
      "Customer Support",
      "Back Office",
      "Quality Assurance",
      "Workforce Support",
    ],
    "/companies/outsourcing",
  ],
  [
    "Apex Tours & Travels",
    "Tours & Pilgrimage",
    "ATT",
    "Purposeful journeys, pilgrimage support and travel logistics designed around care.",
    "Travel support for journeys that matter.",
    [
      "Hajj & Umrah",
      "Travel Planning",
      "Car Rentals",
      "Saudi Logistics",
      "Visa Support",
      "Group Travel",
    ],
    "/companies/tours-travels",
  ],
  [
    "Apex Holdings",
    "Holdings & Real Estate",
    "AH",
    "Long-term thinking across property, assets and opportunities with durable value.",
    "A patient view of property and opportunity.",
    ["Real Estate", "Property", "Investments", "Asset Strategy", "Development", "Holdings"],
    "/companies/holdings",
  ],
  [
    "Apex Financial Consultancy",
    "Financial Advisory",
    "AFC",
    "Financial perspective for businesses, investors and high-net-worth individuals.",
    "Clearer financial decisions, grounded in perspective.",
    ["Advisory", "Strategy", "HNWI Support", "Planning", "Business Finance", "Risk Perspective"],
    "/consultancy",
  ],
];
export default function CompaniesIndexList() {
  return (
    <section className="py-24">
      <Container>
        <div className="space-y-6">
          {companies.map(([name, sector, initials, desc, tagline, chips, href], i) => (
            <article
              key={name}
              className="border-navy/10 grid gap-8 border bg-white p-6 md:grid-cols-[280px_1fr] md:p-10"
            >
              <div
                className={`bg-navy flex min-h-[250px] items-center justify-center ${i % 2 ? "md:order-2" : ""}`}
              >
                <span className="font-display text-gold text-6xl">{initials}</span>
              </div>
              <div className={i % 2 ? "md:order-1 md:pl-2" : ""}>
                <p className="text-gold text-xs font-semibold tracking-[.2em] uppercase">
                  {sector}
                </p>
                <h2 className="font-display text-navy mt-3 text-4xl">{name}</h2>
                <p className="font-editorial text-navy/65 mt-3 text-2xl">{tagline}</p>
                <p className="text-charcoal/70 mt-5 max-w-2xl leading-7">{desc}</p>
                <p className="text-charcoal/60 mt-4 max-w-2xl leading-7">
                  This company operates with its own sector focus while aligned to the Group’s
                  standards and long-term perspective.
                </p>
                <p className="text-charcoal/60 mt-4 max-w-2xl leading-7">
                  Specific company information is a placeholder and will be updated through the
                  Group content system.
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
                <div className="border-navy/10 mt-8 grid gap-3 border-y py-5 text-xs sm:grid-cols-3">
                  <p>
                    <span className="text-navy/40 block tracking-wider uppercase">
                      Headquarters
                    </span>
                    <span className="text-navy mt-1 block">Placeholder — to be updated</span>
                  </p>
                  <p>
                    <span className="text-navy/40 block tracking-wider uppercase">
                      Operating Markets
                    </span>
                    <span className="text-navy mt-1 block">Placeholder — to be updated</span>
                  </p>
                  <p>
                    <span className="text-navy/40 block tracking-wider uppercase">
                      Company Type
                    </span>
                    <span className="text-navy mt-1 block">Placeholder — to be updated</span>
                  </p>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href={href}>Visit company page →</Button>
                  <Button href="/contact" variant="outline-gold">
                    Enquire about this company →
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
