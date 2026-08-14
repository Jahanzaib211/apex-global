import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Building2 } from "lucide-react";

export default function HoldingsDevelopments() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <SectionHeading
              eyebrow="APEX DEVELOPMENTS"
              title="The Path Toward Self-Owned Development."
            />
            <div className="text-charcoal/75 mt-8 space-y-5 text-base leading-7">
              <p>
                Apex Holdings&apos; long-term direction is to move from marketing projects on behalf
                of developers to developing and operating our own. The transition will be gradual —
                driven by the strength of our market understanding, the maturity of our partnerships
                and the Group&apos;s overall capital posture.
              </p>
              <p>
                In the near term, our focus remains on curating the right developer relationships,
                understanding what buyers actually need, and building the operational muscle to
                manage projects end-to-end when the time comes.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="border-gold bg-navy relative overflow-hidden border-2 p-8 text-white">
              <div className="bg-gold/20 absolute -top-10 -right-10 h-40 w-40 rounded-full blur-2xl" />
              <div className="relative">
                <div className="border-gold bg-navy text-gold inline-flex h-12 w-12 items-center justify-center border">
                  <Building2 size={20} />
                </div>
                <p className="text-gold mt-5 text-xs font-semibold tracking-[.25em] uppercase">
                  Future Direction
                </p>
                <p className="font-editorial mt-3 text-2xl leading-snug">
                  Apex Holdings is preparing for future self-owned project development. As projects
                  progress, they will be featured here.
                </p>
                <p className="mt-5 text-xs tracking-[.2em] text-white/50 uppercase">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
