"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { insights } from "@/data/content";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(`${date}T00:00:00`),
  );

export default function InsightDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  if (!slug) return null;
  const insight = insights.find((item) => item.slug === slug);
  if (!insight) return <NotFound />;
  const related = insights.filter((item) => item.slug !== insight.slug).slice(0, 3);
  return (
    <>
      <PageBanner
        eyebrow={insight.category}
        title={insight.title}
        description={insight.excerpt}
        bg={insight.cover}
        breadcrumbs={[{ label: "Insights", href: "/insights" }, { label: insight.title }]}
      />
      <main className="bg-white">
        <div className="container-x py-8 md:py-12">
          <div className="relative h-[38vh] min-h-[260px] overflow-hidden rounded-2xl">
            <Image
              src={insight.cover}
              alt={insight.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <article className="mx-auto max-w-3xl py-12">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="text-ink font-semibold">By {insight.author}</span>
              <span className="bg-gold-400 h-1 w-1 rounded-full" />
              <span>{formatDate(insight.date)}</span>
              <span className="pill-gold ml-auto">{insight.category}</span>
            </div>
            <div className="prose prose-lg prose-headings:font-display prose-headings:text-ink prose-p:leading-[1.9] prose-p:text-slate-600 mt-12 max-w-none">
              {insight.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <p>
                For teams working across the property journey, the lesson is practical: clarity
                earns attention, consistency earns confidence and meaningful results are built one
                considered decision at a time.
              </p>
            </div>
          </article>
        </div>
        <section className="container-x border-t border-slate-200 py-12">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <span className="eyebrow mb-2 block">CONTINUE READING</span>
              <h2 className="font-display text-ink text-3xl font-bold">Related insights</h2>
            </div>
            <Link
              href="/insights"
              className="text-ink hidden items-center gap-2 text-sm font-bold sm:flex"
            >
              All insights <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/insights/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200"
              >
                <div className="relative h-40">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-gold-500 text-xs font-bold tracking-wider uppercase">
                    {item.category}
                  </p>
                  <h3 className="font-display text-ink mt-2 font-bold">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <CTASection
        variant="dark"
        title="Discuss your project"
        primary={{ label: "Start a conversation", href: "/contact" }}
      />
    </>
  );
}
function NotFound() {
  return (
    <main className="container-x section">
      <h1 className="font-display text-ink text-4xl font-bold">Insight not found</h1>
      <Link href="/insights" className="btn-primary mt-7 inline-flex">
        Back to insights
      </Link>
    </main>
  );
}
