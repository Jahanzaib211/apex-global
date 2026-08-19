import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { insights, getInsightBySlug, getRelatedInsights } from "@/data/insights";
import { getInsightBody } from "@/data/insightBodies";
import { Calendar, Clock, ArrowLeft, ArrowUpRight, Share2 } from "lucide-react";

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: { absolute: article.title },
    description: article.excerpt,
  };
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) notFound();

  const body = getInsightBody(article);
  const related = getRelatedInsights(article.slug, article.category, 2);

  return (
    <main>
      <section className="bg-navy pt-32 text-white">
        <Container className="py-16">
          <nav className="mb-8 flex items-center gap-2 text-xs tracking-[.2em] text-white/45 uppercase">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-gold">
              News &amp; Insights
            </Link>
            <span>/</span>
            <span className="text-gold">{article.category}</span>
          </nav>
          <span className="bg-gold/15 text-gold inline-flex items-center px-3 py-1 text-[10px] font-semibold tracking-[.2em] uppercase">
            {article.category}
          </span>
          <h1 className="font-display mt-5 max-w-4xl text-4xl leading-[1.1] md:text-6xl">
            {article.title}
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-white/65">
            <span>{article.author}</span>
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-gold" />
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-gold" />
              {article.readTime}
            </span>
          </div>
        </Container>
      </section>

      <article className="bg-cream py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-charcoal/80 text-lg leading-8">{article.excerpt}</p>
            <div className="text-charcoal/80 mt-10 space-y-6 text-base leading-8">
              {body.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="border-navy/10 mt-12 flex flex-wrap items-center gap-3 border-t pt-8">
              <span className="text-charcoal/55 text-[10px] font-semibold tracking-[.2em] uppercase">
                Share
              </span>
              <button className="border-navy/15 text-charcoal/70 hover:border-gold hover:text-gold inline-flex items-center gap-2 border bg-white px-3 py-2 text-xs">
                <Share2 size={12} /> Copy link
              </button>
              <button className="border-navy/15 text-charcoal/70 hover:border-gold hover:text-gold inline-flex items-center gap-2 border bg-white px-3 py-2 text-xs">
                <Share2 size={12} /> Share on LinkedIn
              </button>
              <button className="border-navy/15 text-charcoal/70 hover:border-gold hover:text-gold inline-flex items-center gap-2 border bg-white px-3 py-2 text-xs">
                <Share2 size={12} /> Email
              </button>
            </div>

            <div className="mt-10">
              <Link
                href="/insights"
                className="text-navy hover:text-gold inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase"
              >
                <ArrowLeft size={12} /> Back to all insights
              </Link>
            </div>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="bg-white py-20">
          <Container>
            <h3 className="font-display text-navy text-3xl">Related Insights</h3>
            <p className="text-charcoal/55 mt-2 text-sm">
              More from the {article.category} stream.
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/insights/${r.slug}`}
                  className="group border-navy/10 hover:border-gold flex flex-col border bg-white p-7 transition"
                >
                  <span className="bg-navy/5 text-navy inline-flex w-fit items-center px-3 py-1 text-[10px] font-semibold tracking-[.18em] uppercase">
                    {r.category}
                  </span>
                  <h4 className="font-display text-navy group-hover:text-gold mt-5 text-2xl">
                    {r.title}
                  </h4>
                  <p className="text-charcoal/65 mt-3 text-sm leading-6">{r.excerpt}</p>
                  <span className="text-navy group-hover:text-gold mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase">
                    Read article <ArrowUpRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
