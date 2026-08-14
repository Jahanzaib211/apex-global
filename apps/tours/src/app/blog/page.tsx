import { BookOpen, ArrowRight, Calendar } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Travel Guides — Apex Global Tours & Travels",
  description:
    "Helpful preparation guides for Hajj, Umrah, and travel in Pakistan and Saudi Arabia. Verify government, visa, and religious information with the relevant authority.",
};

const FEATURED = {
  category: "Umrah preparation",
  title: "Umrah preparation — a starting checklist",
  excerpt:
    "A practical starting point for travelers planning their first Umrah — what to sort out months before, weeks before, and the day before departure. Designed to complement, not replace, guidance from your local religious authority.",
};

const POSTS = [
  {
    category: "Hajj preparation",
    title: "Hajj preparation — what to plan first",
    excerpt:
      "The earliest decisions shape the rest of your Hajj journey — from passport readiness to package timing.",
  },
  {
    category: "Umrah preparation",
    title: "Umrah preparation — a starting checklist",
    excerpt: "A practical starting point for travelers planning their first Umrah journey.",
  },
  {
    category: "Saudi travel essentials",
    title: "Saudi travel essentials — what to know before you fly",
    excerpt:
      "Practical things travelers commonly ask about before entering the Kingdom — apps, currency, transport.",
  },
  {
    category: "Pakistan travel essentials",
    title: "Pakistan travel essentials — intercity and city travel",
    excerpt:
      "How car rentals, airport transfers, and intercity travel typically work across major Pakistani cities.",
  },
  {
    category: "Car rental guide",
    title: "Car rental guide — with driver vs self-drive",
    excerpt:
      "When a chauffeured vehicle makes more sense than a self-drive rental — and when it does not.",
  },
  {
    category: "Travel checklist",
    title: "Travel checklist — documents, packing, and contingencies",
    excerpt:
      "A generic, non-religious travel checklist covering documents, packing, and contingencies for group trips.",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Travel guides"
        title="Travel guides"
        subtitle="Helpful preparation information. Government, visa and religious information changes frequently — verify with the relevant authority before relying on it."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      {/* Featured post */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="eyebrow mb-3">Featured guide</div>
          <div className="card relative overflow-hidden p-7 lg:p-10">
            <div className="grid grid-cols-1 items-center gap-7 lg:grid-cols-5">
              <div className="order-2 lg:order-1 lg:col-span-3">
                <div className="badge-navy mb-4">{FEATURED.category}</div>
                <h2 className="heading-md mb-3">{FEATURED.title}</h2>
                <p className="prose-body-lg mb-6">{FEATURED.excerpt}</p>
                <div className="text-ink-300 mb-6 flex items-center gap-2 text-xs">
                  <Calendar size={14} />
                  <span>Article to be published by Apex</span>
                </div>
                <button
                  type="button"
                  disabled
                  className="btn-ghost inline-flex cursor-not-allowed opacity-60"
                  aria-label="Read more (article to be published)"
                >
                  Read more <ArrowRight size={16} />
                </button>
              </div>
              <div className="order-1 lg:order-2 lg:col-span-2">
                <div className="bg-navy-grad shadow-navy flex aspect-[4/3] items-center justify-center rounded-2xl">
                  <BookOpen size={64} className="text-gold-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All posts grid */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="eyebrow mb-3">All guides</div>
            <h2 className="heading-lg">Browse by category</h2>
            <p className="prose-body mt-3">
              These are the questions travellers ask us most. Ask about any of them and our team
              will answer for your specific trip.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((p) => (
              <article key={p.title} className="card flex flex-col p-6 lg:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <span className="badge-gold">{p.category}</span>
                </div>
                <h3 className="font-display text-navy-600 mb-3 text-lg leading-snug font-semibold">
                  {p.title}
                </h3>
                <p className="text-ink-400 flex-1 text-sm leading-relaxed">{p.excerpt}</p>
                <a
                  href="/contact#enquiry"
                  className="text-navy-600 hover:text-gold-600 mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
                >
                  Ask about this <ArrowRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer banner */}
      <section className="section-tight bg-sand-grad">
        <div className="container-narrow">
          <div className="border-sand-200 rounded-2xl border bg-white p-6 md:p-7">
            <div className="flex items-start gap-5">
              <div className="bg-gold-100 text-gold-600 flex h-12 w-12 flex-none items-center justify-center rounded-xl">
                <BookOpen size={22} />
              </div>
              <div>
                <h3 className="font-display text-navy-600 mb-2 text-lg font-semibold">
                  About these guides
                </h3>
                <p className="text-ink-400 text-sm leading-relaxed">
                  Travel, visa, religious and government requirements change frequently. Treat these
                  as orientation, and confirm the current position with the relevant authority — or
                  with us — before you rely on it for a booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-navy-grad text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3">Have a question?</div>
          <h2 className="heading-lg mb-4 text-white">Speak to our team instead</h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            For specific dates, routes, or packages, the fastest path is an enquiry with our team.
            We&apos;ll respond with options.
          </p>
          <EnquireButton mode="general" label="Enquire Now" />
        </div>
      </section>
    </>
  );
}
