/**
 * Lightweight structured logger. Writes JSON to stdout in production for log
 * aggregators (PM2 / CloudWatch / Loki), pretty-prints in dev.
 *
 * Levels: debug < info < warn < error
 */

type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const isProd = process.env.NODE_ENV === "production";
const SERVICE = "apex-outsourcing";

function emit(level: Level, msg: string, fields: Fields = {}): void {
  const record = {
    ts: new Date().toISOString(),
    level,
    service: SERVICE,
    msg,
    ...fields,
  };
  if (isProd) {
    // NDJSON to stdout — easy to grep, parse, ship to a log sink.
    process.stdout.write(JSON.stringify(record) + "\n");
  } else {
    const tag = level.toUpperCase().padEnd(5);
    // eslint-disable-next-line no-console
    console.log(`[${tag}] ${msg}`, Object.keys(fields).length ? fields : "");
  }
}

export const logger = {
  debug: (msg: string, fields?: Fields) => emit("debug", msg, fields),
  info: (msg: string, fields?: Fields) => emit("info", msg, fields),
  warn: (msg: string, fields?: Fields) => emit("warn", msg, fields),
  error: (msg: string, fields?: Fields) => emit("error", msg, fields),
  child(bindings: Fields) {
    return {
      debug: (msg: string, fields?: Fields) => emit("debug", msg, { ...bindings, ...fields }),
      info: (msg: string, fields?: Fields) => emit("info", msg, { ...bindings, ...fields }),
      warn: (msg: string, fields?: Fields) => emit("warn", msg, { ...bindings, ...fields }),
      error: (msg: string, fields?: Fields) => emit("error", msg, { ...bindings, ...fields }),
    };
  },
};
