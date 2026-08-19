import type { Metadata } from "next";
import SearchHero from "@/components/search/SearchHero";
import SearchBox from "@/components/search/SearchBox";
export const metadata: Metadata = {
  title: "Search",
  description:
    "Find a company, capability or page across the Apex Group ecosystem.",
};

export default function SearchPage() {
  return (
    <main>
      <SearchHero />
      <SearchBox />
    </main>
  );
}
