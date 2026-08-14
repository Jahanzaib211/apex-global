"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Camera, ChevronDown, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { gallery, galleryCategories } from "@/data/content";

export default function GalleryPage() {
  const [category, setCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const filtered = useMemo(
    () => (category === "All" ? gallery : gallery.filter((item) => item.category === category)),
    [category],
  );
  const selected = selectedIndex === null ? null : filtered[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight")
        setSelectedIndex((i) => (i === null ? 0 : (i + 1) % filtered.length));
      if (event.key === "ArrowLeft")
        setSelectedIndex((i) => (i === null ? 0 : (i - 1 + filtered.length) % filtered.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, filtered.length]);

  return (
    <>
      <PageBanner
        eyebrow="APEX GALLERY"
        title="A living record of our projects, events and corporate moments."
        description="Curated imagery from our project portfolio and corporate journey — updated as the company grows."
        breadcrumbs={[{ label: "Gallery" }]}
      />
      <main className="section bg-white">
        <div className="container-x">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="eyebrow mb-2 block">EXPLORE THE ARCHIVE</span>
              <p className="max-w-xl text-slate-600">
                A considered view into the people, places and milestones behind Apex.
              </p>
            </div>
            <div className="relative">
              <select
                aria-label="Filter gallery"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-ink focus:border-gold-400 appearance-none rounded-full border border-slate-200 bg-slate-50 py-3 pr-11 pl-5 text-sm font-semibold outline-none sm:hidden"
              >
                {galleryCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-3.5 right-4 h-4 w-4 text-slate-500 sm:hidden" />
            </div>
            <div className="hidden flex-wrap gap-2 sm:flex">
              {galleryCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${category === item ? "border-gold-400 bg-gold-400 text-ink" : "hover:border-gold-400 hover:text-ink border-slate-200 bg-white text-slate-600"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {filtered.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                className={`group relative overflow-hidden rounded-2xl text-left shadow-sm ${index % 7 === 0 || index % 7 === 4 ? "row-span-2" : ""} ${index % 9 === 0 ? "col-span-2" : ""}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="from-ink/90 via-ink/10 absolute inset-0 bg-gradient-to-t to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
                  <span className="text-gold-400 mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] uppercase">
                    <Camera className="h-3 w-3" />
                    {item.category}
                  </span>
                  <h2 className="font-display text-base leading-snug font-bold md:text-lg">
                    {item.title}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-300">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
      <CTASection
        variant="dark"
        eyebrow="KEEP THE STORY MOVING"
        title="Have a moment to add?"
        primary={{ label: "Get in touch", href: "/contact" }}
      />
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          className="bg-ink/95 fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            aria-label="Close lightbox"
            onClick={() => setSelectedIndex(null)}
            className="hover:bg-gold-400 hover:text-ink absolute top-5 right-5 z-10 rounded-full border border-white/20 bg-white/10 p-3 text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((selectedIndex! - 1 + filtered.length) % filtered.length);
            }}
            className="hover:bg-gold-400 hover:text-ink absolute top-1/2 left-3 rounded-full border border-white/20 bg-white/10 p-3 text-white md:left-8"
          >
            <ChevronLeft />
          </button>
          <div className="relative h-[70vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selected.image}
              alt={selected.title}
              fill
              unoptimized
              className="object-contain"
            />
            <div className="from-ink/90 absolute right-0 bottom-0 left-0 bg-gradient-to-t to-transparent p-5 pt-20 text-white">
              <p className="eyebrow !text-gold-400">{selected.category}</p>
              <h2 className="font-display mt-2 text-2xl font-bold">{selected.title}</h2>
              <p className="mt-1 text-sm text-slate-300">
                {selected.date} · {selected.location}
              </p>
            </div>
          </div>
          <button
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((selectedIndex! + 1) % filtered.length);
            }}
            className="hover:bg-gold-400 hover:text-ink absolute top-1/2 right-3 rounded-full border border-white/20 bg-white/10 p-3 text-white md:right-8"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
