import Hero from "@/components/home/Hero";
import GroupIntro from "@/components/home/GroupIntro";
import OurCompanies from "@/components/home/OurCompanies";
import Ecosystem from "@/components/home/Ecosystem";
import WhyApex from "@/components/home/WhyApex";
import CrossBusinessDiscovery from "@/components/home/CrossBusinessDiscovery";
import FinalCTA from "@/components/home/FinalCTA";
export default function Home() {
  return (
    <main>
      <Hero />
      <GroupIntro />
      <OurCompanies />
      <Ecosystem />
      <WhyApex />
      <CrossBusinessDiscovery />
      <FinalCTA />
    </main>
  );
}
