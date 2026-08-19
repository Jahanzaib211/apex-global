import { Camera } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { GalleryGrid } from "./_components/gallery-grid";

export const metadata = {
  title: "Gallery",
  description:
    "Real travel imagery from Apex Global Tours & Travels — Pakistan and Saudi Arabia destinations, vehicles, hotels, and group journeys.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Gallery"
        subtitle="Real travel imagery to be added by Apex as customer-approved photos become available."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      {/* Filter + grid */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="eyebrow mb-3">Browse by category</div>
            <h2 className="heading-lg mb-3">Destinations, vehicles, and pilgrim journeys</h2>
            <p className="prose-body">
              We are building a library of customer-approved photography from across our routes. The
              categories below show the journeys we publish photography from.
            </p>
          </div>

          <GalleryGrid />
        </div>
      </section>

      {/* Note banner */}
      <section className="section-tight bg-white">
        <div className="container-narrow">
          <div className="border-sand-200 bg-sand-100 flex items-start gap-5 rounded-2xl border p-6 md:p-7">
            <div className="bg-navy-50 text-navy-600 flex h-12 w-12 flex-none items-center justify-center rounded-xl">
              <Camera size={22} />
            </div>
            <div>
              <h3 className="font-display text-navy-600 mb-2 text-lg font-semibold">
                About this gallery
              </h3>
              <p className="text-ink-400 text-sm leading-relaxed">
                The categories above represent the journeys Apex publishes; new photography is added
                to publish. Final imagery will be added only after customer approval. No stock
                photography is used to misrepresent our actual services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-navy-grad text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3">Share your journey</div>
          <h2 className="heading-lg mb-4 text-white">
            Travelled with Apex? We&apos;d love to feature your photos.
          </h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            Customer-approved photos help future travelers see what to expect. Send a photo and a
            short caption — we will reach out before publishing anything.
          </p>
          <form
            action="/api/gallery-upload"
            method="post"
            encType="multipart/form-data"
            className="mx-auto flex max-w-xl flex-col gap-4 rounded-2xl bg-white/5 p-6 text-left backdrop-blur"
          >
            <label className="block text-sm font-medium text-white">
              Your photo
              <span className="ml-2 text-xs text-white/60">(JPEG, PNG, or WebP — up to 5 MB)</span>
              <input
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/webp"
                required
                className="file:bg-gold-500 file:text-navy-600 mt-2 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:px-3 file:py-2"
              />
            </label>
            <label className="block text-sm font-medium text-white">
              Caption (where, when, optional notes)
              <textarea
                name="caption"
                rows={3}
                maxLength={500}
                placeholder="A weekend trip to Hunza, October 2025..."
                className="mt-2 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40"
              />
            </label>
            <button
              type="submit"
              className="bg-gold-500 text-navy-600 self-start rounded-full px-5 py-2.5 text-sm font-semibold transition hover:bg-white"
            >
              Submit your photos
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
