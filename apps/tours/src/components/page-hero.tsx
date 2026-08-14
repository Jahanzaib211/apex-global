import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  image?: string;
  breadcrumbs?: { label: string; href?: string }[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  children?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  breadcrumbs,
  primaryCta,
  secondaryCta,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="bg-navy-grad grain relative h-full w-full" />
        )}
        <div className={`absolute inset-0 ${image ? "hero-overlay" : ""}`} />
      </div>

      <div className="container-page relative py-20 text-white md:py-28 lg:py-32">
        {breadcrumbs && (
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/70">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="opacity-50" />}
                {b.href ? (
                  <Link href={b.href} className="hover:text-gold-400 transition">
                    {b.label}
                  </Link>
                ) : (
                  <span>{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && <div className="eyebrow !text-gold-400 mb-4">{eyebrow}</div>}

        <h1 className="font-display max-w-3xl text-4xl leading-[1.05] font-semibold text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
            {subtitle}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta && (
              <Link href={primaryCta.href} className="btn-primary">
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href} className="btn-secondary">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
