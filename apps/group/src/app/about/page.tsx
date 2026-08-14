import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import WhoWeAre from "@/components/about/WhoWeAre";
import MissionVision from "@/components/about/MissionVision";
import OurValues from "@/components/about/OurValues";
import OurBusinesses from "@/components/about/OurBusinesses";
import GroupEcosystem from "@/components/about/GroupEcosystem";
import OurFuture from "@/components/about/OurFuture";
import AboutFinalCTA from "@/components/about/AboutFinalCTA";
import { SITE_URL } from "@/lib/site-url";
import { APEX_SOCIALS } from "@apex/site-kit/social";

export const metadata = {
  title: "About | Apex Group of Companies",
  description:
    "Learn about Apex Group of Companies — a diversified group operating specialized businesses across technology, outsourcing, travel, real estate and financial consultancy.",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Apex Group of Companies (Pvt) Ltd",
  url: SITE_URL,
  logo: "/logo.png",
  description:
    "A diversified group operating specialized businesses across technology, outsourcing, travel, real estate and financial consultancy.",
  sameAs: APEX_SOCIALS.map((s) => s.href),
};

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <AboutHero />
      <OurStory />
      <WhoWeAre />
      <MissionVision />
      <OurValues />
      <OurBusinesses />
      <GroupEcosystem />
      <OurFuture />
      <AboutFinalCTA />
    </main>
  );
}
