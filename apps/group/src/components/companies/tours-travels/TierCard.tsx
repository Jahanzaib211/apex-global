import { Check } from "lucide-react";
import Button from "@/components/Button";

type TierProps = {
  tier: string;
  features: string[];
  highlighted?: boolean;
};

export default function TierCard({ tier, features, highlighted = false }: TierProps) {
  return (
    <div
      className={`relative flex h-full flex-col border p-8 transition ${
        highlighted ? "border-gold bg-white shadow-xl" : "border-navy/15 bg-white"
      }`}
    >
      {highlighted && (
        <div className="bg-gold text-navy absolute -top-3 left-8 px-3 py-1 text-[10px] font-bold tracking-[.2em] uppercase">
          Most Popular
        </div>
      )}

      <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">Package</p>
      <h3 className="font-display text-navy mt-3 text-3xl">{tier}</h3>

      <div className="border-navy/10 mt-4 border-t pt-4">
        <p className="text-charcoal/50 text-xs tracking-[.18em] uppercase">Pricing</p>
        <p className="font-display text-navy mt-1 text-2xl">Pricing on request</p>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="text-charcoal/75 flex items-start gap-3 text-sm leading-6">
            <Check size={16} className="text-gold mt-1 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button
          href="#booking"
          variant={highlighted ? "primary" : "outline-gold"}
          size="md"
          className="w-full"
        >
          Inquire about this package
        </Button>
      </div>
    </div>
  );
}
