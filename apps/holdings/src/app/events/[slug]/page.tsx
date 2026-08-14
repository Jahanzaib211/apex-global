"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Building2, Tag, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { events } from "@/data/content";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(`${date}T00:00:00`),
  );

export default function EventDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  if (!slug) return null;
  const event = events.find((item) => item.slug === slug);
  if (!event) return <NotFound />;
  const related = events.filter((item) => item.slug !== event.slug).slice(0, 3);
  const details = [
    { Icon: Calendar, label: "Date", value: formatDate(event.date) },
    { Icon: MapPin, label: "Location", value: event.location },
    { Icon: Building2, label: "Project", value: event.project },
    { Icon: Tag, label: "Category", value: event.category },
  ].filter((row) => row.value);
  return (
    <>
      <PageBanner
        eyebrow={event.category}
        title={event.title}
        description={event.description}
        bg={event.cover}
        breadcrumbs={[{ label: "Events", href: "/events" }, { label: event.title }]}
      />
      <main className="bg-white">
        <div className="container-x py-8 md:py-12">
          <div className="relative h-[42vh] min-h-[280px] overflow-hidden rounded-2xl">
            <Image src={event.cover} alt={event.title} fill unoptimized className="object-cover" />
          </div>
          <div className="grid gap-10 py-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            <aside className="h-fit rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <span className="eyebrow mb-5 block">EVENT DETAILS</span>
              <dl className="space-y-5">
                {details.map(({ Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="text-gold-400 mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <dt className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                        {label}
                      </dt>
                      <dd className="text-ink mt-1 text-sm font-semibold">{String(value)}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </aside>
            <article className="max-w-3xl">
              <span className="eyebrow mb-4 block">WHY WE GATHER</span>
              <h2 className="font-display text-ink text-3xl font-bold md:text-4xl">
                Creating the room for meaningful conversations.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                {event.description} The evening was designed to bring the right people into the same
                room, create clarity around the opportunity and turn a shared interest into the next
                practical step.
              </p>
              <p className="mt-5 leading-relaxed text-slate-600">
                From focused introductions to open conversations, every detail was anchored in the
                Apex way of working: prepared, transparent and committed to outcomes that last
                beyond the event itself.
              </p>
              <div className="mt-10">
                <span className="eyebrow mb-5 block">HIGHLIGHTS</span>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["Strong partner turnout", "Media coverage", "Lead generation outcomes"].map(
                    (item) => (
                      <div
                        key={item}
                        className="text-ink rounded-xl border border-slate-200 p-4 text-sm font-bold"
                      >
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>
        <section className="container-x border-t border-slate-200 py-12">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <span className="eyebrow mb-2 block">KEEP EXPLORING</span>
              <h2 className="font-display text-ink text-3xl font-bold">Related events</h2>
            </div>
            <Link
              href="/events"
              className="text-ink hidden items-center gap-2 text-sm font-bold sm:flex"
            >
              All events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/events/${item.slug}`}
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
        title="Talk to our team"
        primary={{ label: "Start a conversation", href: "/contact" }}
      />
    </>
  );
}
function NotFound() {
  return (
    <main className="container-x section">
      <h1 className="font-display text-ink text-4xl font-bold">Event not found</h1>
      <p className="mt-3 text-slate-600">The event you are looking for may have moved.</p>
      <Link href="/events" className="btn-primary mt-7 inline-flex">
        Back to events
      </Link>
    </main>
  );
}
