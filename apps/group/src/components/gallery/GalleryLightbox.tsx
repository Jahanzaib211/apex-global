"use client";
import { X } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";
export default function GalleryLightbox({
  item,
  onClose,
}: {
  item: GalleryItem | null;
  onClose: () => void;
}) {
  if (!item) return null;
  return (
    <div
      className="bg-navy/90 fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div
        className="bg-cream relative max-h-[90vh] w-full max-w-3xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close gallery image"
          className="bg-navy hover:bg-gold hover:text-navy absolute top-4 right-4 z-10 rounded-full p-2 text-white"
        >
          <X size={18} />
        </button>
        <div className="flex aspect-video items-center justify-center bg-[radial-gradient(circle_at_70%_30%,rgba(242,169,0,.45),transparent_22%),linear-gradient(135deg,#24365d,#0b1431)]">
                  </div>
        <div className="p-7 md:p-10">
          <div className="flex flex-wrap gap-2">
            <span className="bg-gold text-navy px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
              {item.category}
            </span>
            {item.company && (
              <span className="border-navy/15 text-navy/60 border px-2 py-1 text-[10px] tracking-wider uppercase">
                {item.company}
              </span>
            )}
          </div>
          <h2 className="font-display text-navy mt-4 text-4xl">{item.title}</h2>
          <p className="text-charcoal/70 mt-4 leading-7">{item.caption}</p>
          <p className="text-charcoal/45 mt-6 text-xs tracking-wider uppercase">
            {new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
