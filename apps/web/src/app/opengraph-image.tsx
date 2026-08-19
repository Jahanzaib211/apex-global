import { ImageResponse } from "next/og";

/**
 * Social share card for the Tech site, generated at build time.
 *
 * This was the only site in the estate with no og:image at all — the four
 * sibling sites all had one — so every share of the flagship domain rendered
 * as a bare link.
 */
export const runtime = "nodejs";
export const alt = "Apex Global Tech Solution";
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
      <div style={{ fontSize: 74, fontWeight: 700, marginTop: 28, lineHeight: 1.05 }}>
        Apex Global Tech Solution
      </div>
      <div style={{ fontSize: 34, marginTop: 26, color: "rgba(255,255,255,0.78)" }}>
        Software, SaaS, AI and cloud engineering.
      </div>
      <div
        style={{
          marginTop: "auto",
          fontSize: 26,
          color: "rgba(255,255,255,0.55)",
          display: "flex",
        }}
      >
        tech.apexgroupcompanies.com
      </div>
    </div>,
    size,
  );
}
