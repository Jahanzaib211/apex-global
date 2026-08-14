import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import {
  Wallet,
  Briefcase,
  Layers,
  Network,
  TrendingUp,
  Coins,
  Home,
  LineChart,
  Compass,
  ClipboardList,
} from "lucide-react";

const services = [
  {
    icon: Wallet,
    name: "Personal Financial Consultancy",
    desc: "Bringing structure to overall personal financial position, cash flow and priorities.",
  },
  {
    icon: Briefcase,
    name: "Business Financial Consultancy",
    desc: "Financial thinking for the owner alongside the business — from margins to dividends to exits.",
  },
  {
    icon: Layers,
    name: "Asset Review",
    desc: "A structured review of existing assets, their composition and how well they serve your objectives.",
  },
  {
    icon: Network,
    name: "Wealth Structuring",
    desc: "Structuring approaches across entities, jurisdictions and generations, with appropriate professional coordination.",
  },
  {
    icon: TrendingUp,
    name: "Business Growth Consultancy",
    desc: "Financial perspective on growth — capital needs, funding mix, scale-up trade-offs and timing.",
  },
  {
    icon: Coins,
    name: "Capital Planning",
    desc: "Planning around capital needs across personal, business and investment objectives.",
  },
  {
    icon: Home,
    name: "Real Estate Consultancy",
    desc: "Strategic guidance around property as part of a broader financial picture, coordinated with Apex Holdings.",
  },
  {
    icon: LineChart,
    name: "Investment Planning",
    desc: "Aligning investment posture with objectives, risk tolerance, time horizon and liquidity needs.",
  },
  {
    icon: Compass,
    name: "Succession & Long-Term Planning",
    desc: "Considered planning for transition — within families, businesses or both — coordinated with appropriate advisors.",
  },
  {
    icon: ClipboardList,
    name: "Strategic Financial Planning",
    desc: "Bringing the strands together into a coherent strategic plan with sequenced decisions.",
  },
];

export default function ConsultancyServices() {
  return (
    <section className="bg-white py-28">
      <Container>
        <SectionHeading
          eyebrow="SERVICES"
          title="A Structured Range of Consultancy Services."
          subtitle="The breadth below is offered as a structured catalogue. In practice, each engagement is shaped to the specific situation."
        />

        <div className="bg-navy/10 mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-2">
          {services.map(({ icon: Icon, name, desc }) => (
            <div key={name} className="group hover:bg-cream bg-white p-8 transition">
              <div className="flex items-start gap-5">
                <div className="border-gold text-gold group-hover:bg-gold group-hover:text-navy inline-flex h-12 w-12 shrink-0 items-center justify-center border transition">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-display text-navy text-xl">{name}</h3>
                  <p className="text-charcoal/65 mt-2 text-sm leading-6">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
