import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

export default function ConsultancyIntro() {
  return (
    <section className="bg-cream py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeading
              eyebrow="INTRODUCTION"
              title="Strategic Guidance for Complex Financial Lives."
            />
          </div>
          <div className="text-charcoal/75 space-y-6 text-base leading-7 lg:col-span-2">
            <p className="font-editorial text-navy text-2xl italic">
              For clients whose financial lives have grown beyond simple answers, a more strategic
              view is often the most valuable thing we can offer.
            </p>
            <p>
              Apex Group&apos;s financial consultancy is positioned for individuals and families
              with non-trivial financial situations — business owners with cross-border interests,
              families navigating inheritance, professionals managing concentrated positions, and
              entrepreneurs preparing for exits. We work with clients who value clarity over speed
              and judgement over generic advice.
            </p>
            <p>
              Our role is not to push products. It is to bring structure to complexity: assembling a
              clear picture of where a client stands, identifying what deserves attention, and
              helping them make better decisions in sequence. Where regulated investment, tax or
              legal services are needed, we coordinate with qualified partners rather than
              pretending to do it all ourselves.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
