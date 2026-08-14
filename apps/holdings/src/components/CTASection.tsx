import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  variant = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <section
      className={`relative overflow-hidden ${
        dark ? "bg-ink text-white" : "text-ink border-y border-slate-200 bg-slate-50"
      }`}
    >
      {dark && <div className="bg-grid absolute inset-0 opacity-20" aria-hidden />}
      <div className="container-x relative flex flex-col items-start justify-between gap-8 py-20 lg:flex-row lg:items-center lg:py-24">
        <div className="max-w-2xl">
          {eyebrow && (
            <span className={`eyebrow ${dark ? "!text-gold-400" : ""} mb-3 block`}>{eyebrow}</span>
          )}
          <h2
            className={`font-display text-3xl leading-tight font-bold lg:text-4xl ${dark ? "text-white" : ""}`}
          >
            {title}
          </h2>
          {description && (
            <p className={`mt-4 ${dark ? "text-slate-300" : "text-slate-600"} max-w-xl`}>
              {description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {primary && (
            <Link href={primary.href} className={dark ? "btn-accent" : "btn-primary"}>
              {primary.label} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {secondary && (
            <Link href={secondary.href} className={dark ? "btn-ghost-light" : "btn-ghost"}>
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
