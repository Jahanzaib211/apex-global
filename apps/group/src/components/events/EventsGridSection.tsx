"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Calendar, MapPin, ArrowUpRight, Clock } from "lucide-react";
import { events, type Event, type EventCategory } from "@/data/events";

const CATEGORIES: ("All" | EventCategory)[] = [
  "All",
  "Group Event",
  "Corporate",
  "Product Launch",
  "Pilgrimage",
  "Real Estate",
  "Webinar",
  "Conference",
];

export default function EventsGridSection() {
  const [active, setActive] = useState<"All" | EventCategory>("All");

  const visible = useMemo(
    () => (active === "All" ? events : events.filter((e) => e.category === active)),
    [active],
  );

  const featured = visible.find((e) => e.featured) ?? events.find((e) => e.featured);
  const rest = visible.filter((e) => e !== featured);

  return (
    <>
      <section className="bg-cream py-16">
        <Container>
          <SectionHeading
            eyebrow="FILTER BY CATEGORY"
            title="Browse Events."
            subtitle="Seven event categories reflecting the work of the Group and the conversations we host throughout the year."
          />
          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Event categories">
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

      {featured && active === "All" && <EventsFeatured event={featured} />}

      <section id="all-events" className="bg-white py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <h3 className="font-display text-navy text-3xl">All Events</h3>
            <p className="text-charcoal/45 text-xs tracking-[.18em] uppercase">
              {visible.length} {visible.length === 1 ? "event" : "events"}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(active === "All" ? rest : visible).map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
            {visible.length === 0 && (
              <div className="border-navy/20 text-charcoal/55 col-span-full border border-dashed p-10 text-center text-sm">
                No events in this category yet.
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

function EventsFeatured({ event }: { event: Event }) {
  return (
    <section className="bg-white pt-2 pb-20">
      <Container>
        <SectionHeading
          eyebrow="FEATURED UPCOMING"
          title="On the Calendar."
          subtitle="A highlighted upcoming event from across the Group."
        />
        <div className="border-navy/10 mt-12 grid gap-0 border lg:grid-cols-2">
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
              {event.category}
            </span>
            <h3 className="font-display text-navy mt-5 text-3xl leading-tight md:text-4xl">
              {event.name}
            </h3>
            <p className="text-charcoal/70 mt-5 text-sm leading-7">{event.description}</p>
            <dl className="text-charcoal/70 mt-7 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gold" />
                <span>{formatDateRange(event)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gold" />
                <span>{event.location}</span>
              </div>
            </dl>
            <a
              href={`/events/${event.slug}`}
              className="bg-gold text-navy hover:bg-navy hover:text-gold mt-7 inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold tracking-[.18em] uppercase transition"
            >
              Register Interest <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <a
      href={`/events/${event.slug}`}
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
          {event.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-navy group-hover:text-gold text-xl leading-snug">
          {event.name}
        </h3>
        <p className="text-charcoal/65 mt-3 text-sm leading-6">{event.description}</p>
        <dl className="text-charcoal/65 mt-5 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <Calendar size={11} className="text-gold" />
            {formatDateRange(event)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={11} className="text-gold" />
            {event.location}
          </div>
        </dl>
        <div className="text-charcoal/55 mt-auto flex items-center justify-between pt-6 text-xs">
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-gold" /> {isUpcoming(event) ? "Upcoming" : "Past"}
          </span>
          <span className="text-navy group-hover:text-gold font-semibold tracking-[.15em] uppercase">
            Learn more →
          </span>
        </div>
      </div>
    </a>
  );
}

function isUpcoming(event: Event) {
  try {
    return new Date(event.date).getTime() >= Date.now();
  } catch {
    return true;
  }
}

function formatDateRange(event: Event) {
  try {
    const start = new Date(event.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    if (!event.endDate) return start;
    const end = new Date(event.endDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `${start} — ${end}`;
  } catch {
    return event.date;
  }
}
