import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { events, getEventBySlug, getRelatedEvents } from "@/data/events";
import { getEventBody } from "@/data/eventBodies";
import EventRegistrationForm from "@/components/events/EventRegistrationForm";
import { Calendar, MapPin, ArrowLeft, ArrowUpRight, Building2, Tag } from "lucide-react";

const COMPANY_LABEL: Record<string, string> = {
  "tech-solution": "Apex Global Tech Solution",
  outsourcing: "Apex Global Outsourcing",
  "tours-travels": "Apex Global Tours & Travels",
  holdings: "Apex Holdings",
  consultancy: "Apex Group Financial Consultancy",
  group: "Apex Group",
};

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event | Apex Group" };
  return {
    title: `${event.name} | Apex Group Events`,
    description: event.description,
  };
}

const galleryCaptions = [
  "Pre-event setup",
  "Opening session",
  "Panel discussion",
  "Networking break",
];

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const body = getEventBody(event);
  const related = getRelatedEvents(event.slug, 2);

  return (
    <main>
      <section className="bg-navy pt-32 text-white">
        <Container className="py-16">
          <nav className="mb-8 flex items-center gap-2 text-xs tracking-[.2em] text-white/45 uppercase">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:text-gold">
              Events
            </Link>
            <span>/</span>
            <span className="text-gold">{event.category}</span>
          </nav>
          <span className="bg-gold/15 text-gold inline-flex items-center px-3 py-1 text-[10px] font-semibold tracking-[.2em] uppercase">
            {event.category}
          </span>
          <h1 className="font-display mt-5 max-w-4xl text-4xl leading-[1.1] md:text-6xl">
            {event.name}
          </h1>
          <dl className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/65">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gold" />
              {formatDateRange(event)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gold" />
              {event.location}
            </div>
          </dl>
        </Container>
      </section>

      <section className="bg-cream py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.6fr,1fr]">
            <article>
              <p className="text-charcoal/80 text-lg leading-8">{event.description}</p>
              <div className="text-charcoal/80 mt-10 space-y-6 text-base leading-8">
                {body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
              <div className="mt-12">
                <Link
                  href="/events"
                  className="text-navy hover:text-gold inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase"
                >
                  <ArrowLeft size={12} /> Back to all events
                </Link>
              </div>
            </article>

            <aside className="space-y-6">
              <div className="border-navy/10 border bg-white p-7">
                <h3 className="font-display text-navy text-2xl">Event Details</h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-charcoal/45 text-[10px] font-semibold tracking-[.2em] uppercase">
                      Date
                    </dt>
                    <dd className="text-charcoal/80 mt-1">{formatDateRange(event)}</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal/45 text-[10px] font-semibold tracking-[.2em] uppercase">
                      Location
                    </dt>
                    <dd className="text-charcoal/80 mt-1">{event.location}</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal/45 text-[10px] font-semibold tracking-[.2em] uppercase">
                      Company
                    </dt>
                    <dd className="text-charcoal/80 mt-1 flex items-center gap-2">
                      <Building2 size={14} className="text-gold" /> {COMPANY_LABEL[event.company]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-charcoal/45 text-[10px] font-semibold tracking-[.2em] uppercase">
                      Category
                    </dt>
                    <dd className="text-charcoal/80 mt-1 flex items-center gap-2">
                      <Tag size={14} className="text-gold" /> {event.category}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-display text-navy mb-3 text-xl">Register Interest</h3>
                <EventRegistrationForm eventSlug={event.slug} />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20">
        <Container>
          <h3 className="font-display text-navy text-3xl">Event Gallery</h3>
          <p className="text-charcoal/55 mt-2 text-sm">Highlights from the program.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {galleryCaptions.map((cap) => (
              <figure key={cap} className="border-navy/10 border bg-white">
                <div className="bg-navy relative aspect-[4/3] overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(242,169,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(242,169,0,0.10) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />
                  <span className="bg-navy/80 text-gold absolute top-3 right-3 inline-flex items-center px-2 py-1 text-[9px] font-semibold tracking-[.2em] uppercase backdrop-blur">
                  </span>
                </div>
                <figcaption className="text-charcoal/65 p-3 text-xs">{cap}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-cream py-20">
          <Container>
            <h3 className="font-display text-navy text-3xl">Related Events</h3>
            <p className="text-charcoal/55 mt-2 text-sm">Other events from across the Group.</p>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/events/${r.slug}`}
                  className="group border-navy/10 hover:border-gold flex flex-col border bg-white p-7 transition"
                >
                  <span className="bg-navy/5 text-navy inline-flex w-fit items-center px-3 py-1 text-[10px] font-semibold tracking-[.18em] uppercase">
                    {r.category}
                  </span>
                  <h4 className="font-display text-navy group-hover:text-gold mt-5 text-2xl">
                    {r.name}
                  </h4>
                  <p className="text-charcoal/65 mt-3 text-sm leading-6">{r.description}</p>
                  <div className="text-charcoal/55 mt-4 flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-gold" /> {formatDateRange(r)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-gold" /> {r.location}
                    </span>
                  </div>
                  <span className="text-navy group-hover:text-gold mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase">
                    Learn more <ArrowUpRight size={12} />
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

function formatDateRange(event: { date: string; endDate?: string }) {
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
