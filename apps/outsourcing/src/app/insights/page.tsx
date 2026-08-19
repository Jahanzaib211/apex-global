import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROUTE_META } from "@/lib/nav";

export const metadata: Metadata = {
  title: ROUTE_META["/insights"]!.title,
  description: ROUTE_META["/insights"]!.description,
  alternates: { canonical: "/insights" },
  openGraph: {
    // Declaring openGraph replaces the root layout\'s entire node, which
    // dropped its image. The generated card lives at /opengraph-image.
    images: ["/opengraph-image"],
    title: ROUTE_META["/insights"]!.title,
    description: ROUTE_META["/insights"]!.description,
    url: "/insights",
  },
};

const POSTS = [
  {
    cat: "Sales",
    title: "Why B2B companies are rebuilding their SDR function in 2026",
    excerpt:
      "The economics of in-house SDRs have shifted. Here's how leading companies are structuring outbound for the next cycle.",
    date: "Aug 2026",
    read: "6 min",
  },
  {
    cat: "Customer Experience",
    title: "The omnichannel mandate: meeting customers where they are",
    excerpt:
      "Email, chat, voice and social are no longer channels — they're one conversation. How to design for it.",
    date: "Jul 2026",
    read: "5 min",
  },
  {
    cat: "Marketing",
    title: "Performance marketing + Telesales: the integrated growth model",
    excerpt:
      "When paid media and outbound sales share one operating rhythm, conversion compounds. Here's the playbook.",
    date: "Jul 2026",
    read: "7 min",
  },
  {
    cat: "Operations",
    title: "KPI design for outsourced engagements that actually drive behaviour",
    excerpt:
      "Bad KPIs optimize for the wrong outcomes. Here are the principles we use to design measurement that works.",
    date: "Jun 2026",
    read: "8 min",
  },
  {
    cat: "Strategy",
    title: "Outsourcing vs. offshoring vs. nearshoring: choosing the right model",
    excerpt:
      "Labels are easy. Operating realities are harder. A practical guide to choosing the right delivery model.",
    date: "Jun 2026",
    read: "6 min",
  },
  {
    cat: "AI",
    title: "Where AI genuinely moves the needle in outsourcing operations",
    excerpt:
      "Transcription, summarization, QA scoring and lead scoring — separating real wins from vendor hype.",
    date: "May 2026",
    read: "5 min",
  },
];

export default function InsightsPage() {
  return (
    <main className="bg-white">
      <Navbar />

      <section className="from-navy-dark via-navy to-slate2-dark relative overflow-hidden bg-gradient-to-br pt-32 pb-20 text-white">
        <div className="bg-hero-grid absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Insights
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-5xl leading-tight font-extrabold md:text-6xl">
            Thinking on outsourcing, <span className="gradient-text">growth and operations.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Practical perspectives from operators running global sales, CX and marketing engagements
            at scale.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((p) => (
              <article
                key={p.title}
                className="border-line card-hover overflow-hidden rounded-2xl border bg-white"
              >
                <div className="from-navy to-slate2-dark relative h-40 bg-gradient-to-br">
                  <div className="bg-hero-grid absolute inset-0 opacity-30" />
                  <div className="text-amber2 absolute top-4 left-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest uppercase backdrop-blur">
                    {p.cat}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-navy text-lg font-bold">{p.title}</h3>
                  <p className="text-steel mt-3 text-sm leading-relaxed">{p.excerpt}</p>
                  <div className="text-steel mt-5 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} aria-hidden /> {p.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} aria-hidden /> {p.read}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/contact" className="btn-ghost">
              Subscribe to Insights <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
