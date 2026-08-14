"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

type Category =
  | "All"
  | "Pakistan"
  | "Saudi Arabia"
  | "Makkah"
  | "Madinah"
  | "Hotels"
  | "Vehicles"
  | "Group Travel";

interface Tile {
  id: number;
  category: Exclude<Category, "All">;
  bg: string;
  label: string;
}

const TILES: Tile[] = [
  { id: 1, category: "Pakistan", bg: "bg-navy-grad", label: "Lahore city skyline" },
  { id: 2, category: "Saudi Arabia", bg: "bg-gold-grad", label: "Riyadh boulevard" },
  { id: 3, category: "Makkah", bg: "bg-navy-grad", label: "Makkah Al-Masjid Al-Haram" },
  { id: 4, category: "Madinah", bg: "bg-sand-grad", label: "Madinah Al-Masjid An-Nabawi" },
  { id: 5, category: "Vehicles", bg: "bg-navy-grad", label: "SUV fleet" },
  { id: 6, category: "Vehicles", bg: "bg-gold-grad", label: "Sedan executive class" },
  { id: 7, category: "Hotels", bg: "bg-navy-grad", label: "Makkah hotel lobby" },
  { id: 8, category: "Hotels", bg: "bg-sand-grad", label: "Madinah hotel room" },
  { id: 9, category: "Group Travel", bg: "bg-gold-grad", label: "Pilgrim group transfer" },
  { id: 10, category: "Group Travel", bg: "bg-navy-grad", label: "Family Umrah group" },
  { id: 11, category: "Pakistan", bg: "bg-sand-grad", label: "Karachi coastal drive" },
  { id: 12, category: "Pakistan", bg: "bg-gold-grad", label: "Islamabad Faisal Mosque" },
  { id: 13, category: "Saudi Arabia", bg: "bg-sand-grad", label: "Jeddah old town" },
  { id: 14, category: "Makkah", bg: "bg-gold-grad", label: "Tawaf area" },
  { id: 15, category: "Vehicles", bg: "bg-sand-grad", label: "Family van" },
  { id: 16, category: "Group Travel", bg: "bg-navy-grad", label: "Airport welcome desk" },
];

const CATEGORIES: Category[] = [
  "All",
  "Pakistan",
  "Saudi Arabia",
  "Makkah",
  "Madinah",
  "Hotels",
  "Vehicles",
  "Group Travel",
];

export function GalleryGrid() {
  const [active, setActive] = useState<Category>("All");
  const filtered = active === "All" ? TILES : TILES.filter((t) => t.category === active);

  return (
    <>
      {/* Filter chips */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-navy-grad border-navy-600 shadow-navy text-white"
                  : "text-ink-400 border-sand-200 hover:border-navy-200 hover:text-navy-600 bg-white"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className={`${t.bg} shadow-soft hover:shadow-navy relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl p-5 text-center transition-shadow`}
          >
            <Camera size={28} className="mb-3 text-white/80" />
            <div className="mb-2 text-sm leading-tight font-semibold text-white">{t.label}</div>
            <div className="text-[10px] font-semibold tracking-wider text-white/70 uppercase">
              {t.category}
            </div>
            <div className="absolute right-2 bottom-2 left-2 text-[10px] text-white/60 italic"></div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-ink-400 py-12 text-center">No items in this category yet.</div>
      )}
    </>
  );
}
