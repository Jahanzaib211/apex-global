import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { SiteLogo } from "./SiteLogo";
import { site, footerNav, socials } from "@/data/site";
import { APEX_GROUP } from "@/lib/apex-group";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SiteLogo variant="light" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-slate-400">
              {site.description}
            </p>

            <div className="mt-8 space-y-3 text-sm text-slate-400">
              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="hover:text-gold-400 flex items-center gap-3 transition-colors"
              >
                <Phone className="text-gold-400 h-4 w-4" />
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="hover:text-gold-400 flex items-center gap-3 transition-colors"
              >
                <Mail className="text-gold-400 h-4 w-4" />
                {site.email}
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold-400 flex items-center gap-3 transition-colors"
              >
                <MessageCircle className="text-gold-400 h-4 w-4" />
                WhatsApp a Consultant
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="text-gold-400 mt-0.5 h-4 w-4 shrink-0" />
                <span>{site.address}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-8">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h3 className="tracking-wide-3 mb-5 text-xs font-semibold text-white uppercase">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="hover:text-gold-400 text-sm text-slate-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The rest of the Apex group. Same list and order on all five sites. */}
      <div className="border-t border-white/10">
        <nav
          aria-label="Apex Group of Companies"
          className="container-x flex flex-col gap-3 py-5 sm:flex-row sm:items-baseline sm:gap-6"
        >
          <span className="tracking-wide-3 text-gold-400 text-[11px] font-semibold whitespace-nowrap uppercase">
            Apex Group
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
            {APEX_GROUP.filter((c) => !c.self).map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300"
              >
                {c.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-slate-500 md:flex-row">
          <div>
            © {new Date().getFullYear()} Apex Holdings. All rights reserved · Marketing &
            Developments
          </div>
          <div className="flex items-center gap-5">
            <Link href="/legal/privacy" className="hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-slate-300">
              Terms
            </Link>
            <Link href="/legal/disclaimer" className="hover:text-slate-300">
              Disclaimer
            </Link>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold-400"
                  aria-label={s.label}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
