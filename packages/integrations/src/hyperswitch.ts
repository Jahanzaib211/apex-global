import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Hyperswitch payment gateway client.
 *
 * Hyperswitch (https://hyperswitch.io) is an open-source payments orchestrator
 * that lets the platform route a single payment through multiple processors
 * (Stripe, Adyen, Checkout, etc.) and switch between them without an integration
 * change. We expose three operations to the rest of the platform:
 *
 *   - createPayment: start a payment against the configured routing rule.
 *   - retrievePayment: fetch the current state — used by the webhook handler
 *     to reconcile before deciding what to do.
 *   - verifyWebhookSignature: confirm the webhook actually came from
 *     Hyperswitch before we trust its payload.
 *
 * The SDK runs as a thin wrapper around the Hyperswitch REST API. We do not
 * pull in hyperswitch-node, because the surface we use is small and a typed
 * dependency we own is easier to audit than a generated client.
 */

export interface HyperswitchConfig {
  /** Hyperswitch API base, e.g. https://sandbox.hyperswitch.io or https://api.hyperswitch.io */
  baseUrl: string;
  /** Publishable key (sent to the browser to tokenise cards). */
  publishableKey: string;
  /** Secret API key (server-side only). */
  apiKey: string;
  /** Profile id — chosen when the merchant is onboarded to Hyperswitch. */
  profileId: string;
  /** Optional webhook signing secret. Required to verify webhook payloads. */
  webhookSecret?: string;
  /** Connector priority list, e.g. ["stripe","adyen","checkout"]. */
  routing?: string[];
}

export interface CreatePaymentInput {
  amount: number; // minor units (cents)
  currency: string; // ISO 4217, e.g. "USD"
  customerEmail: string;
  customerName?: string;
  description: string;
  metadata?: Record<string, string>;
  /** Return URL after the 3DS / redirect flow — must be HTTPS in production. */
  returnUrl: string;
  /** Idempotency key — same key returns the same payment without double-charging. */
  idempotencyKey: string;
}

export interface HyperswitchPayment {
  id: string;
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "processing"
    | "succeeded"
    | "failed"
    | "cancelled";
  amount: number;
  currency: string;
  clientSecret?: string;
  nextAction?: { redirectUrl?: string };
  errorMessage?: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

export class HyperswitchError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "HyperswitchError";
  }
}

export class HyperswitchClient {
  constructor(private readonly cfg: HyperswitchConfig) {
    // Only the truly universal credentials are required to construct a client.
    // `profileId` is deferred to the operations that need it (createPayment) so
    // that the webhook route — which only verifies signatures — can build a
    // client from a partially configured integration without a 500.
    if (!cfg.baseUrl) throw new Error("Hyperswitch baseUrl is required");
    if (!cfg.apiKey) throw new Error("Hyperswitch apiKey is required");
  }

  /** Initiate a payment. Hyperswitch returns a client_secret the browser uses to confirm. */
  async createPayment(input: CreatePaymentInput): Promise<HyperswitchPayment> {
    // `profileId` is required only by operations that create a routed payment.
    // Surfacing it as a 503 (not a thrown 500) keeps the route's error contract
    // intact when the merchant profile has not been provisioned yet.
    if (!this.cfg.profileId) {
      throw new HyperswitchError("Hyperswitch profileId is not configured", 503);
    }

    const body = {
      amount: input.amount,
      currency: input.currency.toLowerCase(),
      profile_id: this.cfg.profileId,
      customer: {
        email: input.customerEmail,
        name: input.customerName,
      },
      description: input.description,
      metadata: input.metadata ?? {},
      return_url: input.returnUrl,
      // Connector routing: when omitted, Hyperswitch uses the merchant's
      // configured default. When provided, it overrides for this payment.
      routing: this.cfg.routing
        ? this.cfg.routing.map((connector) => ({ type: "priority", connector }))
        : undefined,
    };

    return this.request<HyperswitchPayment>("POST", "/payments", body, input.idempotencyKey);
  }

  /** Fetch a payment's current state. Used by the webhook handler for reconciliation. */
  async retrievePayment(paymentId: string): Promise<HyperswitchPayment> {
    return this.request<HyperswitchPayment>("GET", `/payments/${encodeURIComponent(paymentId)}`);
  }

  /**
   * Confirm a payment server-side after the customer completes the 3DS flow.
   * The payment-id and client-secret are passed back by the browser on return.
   */
  async confirmPayment(paymentId: string, clientSecret: string): Promise<HyperswitchPayment> {
    return this.request<HyperswitchPayment>(
      "POST",
      `/payments/${encodeURIComponent(paymentId)}/confirm`,
      {
        client_secret: clientSecret,
      },
    );
  }

  /**
   * Verify a webhook signature.
   *
   * Hyperswitch signs the payload with HMAC-SHA256 over the raw body, using
   * the webhook secret as the key. The signature arrives in the
   * `x-webhook-signature` header in the format `t=<unix-ts>,v1=<hex-sig>`.
   * We recompute the HMAC over `<unix-ts>.<raw-body>` and compare in constant
   * time to defeat timing analysis.
   */
  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
    if (!this.cfg.webhookSecret) return false;
    if (!signatureHeader) return false;

    const parts = Object.fromEntries(
      signatureHeader.split(",").map((p) => {
        const [k, v] = p.split("=");
        return [k?.trim(), v?.trim()];
      }),
    );
    const ts = parts.t;
    const sig = parts.v1;
    if (!ts || !sig) return false;

    // Tolerate a small clock skew; refuse anything older than 5 minutes.
    const tsNum = Number(ts);
    if (!Number.isFinite(tsNum)) return false;
    const ageMs = Date.now() - tsNum * 1000;
    if (ageMs > 5 * 60 * 1000) return false;

    const expected = createHmac("sha256", this.cfg.webhookSecret)
      .update(`${ts}.${rawBody}`)
      .digest("hex");

    try {
      return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
    } catch {
      return false;
    }
  }

  /** Connectivity check used by the console "Test connection" button. */
  async testConnection(): Promise<{ ok: boolean; detail: string }> {
    try {
      // The `/accounts` endpoint requires no parameters and is the cheapest
      // way to confirm the credential is live and the profile is reachable.
      await this.request<unknown>("GET", "/accounts");
      return { ok: true, detail: `Connected to Hyperswitch at ${this.cfg.baseUrl}` };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return { ok: false, detail: msg };
    }
  }

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    body?: unknown,
    idempotencyKey?: string,
  ): Promise<T> {
    const headers: Record<string, string> = {
      Authorization: `api-key=${this.cfg.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

    const res = await fetch(`${this.cfg.baseUrl.replace(/\/$/, "")}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15_000),
    });

    const text = await res.text();
    const parsed = text ? safeJson(text) : undefined;

    if (!res.ok) {
      throw new HyperswitchError(
        `Hyperswitch ${method} ${path} → ${res.status}: ${text.slice(0, 200)}`,
        res.status,
        parsed,
      );
    }
    return parsed as T;
  }
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

/** Build a client from a stored `PartnerIntegration` config blob. */
export function clientFromConfig(
  cfg: HyperswitchConfig & { enabled?: boolean },
): HyperswitchClient {
  return new HyperswitchClient({
    baseUrl: cfg.baseUrl,
    publishableKey: cfg.publishableKey,
    apiKey: cfg.apiKey,
    profileId: cfg.profileId,
    webhookSecret: cfg.webhookSecret,
    routing: cfg.routing,
  });
}
