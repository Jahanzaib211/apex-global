/**
 * Renders the compliance programme strip under the marquee on Tech.
 *
 * Always visible — honest about in-progress vs verified state. The
 * "Verified" status is only ever claimed when an env var flips it at build
 * time; the "In progress" status never claims an audit completed.
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
      className="border-y border-[var(--border-default)] bg-[var(--color-navy-50)] py-8"
    >
      <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[var(--color-navy-600)] uppercase">
          <ShieldCheck size={14} aria-hidden />
          Compliance programme
        </span>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {badges.map((b) => {
            const isVerified = b.status === "verified";
            return (
              <li key={b.id}>
                <Link
                  href={b.href}
                  className={
                    isVerified
                      ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 font-medium text-emerald-800 transition hover:border-emerald-400 hover:text-emerald-900"
                      : "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-navy-200)] bg-white px-3 py-1 font-medium text-[var(--color-navy-700)] transition hover:border-[var(--color-gold-400)] hover:text-[var(--color-navy-900)]"
                  }
                  aria-label={
                    isVerified ? `${b.name} — verified` : `${b.name} — in progress, audit pending`
                  }
                >
                  {isVerified ? (
                    <ShieldCheck size={12} aria-hidden className="text-emerald-600" />
                  ) : (
                    <ShieldAlert size={12} aria-hidden className="text-amber-500" />
                  )}
                  {b.name}
                  <span
                    className={
                      isVerified
                        ? "ml-1 text-[10px] tracking-wider text-emerald-700 uppercase"
                        : "ml-1 text-[10px] tracking-wider text-amber-700 uppercase"
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
          <p className="basis-full text-center text-xs text-[var(--color-ink-400)]">
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
