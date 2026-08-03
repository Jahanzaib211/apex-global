import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Chrome for the marketing site.
 *
 * Ad landing pages under /lp deliberately sit outside this group: they have no
 * navigation and no footer links, because every exit route on a page you paid
 * to send someone to is a way to lose the conversion.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-md)] focus:bg-[var(--bg-raised)] focus:px-4 focus:py-2 focus:shadow-[var(--shadow-md)]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
