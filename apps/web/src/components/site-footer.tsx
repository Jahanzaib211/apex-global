import { Logo } from "@apex/ui";
import Link from "next/link";
import { getSettings } from "@/lib/content";
import { FOOTER_LEGAL, NAV } from "@/lib/site";

const SOLUTIONS = NAV.find((n) => n.label === "Solutions");

export async function SiteFooter() {
  const settings = await getSettings();
  const year = new Date().getFullYear();

  const phone = settings["org.phone"];
  const email = settings["org.email"];
  const address = settings["org.address"];

  return (
    <footer className="border-t border-[var(--border-inverse)] bg-[var(--color-navy-900)] text-[var(--color-navy-200)]">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-5 lg:col-span-1">
          <Logo variant="inverse" orientation="stacked" className="items-start" />
          <p className="max-w-xs text-sm leading-relaxed">
            We build and operate SaaS products and deliver technology solutions for businesses
            worldwide.
          </p>
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
            {[
              { label: "SaaS Products", href: "/saas" },
              { label: "Industries", href: "/industries" },
              { label: "Technology & Engineering", href: "/technology" },
              { label: "Case Studies", href: "/case-studies" },
              { label: "About", href: "/about" },
              { label: "Insights", href: "/insights" },
              { label: "Careers", href: "/careers" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
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
          <p>© {year} Apex Global Tech Solution. All rights reserved.</p>
          <ul className="flex gap-5">
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
