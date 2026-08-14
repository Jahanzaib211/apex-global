import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { CloudUpload, Code2, ShieldCheck } from "lucide-react";

const cards = [
  {
    Icon: CloudUpload,
    title: "Cloud Migration",
    body: "Move workloads off legacy infrastructure with minimal disruption — staged cutovers, tested rollback paths and clean target architectures.",
  },
  {
    Icon: Code2,
    title: "Cloud-Native Development",
    body: "Build applications designed for the cloud from the first commit — containers, managed services, IaC and CI/CD as the default, not the afterthought.",
  },
  {
    Icon: ShieldCheck,
    title: "Managed Cloud Operations",
    body: "Day-2 operations handled properly — observability, cost discipline, patching, scaling and incident response with clear ownership.",
  },
];

export default function TechCloud() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Cloud Services"
              title="Cloud Built for Reliability, Scale and Cost."
            />
            <div className="text-charcoal/70 mt-8 space-y-5 text-base leading-7">
              <p>
                Cloud is most valuable when it is treated as an operating model, not a destination.
                Architectures are designed for the failure modes that actually happen, with cost
                discipline built into every layer.
              </p>
              <p>
                Migration paths are staged and reversible. Cloud-native builds ship with
                infrastructure-as-code, automated pipelines and observable runtimes. And once
                workloads are live, managed operations keep them healthy without consuming internal
                engineering bandwidth.
              </p>
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
