"use client";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself, which
 * `error.tsx` cannot. It must render its own <html>/<body> because the layout
 * that would normally provide them is the thing that failed. Styles are inline
 * for the same reason — the stylesheet link lives in that broken layout.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1431",
          color: "#fff",
          fontFamily: "Inter, system-ui, sans-serif",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "36rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.25rem", margin: 0 }}>Application error</h1>
          <p style={{ marginTop: "1rem", color: "rgba(255,255,255,.65)" }}>
            A critical error occurred. Please try again, or return to the home page.
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: ".5rem",
                fontFamily: "ui-monospace, monospace",
                fontSize: ".75rem",
                color: "rgba(255,255,255,.4)",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              marginTop: "2rem",
              background: "#F2A900",
              color: "#0B1431",
              border: 0,
              padding: ".75rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
