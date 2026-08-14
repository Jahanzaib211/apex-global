import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ShieldCheck, AudioLines, Sparkles } from "lucide-react";

const cards = [
  {
    Icon: ShieldCheck,
    title: "AI-Assisted Quality Assurance",
    body: "Automated scoring of calls and tickets against QA criteria — with humans reviewing flagged interactions before any decision.",
  },
  {
    Icon: AudioLines,
    title: "Transcription & Analytics",
    body: "Call and meeting transcription, theme detection and search across interactions — useful for coaching and process improvement.",
  },
  {
    Icon: Sparkles,
    title: "Lead Scoring",
    body: "AI-assisted prioritisation of inbound interest — surfacing the signals your sales team should look at first.",
  },
];

export default function OutsourcingAI() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="AI-Enabled Operations" title="AI Where It Actually Helps." />
            <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
              <p>
                AI is applied selectively — to the parts of operations where it measurably improves
                throughput, accuracy or insight. Not as a label, and not as a substitute for trained
                operators.
              </p>
              <p>
                Wherever AI is used in customer-facing or commercially significant decisions, the
                work is reviewed by trained professionals before it touches the customer.
              </p>
            </div>

            <div className="border-gold text-charcoal/70 mt-8 border-l-4 bg-white p-5 text-sm leading-6">
              <strong className="text-navy">Disclaimer —</strong> AI supports our operations. All
              customer-facing decisions are reviewed by trained professionals.
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            {cards.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="border-navy/10 hover:border-gold border bg-white p-6 transition"
              >
                <Icon className="text-gold" size={22} />
                <h3 className="font-display text-navy mt-4 text-xl">{title}</h3>
                <p className="text-charcoal/65 mt-2 text-sm leading-6">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
