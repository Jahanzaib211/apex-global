import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export function ServiceCard({ icon: Icon, title, description, href, badge }: Props) {
  return (
    <Link
      href={href}
      className="group card relative flex flex-col gap-3 overflow-hidden p-6 lg:p-7"
    >
      {badge && <span className="badge-gold absolute top-4 right-4">{badge}</span>}
      <div className="bg-gold-100 text-gold-600 group-hover:bg-gold-grad group-hover:text-navy-700 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="font-display text-navy-600 text-xl font-semibold">{title}</h3>
      <p className="text-ink-400 flex-1 text-sm leading-relaxed">{description}</p>
      <div className="text-gold-500 group-hover:text-gold-600 mt-1 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2">
        Learn more <ArrowRight size={14} />
      </div>
    </Link>
  );
}
