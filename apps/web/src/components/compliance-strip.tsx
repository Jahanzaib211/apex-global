/**
 * The compliance programme strip, sitting at the foot of the page.
 *
 * It used to be a light band high up, wedged between the tech marquee and the
 * partner strip, where it interrupted the pitch to make a governance point.
 * Compliance is reassurance, not a headline — it belongs where a reader looks
 * once they are already interested.
 *
 * So it now renders last, on the same `--color-navy-900` as the closing CTA
 * above it and the footer below, which makes the bottom of the page one
 * continuous dark run rather than three stacked bands. The only seam is a
 * hairline above it; there is deliberately no bottom border, so it flows
 * straight into the footer.
 *
 * Always visible — honest about in-progress vs verified state. The "Verified"
 * status is only ever claimed when an env var flips it at build time; the
 * "In progress" status never claims an audit completed.
 */

import Link from "next/link";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { resolvedComplianceBadges } from "@/lib/compliance";

export function ComplianceStrip() {
  const badges = resolvedComplianceBadges();
  if (badges.length === 0) return null;

  const verifiedCount = badges.filter((b) => b.status === "verified").length;
  const inProgressCount = badges.length - verifiedCount;

  return (
    <section
      aria-label="Compliance programme"
      className="border-t border-white/10 bg-[var(--color-navy-900)] py-10 text-[var(--color-navy-200)]"
    >
      <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-5 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[var(--color-canvas-100)] uppercase">
          <ShieldCheck size={14} aria-hidden className="text-[var(--color-amber-400)]" />
          Compliance programme
        </span>

        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-sm">
          {badges.map((b) => {
            const isVerified = b.status === "verified";
            return (
              <li key={b.id}>
                <Link
                  href={b.href}
                  className={
                    // Both pills are translucent surfaces over the navy rather
                    // than opaque chips, so they read as part of the footer
                    // rather than pasted onto it.
                    isVerified
                      ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-medium text-emerald-300 transition-colors hover:border-emerald-400/70 hover:text-emerald-200"
                      : "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-medium text-[var(--color-canvas-100)] transition-colors hover:border-[var(--color-amber-400)]/60 hover:bg-white/10"
                  }
                  aria-label={
                    isVerified ? `${b.name} — verified` : `${b.name} — in progress, audit pending`
                  }
                >
                  {isVerified ? (
                    <ShieldCheck size={12} aria-hidden className="text-emerald-400" />
                  ) : (
                    <ShieldAlert size={12} aria-hidden className="text-[var(--color-amber-400)]" />
                  )}
                  {b.name}
                  <span
                    className={
                      isVerified
                        ? "ml-1 text-[10px] tracking-wider text-emerald-400/90 uppercase"
                        : "ml-1 text-[10px] tracking-wider text-[var(--color-amber-400)]/90 uppercase"
                    }
                  >
                    {isVerified ? "Verified" : "In progress"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {inProgressCount > 0 && (
          <p className="basis-full text-center text-xs text-[var(--color-navy-200)]/70">
            {inProgressCount > 1
              ? `${inProgressCount} audits in progress`
              : `${inProgressCount} audit in progress`}
            {" — "}
            {verifiedCount > 0
              ? "verified seals will replace in-progress pills as audits close"
              : "every audit enters the strip the day an engagement letter is signed"}
          </p>
        )}
      </div>
    </section>
  );
}
