"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
const pages = [
  ["Home", "/", "The Apex Group at a glance", "home"],
  ["About Apex", "/about", "Our story, vision and operating perspective", "about"],
  ["Leadership", "/leadership", "Meet the people shaping Apex", "leadership"],
  [
    "Apex Global Tech Solution",
    "/companies/tech-solution",
    "Technology, SaaS and digital systems",
    "tech technology saas",
  ],
  [
    "Apex Global Outsourcing",
    "/companies/outsourcing",
    "BPO, telesales and customer operations",
    "outsourcing bpo telesales tele-sales",
  ],
  [
    "Apex Tours & Travels",
    "/companies/tours-travels",
    "Travel, Hajj, Umrah and car rentals",
    "tours travel hajj umrah",
  ],
  [
    "Apex Holdings",
    "/companies/holdings",
    "Real estate and long-term assets",
    "holdings real estate",
  ],
  [
    "Financial Consultancy",
    "/consultancy",
    "Financial advice for businesses and HNWI",
    "consultancy financial hnwi",
  ],
  ["Ecosystem", "/ecosystem", "How the Apex companies work together", "ecosystem"],
  ["Our Companies", "/companies", "Directory of Apex operating companies", "companies"],
  ["Contact Apex", "/contact", "Start a conversation with Apex", "contact"],
  [
    "Partnerships",
    "/partnerships",
    "Build something meaningful with Apex",
    "partnership partnership",
  ],
  ["Careers", "/careers", "Explore opportunities at Apex", "careers jobs"],
  ["Insights", "/insights", "News, ideas and perspectives", "insights news blog"],
  ["Events", "/events", "Apex events and milestones", "events"],
  ["Gallery", "/gallery", "Moments from across Apex", "gallery"],
  ["Privacy", "/privacy", "Privacy information", "privacy"],
  ["Terms", "/terms", "Terms and conditions", "terms"],
];
export default function SearchBox() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? pages.filter((p) => `${p[0]} ${p[2]} ${p[3]}`.toLowerCase().includes(q)) : pages;
  }, [query]);
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <label htmlFor="search" className="sr-only">
            Search Apex Group
          </label>
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, companies or capabilities…"
            className="border-navy font-display text-navy placeholder:text-navy/25 focus:border-gold w-full border-b-2 bg-transparent px-0 py-5 text-3xl outline-none"
          />
          <div className="mt-10">
            {results.length ? (
              <div className="grid gap-3">
                {results.map((p) => (
                  <Link
                    href={p[1] ?? "#"}
                    key={p[1] ?? "x"}
                    className="group border-navy/10 hover:border-gold border bg-white p-6 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-navy text-2xl">{p[0]}</h2>
                        <p className="text-charcoal/60 mt-2 text-sm">{p[2]}</p>
                      </div>
                      <span className="text-gold text-sm font-semibold transition group-hover:translate-x-1">
                        Visit →
                      </span>
                    </div>
                    <p className="text-navy/35 mt-4 text-xs tracking-wider uppercase">{p[1]}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border-gold border border-dashed p-10 text-center">
                <p className="font-display text-navy text-3xl">No matches yet.</p>
                <p className="text-charcoal/60 mt-3 text-sm">
                  Try a broader term like technology, travel or contact.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
