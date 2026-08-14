"use client";
import type { GalleryItem } from "@/data/gallery";
export default function GalleryTile({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}) {
  return (
    <button
      onClick={() => onClick(item)}
      className="group bg-navy relative aspect-square w-full overflow-hidden text-left"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(242,169,0,.28),transparent_28%),linear-gradient(135deg,#172449,#0b1431_65%,#2c3e50)] transition duration-500 group-hover:scale-105" />
      <span className="bg-gold text-navy absolute top-4 left-4 z-10 px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
        {item.category}
      </span>
            <div className="from-navy via-navy/85 absolute inset-x-0 bottom-0 z-10 translate-y-3 bg-gradient-to-t to-transparent p-5 pt-16 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="font-display text-2xl text-white">{item.title}</h3>
      </div>
    </button>
  );
}
