import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Globe, Mail, Phone, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";
import { CONTACT, CONTACT_LINKS } from "@/lib/contact";
import { SOCIAL, type SocialKey } from "@/lib/social";
import { APEX_GROUP } from "@/lib/apex-group";
import { BRAND } from "@/lib/brand";

const SOCIAL_ICONS: Record<SocialKey, LucideIcon> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
};

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Security", href: "/security" },
  { label: "Cookies", href: "/cookies" },
];

const FOOTER_NAV = [
  {
    title: "Services",
    links: [
      { label: "BPO", href: "/services/bpo" },
      { label: "Customer Experience", href: "/services/customer-experience" },
      { label: "Telesales", href: "/services/tele-sales" },
      { label: "Lead Generation", href: "/services/sales-development" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
      { label: "Dedicated Teams", href: "/services/dedicated-teams" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Industries", href: "/industries" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Careers", href: "/careers" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink relative border-t border-white/15 text-white">
      <div className="container-x relative pt-48 pb-16">
        <div className="grid items-start gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block" aria-label={`${BRAND.name} — Home`}>
              <Image
                src="/logo.png"
                alt={BRAND.name}
                width={320}
                height={106}
                className="h-16 w-auto"
                loading="lazy"
              />
            </Link>
            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-white/70">
              {BRAND.description}
            </p>
            <ul className="mt-8 flex gap-2.5" aria-label="Social profiles">
              {(Object.keys(SOCIAL) as SocialKey[]).map((key) => {
                const Icon = SOCIAL_ICONS[key];
                const item = SOCIAL[key];
                if (item.href) {
                  return (
                    <li key={key}>
                      <a
                        href={item.href}
                        aria-label={item.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:bg-amber2 hover:border-amber2 hover:text-navy focus-visible:ring-amber2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/80 transition focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <Icon size={16} />
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={key}>
                    <button
                      type="button"
                      disabled
                      aria-label={`${item.label} (coming soon)`}
                      className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/40"
                    >
                      <Icon size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {FOOTER_NAV.map((col) => (
            <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
              <h3 className="text-amber2 text-[11px] font-semibold tracking-[0.22em] uppercase">
                {col.title}
              </h3>
              <ul className="mt-7 space-y-3.5 text-[14px]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/65 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-4">
            <h3 className="text-amber2 text-[11px] font-semibold tracking-[0.22em] uppercase">
              Get in Touch
            </h3>
            <ul className="mt-7 space-y-4 text-[14px]">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin size={16} className="text-amber2 mt-0.5 shrink-0" aria-hidden />
                <span>
                  {CONTACT.address.line1} — {CONTACT.address.line2}
                  <br />
                  <span className="text-[13px] text-white/55">{CONTACT.address.region}</span>
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail size={16} className="text-amber2 shrink-0" aria-hidden />
                <a href={CONTACT_LINKS.mailto} className="transition hover:text-white">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone size={16} className="text-amber2 shrink-0" aria-hidden />
                <a href={CONTACT_LINKS.tel} className="transition hover:text-white">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Globe size={16} className="text-amber2 shrink-0" aria-hidden />
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom legal bar — full-width band with a 2px amber rule above.
            Brand color opens (CTA) and closes (this rule). */}
        {/* The rest of the Apex group. Same list and order on all five sites. */}
        <nav
          aria-label="Apex Group of Companies"
          className="mt-20 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-baseline sm:gap-7"
        >
          <span className="text-amber2 text-[11px] font-semibold tracking-[0.22em] whitespace-nowrap uppercase">
            Apex Group
          </span>
          <div className="flex flex-wrap gap-x-7 gap-y-2 text-[15px] text-white/60">
            {APEX_GROUP.filter((c) => !c.self).map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition hover:text-white"
              >
                {c.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="border-amber2 mt-10 border-t-2 pt-10">
          <div className="flex flex-col-reverse gap-6 text-[15px] text-white/60 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <p className="font-medium">
                © {new Date().getFullYear()} {BRAND.legalName}.
                <span className="mx-3 hidden text-white/30 sm:inline">·</span>
                <br className="sm:hidden" />
                <span className="font-normal text-white/45">
                  Built with global teams. Operates in 30+ countries.
                </span>
              </p>
            </div>
            <nav
              aria-label="Legal"
              className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[15px]"
            >
              {LEGAL_LINKS.map((l, i) => (
                <span key={l.href} className="contents">
                  <Link href={l.href} className="font-medium transition hover:text-white">
                    {l.label}
                  </Link>
                  {i < LEGAL_LINKS.length - 1 && (
                    <span aria-hidden className="hidden h-3.5 w-px bg-white/20 md:inline" />
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
