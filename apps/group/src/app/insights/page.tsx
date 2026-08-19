import InsightsHero from "@/components/insights/InsightsHero";
import InsightsGridSection from "@/components/insights/InsightsGridSection";
import InsightsNewsletter from "@/components/insights/InsightsNewsletter";
import InsightsCTA from "@/components/insights/InsightsCTA";
import { insights } from "@/data/insights";
import { SITE_URL, url } from "@/lib/site-url";
import { jsonLdProps } from "@apex/site-kit/json-ld";

export const metadata = {
  title: "News & Insights",
  description:
    "Group announcements, sector insights, and updates from across the Apex ecosystem — technology, outsourcing, travel, real estate and financial consultancy.",
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Apex Group Insights",
  url: url("/insights"),
  description:
    "News, perspectives and updates from across the Apex Group of Companies and its specialized businesses.",
  publisher: {
    "@type": "Organization",
    name: "Apex Group of Companies (Pvt) Ltd",
    url: SITE_URL,
    logo: "/logo.png",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Apex Group Insights — All Articles",
  itemListElement: insights.map((i, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: url(`/insights/${i.slug}`),
    name: i.title,
  })),
};

export default function InsightsPage() {
  return (
    <main>
      <InsightsHero />
      <InsightsGridSection />
      <InsightsNewsletter />
      <InsightsCTA />

      <script type="application/ld+json" {...jsonLdProps(blogSchema)} />
      <script type="application/ld+json" {...jsonLdProps(itemListSchema)} />
    </main>
  );
}
