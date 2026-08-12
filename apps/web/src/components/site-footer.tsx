import { Logo } from "@apex/ui";
import Link from "next/link";
import { getSettings } from "@/lib/content";
import { FOOTER_LEGAL, GROUP_COMPANIES, NAV } from "@/lib/site";

const SOLUTIONS = NAV.find((n) => n.label === "Solutions");

// This site is Apex Global Tech Solution, so its own entry points at the root
// rather than back out through the public hostname.
const GROUP_LINKS = GROUP_COMPANIES.map((c) => ({
  label: c.label,
  href: "self" in c && c.self ? "/" : c.href,
}));

/**
 * The Company column, derived from NAV rather than hand-listed.
 *
 * It used to be an inline array that had drifted from the header: it carried
 * /contact, which NAV does not have, and had lost /services and the client
 * login. Deriving it means the two menus can no longer disagree; /contact is
 * appended because it is a real page the header only exposes as a CTA button.
 */
const COMPANY_LINKS = [
  ...NAV.filter((n) => !("children" in n)).map((n) => ({ label: n.label, href: n.href })),
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/apexglobaltechsolution",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1F8H6VoshA",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/apex-global-tech-solution",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
  },
];

export async function SiteFooter() {
  const settings = await getSettings();
  const year = new Date().getFullYear();

  const phone = settings["org.phone"];
  const email = settings["org.email"];
  const address = settings["org.address"];

  const partnerName = settings["partner.name"];
  const partnerUrl = settings["partner.url"];

  return (
    <footer className="border-t border-[var(--border-inverse)] bg-[var(--color-navy-900)] text-[var(--color-navy-200)]">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-5 lg:col-span-1">
          <Logo variant="inverse" orientation="stacked" className="items-start" animated />
          <p className="max-w-xs text-sm leading-relaxed">
            We build and operate SaaS products and deliver technology solutions for businesses
            worldwide.
          </p>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xs font-semibold uppercase tracking-[0.18em] text-[var(--color-amber-400)]">
              Follow us
            </h2>
            <ul className="flex items-center gap-5" aria-label="Social">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label={s.label}
                    title={s.label}
                    className="inline-flex rounded-full p-2 text-[var(--color-canvas-100)] transition-colors hover:bg-[var(--color-canvas-100)] hover:text-[var(--color-navy-900)]"
                  >
                    {s.glyph}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav aria-label="Solutions" className="flex flex-col gap-3">
          <h2 className="text-2xs font-semibold uppercase tracking-[0.18em] text-[var(--color-amber-400)]">
            Solutions
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {SOLUTIONS && "children" in SOLUTIONS
              ? SOLUTIONS.children.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="transition-colors hover:text-white">
                      {c.label}
                    </Link>
                  </li>
                ))
              : null}
          </ul>
        </nav>

        <nav aria-label="Company" className="flex flex-col gap-3">
          <h2 className="text-2xs font-semibold uppercase tracking-[0.18em] text-[var(--color-amber-400)]">
            Company
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Group" className="flex flex-col gap-3">
          <h2 className="text-2xs font-semibold uppercase tracking-[0.18em] text-[var(--color-amber-400)]">
            Group
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {GROUP_LINKS.map((c) => (
              <li key={c.label}>
                <Link
                  href={c.href}
                  className="transition-colors hover:text-white"
                  {...(c.href.startsWith("http")
                    ? { rel: "noopener noreferrer", target: "_blank" }
                    : {})}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-2xs font-semibold uppercase tracking-[0.18em] text-[var(--color-amber-400)]">
            Contact
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {phone ? (
              <li>
                {/* Tracked as a conversion: in several of our markets, calls
                    outnumber form fills and a funnel that ignores them
                    mis-optimises the ad spend. */}
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  data-conversion="phone_click"
                  className="transition-colors hover:text-white"
                >
                  {phone}
                </a>
              </li>
            ) : null}
            {email ? (
              <li>
                <a
                  href={`mailto:${email}`}
                  data-conversion="email_click"
                  className="transition-colors hover:text-white"
                >
                  {email}
                </a>
              </li>
            ) : null}
            {address ? <li className="max-w-xs leading-relaxed">{address}</li> : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border-inverse)]">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-xs sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p>© {year} Apex Global Tech Solution. All rights reserved.</p>
            {partnerName ? (
              <p className="text-[var(--color-slate-400)]">
                Engineering partner:{" "}
                {partnerUrl ? (
                  <a
                    href={partnerUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="font-medium text-[var(--color-canvas-100)] underline-offset-4 hover:underline"
                  >
                    {partnerName}
                  </a>
                ) : (
                  <span className="font-medium text-[var(--color-canvas-100)]">{partnerName}</span>
                )}
              </p>
            ) : null}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
