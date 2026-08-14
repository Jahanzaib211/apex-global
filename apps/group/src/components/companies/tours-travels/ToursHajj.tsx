import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import TierCard from "./TierCard";

const baseFeatures = [
  "Visa Support",
  "Accommodation in Makkah & Madinah",
  "Ground Transportation",
  "Guided Worship",
  "Meals",
  "Ziyarat",
];

const bronzeFeatures = baseFeatures;
const silverFeatures = [
  ...baseFeatures,
  "Upgraded Accommodation",
  "Closest Possible Hotel Proximity",
];
const goldFeatures = [
  ...baseFeatures,
  "Premium Accommodation",
  "Closest Possible Hotel Proximity",
  "Private Transfers",
  "Concierge Support",
];

export default function ToursHajj() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="HAJJ PACKAGES"
            title="Hajj Arranged With Reverence and Operational Discipline."
            subtitle="Hajj is not a standard trip. Our Hajj packages are designed around the spiritual weight of the journey and the operational realities of moving groups through Makkah, Madinah and the holy sites safely and on time."
          />
          <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
            <p>
              Each tier is supported by visa processing, accommodation, ground transportation,
              guided worship and ziyarat. We coordinate with vetted partners and maintain a single
              point of accountability throughout the journey.
            </p>
            <p>
              Whether you are travelling alone, with family or as part of a community group, we will
              tailor the package to your circumstances. Pricing is provided on request following a
              short conversation about dates, group size and preferences.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <TierCard tier="Bronze" features={bronzeFeatures} />
          <TierCard tier="Silver" features={silverFeatures} highlighted />
          <TierCard tier="Gold" features={goldFeatures} />
        </div>

        <p className="text-charcoal/55 mt-10 text-sm italic">
          All packages are indicative. Final inclusions and pricing are confirmed after a
          consultation about your dates, group size and accommodation preferences.
        </p>
      </Container>
    </section>
  );
}
