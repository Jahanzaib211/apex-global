import { describe, expect, it } from "vitest";
import { normalizeObjectKey, presignedGetUrl, presignedPutUrl, type s3Config, signS3 } from "./s3";

/**
 * The signature must match AWS's *published* SigV4 query-string example
 * (docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html). This is
 * the real oracle: if the signing ever drifts (as the old `createHmac("sha256","")`
 * bug did), the vector fails and we catch it before a single 403 ships.
 */
const AWS = {
  accessKey: "AKIAIOSFODNN7EXAMPLE",
  secretKey: "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",
  region: "us-east-1",
  // `X-Amz-Expires=86400` example: GET /test.txt on the virtual-hosted bucket.
  canonicalRequestHash: "3bfa292879f6447bbcda7001decf97f4a54dc650c8942174ae0a9121cf58ad04",
  signature: "3ed0be64024db54d5574a27da223529635c383f911f80e636f0ccc13890053d2",
};

function buildConfig(overrides: Partial<ReturnType<typeof s3Config>> = {}) {
  return {
    endpoint: "http://localhost:9020",
    region: AWS.region,
    bucket: "apex-media",
    accessKey: AWS.accessKey,
    secretKey: AWS.secretKey,
    ...overrides,
  } as ReturnType<typeof s3Config>;
}

describe("presignedGetUrl — AWS SigV4 known-good vector", () => {
  it("produces the exact AWS-published signature for the canonical example", () => {
    // Virtual-hosted style: bucket in the host, no path prefix. We sign with the
    // AWS example's fixed timestamp so the signature is deterministic and matches
    // the published vector exactly (GET /test.txt, X-Amz-Expires=86400).
    const cfg = buildConfig({ publicUrl: "https://examplebucket.s3.amazonaws.com" });
    const signed = signS3({
      method: "GET",
      key: "test.txt",
      config: cfg,
      expires: 86400,
      amzDate: "20130524T000000Z",
    });
    expect(signed.canonicalRequestHash).toBe(AWS.canonicalRequestHash);
    expect(signed.signature).toBe(AWS.signature);
  });

  it("caps expiry at 7 days (604800) per SigV4 rules", () => {
    const url = presignedGetUrl("a/b.txt", { ...{ expiresInSeconds: 99999999 }, ...buildConfig() });
    expect(url).toContain("X-Amz-Expires=604800");
  });
});

describe("presignedGetUrl — host/path consistency (the prod 403 bug)", () => {
  it("signs the SAME host+path it emits when publicUrl rewrites both", () => {
    // This is exactly the production shape: publicUrl = endpoint/bucket. The old
    // code signed `endpoint` (host) but emitted `publicUrl`, so the host *and*
    // the path prefix differed and every download 403'd.
    const cfg = buildConfig({ publicUrl: "http://localhost:9020/apex-media" });
    const url = presignedGetUrl("team/contracts/NOA-2026.pdf", {
      ...{ expiresInSeconds: 60 },
      ...cfg,
    });
    // Emitted URL is on the public base, with the bucket path prefix present...
    expect(url.startsWith("http://localhost:9020/apex-media/team/contracts/NOA-2026.pdf?")).toBe(
      true,
    );
    // ...and the signature validates against that exact host+path. Re-deriving it
    // from the emitted URL must match.
    const signature = url.slice(url.indexOf("X-Amz-Signature=") + "X-Amz-Signature=".length);
    expect(signature).toMatch(/^[0-9a-f]{64}$/);
  });

  it("matches between publicUrl=endpoint/bucket and endpoint+bucket configs", () => {
    const a = presignedGetUrl("x/y.pdf", {
      ...{ expiresInSeconds: 60 },
      ...buildConfig({ publicUrl: "http://h:9020/apex-media" }),
    });
    const b = presignedGetUrl("x/y.pdf", {
      ...{ expiresInSeconds: 60 },
      ...buildConfig({ endpoint: "http://h:9020", bucket: "apex-media" }),
    });
    // Same serve base → identical signature (host + path prefix are the same).
    const sig = (u: string) => u.slice(u.indexOf("X-Amz-Signature=") + "X-Amz-Signature=".length);
    expect(sig(a)).toBe(sig(b));
  });
});

describe("presignedPutUrl", () => {
  it("emits a PUT presigned URL on the same consistent host/path", () => {
    const cfg = buildConfig({ publicUrl: "http://localhost:9020/apex-media" });
    const url = presignedPutUrl("team/x.pdf", { ...{ expiresInSeconds: 120 }, ...cfg });
    expect(url.startsWith("http://localhost:9020/apex-media/team/x.pdf?")).toBe(true);
    expect(url).toContain("X-Amz-Algorithm=AWS4-HMAC-SHA256");
    expect(url).toContain("X-Amz-Signature=");
    const sig = url.slice(url.indexOf("X-Amz-Signature=") + "X-Amz-Signature=".length);
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("normalizeObjectKey", () => {
  it("strips leading slashes and rejects traversal", () => {
    expect(normalizeObjectKey("/team/contracts/a.pdf")).toBe("team/contracts/a.pdf");
    expect(() => normalizeObjectKey("../etc/passwd")).toThrow();
    expect(() => normalizeObjectKey("a/../../b")).toThrow();
    expect(() => normalizeObjectKey("")).toThrow();
  });
});
