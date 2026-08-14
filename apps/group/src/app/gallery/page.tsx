"use client";
import { useState } from "react";
import Container from "@/components/Container";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryCategories from "@/components/gallery/GalleryCategories";
import GalleryFeatured from "@/components/gallery/GalleryFeatured";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import GalleryUploadInfo from "@/components/gallery/GalleryUploadInfo";
import GalleryCTA from "@/components/gallery/GalleryCTA";
import galleryItems from "@/data/gallery";
import type { GalleryItem } from "@/data/gallery";
import { url } from "@/lib/site-url";
export default function GalleryPage() {
  const [filtered, setFiltered] = useState(galleryItems);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const featured = galleryItems.find((i) => i.featured) ?? galleryItems[0];
  const visible = filtered.filter((i) => i.id !== featured.id);
  return (
    <main>
      <GalleryHero />
      <section className="py-20">
        <Container>
          <GalleryCategories items={galleryItems} onChange={setFiltered} />
          <div className="mt-12">
            <GalleryFeatured item={featured} onClick={setSelected} />
          </div>
          <div className="mt-5">
            <GalleryGrid items={visible} onClick={setSelected} />
          </div>
        </Container>
      </section>
      <GalleryUploadInfo />
      <GalleryCTA />
      <GalleryLightbox item={selected} onClose={() => setSelected(null)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: "Apex Group Gallery",
            description: "Moments from across Apex Group of Companies",
            url: url("/gallery"),
            image: galleryItems.map((i) => url(`/gallery/${i.id}`)),
          }),
        }}
      />
    </main>
  );
}
