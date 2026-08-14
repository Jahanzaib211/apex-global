import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { Handshake } from "lucide-react";

export default function HoldingsPartnerships() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="PARTNERSHIPS" title="Partner With Apex Holdings." />
            <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
              <p>
                We work with credible real estate developers who want a long-term marketing partner
                — not a one-off channel. If you are developing a residential, commercial, mixed-use,
                apartment or plotted project and want it taken to market with care, we would like to
                hear from you.
              </p>
              <p>
                Initial conversations are straightforward. We will ask about the project, the
                development timeline, the team behind it and the kind of buyers you are trying to
                reach. From there we can scope how Apex Holdings might support.
              </p>
            </div>
            <div className="mt-8">
              <Button href="#site-visits" variant="primary" size="lg">
                Discuss a Partnership
              </Button>
            </div>
          </div>

          <div className="border-navy/15 relative overflow-hidden border bg-white p-10">
            <div className="bg-gold/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl" />
            <div className="relative">
              <div className="border-gold bg-cream inline-flex h-14 w-14 items-center justify-center border">
                <Handshake className="text-gold" size={22} />
              </div>
              <p className="font-editorial text-navy mt-6 text-2xl italic">
                &ldquo;A long-term marketing partner — not a transactional channel.&rdquo;
              </p>
              <p className="text-gold mt-4 text-xs tracking-[.2em] uppercase">
                Apex Holdings Approach
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
