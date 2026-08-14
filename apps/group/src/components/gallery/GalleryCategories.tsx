"use client";
import { useState } from "react";
import type { GalleryCategory, GalleryItem } from "@/data/gallery";
const categories: ("All" | GalleryCategory)[] = [
  "All",
  "Group Events",
  "Corporate Events",
  "Leadership",
  "Technology",
  "Outsourcing",
  "Tours & Travels",
  "Real Estate",
  "Project Launches",
  "Meetings",
  "Conferences",
  "Team Activities",
];
export default function GalleryCategories({
  items,
  onChange,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
}) {
  const [active, setActive] = useState<"All" | GalleryCategory>("All");
  function select(c: "All" | GalleryCategory) {
    setActive(c);
    onChange(c === "All" ? items : items.filter((i) => i.category === c));
  }
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => select(c)}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${active === c ? "border-gold bg-gold text-navy" : "border-navy/15 text-navy hover:border-gold bg-white"}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
