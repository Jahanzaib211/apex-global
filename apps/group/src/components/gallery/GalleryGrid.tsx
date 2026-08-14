"use client";
import type { GalleryItem } from "@/data/gallery";
import GalleryTile from "./GalleryTile";
export default function GalleryGrid({
  items,
  onClick,
}: {
  items: GalleryItem[];
  onClick: (item: GalleryItem) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <GalleryTile key={item.id} item={item} onClick={onClick} />
      ))}
    </div>
  );
}
