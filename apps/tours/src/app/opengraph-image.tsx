import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";
import { SITE_URL } from "@/lib/site-url";

/**
 * Social share card, generated at build time.
 *
 * This site emitted no og:image at all, so every share on LinkedIn, WhatsApp
 * and X rendered as a bare link. Generating the card here rather than
 * committing a PNG means it cannot drift from the brand name or go missing,
 * which is what happened on apps/outsourcing before its card was generated.
 */
export const runtime = "nodejs";
export const alt = "Apex Global Tours & Travels";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #06231F 0%, #0C4A3E 60%, #041713 100%)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 26,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#D9A441",
          display: "flex",
        }}
      >
        Apex Group of Companies
      </div>
      <div style={{ fontSize: 74, fontWeight: 700, marginTop: 28, lineHeight: 1.05 }}>
        {BRAND.name}
      </div>
      <div style={{ fontSize: 34, marginTop: 26, color: "rgba(255,255,255,0.78)" }}>
        {BRAND.tagline}
      </div>
      <div
        style={{
          marginTop: "auto",
          fontSize: 26,
          color: "rgba(255,255,255,0.55)",
          display: "flex",
        }}
      >
        {SITE_URL.replace(/^https?:\/\//, "")}
      </div>
    </div>,
    size,
  );
}
