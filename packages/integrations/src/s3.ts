import { createHash, createHmac } from "node:crypto";

/**
 * Minimal S3-compatible object storage client.
 *
 * The platform stores client documents and media in MinIO (S3-compatible).
 * Rather than pull in the AWS SDK for the two operations we actually need,
 * this module implements SigV4 presigning directly — the same signature the
 * SDK would produce, with a surface small enough to audit in one file.
 *
 * We only produce GET presigned URLs: the document route hands the browser a
 * short-lived, object-scoped URL instead of streaming bytes through the app
 * server. Uploads go through the same presigner with PUT when the console
 * document flow lands.
 */

export interface S3Config {
  /** e.g. http://localhost:9020 — MinIO listens here. */
  endpoint: string;
  region: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
  /** Optional public base URL to rewrite the presigned host with (tunnels/domains). */
  publicUrl?: string;
}

export function s3Config(env: NodeJS.ProcessEnv = process.env): S3Config {
  const config: S3Config = {
    endpoint: env.S3_ENDPOINT ?? "http://localhost:9020",
    region: env.S3_REGION ?? "us-east-1",
    bucket: env.S3_BUCKET ?? "apex-media",
    accessKey: env.S3_ACCESS_KEY ?? "",
    secretKey: env.S3_SECRET_KEY ?? "",
    publicUrl: env.S3_PUBLIC_URL,
  };

  if (!config.accessKey || !config.secretKey) {
    throw new Error("S3_ACCESS_KEY and S3_SECRET_KEY must be set to presign object URLs");
  }
  return config;
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

/**
 * Plain SHA-256, as SigV4 requires for the canonical-request hash.
 *
 * This was once `createHmac("sha256", "")` — a keyed MAC with an empty key,
 * which produces a completely different digest. Every presigned URL carried an
 * invalid signature and every download 403'd.
 */
function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

function encodeRfc3986(value: string): string {
  return encodeURIComponent(value)
    .replace(/!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

/**
 * Resolve the base the presigned URL is *served* from and the host that is
 * *signed*. These MUST be consistent: a URL that is emitted for one host but
 * carries a signature computed for another (or a path prefix that is signed but
 * not emitted, as happened when `publicUrl` was `endpoint/bucket`) fails SigV4
 * verification and 403s every download. We derive both from a single `serveBase`.
 */
function serveBase(config: S3Config): { base: string; host: string; pathPrefix: string } {
  const base = (
    config.publicUrl ?? `${config.endpoint.replace(/\/$/, "")}/${config.bucket}`
  ).replace(/\/$/, "");
  const u = new URL(base);
  // `pathPrefix` is the path portion of the serve base (empty for a bare host).
  const pathPrefix = u.pathname.replace(/\/$/, "");
  return { base, host: u.host, pathPrefix };
}

/**
 * Compute the SigV4 query-string signature for a presigned request.
 *
 * Returns the canonical request, string-to-sign and final signature so tests can
 * assert against the AWS-published known-good vectors, not just the emitted URL.
 */
export function signS3({
  method,
  key,
  config,
  expires,
  amzDate,
}: {
  method: "GET" | "PUT";
  key: string;
  config: S3Config;
  expires: number;
  /** Injectable for deterministic tests against the AWS-published vector. */
  amzDate?: string;
}): {
  canonicalRequest: string;
  canonicalRequestHash: string;
  stringToSign: string;
  signature: string;
  host: string;
  pathPrefix: string;
} {
  // Every use below must be `effectiveAmzDate`, not `amzDate`. The fallback
  // existed but only fed `dateStamp`, so a call that omitted the parameter —
  // the signature's whole point of being injectable is that it is optional —
  // signed a canonical request containing the literal text "undefined". The
  // presign helpers always pass a date, which is why production never saw it.
  const effectiveAmzDate = amzDate ?? new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = effectiveAmzDate.slice(0, 8);
  const { host, pathPrefix } = serveBase(config);
  const encodedKey = key.split("/").map(encodeRfc3986).join("/");
  const canonicalPath = `${pathPrefix}/${encodedKey}`.replace(/\/{2,}/g, "/");

  const canonicalQuerystring = [
    `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
    `X-Amz-Credential=${encodeRfc3986(`${config.accessKey}/${dateStamp}/${config.region}/s3/aws4_request`)}`,
    `X-Amz-Date=${effectiveAmzDate}`,
    `X-Amz-Expires=${expires}`,
    `X-Amz-SignedHeaders=host`,
  ].join("&");

  const canonicalRequest = [
    method,
    canonicalPath,
    canonicalQuerystring,
    `host:${host}`,
    "",
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    effectiveAmzDate,
    `${dateStamp}/${config.region}/s3/aws4_request`,
    sha256(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${config.secretKey}`, dateStamp);
  const kRegion = hmac(kDate, config.region);
  const kService = hmac(kRegion, "s3");
  const kSigning = hmac(kService, "aws4_request");
  const signature = hmac(kSigning, stringToSign).toString("hex");

  return {
    canonicalRequest,
    canonicalRequestHash: sha256(canonicalRequest),
    stringToSign,
    signature,
    host,
    pathPrefix,
  };
}

/**
 * Presign a GET URL valid for `expiresInSeconds` seconds.
 *
 * Follows the AWS SigV4 query-string protocol, which MinIO supports
 * natively. `X-Amz-SignedHeaders=host` is the smallest legal set. The host and
 * path that are *signed* are the same as the host and path that are *emitted*,
 * so the signature validates regardless of whether `publicUrl` rewrites the host
 * or the path prefix.
 */
export function presignedGetUrl(
  key: string,
  opts: { expiresInSeconds?: number } & S3Config,
): string {
  const config = opts;
  const expires = Math.min(opts.expiresInSeconds ?? 900, 604800);

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const { signature } = signS3({ method: "GET", key, config, expires, amzDate });
  const encodedKey = key.split("/").map(encodeRfc3986).join("/");
  const canonicalQuerystring = [
    `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
    `X-Amz-Credential=${encodeRfc3986(`${config.accessKey}/${amzDate.slice(0, 8)}/${config.region}/s3/aws4_request`)}`,
    `X-Amz-Date=${amzDate}`,
    `X-Amz-Expires=${expires}`,
    `X-Amz-SignedHeaders=host`,
  ].join("&");

  const { base } = serveBase(config);
  return `${base}/${encodedKey}?${canonicalQuerystring}&X-Amz-Signature=${signature}`;
}

/**
 * Presign a PUT URL so a trusted server can upload an object directly to storage
 * (used by the console document-upload flow, which PUTs bytes server-side to
 * avoid MinIO CORS). Same SigV4 construction as the GET variant.
 */
export function presignedPutUrl(
  key: string,
  opts: { expiresInSeconds?: number } & S3Config,
): string {
  const config = opts;
  const expires = Math.min(opts.expiresInSeconds ?? 900, 604800);

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const { signature } = signS3({ method: "PUT", key, config, expires, amzDate });
  const encodedKey = key.split("/").map(encodeRfc3986).join("/");
  const canonicalQuerystring = [
    `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
    `X-Amz-Credential=${encodeRfc3986(`${config.accessKey}/${amzDate.slice(0, 8)}/${config.region}/s3/aws4_request`)}`,
    `X-Amz-Date=${amzDate}`,
    `X-Amz-Expires=${expires}`,
    `X-Amz-SignedHeaders=host`,
  ].join("&");

  const { base } = serveBase(config);
  return `${base}/${encodedKey}?${canonicalQuerystring}&X-Amz-Signature=${signature}`;
}

/** Sanitise a client-supplied key so it stays inside the bucket. */
export function normalizeObjectKey(key: string): string {
  const cleaned = key.replace(/^\/+/, "");
  if (
    !cleaned ||
    cleaned.length > 1024 ||
    (cleaned.includes("..") && /(^|\/)\.\.(\/|$)/.test(cleaned))
  ) {
    throw new Error("Invalid object key");
  }
  return cleaned;
}
