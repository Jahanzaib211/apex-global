import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

/**
 * Social share card, generated at build time.
 *
 * `BRAND.ogImage` pointed at `/og-image.png`, which does not exist in
 * `public/` — so every og:image and twitter:image on this site 404'd and every
 * share rendered as a bare link. Generating the card here means it cannot go
 * missing again, and it stays in sync with the brand name and tagline.
 */
export const runtime = "nodejs";
export const alt = BRAND.name;
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
        background: "linear-gradient(135deg, #0B1431 0%, #16224d 60%, #080D24 100%)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 26,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#E8B02A",
          display: "flex",
        }}
      >
        Apex Group of Companies
      </div>
      <div style={{ fontSize: 78, fontWeight: 700, marginTop: 28, lineHeight: 1.05 }}>
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
        {BRAND.siteUrl.replace(/^https?:\/\//, "")}
      </div>
    </div>,
    size,
  );
}
