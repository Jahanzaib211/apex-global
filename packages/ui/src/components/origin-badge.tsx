import { cn } from "../lib/cn";

/**
 * Provenance label for every technology-proof entry and SaaS product.
 *
 * This is the visible half of the credibility rule in docs/CREDIBILITY.md: a
 * technical buyer can verify our claims in about five minutes, so the site
 * states plainly what Apex wrote, what Apex runs, and what belongs to someone
 * else. It renders inline with the claim — never as a footnote.
 */
export type Origin = "BUILT_BY_APEX" | "OPERATED_BY_APEX" | "THIRD_PARTY_OSS";

const COPY: Record<Origin, { label: string; tone: string; title: string }> = {
  BUILT_BY_APEX: {
    label: "Built by Apex",
    title: "Designed and written by the Apex engineering team.",
    tone: "bg-[var(--bg-accent-subtle)] text-[var(--color-amber-800)] border-[var(--color-amber-300)]",
  },
  OPERATED_BY_APEX: {
    label: "Operated by Apex",
    title: "Deployed, configured, secured and run by Apex in production.",
    tone: "bg-[var(--color-info-100)] text-[var(--color-info-500)] border-[var(--color-info-500)]/30",
  },
  THIRD_PARTY_OSS: {
    label: "Third-party open source",
    title: "Software written by others that Apex deploys and operates for clients.",
    tone: "bg-[var(--bg-sunken)] text-[var(--ink-secondary)] border-[var(--border-default)]",
  },
};

export interface OriginBadgeProps {
  origin: Origin;
  /** Required for derived work: the upstream project's name. */
  upstreamName?: string | null;
  upstreamUrl?: string | null;
  upstreamLicense?: string | null;
  className?: string;
}

export function OriginBadge({
  origin,
  upstreamName,
  upstreamUrl,
  upstreamLicense,
  className,
}: OriginBadgeProps) {
  const { label, tone, title } = COPY[origin];

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <span
        title={title}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5",
          "text-2xs font-medium tracking-wide uppercase",
          tone,
        )}
      >
        {label}
      </span>
      {upstreamName ? (
        <span className="text-2xs text-[var(--ink-muted)]">
          built on{" "}
          {upstreamUrl ? (
            <a
              href={upstreamUrl}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="underline underline-offset-2 hover:text-[var(--ink-primary)]"
            >
              {upstreamName}
            </a>
          ) : (
            upstreamName
          )}
          {upstreamLicense ? ` · ${upstreamLicense}` : null}
        </span>
      ) : null}
    </span>
  );
}
