"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import graphData from "@/lib/repo-graph.json";

interface GNode {
  id: string;
  label: string;
  file: string;
  c: number;
  d: number;
  x: number;
  y: number;
}

type Pair = [string, string];

const NODES = graphData.nodes as GNode[];
const LINKS = graphData.links as Pair[];

const COMMUNITY_COLORS = [
  "#fab319",
  "#4ecdc4",
  "#5f8ee8",
  "#f26d78",
  "#9b6bff",
  "#38c172",
  "#ff9f43",
  "#5bb0e6",
  "#e879f9",
  "#93c5fd",
  "#fbbf24",
  "#a3e635",
];
const LINK_BASE = "rgba(170, 190, 220, 0.18)";

/** Padding around the node extent so edge nodes aren't clipped. */
const BOUNDS_PAD = 46;

/** Real axis-aligned bounds of the baked layout, expanded a little. */
const DATA_BOUNDS = (() => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const n of NODES) {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  }
  return {
    minX,
    maxX,
    minY,
    maxY,
    w: maxX - minX + BOUNDS_PAD * 2,
    h: maxY - minY + BOUNDS_PAD * 2,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
})();

function colorForCommunity(c: number): string {
  return COMMUNITY_COLORS[c % COMMUNITY_COLORS.length] ?? "#fab319";
}

function shortLabel(label: string): string {
  // strip call/params noise helpers for display
  return label.replace(/\s*\(.*\)\s*$/, "").slice(0, 34);
}

function relativePath(file: string): string {
  return file.replace(/^apps\/(web|console)\//, "").replace(/^packages\/[^/]+\//, "");
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * RepoGraph — the real symbol graph of this repository, rendered on canvas.
 *
 * Node positions are baked into `repo-graph.json` (computed offline with the
 * force layout in `scripts/generate-repo-graph.py`), so the live component
 * never runs a physics step; it only breathes — pulses the hub nodes and
 * details the neighborhood on hover.
 *
 * The dataset deliberately ships NO source text. The graph is public proof
 * that the system is real, but the code behind each node stays in the
 * repository — a click focuses the node, it does not dump the file.
 */
export function RepoGraph() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);

  hoveredRef.current = hovered;
  selectedRef.current = selected;

  const byId = useMemo(() => {
    const m = new Map<string, GNode>();
    for (const n of NODES) m.set(n.id, n);
    return m;
  }, []);

  const parent = useMemo(() => DATA_BOUNDS, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cvs = canvas; // non-null aliases so the hoisted render() can use them
    const c2d = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const fitScale = () => {
      const r = wrap.getBoundingClientRect();
      return Math.min(r.width / parent.w, r.height / parent.h) * 1.06;
    };

    const resize = () => {
      cvs.width = wrap.clientWidth * dpr;
      cvs.height = wrap.clientHeight * dpr;
      cvs.style.width = `${wrap.clientWidth}px`;
      cvs.style.height = `${wrap.clientHeight}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("resize", resize);

    const neighbors = new Map<string, Set<string>>();
    for (const n of NODES) neighbors.set(n.id, new Set());
    const linkById = new Map<string, { a: GNode; b: GNode }[]>();
    for (const [s, t] of LINKS) {
      const a = byId.get(s);
      const b = byId.get(t);
      if (!a || !b) continue;
      neighbors.get(s)?.add(t);
      neighbors.get(t)?.add(s);
      const k = s < t ? `${s}\u0000${t}` : `${t}\u0000${s}`;
      (linkById.get(k) ?? linkById.set(k, []).get(k)!).push({ a, b });
    }

    const edgeList: { a: GNode; b: GNode }[] = [...linkById.values()]
      .map((l) => l[0])
      .filter((x): x is { a: GNode; b: GNode } => Boolean(x));

    let raf = 0;

    function render(t: number) {
      const W = cvs.width / dpr;
      const H = cvs.height / dpr;
      c2d.setTransform(1, 0, 0, 1, 0, 0);
      c2d.clearRect(0, 0, cvs.width, cvs.height);
      c2d.save();
      c2d.scale(dpr, dpr);

      const s = fitScale();
      // Bind the layout origin (0,0) to the canvas centre so the graph is
      // dead-centre no matter how wide or tall the section is.
      const ox = W / 2;
      const oy = H / 2;
      c2d.translate(ox, oy);
      c2d.scale(s, s);

      const hover = hoveredRef.current;
      const sel = selectedRef.current;

      const inView = (n: GNode) => {
        const rx = ox + n.x * s;
        const ry = oy + n.y * s;
        return rx > -40 && rx < W + 40 && ry > -40 && ry < H + 40;
      };

      // edges
      c2d.lineCap = "round";
      const maxEdges = (id: string, other: string) =>
        hover === id || sel === id || (hover && other === hover) || (sel && other === sel);
      for (const l of edgeList) {
        if (!inView(l.a) && !inView(l.b)) continue;
        const active = maxEdges(l.a.id, l.b.id);
        if (hover && !active) continue;
        if (sel && !active) continue;
        c2d.strokeStyle = active ? "rgba(144, 180, 240, 0.6)" : LINK_BASE;
        c2d.lineWidth = active ? 1.6 / s : 0.8 / s;
        c2d.beginPath();
        c2d.moveTo(l.a.x, l.a.y);
        c2d.lineTo(l.b.x, l.b.y);
        c2d.stroke();
      }

      // nodes
      for (const n of NODES) {
        if (!inView(n)) continue;
        const isHover = hover === n.id;
        const isSel = sel === n.id;
        if (hover && !isHover && !neighbors.get(hover)?.has(n.id) && !isSel) continue;
        const r = Math.max(2.5, 3 + Math.sqrt(n.d) * 2.2);
        const color = colorForCommunity(n.c);
        const pulse = 0.5 + 0.5 * Math.sin(t / 1400 + n.d * 0.9);
        c2d.beginPath();
        c2d.arc(n.x, n.y, r + (isHover || isSel ? pulse * 1.6 : 0), 0, Math.PI * 2);
        c2d.fillStyle = color;
        c2d.globalAlpha = isHover || isSel ? 0.95 : 0.4 + 0.25 * pulse;
        c2d.fill();
        c2d.globalAlpha = 1;
        c2d.beginPath();
        c2d.arc(n.x, n.y, r + 3.2, 0, Math.PI * 2);
        c2d.strokeStyle = color;
        c2d.globalAlpha = isHover || isSel ? 0.4 : 0.14 + 0.1 * pulse;
        c2d.lineWidth = 1;
        c2d.stroke();
        c2d.globalAlpha = 1;
        if (isHover || isSel) {
          c2d.font = "600 12px ui-monospace, SFMono-Regular, Menlo, monospace";
          c2d.fillStyle = "#eaf1ff";
          c2d.fillText(shortLabel(n.label), n.x + r + 6, n.y + 4);
        }
      }

      // tooltip
      if (hover) {
        const n = byId.get(hover);
        if (n) {
          c2d.font = "11px ui-monospace, Menlo, monospace";
          const label = shortLabel(n.label);
          const short = relativePath(n.file);
          const tw = Math.max(c2d.measureText(label).width, c2d.measureText(short).width) + 24;
          const tx = Math.min(Math.max(n.x - tw / 2, -parent.w / 2), parent.w / 2 - tw);
          const ty = Math.max(n.y - 34, -parent.h / 2 + 4);
          // map into scaled space for the tooltip text (keep readable)
          c2d.setTransform(1, 0, 0, 1, 0, 0);
          const px = ox + tx * s;
          const py = oy + ty * s;
          c2d.fillStyle = "rgba(10, 16, 28, 0.94)";
          c2d.strokeStyle = "rgba(120, 150, 210, 0.35)";
          roundRect(c2d, px, py, tw, 42, 6);
          c2d.fill();
          c2d.stroke();
          c2d.fillStyle = "#e8f0ff";
          c2d.fillText(label, px + 12, py + 17);
          c2d.fillStyle = "rgba(168, 182, 210, 0.85)";
          const sub = short.length > 46 ? "…" + short.slice(-46) : short;
          c2d.fillText(sub, px + 12, py + 31);
          c2d.setTransform(1, 0, 0, 1, 0, 0);
          c2d.scale(s, s);
        }
      }

      c2d.restore();
      raf = requestAnimationFrame(render);
    }

    // simple reset of canvas transform before pick - we keep world coords
    const pick = (px: number, py: number): string | null => {
      const s = fitScale();
      const cvW = cvs.width / dpr;
      const cvH = cvs.height / dpr;
      const ox = cvW / 2;
      const oy = cvH / 2;
      const wx = (px - ox) / s;
      const wy = (py - oy) / s;
      let best: string | null = null;
      let bestDist = 34 / s;
      for (const n of NODES) {
        if (byId.get(n.id) !== n) continue;
        const r = Math.max(2.5, 3 + Math.sqrt(n.d) * 2.2);
        const dx = n.x - wx;
        const dy = n.y - wy;
        const dist = Math.hypot(dx, dy);
        if (dist < r + 6 && dist < bestDist) {
          best = n.id;
          bestDist = dist;
        }
      }
      return best;
    };

    const onMove = (e: MouseEvent) => {
      const r = cvs.getBoundingClientRect();
      const id = pick(e.clientX - r.left, e.clientY - r.top);
      if (id !== hoveredRef.current) setHovered(id);
    };
    const onLeave = () => {
      setHovered(null);
    };
    const onClick = (e: MouseEvent) => {
      const r = cvs.getBoundingClientRect();
      const id = pick(e.clientX - r.left, e.clientY - r.top);
      if (id) setSelected(id);
    };
    cvs.addEventListener("mousemove", onMove);
    cvs.addEventListener("mouseleave", onLeave);
    cvs.addEventListener("click", onClick);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      cvs.removeEventListener("mousemove", onMove);
      cvs.removeEventListener("mouseleave", onLeave);
      cvs.removeEventListener("click", onClick);
    };
  }, [byId, parent]);

  const selectedNode = selected ? (byId.get(selected) ?? null) : null;

  return (
    <div
      ref={wrapRef}
      className="relative h-[560px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[#0d1420] shadow-[var(--shadow-lg)]"
    >
      <canvas ref={canvasRef} data-testid="repo-graph-canvas" className="absolute inset-0" />
      <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-2">
        <p className="text-2xs rounded-full border border-white/10 bg-black/40 px-3 py-1 tracking-[0.16em] text-slate-300 uppercase">
          {NODES.length.toLocaleString()} symbols · {LINKS.length.toLocaleString()} relations
        </p>
      </div>
      <div className="pointer-events-none absolute top-4 right-4 flex gap-2">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="pointer-events-auto rounded-md border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-white/10"
        >
          clear
        </button>
      </div>
      <p className="text-2xs pointer-events-none absolute bottom-4 left-4 text-slate-500">
        hover a node to see its neighbourhood · click a node to focus it
      </p>

      {selectedNode ? (
        <div className="absolute right-4 bottom-14 left-4 rounded-lg border border-white/10 bg-[#0a1320]/95 p-3 shadow-2xl md:right-auto md:left-4 md:w-[420px]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-[11px] text-slate-500">{selectedNode.file}</p>
              <p className="truncate text-sm font-semibold text-[var(--color-canvas-50)]">
                {shortLabel(selectedNode.label)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="shrink-0 rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400 hover:bg-white/10"
            >
              close
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            This is a live node in the shipped graph. The source behind it lives in the repository —
            ask us to walk you through it.
          </p>
        </div>
      ) : null}
    </div>
  );
}
