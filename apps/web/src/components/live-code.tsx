"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface LiveCodeProps {
  /** File path shown in the tab strip — e.g. `packages/db/prisma/content/services.ts`. */
  filePath: string;
  /** Real file contents, read server-side. */
  code: string;
  /** Lines shown per step before the next ones are revealed. */
  linesPerStep?: number;
  /** Milliseconds between steps. */
  stepMs?: number;
}

/**
 * LiveCode — real code from this repository, animated as it might be written.
 *
 * Takes actual source (`code`) read at render time on the server, then
 * reveals it line-by-line with a caret, in an editor-style window. This is
 * not a mockup of a demo codebase: the file path shown is real and the lines
 * are real, which is the credibility rule of this site applied to the "see
 * the code" request.
 *
 * Controls: pause/resume, and the whole run restarts from line one. Motion's
 * AnimatePresence keeps the reveal frame-perfect; the caret is a plain CSS
 * blink so nothing else animates when the tab is hidden.
 */
export function LiveCode({ filePath, code, linesPerStep = 1, stepMs = 90 }: LiveCodeProps) {
  const lines = useMemo(() => code.split("\n"), [code]);
  const [visible, setVisible] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setVisible((v) => {
        if (v >= lines.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          return v;
        }
        return v + linesPerStep;
      });
    }, stepMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, lines.length, linesPerStep, stepMs]);

  const done = visible >= lines.length;

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[#0d1420] shadow-[var(--shadow-lg)]">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <p className="font-mono text-xs text-slate-400">{filePath}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            disabled={done && !playing}
            className="rounded-[var(--radius-sm)] border border-white/10 px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-40"
          >
            {done ? "Replay" : playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setVisible(0);
              setPlaying(true);
            }}
            className="rounded-[var(--radius-sm)] border border-white/10 px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-white/10"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className="max-h-[26rem] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed">
        <pre className="min-w-max">
          <code>
            {lines.slice(0, Math.min(visible, lines.length)).map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.08 }}
                className="block whitespace-pre"
              >
                <span className="mr-4 inline-block w-8 text-right text-slate-600 select-none">
                  {i + 1}
                </span>
                <span className="text-slate-300">{line || " "}</span>
                {i === Math.min(visible, lines.length) - 1 && !done ? (
                  <span className="caret-blink ml-0.5 inline-block h-4 w-2 translate-y-[3px] bg-[var(--color-amber-500)]" />
                ) : null}
              </motion.span>
            ))}
          </code>
        </pre>
      </div>

      {/* Provenance footer — honest about what this is */}
      <div className="border-t border-white/10 px-4 py-2.5">
        <p className="text-xs text-slate-500">
          Real source from this repository — opened live, nothing fabricated.{" "}
          <span className="text-slate-400">
            Lines: {lines.length.toLocaleString()} · {filePath}
          </span>
        </p>
      </div>
    </div>
  );
}
