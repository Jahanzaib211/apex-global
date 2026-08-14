import EventsHero from "@/components/events/EventsHero";
import EventsGridSection from "@/components/events/EventsGridSection";
import EventsGallery from "@/components/events/EventsGallery";
import EventsCTA from "@/components/events/EventsCTA";

export const metadata = {
  title: "Events | Apex Group of Companies",
  description:
    "Apex Group events calendar — group events, product launches, pilgrimages, real estate project launches, webinars and conferences.",
};

export default function EventsPage() {
  return (
    <main>
      <EventsHero />
      <EventsGridSection />
      <EventsGallery />
      <EventsCTA />
    </main>
  );
}
