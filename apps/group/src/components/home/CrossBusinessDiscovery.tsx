"use client";
import { useState } from "react";
import Container from "../Container";
import SectionHeading from "../SectionHeading";
import { ArrowUpRight } from "lucide-react";
const filters = ["All", "Tech", "Outsourcing", "Travel", "Real Estate", "Finance"];
const cards = [
  ["Tech", "Apex Global Tech Solution", "Technology"],
  ["Outsourcing", "Apex Outsourcing", "Outsourcing"],
  ["Travel", "Apex Tours & Travels", "Travel & Tours"],
  ["Real Estate", "Apex Holdings", "Real Estate"],
  ["Finance", "Financial Consultancy", "Financial Consultancy"],
];
export default function CrossBusinessDiscovery() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? cards : cards.filter((c) => c[0] === filter);
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="EXPLORE MORE"
          title="Other Ways Apex Can Support You."
          subtitle="Follow the thread that is most relevant to your next move."
        />
        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-4 py-2 text-xs font-semibold transition ${filter === f ? "border-navy bg-navy text-white" : "border-navy/20 text-navy hover:border-gold"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {visible.map(([_, name, sector]) => (
            <a href="#contact" key={name} className="group hover:bg-navy bg-white p-6">
              <p className="text-gold text-[10px] font-bold tracking-widest uppercase">{sector}</p>
              <h3 className="font-display text-navy mt-12 text-2xl group-hover:text-white">
                {name}
              </h3>
              <ArrowUpRight className="text-gold mt-5" size={18} />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
