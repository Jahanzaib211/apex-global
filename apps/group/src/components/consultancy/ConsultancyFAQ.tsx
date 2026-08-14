import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const faqs = [
  {
    q: "What does the initial consultation cover?",
    a: "The initial consultation is a focused conversation to understand your situation, objectives and constraints. We will not present a pre-built solution; the goal is to establish whether there is a meaningful way we can help, and to outline next steps if so.",
  },
  {
    q: "Is this regulated investment advice?",
    a: "We provide strategic consultancy within authorized scope. Regulated services are provided through qualified partners.",
  },
  {
    q: "Who will I work with?",
    a: "A senior consultant from the Group's financial consultancy practice, supported by specialist input where the situation requires it.",
  },
  {
    q: "How is my information protected?",
    a: "Information is handled within a strictly role-based access environment, encrypted in transit, and never shared with advertising or analytics platforms.",
  },
  {
    q: "What happens after the consultation?",
    a: "Following the consultation we will share a short summary of findings and proposed next steps. Where appropriate, we will continue the advisory relationship or coordinate with qualified partners.",
  },
  {
    q: "Do you work with clients outside Pakistan?",
    a: "Yes. We work with clients across geographies where the engagement can be conducted within the Group's authorized scope and applicable regulations.",
  },
];

export default function ConsultancyFAQ() {
  return (
    <section className="bg-cream py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeading eyebrow="FREQUENT QUESTIONS" title="What Clients Often Ask." />
          </div>
          <div className="space-y-3 lg:col-span-2">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group border-navy/10 open:border-gold border bg-white p-5 transition"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4">
                  <span className="font-display text-navy text-lg">{f.q}</span>
                  <span className="text-gold ml-auto text-xs font-semibold tracking-[.2em] uppercase transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-charcoal/70 mt-3 text-sm leading-7">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
