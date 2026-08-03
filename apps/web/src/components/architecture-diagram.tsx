/**
 * Inline SVG architecture diagram.
 *
 * Deliberately not an image file and not a client-side rendering library:
 * it costs zero JavaScript, stays sharp at any zoom, adapts to light and dark
 * through CSS variables, and remains readable to a screen reader through its
 * title and description. A technical buyer zooms in on these.
 */

interface Node {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  tone?: "default" | "accent" | "muted";
}

const NODE_H = 46;
const DEFAULT_W = 148;

const NODES: Node[] = [
  { id: "internet", label: "Public internet", x: 20, y: 12, w: 180, tone: "muted" },
  { id: "edge", label: "Edge network", sub: "CDN · WAF · TLS", x: 20, y: 92, w: 180, tone: "accent" },

  { id: "web", label: "Public site", sub: ":4300", x: 268, y: 92 },
  { id: "console", label: "Ops console", sub: ":4301", x: 268, y: 168 },

  { id: "pg", label: "PostgreSQL", sub: "system of record", x: 470, y: 54 },
  { id: "redis", label: "Redis", sub: "queues · limits", x: 470, y: 130 },
  { id: "minio", label: "Object storage", sub: "media · documents", x: 470, y: 206 },

  { id: "workers", label: "Workers", sub: "notify · AI · conversions", x: 660, y: 130, w: 170 },
];

const EDGES: Array<[string, string]> = [
  ["internet", "edge"],
  ["edge", "web"],
  ["edge", "console"],
  ["web", "pg"],
  ["web", "redis"],
  ["console", "pg"],
  ["console", "minio"],
  ["redis", "workers"],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export function ArchitectureDiagram() {
  const width = 860;
  const height = 276;

  return (
    // Wide diagrams scroll inside their own box; the page body never scrolls
    // sideways on a phone.
    <div className="scroll-x rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[680px]"
        role="img"
        aria-labelledby="arch-title arch-desc"
      >
        <title id="arch-title">Apex platform architecture</title>
        <desc id="arch-desc">
          Public internet traffic reaches an edge network providing CDN, WAF and TLS termination.
          The edge forwards to the public site and the operations console. Both read and write to
          PostgreSQL as the system of record, with Redis for queues and rate limiting and
          S3-compatible object storage for media and documents. Background workers consume the Redis
          queues to send notifications, run AI jobs and deliver server-side conversion events.
          Datastores are bound to loopback and are not reachable from the public internet.
        </desc>

        <defs>
          <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--border-strong)" />
          </marker>
        </defs>

        {EDGES.map(([from, to]) => {
          const a = nodeById(from);
          const b = nodeById(to);
          const ax = a.x + (a.w ?? DEFAULT_W);
          const ay = a.y + NODE_H / 2;
          const bx = b.x;
          const by = b.y + NODE_H / 2;

          // Compare centres, not edges: two stacked nodes of the same width
          // share a centre but their right/left edges are a full width apart,
          // which was drawing a sideways curve where a straight drop belongs.
          const acx = a.x + (a.w ?? DEFAULT_W) / 2;
          const bcx = b.x + (b.w ?? DEFAULT_W) / 2;
          const isVertical = Math.abs(acx - bcx) < 40;

          const d = isVertical
            ? `M${acx} ${a.y + NODE_H} L${bcx} ${b.y}`
            : `M${ax} ${ay} C${ax + 34} ${ay}, ${bx - 34} ${by}, ${bx} ${by}`;

          return (
            <path
              key={`${from}-${to}`}
              d={d}
              fill="none"
              stroke="var(--border-strong)"
              strokeWidth="1.25"
              markerEnd="url(#arrow)"
              opacity="0.75"
            />
          );
        })}

        {NODES.map((n) => {
          const w = n.w ?? DEFAULT_W;
          const accent = n.tone === "accent";
          const muted = n.tone === "muted";

          return (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={w}
                height={NODE_H}
                rx="8"
                fill={accent ? "var(--bg-accent-subtle)" : "var(--bg-page)"}
                stroke={accent ? "var(--color-amber-500)" : "var(--border-default)"}
                strokeWidth="1.25"
                strokeDasharray={muted ? "4 3" : undefined}
              />
              <text
                x={n.x + w / 2}
                y={n.sub ? n.y + 20 : n.y + 28}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="600"
                fill="var(--ink-primary)"
              >
                {n.label}
              </text>
              {n.sub ? (
                <text
                  x={n.x + w / 2}
                  y={n.y + 34}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill="var(--ink-muted)"
                >
                  {n.sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
