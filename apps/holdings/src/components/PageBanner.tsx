import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageBanner({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  bg = "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  bg?: string;
}) {
  return (
    <section className="bg-ink relative overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${bg})` }}
        aria-hidden
      />
      <div className="from-ink via-ink/80 to-ink absolute inset-0 bg-gradient-to-b" aria-hidden />
      <div className="container-x relative py-20 lg:py-28">
        {breadcrumbs.length > 0 && (
          <nav className="tracking-wide-2 mb-6 flex items-center gap-1.5 text-xs text-slate-400 uppercase">
            <Link href="/" className="hover:text-gold-400">
              Home
            </Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 opacity-50" />
                {b.href ? (
                  <Link href={b.href} className="hover:text-gold-400">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-gold-400">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="eyebrow text-gold-400 mb-4 block">{eyebrow}</span>}
        <h1 className="font-display max-w-3xl text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
