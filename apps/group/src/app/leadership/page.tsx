import LeadershipHero from "@/components/leadership/LeadershipHero";
import CEOProfile from "@/components/leadership/CEOProfile";
import LeadershipMessage from "@/components/leadership/LeadershipMessage";
import LeadershipPhilosophy from "@/components/leadership/LeadershipPhilosophy";
import GroupDirection from "@/components/leadership/GroupDirection";
import LeadershipCTA from "@/components/leadership/LeadershipCTA";

export const metadata = {
  title: "Leadership | Apex Group of Companies",
  description:
    "A message from Shaikh Ahmed, Group CEO of Apex Group of Companies — read about the leadership philosophy, focus areas and direction of the Group.",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shaikh Ahmed",
  jobTitle: "Chief Executive Officer",
  worksFor: {
    "@type": "Organization",
    name: "Apex Group of Companies",
    url: "https://apexgroup.pk",
  },
};

export default function LeadershipPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <LeadershipHero />
      <CEOProfile />
      <LeadershipMessage />
      <LeadershipPhilosophy />
      <GroupDirection />
      <LeadershipCTA />
    </main>
  );
}
