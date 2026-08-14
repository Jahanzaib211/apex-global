import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { Sparkles } from "lucide-react";

export default function ToursCustom() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="CUSTOM PACKAGES"
              title="Tailored Itineraries for Unique Requirements."
            />
            <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
              <p>
                Not every journey fits a standard package. Apex Global Tours &amp; Travels builds
                custom itineraries for clients with specific requirements — combining
                transportation, accommodation, ziyarat and ground handling into a single,
                coordinated plan.
              </p>
              <p>
                Tell us your dates, group size and preferences. We&apos;ll design a journey around
                them.
              </p>
            </div>
            <div className="mt-8">
              <Button href="#booking" variant="primary" size="lg">
                Start a Custom Enquiry
              </Button>
            </div>
          </div>

          <div className="border-navy/15 relative overflow-hidden border bg-white p-10">
            <div className="bg-gold/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl" />
            <div className="relative">
              <div className="border-gold bg-cream inline-flex h-14 w-14 items-center justify-center border">
                <Sparkles className="text-gold" size={22} />
              </div>
              <p className="font-editorial text-navy mt-6 text-2xl italic">
                &ldquo;Tell us your dates, group size, and preferences. We&apos;ll design a journey
                around them.&rdquo;
              </p>
              <p className="text-gold mt-4 text-xs tracking-[.2em] uppercase">
                Apex Group Approach
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
