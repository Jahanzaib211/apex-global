import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Eye, ShieldCheck, Clock, Handshake } from "lucide-react";

const pillars = [
  {
    icon: Eye,
    title: "Aligned Vision",
    desc: "A shared view of what we are building, who it serves, and the kind of work we are willing to be known for.",
  },
  {
    icon: ShieldCheck,
    title: "Professional Integrity",
    desc: "Honest communication, clear commitments, and a willingness to be straight — including when the answer is no.",
  },
  {
    icon: Clock,
    title: "Long-Term Orientation",
    desc: "We measure success in years. Partners who think in compounding relationships rather than transactions fit well.",
  },
  {
    icon: Handshake,
    title: "Mutual Value Creation",
    desc: "Each side should bring something the other cannot easily build alone — and the exchange should feel fair over time.",
  },
];

export default function PartnershipExpectations() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="WHAT WE LOOK FOR"
          title="The Qualities We Value in Partners."
          subtitle="A few shared standards that make collaboration easier and outcomes more durable."
        />

        <div className="bg-navy/10 mt-14 grid gap-px md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="bg-white p-8">
                <Icon className="text-gold" size={26} />
                <h3 className="font-display text-navy mt-6 text-2xl">{p.title}</h3>
                <p className="text-charcoal/65 mt-3 text-sm leading-6">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
