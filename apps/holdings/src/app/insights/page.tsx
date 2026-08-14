"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { insights } from "@/data/content";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${date}T00:00:00`),
  );
const categories = ["All", "Marketing", "Vision", "Digital", "Brand"];

export default function InsightsPage() {
  const [category, setCategory] = useState("All");
  const filtered = useMemo(
    () => (category === "All" ? insights : insights.filter((item) => item.category === category)),
    [category],
  );
  const featured = filtered[0];
  const rest = filtered.slice(1);
  return (
    <>
      <PageBanner
        eyebrow="INSIGHTS"
        title="Perspectives on real estate, marketing and the journey ahead."
        breadcrumbs={[{ label: "Insights" }]}
      />
      <div className="section bg-white">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${category === item ? "border-gold-400 bg-gold-400 text-ink" : "hover:border-gold-400 border-slate-200 bg-white text-slate-600"}`}
              >
                {item}
              </button>
            ))}
          </div>
          {featured && (
            <Link
              href={`/insights/${featured.slug}`}
              className="group bg-ink mb-14 grid overflow-hidden rounded-2xl lg:grid-cols-2"
            >
              <div className="relative min-h-[300px]">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-7 text-white md:p-12">
                <span className="eyebrow !text-gold-400">FEATURED · {featured.category}</span>
                <h2 className="font-display mt-4 text-3xl leading-tight font-bold md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-5 leading-relaxed text-slate-300">{featured.excerpt}</p>
                <span className="text-gold-400 mt-7 inline-flex items-center gap-2 text-sm font-bold">
                  Read insight <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((item) => (
              <article
                key={item.slug}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <Link href={`/insights/${item.slug}`}>
                  <div className="relative h-52">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-gold-500 flex items-center justify-between text-xs font-bold tracking-wider uppercase">
                      <span>{item.category}</span>
                      <span className="text-slate-400">{formatDate(item.date)}</span>
                    </div>
                    <h3 className="font-display text-ink mt-4 text-xl leading-snug font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {item.excerpt}
                    </p>
                    <span className="text-ink mt-6 inline-flex items-center gap-2 text-sm font-bold">
                      Read more <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
      <CTASection
        variant="dark"
        eyebrow="STAY IN THE KNOW"
        title="Subscribe to insights"
        description="Get thoughtful perspectives on the market and the work shaping it."
        primary={{ label: "Join the conversation", href: "/contact" }}
      />
    </>
  );
}
