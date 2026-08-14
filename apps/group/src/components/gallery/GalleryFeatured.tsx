"use client";
import type { GalleryItem } from "@/data/gallery";
export default function GalleryFeatured({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}) {
  return (
    <button
      onClick={() => onClick(item)}
      className="group bg-navy grid w-full overflow-hidden text-left md:grid-cols-[1.2fr_1fr]"
    >
      <div className="relative min-h-[360px] bg-[radial-gradient(circle_at_70%_30%,rgba(242,169,0,.5),transparent_22%),linear-gradient(135deg,#24365d,#0b1431)]">
        <span className="bg-gold text-navy absolute top-6 left-6 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase">
          {item.category}
        </span>
        <span className="absolute bottom-6 left-6 text-xs tracking-wider text-white/45 uppercase">
          Placeholder image
        </span>
      </div>
      <div className="flex flex-col justify-center p-8 md:p-12">
        <p className="text-gold text-xs tracking-[.2em] uppercase">Featured moment</p>
        <h2 className="font-display mt-4 text-4xl leading-tight text-white md:text-5xl">
          {item.title}
        </h2>
        <p className="mt-5 leading-7 text-white/65">{item.caption}</p>
        <p className="mt-8 text-xs tracking-wider text-white/40 uppercase">
          {new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </button>
  );
}
