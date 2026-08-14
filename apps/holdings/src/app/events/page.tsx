"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { events } from "@/data/content";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${date}T00:00:00`),
  );

export default function EventsPage() {
  const ordered = [...events].sort((a, b) => b.date.localeCompare(a.date));
  const now = new Date("2026-06-01");
  const upcoming = ordered.filter((event) => new Date(`${event.date}T00:00:00`) >= now);
  const past = ordered.filter((event) => new Date(`${event.date}T00:00:00`) < now);
  const groups = [
    { label: "Upcoming gatherings", items: upcoming },
    { label: "Past gatherings", items: past },
  ].filter((group) => group.items.length);
  return (
    <>
      <PageBanner
        eyebrow="CORPORATE EVENTS"
        title="The gatherings that define our journey."
        breadcrumbs={[{ label: "Events" }]}
      />
      <div className="section bg-slate-50">
        <div className="container-x space-y-16">
          {groups.map((group) => (
            <section key={group.label}>
              <div className="mb-7 flex items-end justify-between border-b border-slate-200 pb-5">
                <div>
                  <span className="eyebrow mb-2 block">APEX CALENDAR</span>
                  <h2 className="font-display text-ink text-3xl font-bold">{group.label}</h2>
                </div>
                <span className="text-sm text-slate-500">
                  {group.items.length} {group.items.length === 1 ? "event" : "events"}
                </span>
              </div>
              <div className="grid gap-7 lg:grid-cols-2">
                {group.items.map((event) => (
                  <article
                    key={event.slug}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70"
                  >
                    <div className="relative h-64">
                      <Image
                        src={event.cover}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="bg-ink/90 text-gold-400 absolute top-5 left-5 rounded-full px-3 py-1.5 text-xs font-bold">
                        {event.category}
                      </div>
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="text-gold-400 h-4 w-4" />
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="text-gold-400 h-4 w-4" />
                          {event.location}
                        </span>
                      </div>
                      <h3 className="font-display text-ink mt-4 text-2xl font-bold">
                        {event.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-slate-600">{event.description}</p>
                      <Link
                        href={`/events/${event.slug}`}
                        className="text-ink hover:text-gold-400 mt-6 inline-flex items-center gap-2 text-sm font-bold"
                      >
                        View event <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <CTASection
        variant="dark"
        eyebrow="LET'S MAKE IT MATTER"
        title="Plan an event with us"
        primary={{ label: "Talk to our team", href: "/contact" }}
      />
    </>
  );
}
