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

/**
 * Branding for a hosted payment link. Hyperswitch renders the link's checkout
 * page itself, so these values are the only control we have over how it looks —
 * they are the link-flow equivalent of the `appearance` block the embedded SDK
 * takes. Keep them in step with `packages/ui/src/styles/tokens.css`.
 */
export interface PaymentLinkBranding {
  /** Name shown as the payee. Defaults to the Hyperswitch merchant name, which is not customer-facing copy. */
  merchantName?: string;
  /** Absolute HTTPS URL — a relative path renders broken on the hosted page. */
  logoUrl?: string;
  /** Primary/CTA colour. Apex navy. */
  themeColor?: string;
  /** Seconds until the link stops accepting payment. */
  expiresInSeconds?: number;
}

export interface CreatePaymentLinkInput extends CreatePaymentInput {
  branding?: PaymentLinkBranding;
}

export interface HyperswitchPaymentLink {
  paymentId: string;
  paymentLinkId: string;
  /** The URL to send the customer to. */
  url: string;
  /** Present when the merchant has secure links enabled; prefer it when set. */
  secureUrl?: string;
  amount: number;
  currency: string;
  status: HyperswitchPayment["status"];
}

/** A decoded outgoing webhook. See `parseWebhookEvent`. */
export interface HyperswitchWebhookEvent {
  eventId?: string;
  /** e.g. "payment_succeeded", "payment_failed", "payment_processing". */
  eventType?: string;
  merchantId?: string;
  paymentId?: string;
  status?: HyperswitchPayment["status"];
  amount?: number;
  currency?: string;
  metadata?: Record<string, string>;
  errorMessage?: string;
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
      // UPPERCASE, not lowercase. Hyperswitch deserialises currency into a Rust
      // enum whose variants are `USD`, `EUR`, … and rejects anything else with
      // 400 IR_06 "unknown variant `usd`". Lowercasing here (a Stripe habit —
      // Stripe accepts either) failed every single payment.
      currency: input.currency.toUpperCase(),
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
      routing: straightThroughRouting(this.cfg.routing),
    };

    const raw = await this.request<RawPayment>("POST", "/payments", body, input.idempotencyKey);
    return mapPayment(raw);
  }

  /**
   * Create a payment with a Hyperswitch-hosted, Apex-branded checkout link.
   *
   * Used for invoices sent by email, where the customer never signs into the
   * portal and so cannot reach the embedded checkout. The link carries the same
   * `metadata.invoiceId` as a portal payment, which is what lets the existing
   * webhook handler reconcile both flows through one code path.
   */
  async createPaymentLink(input: CreatePaymentLinkInput): Promise<HyperswitchPaymentLink> {
    if (!this.cfg.profileId) {
      throw new HyperswitchError("Hyperswitch profileId is not configured", 503);
    }

    const branding = input.branding;
    const raw = await this.request<RawPayment>(
      "POST",
      "/payments",
      {
        amount: input.amount,
        // Uppercase — see the note in createPayment.
        currency: input.currency.toUpperCase(),
        profile_id: this.cfg.profileId,
        customer: { email: input.customerEmail, name: input.customerName },
        description: input.description,
        metadata: input.metadata ?? {},
        return_url: input.returnUrl,
        // Asking for a link is what makes Hyperswitch render and host the
        // checkout page; without it the response carries only a client_secret.
        payment_link: true,
        payment_link_config: branding
          ? {
              theme: branding.themeColor,
              logo: branding.logoUrl,
              seller_name: branding.merchantName,
            }
          : undefined,
        // The link must outlive the email that carries it. Hyperswitch defaults
        // to 15 minutes, which would expire before most customers open it.
        session_expiry: branding?.expiresInSeconds ?? 7 * 24 * 60 * 60,
        routing: straightThroughRouting(this.cfg.routing),
      },
      input.idempotencyKey,
    );

    const link = raw.payment_link;
    if (!link?.link) {
      throw new HyperswitchError(
        "Hyperswitch did not return a payment link — check that payment links are enabled on the profile",
        502,
        raw,
      );
    }

    return {
      paymentId: raw.payment_id ?? "",
      paymentLinkId: link.payment_link_id ?? "",
      url: link.link,
      secureUrl: link.secure_link ?? undefined,
      amount: raw.amount ?? input.amount,
      currency: (raw.currency ?? input.currency).toUpperCase(),
      status: (raw.status as HyperswitchPayment["status"]) ?? "requires_payment_method",
    };
  }

  /** Fetch a payment's current state. Used by the webhook handler for reconciliation. */
  async retrievePayment(paymentId: string): Promise<HyperswitchPayment> {
    const raw = await this.request<RawPayment>("GET", `/payments/${encodeURIComponent(paymentId)}`);
    return mapPayment(raw);
  }

  /**
   * Confirm a payment server-side after the customer completes the 3DS flow.
   * The payment-id and client-secret are passed back by the browser on return.
   */
  async confirmPayment(paymentId: string, clientSecret: string): Promise<HyperswitchPayment> {
    const raw = await this.request<RawPayment>(
      "POST",
      `/payments/${encodeURIComponent(paymentId)}/confirm`,
      {
        client_secret: clientSecret,
      },
    );
    return mapPayment(raw);
  }

  /**
   * Verify a webhook signature.
   *
   * Hyperswitch sends `x-webhook-signature-512`: a bare hex **HMAC-SHA512** of
   * the raw request body, keyed by the **business profile's**
   * `payment_response_hash_key`. Confirmed by capturing live webhooks from
   * `hyperswitch-router:nightly-standalone` on 2026-08-17 and reproducing the
   * digest — see `docs/hyperswitch-provisioning.md`.
   *
   * This previously implemented Stripe's scheme instead (SHA-256 over
   * `<timestamp>.<body>`, parsed out of a `t=…,v1=…` header). Nothing about
   * that matched, so every webhook was rejected with 401 and no invoice could
   * ever settle.
   *
   * Two consequences of the real format worth knowing:
   *
   *  - The key is the *profile's* hash key, not the merchant's, and not a
   *    secret you invent. Paste the profile value into the console.
   *  - There is no timestamp in the signature, so this cannot enforce
   *    freshness. Replay protection comes from reconciliation being idempotent
   *    (re-applying a settled status is a no-op), not from the signature.
   *    Rejecting old payloads here would break Hyperswitch's own retries, which
   *    resend the original body unchanged.
   */
  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
    if (!this.cfg.webhookSecret) return false;
    if (!signatureHeader) return false;

    const received = signatureHeader.trim();
    if (!/^[a-f0-9]+$/i.test(received)) return false;

    const expected = createHmac("sha512", this.cfg.webhookSecret).update(rawBody).digest("hex");

    try {
      const a = Buffer.from(expected, "hex");
      const b = Buffer.from(received, "hex");
      // timingSafeEqual throws on a length mismatch; check first so a wrong-length
      // signature is a clean `false` rather than an exception.
      if (a.length !== b.length) return false;
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  /** Connectivity check used by the console "Test connection" button. */
  async testConnection(): Promise<{ ok: boolean; detail: string }> {
    try {
      // `/payments/list` is merchant-scoped, so it exercises the same key the
      // payment flow uses and returns 200 even with no payments yet. (The
      // former check hit `GET /accounts`, which is admin-scoped and answers
      // 405 on this router build — it could never have succeeded.)
      await this.request<unknown>("GET", "/payments/list?limit=1");
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
      // Hyperswitch authenticates on a bare `api-key` header. This previously
      // sent `Authorization: api-key=<key>`, which the router does not read at
      // all — every call came back 401 IR_01 regardless of the credential.
      // Verified against the live router on 2026-08-17.
      "api-key": this.cfg.apiKey,
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

/**
 * Build a straight-through routing rule.
 *
 * Hyperswitch expects a tagged object — `{ type: "priority", data: [{connector}] }`
 * — not a bare array. Sending an array of `{type, connector}` pairs (which is
 * what this used to do) is rejected with 400 IR_06 "Invalid straight through
 * routing rules format", so no payment could be created while a routing
 * preference was configured.
 *
 * Returns undefined when no preference is set, which lets the merchant's own
 * default routing apply.
 */
function straightThroughRouting(routing?: string[]) {
  if (!routing || routing.length === 0) return undefined;
  return {
    type: "priority",
    data: routing.map((connector) => ({ connector })),
  };
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

/**
 * The router's wire format. Hyperswitch speaks snake_case and names the payment
 * id `payment_id`, so the response cannot be handed to callers as-is: every
 * consumer of `HyperswitchPayment` reads `.id`, `.clientSecret` and
 * `.nextAction`, all of which would be `undefined` on a raw body. `mapPayment`
 * is the single place that translation happens.
 */
interface RawPayment {
  payment_id?: string;
  status?: string;
  amount?: number;
  currency?: string;
  client_secret?: string;
  error_message?: string;
  metadata?: Record<string, string>;
  created?: string;
  next_action?: {
    type?: string;
    redirect_to_url?: string;
  };
  payment_link?: {
    link?: string;
    payment_link_id?: string;
    secure_link?: string | null;
  };
}

function mapPayment(raw: RawPayment): HyperswitchPayment {
  return {
    id: raw.payment_id ?? "",
    status: (raw.status as HyperswitchPayment["status"]) ?? "requires_payment_method",
    amount: raw.amount ?? 0,
    // Callers compare against invoice currency, which is stored uppercase.
    currency: (raw.currency ?? "").toUpperCase(),
    clientSecret: raw.client_secret,
    // A redirect is only meaningful when the router actually asked for one;
    // `next_action` is present with other shapes (e.g. display_qr_code) too.
    nextAction: raw.next_action?.redirect_to_url
      ? { redirectUrl: raw.next_action.redirect_to_url }
      : undefined,
    errorMessage: raw.error_message,
    metadata: raw.metadata,
    createdAt: raw.created ?? new Date().toISOString(),
  };
}

/**
 * Decode an outgoing webhook body into the fields reconciliation needs.
 *
 * The envelope is *not* the shape a Stripe-style integration expects. A real
 * payload looks like:
 *
 * ```json
 * { "merchant_id": "...", "event_id": "evt_...", "event_type": "payment_failed",
 *   "content": { "type": "payment_details",
 *                "object": { "payment_id": "pay_...", "status": "failed",
 *                            "metadata": { "invoiceId": "..." } } } }
 * ```
 *
 * Reading `type` / `data.id` off the top level — as this integration used to —
 * yields `undefined` for every field, so nothing reconciled even when a webhook
 * was accepted. Keeping the digging in one tested function stops that drift
 * from recurring.
 */
export function parseWebhookEvent(rawBody: string): HyperswitchWebhookEvent | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;

  const envelope = parsed as {
    event_id?: string;
    event_type?: string;
    merchant_id?: string;
    content?: { object?: RawPayment };
  };
  const object = envelope.content?.object ?? {};

  return {
    eventId: envelope.event_id,
    eventType: envelope.event_type,
    merchantId: envelope.merchant_id,
    paymentId: object.payment_id,
    status: object.status as HyperswitchPayment["status"] | undefined,
    amount: object.amount,
    currency: object.currency?.toUpperCase(),
    metadata: object.metadata,
    errorMessage: object.error_message,
  };
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
