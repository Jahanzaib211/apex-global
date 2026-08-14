import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { APEX_GROUP } from "@/lib/apex-group";
import { APEX_SOCIALS } from "@apex/site-kit/social";
import { DEFAULT_BRANDS } from "@apex/site-kit/brand";

const BRAND = DEFAULT_BRANDS["apex-group"]!;

const SOCIAL_GLYPH: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
};

export default function Footer() {
  return (
    <footer id="contact" className="bg-navy scroll-mt-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8 xl:grid-cols-6">
        <div>
          <Image
            src="/logo.png"
            alt="Apex Group of Companies"
            width={130}
            height={50}
            className="mb-5 h-12 w-auto object-contain"
          />
          <p className="font-editorial text-xl text-white/80">
            Pakistan-rooted.
            <br />
            Globally connected.
          </p>
          <p className="mt-5 text-sm leading-6 text-white/50">
            A growing ecosystem of specialized businesses, connected by one vision.
          </p>
          <ul className="mt-6 flex gap-3" aria-label="Apex Group social profiles">
            {APEX_SOCIALS.map((s) => {
              const Glyph = SOCIAL_GLYPH[s.platform];
              return (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="hover:border-gold hover:text-gold focus-visible:ring-gold inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {Glyph ? (
                      <span aria-hidden>
                        <Glyph className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="text-xs font-semibold">{s.label[0]}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <FooterCol
          title="Our Companies"
          items={[
            ["Apex Global Tech Solution", "/companies/tech-solution"],
            ["Apex Outsourcing", "/companies/outsourcing"],
            ["Apex Tours & Travels", "/companies/tours-travels"],
            ["Apex Holdings", "/companies/holdings"],
          ]}
        />
        <div>
          <h3 className="text-gold mb-5 text-xs font-semibold tracking-[.2em] uppercase">
            Visit Our Sites
          </h3>
          <div className="space-y-3">
            {APEX_GROUP.filter((c) => !c.self).map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-white/65 hover:text-white"
              >
                {/*
                  Show the hostname, not the company name. "Our Companies"
                  already lists the same names linking to this site's own
                  profile pages, so the footer had each company twice under an
                  identical label going to two different destinations.
                */}
                {new URL(c.href).hostname}
              </a>
            ))}
          </div>
        </div>
        <FooterCol
          title="Group Services"
          items={[
            ["Financial Consultancy", "/consultancy"],
            ["Partnerships", "/partnerships"],
            ["Our Ecosystem", "/ecosystem"],
          ]}
        />
        <FooterCol
          title="Company"
          items={[
            ["About", "/about"],
            ["Leadership", "/leadership"],
            ["Careers", "/careers"],
            ["News", "/insights"],
            ["Events", "/events"],
            ["Gallery", "/gallery"],
          ]}
        />
        <div>
          <h3 className="text-gold mb-5 text-xs font-semibold tracking-[.2em] uppercase">
            Contact
          </h3>
          {/*
            This block carried three dead contact routes: a `support@` mailto to
            a mailbox that does not exist, `tel:+920000000000` rendered as
            "+92 (0) 000 000 0000", and `wa.me/920000000000`. All three are now
            the real values from `@apex/site-kit/brand`, except the email, which
            is dropped in favour of the contact form — the channel that actually
            reaches the CRM.
          */}
          <p className="text-sm leading-6 text-white/70">
            Registered Office
            <br />
            {BRAND.contactAddress}
          </p>
          <a
            href={`tel:${BRAND.contactPhone!.replace(/\s+/g, "")}`}
            className="hover:text-gold mt-4 block text-sm text-white/70"
          >
            {BRAND.contactPhone}
          </a>
          {BRAND.whatsapp && (
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              ● WhatsApp {BRAND.whatsappDisplay}
            </a>
          )}
          <Link
            href="/consultancy#consultancy-form"
            className="bg-gold text-navy mt-6 block px-4 py-3 text-center text-sm font-semibold hover:bg-white"
          >
            Request Financial Consultancy
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/40 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Apex Group of Companies. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h3 className="text-gold mb-5 text-xs font-semibold tracking-[.2em] uppercase">{title}</h3>
      <div className="space-y-3">
        {items.map(([label, href]) => (
          <Link key={label} href={href} className="block text-sm text-white/65 hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
