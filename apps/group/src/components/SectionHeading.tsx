export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <div className="bg-gold mb-5 h-1 w-12" />
      <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">{eyebrow}</p>
      <h2
        className={`font-display mt-3 text-4xl leading-tight md:text-5xl ${light ? "text-white" : "text-navy"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 max-w-2xl text-base leading-7 ${light ? "text-white/65" : "text-charcoal/65"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
