import Container from "../Container";
import SectionHeading from "../SectionHeading";
import { Cpu, Headphones, Plane, Building2, LineChart } from "lucide-react";
const items = [
  ["TECHNOLOGY", "Apex Global Tech Solution", Cpu],
  ["OUTSOURCING", "Apex Outsourcing", Headphones],
  ["TRAVEL & TOURS", "Apex Tours & Travels", Plane],
  ["REAL ESTATE", "Apex Holdings", Building2],
  ["FINANCIAL CONSULTANCY", "Group Services", LineChart],
] as const;
export default function GroupIntro() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="APEX GROUP"
          title="More Than One Business. One Growing Ecosystem."
          subtitle="Apex connects focused businesses under a shared operating philosophy: build useful expertise, create lasting relationships and grow with intention."
        />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(([sector, name, Icon]) => (
            <div
              key={sector}
              className="border-navy/10 hover:border-gold border bg-white p-6 transition hover:-translate-y-1"
            >
              <Icon className="text-gold mb-10" size={25} />
              <p className="text-slate text-[10px] font-bold tracking-[.18em]">{sector}</p>
              <h3 className="font-display text-navy mt-3 text-2xl">{name}</h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
