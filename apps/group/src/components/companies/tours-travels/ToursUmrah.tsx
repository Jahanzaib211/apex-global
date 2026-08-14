import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import TierCard from "./TierCard";

const baseFeatures = [
  "Visa Support",
  "Accommodation in Makkah & Madinah",
  "Ground Transportation",
  "Guided Worship",
  "Ziyarat",
];
const bronzeFeatures = baseFeatures;
const silverFeatures = [...baseFeatures, "Upgraded Accommodation", "Closer Proximity to Haram"];
const goldFeatures = [
  ...baseFeatures,
  "Premium Accommodation",
  "Closest Possible Hotel Proximity",
  "Private Transfers",
  "Concierge Support",
];

export default function ToursUmrah() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="UMRAH PACKAGES"
            title="Umrah Packages for Individuals, Families and Groups."
            subtitle="Umrah is available year-round, with seasonal demand peaks during Ramadan. We arrange packages for individuals, families and community groups, with options suited to shorter visits and extended stays."
          />
          <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
            <p>
              Our Umrah offerings follow a similar three-tier structure to our Hajj packages,
              allowing clients to choose the right balance between comfort, proximity and price.
              Each package can be customized around your preferred travel window.
            </p>
            <p>
              Family-friendly configurations, women-led group arrangements and accessibility
              considerations can all be accommodated. Ramadan-specific itineraries are available
              with adjusted logistics and closer proximity to the Haram where possible.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <TierCard tier="Bronze" features={bronzeFeatures} />
          <TierCard tier="Silver" features={silverFeatures} highlighted />
          <TierCard tier="Gold" features={goldFeatures} />
        </div>

        <p className="text-charcoal/55 mt-10 text-sm italic">
          Pricing is provided on request. Final details depend on dates, group size and hotel
          preferences.
        </p>
      </Container>
    </section>
  );
}
