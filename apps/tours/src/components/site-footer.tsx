import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, MapPin, Camera } from "lucide-react";
import { APEX_SOCIALS } from "@apex/site-kit/social";

// The inline Facebook / Instagram / LinkedIn SVGs that lived here were removed
// with the dead `href="#"` links they decorated — see the note further down.
// Restore them from git history when real profile URLs exist.
import { BRAND, WHATSAPP_LINK } from "@/lib/brand";
import { APEX_GROUP } from "@/lib/apex-group";

export function SiteFooter() {
  return (
    <footer className="bg-navy-grad mt-auto text-white">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/logo.png"
              alt={BRAND.name}
              width={192}
              height={48}
              loading="lazy"
              className="mb-4 h-12 w-auto"
            />
            <p className="font-display mb-3 text-xl text-white">{BRAND.promise}</p>
            <p className="text-sm leading-relaxed text-white/70">
              Reliable car rental across Pakistan and Saudi Arabia, plus carefully organized Hajj
              and Umrah packages.
            </p>
          </div>

          <div>
            <h4 className="text-gold-400 mb-4 text-sm font-semibold tracking-wider uppercase">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link className="hover:text-gold-400" href="/pakistan-car-rental">
                  Pakistan Car Rental
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/saudi-car-rental">
                  Saudi Arabia Car Rental
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/car-rental-with-driver">
                  Car Rental with Driver
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/self-drive-car-rental">
                  Self-Drive Rental
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/vehicles">
                  Vehicle Fleet
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/umrah-packages">
                  Umrah Packages
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/hajj-packages">
                  Hajj Packages
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/custom-package">
                  Custom Packages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 mb-4 text-sm font-semibold tracking-wider uppercase">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link className="hover:text-gold-400" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/destinations">
                  Destinations
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/gallery">
                  Gallery
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/blog">
                  Travel Guides
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/careers">
                  Careers
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold-400" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 mb-4 text-sm font-semibold tracking-wider uppercase">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2.5">
                <MessageCircle size={16} className="text-[#25D366]" />
                <a
                  href={WHATSAPP_LINK("Hi Apex, I would like to enquire.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400"
                >
                  WhatsApp: {BRAND.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-gold-400" />
                <a href={`tel:${BRAND.phone}`} className="hover:text-gold-400">
                  {BRAND.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={16} className="text-gold-400" />
                <span>{BRAND.hqCity} · Saudi Arabia</span>
              </li>
            </ul>
            <ul className="mt-8 flex items-center gap-3" aria-label="Social profiles">
              {APEX_SOCIALS.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="hover:bg-gold-500 hover:text-navy-600 focus-visible:ring-gold-500 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/80 transition focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Camera aria-hidden className="h-4 w-4" />
                    <span className="sr-only">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav
          aria-label="Apex Group of Companies"
          className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-baseline sm:gap-6"
        >
          <span className="text-gold-400 text-[11px] tracking-[0.2em] whitespace-nowrap uppercase">
            Apex Group
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
            {APEX_GROUP.filter((c) => !c.self).map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-400 transition"
              >
                {c.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center">
          <div>
            © {new Date().getFullYear()} {BRAND.legal}. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="hover:text-gold-400">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gold-400">
              Privacy
            </Link>
            <Link href="/disclaimer" className="hover:text-gold-400">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
