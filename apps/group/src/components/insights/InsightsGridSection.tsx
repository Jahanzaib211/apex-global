"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { insights, type Insight, type InsightCategory } from "@/data/insights";

const CATEGORIES: ("All" | InsightCategory)[] = [
  "All",
  "Group News",
  "Technology",
  "Outsourcing",
  "Tours & Travels",
  "Real Estate",
  "Financial Insights",
  "Corporate Updates",
  "Events",
];

export default function InsightsGridSection() {
  const [active, setActive] = useState<"All" | InsightCategory>("All");

  const visible = useMemo(
    () => (active === "All" ? insights : insights.filter((i) => i.category === active)),
    [active],
  );

  const featured = visible.find((i) => i.featured) ?? insights.find((i) => i.featured);
  const rest = visible.filter((i) => i !== featured);

  return (
    <>
      <section className="bg-cream py-16">
        <Container>
          <SectionHeading
            eyebrow="FILTER BY TOPIC"
            title="Browse by Category."
            subtitle="Eight content streams reflecting the breadth of the Group and the conversations happening across it."
          />

          <div
            className="mt-10 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Insight categories"
          >
            {CATEGORIES.map((c) => {
              const isActive = active === c;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  role="tab"
                  aria-selected={isActive}
                  className={`border px-4 py-2 text-xs font-semibold tracking-[.15em] uppercase transition ${
                    isActive
                      ? "border-navy bg-navy text-gold"
                      : "border-navy/20 text-charcoal/70 hover:border-navy/40 bg-white"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {featured && active === "All" && <InsightsFeatured article={featured} />}

      <section id="all-insights" className="bg-white py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <h3 className="font-display text-navy text-3xl">All Insights</h3>
            <p className="text-charcoal/45 text-xs tracking-[.18em] uppercase">
              {visible.length} {visible.length === 1 ? "article" : "articles"}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(active === "All" ? rest : visible).map((a) => (
              <InsightCard key={a.slug} article={a} />
            ))}
            {visible.length === 0 && (
              <div className="border-navy/20 text-charcoal/55 col-span-full border border-dashed p-10 text-center text-sm">
                No articles in this category yet.
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

export function InsightsFeatured({ article }: { article: Insight }) {
  return (
    <section className="bg-white pt-2 pb-20">
      <Container>
        <SectionHeading
          eyebrow="FEATURED"
          title="Editor's Pick."
          subtitle="A highlighted piece from across the Group."
        />
        <a
          href={`/insights/${article.slug}`}
          className="group border-navy/10 mt-12 grid gap-0 border lg:grid-cols-2"
        >
          <div className="bg-navy relative aspect-[16/10] overflow-hidden">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(242,169,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,0.10) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="bg-gold text-navy absolute top-5 right-5 inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold tracking-[.2em] uppercase">
              Featured
            </div>
          </div>
          <div className="bg-white p-8 md:p-12">
            <span className="bg-navy/5 text-navy inline-flex items-center px-3 py-1 text-[10px] font-semibold tracking-[.18em] uppercase">
              {article.category}
            </span>
            <h3 className="font-display text-navy group-hover:text-gold mt-5 text-3xl leading-tight md:text-4xl">
              {article.title}
            </h3>
            <p className="text-charcoal/70 mt-5 text-sm leading-7">{article.excerpt}</p>
            <div className="text-charcoal/55 mt-7 flex flex-wrap items-center gap-4 text-xs">
              <span>{article.author}</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-gold" /> {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-gold" /> {article.readTime}
              </span>
            </div>
            <span className="text-navy group-hover:text-gold mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase">
              Read article <ArrowUpRight size={12} />
            </span>
          </div>
        </a>
      </Container>
    </section>
  );
}

function InsightCard({ article }: { article: Insight }) {
  return (
    <a
      href={`/insights/${article.slug}`}
      className="group border-navy/10 hover:border-gold flex flex-col border bg-white transition"
    >
      <div className="bg-navy relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(242,169,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,0.10) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <span className="bg-gold text-navy absolute top-5 left-5 inline-flex items-center px-3 py-1 text-[10px] font-semibold tracking-[.18em] uppercase">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-navy group-hover:text-gold text-xl leading-snug">
          {article.title}
        </h3>
        <p className="text-charcoal/65 mt-3 text-sm leading-6">{article.excerpt}</p>
        <div className="text-charcoal/55 mt-auto flex items-center justify-between pt-6 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span>{article.author}</span>
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-gold" /> {formatDate(article.date)}
            </span>
          </div>
          <span className="text-navy group-hover:text-gold font-semibold tracking-[.15em] uppercase">
            Read article →
          </span>
        </div>
      </div>
    </a>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
