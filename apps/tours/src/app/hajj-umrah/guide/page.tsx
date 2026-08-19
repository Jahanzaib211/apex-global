import { BookOpen, ListChecks, Plane, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Pilgrimage Travel Guide",
  description:
    "Helpful preparation information for Hajj and Umrah travel. Government, visa and religious information must be verified by you before travel.",
};

const NAV_SECTIONS = [
  { id: "hajj-prep", label: "Hajj Preparation" },
  { id: "umrah-prep", label: "Umrah Preparation" },
  { id: "checklist", label: "Travel Checklist" },
  { id: "pack", label: "What to Pack" },
  { id: "visa", label: "Visa Information" },
  { id: "airport", label: "Airport Guidance" },
  { id: "hotel", label: "Hotel Guidance" },
  { id: "transport", label: "Transportation Guidance" },
  { id: "faqs", label: "FAQs" },
];

const SECTIONS = [
  {
    id: "hajj-prep",
    icon: BookOpen,
    title: "Hajj Preparation",
    body: "Hajj involves specific religious rituals and timelines. Pilgrims should consult qualified religious scholars for guidance on rituals, Ibrahim (AS) status, and the days of Hajj. Confirm all practical arrangements with your travel expert well before the season.",
  },
  {
    id: "umrah-prep",
    icon: BookOpen,
    title: "Umrah Preparation",
    body: "Umrah can be performed at most times of year outside the Hajj period. Pilgrims should consult religious scholars for guidance on Ihram, Tawaf, and Sa'i. Practical arrangements for travel, accommodation, and visa are coordinated with your travel team.",
  },
  {
    id: "checklist",
    icon: ListChecks,
    title: "Travel Checklist",
    body: "A typical preparation checklist includes: a valid passport with the required validity, travel documents per destination, confirmed accommodation, return ticket, prescribed medications, and emergency contacts. Your travel expert will share a full guest-specific checklist at enquiry.",
  },
  {
    id: "pack",
    icon: ListChecks,
    title: "What to Pack",
    body: "Pack comfortable clothing suitable for the climate, modest attire for holy sites, personal medications, basic toiletries, and travel documents in a secure folder. Specific items depend on the season and your hotel arrangements.",
  },
  {
    id: "visa",
    icon: FileText,
    title: "Visa Information",
    body: "Visa requirements change frequently. Confirm current requirements with the relevant embassy or authorized agency before booking. We support visa processing as part of our packages, but final approval is granted by the relevant authority.",
  },
  {
    id: "airport",
    icon: Plane,
    title: "Airport Guidance",
    body: "Arrive at the airport with sufficient time before your flight. Carry your passport, ticket, and required documents in your hand luggage. Specific procedures depend on your departure airport and the airport in Saudi Arabia — confirm with your airline and travel expert.",
  },
  {
    id: "hotel",
    icon: ShieldCheck,
    title: "Hotel Guidance",
    body: "Hotels in Makkah and Madinah are categorized by distance from the Haram, room type, and tier. We share the actual hotel, distance, and tier in your booking confirmation. Specific arrangements and check-in times are confirmed at the time of booking.",
  },
  {
    id: "transport",
    icon: Plane,
    title: "Transportation Guidance",
    body: "Our team coordinates airport transfers, intercity travel between Makkah and Madinah, and (where applicable) Hajj-site transportation. Specific vehicles, drivers, and schedules are shared in your itinerary.",
  },
  {
    id: "faqs",
    icon: CheckCircle2,
    title: "FAQs",
    body: "Common questions relate to passport validity, vaccinations, currency, mobile connectivity, and Ziyarat. Your travel expert will answer these specifically for your journey.",
  },
];

export default function TravelGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Travel Guide"
        title="Pilgrimage travel guide."
        subtitle="Helpful preparation information. Government, visa and religious information must be verified by you before travel."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hajj & Umrah", href: "/hajj-umrah" },
          { label: "Travel Guide" },
        ]}
      />

      {/* Important notice */}
      <section className="section-tight bg-sand-grad">
        <div className="container-page">
          <div className="border-gold-200 bg-gold-50 flex items-start gap-4 rounded-2xl border p-5 lg:p-6">
            <div className="bg-gold-200 text-gold-700 flex h-10 w-10 flex-none items-center justify-center rounded-full">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-display text-navy-600 mb-1 text-lg font-semibold">
                Important notice
              </h2>
              <p className="text-ink-500 text-sm leading-relaxed">
                Religious, visa and government information changes frequently. Please verify all
                guidance with the relevant authority before relying on it. The information on this
                page is general preparation guidance, not a substitute for official sources or
                qualified religious advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guide body */}
      <section className="section-tight bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
            {/* Sidebar nav */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border-sand-200 bg-sand-100 rounded-2xl border p-4">
                <div className="eyebrow mb-3">Sections</div>
                <nav className="space-y-0.5">
                  {NAV_SECTIONS.map((n) => (
                    <a
                      key={n.id}
                      href={`#${n.id}`}
                      className="text-ink-500 hover:text-navy-600 block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white"
                    >
                      {n.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content cards */}
            <div className="space-y-5">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <article id={s.id} key={s.id} className="card-flat scroll-mt-24 p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="bg-gold-100 text-gold-600 flex h-10 w-10 flex-none items-center justify-center rounded-xl">
                        <Icon size={20} />
                      </div>
                      <h3 className="font-display text-navy-600 text-xl font-semibold">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-ink-400 text-sm leading-relaxed">{s.body}</p>
                  </article>
                );
              })}

              <div className="border-sand-200 bg-sand-100 text-ink-500 rounded-2xl border p-5 text-sm">
                <strong className="text-navy-600">Reminder:</strong> the items above are general
                preparation guidance. Your personal booking confirmation and the relevant authority
                are the final sources for visa, religious, and government information.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-navy-grad text-white">
        <div className="container-narrow text-center">
          <div className="eyebrow !text-gold-400 mb-3">Ready to plan?</div>
          <h2 className="heading-lg mb-4 text-white">Talk to our team</h2>
          <p className="mx-auto mb-7 max-w-2xl text-white/85">
            If you have questions about your specific journey, share a few details and our team will
            respond with helpful, honest information.
          </p>
          <EnquireButton
            mode="pilgrimage"
            presetService="Guide Enquiry"
            label="Speak to a Travel Expert"
          />
        </div>
      </section>
    </>
  );
}
