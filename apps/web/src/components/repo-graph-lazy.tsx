"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Loads the repository graph only when a visitor gets near it.
 *
 * `repo-graph.tsx` statically imports `repo-graph.json` — 787 nodes and 1,770
 * links, about 290 KB of JSON — which webpack folds into the initial client
 * bundle. Every visitor to the home page downloaded the entire symbol graph
 * before the page was interactive, whether or not they ever scrolled to the
 * decorative canvas that draws it. That is what put the page over the 180 KB
 * script budget in `.lighthouserc.json`.
 *
 * Splitting it out costs nothing visually: the placeholder is the same height
 * as the real canvas, so nothing shifts when the graph arrives, and the
 * IntersectionObserver has enough margin to start fetching before the section
 * is on screen.
 */
const RepoGraphImpl = dynamic(() => import("./repo-graph").then((m) => m.RepoGraph), {
  // The graph paints to a canvas from measured element size; there is nothing
  // useful to render on the server.
  ssr: false,
  loading: () => <GraphPlaceholder />,
});

/** Same box as the real graph, so its arrival shifts nothing. */
function GraphPlaceholder() {
  return (
    <div
      aria-hidden
      className="relative h-[560px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[#0d1420] shadow-[var(--shadow-lg)]"
    />
  );
}

export function RepoGraphLazy() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // No observer (very old browser, or a test environment without one) —
      // load it rather than leaving an empty box forever.
      setNear(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      // Start fetching a screen early so the canvas is usually already there
      // by the time the section scrolls into view.
      { rootMargin: "800px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{near ? <RepoGraphImpl /> : <GraphPlaceholder />}</div>;
}
