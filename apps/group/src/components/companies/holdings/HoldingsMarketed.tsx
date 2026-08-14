import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const listed = [
  {
    name: "Project A — Heights Residency",
    city: "Islamabad",
    category: "Residential",
    status: "Available",
  },
  {
    name: "Project B — Garden Apartments",
    city: "Lahore",
    category: "Apartments",
    status: "Available",
  },
  {
    name: "Project C — Commercial Plaza",
    city: "Karachi",
    category: "Commercial",
    status: "Limited Units",
  },
  { name: "Project D — Riverside Plots", city: "Multan", category: "Plots", status: "Available" },
];

export default function HoldingsMarketed() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="MARKETED PROJECTS" title="Projects Marketed by Apex." />
            <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
              <p>
                Apex Holdings works with developers to market their projects to qualified buyers.
                Our role covers promotion, lead management, buyer engagement and sales coordination.
              </p>
              <p>
                The list below is a sample of marketed projects. Real project names are shared with
                qualified enquiries under NDA.
              </p>
            </div>
            <p className="text-charcoal/45 mt-6 text-xs italic">
              All entries shown are placeholders.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="border-navy/10 overflow-hidden border">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold tracking-[.15em] uppercase">
                      Project
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-[.15em] uppercase">
                      City
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-[.15em] uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-[.15em] uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-navy/10 divide-y bg-white">
                  {listed.map((p) => (
                    <tr key={p.name} className="text-charcoal/75">
                      <td className="text-navy px-4 py-4 font-medium">{p.name}</td>
                      <td className="px-4 py-4">{p.city}</td>
                      <td className="px-4 py-4">{p.category}</td>
                      <td className="text-gold px-4 py-4">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-charcoal/45 mt-3 text-xs italic">Sample list — placeholders only.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
