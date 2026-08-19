"use client";

import { HyperElements, UnifiedCheckout, useHyper, useWidgets } from "@juspay-tech/react-hyper-js";
import type { HyperInstance } from "@juspay-tech/hyper-js";
import { useEffect, useMemo, useState } from "react";

/**
 * Self-hosted HyperLoader injector.
 *
 * The stock `loadHyper` from `@juspay-tech/hyper-js` would fetch the loader
 * script from `https://beta.hyperswitch.io/v1/HyperLoader.js` — a CDN that
 * (a) hardcodes the widget app on the same origin and (b) applies a strict
 * CSP that blocks any custom backend on our own domain. Both make the
 * self-hosted router unreachable from the browser.
 *
 * We ship a patched loader in `apps/web/public/hyperswitch-sdk/v1/` whose only
 * change is the widget app base URL, and inject it from the same origin as
 * the checkout page. The loader exposes `window.Hyper` — the same factory
 * `loadHyper` would return — which we invoke manually with the same
 * arguments.
 */
type HyperFactory = (
  keys: { publishableKey: string; profileId: string },
  options: { customBackendUrl: string; env: "SANDBOX" | "PROD" },
) => Promise<HyperInstance>;

function getHyper(): HyperFactory | undefined {
  return (window as unknown as { Hyper?: HyperFactory }).Hyper;
}

function loadSelfHostedHyper(): Promise<HyperFactory> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[data-apex-hyper-loader="1"]',
    ) as HTMLScriptElement | null;
    if (existing) {
      const h = getHyper();
      if (h) resolve(h);
      else existing.addEventListener("load", () => resolve(getHyper()!), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "/hyperswitch-sdk/v1/HyperLoader.js";
    script.dataset.apexHyperLoader = "1";
    script.onload = () => {
      const h = getHyper();
      if (h) resolve(h);
      else reject(new Error("HyperLoader loaded but window.Hyper unavailable"));
    };
    script.onerror = () => reject(new Error("Failed to load HyperLoader.js"));
    document.body.appendChild(script);
  });
}

/**
 * Apex-branded Hyperswitch checkout.
 *
 * The card fields render inside Hyperswitch's own iframes, so no card data ever
 * touches an Apex origin and the portal stays in PCI SAQ-A scope. What we
 * control is the frame around them and the `appearance` object passed in.
 *
 * Because the fields are cross-origin, our CSS custom properties cannot cascade
 * into them — `appearance` only accepts literal colour values. We therefore read
 * the *computed* values of the portal's tokens at mount and forward those, which
 * keeps the widget in step with the light/dark theme without duplicating the
 * palette here. See `packages/ui/src/styles/tokens.css`.
 */

interface Props {
  clientSecret: string;
  publishableKey: string;
  profileId: string;
  baseUrl: string;
  returnUrl: string;
  /** Test-mode credentials point the SDK at the sandbox environment. */
  isSandbox: boolean;
  amountLabel: string;
}

/** Read a CSS custom property off the document root, resolved to a real value. */
function token(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function Checkout(props: Props) {
  const [appearance, setAppearance] = useState<Record<string, unknown> | null>(null);

  // Resolve tokens after mount: `getComputedStyle` needs a real document, and
  // reading during render would break SSR.
  useEffect(() => {
    setAppearance({
      theme: "default",
      variables: {
        colorPrimary: token("--accent", "#FAB319"),
        colorBackground: token("--bg-raised", "#FFFFFF"),
        colorText: token("--ink-primary", "#171929"),
        colorTextSecondary: token("--ink-secondary", "#4E5155"),
        colorDanger: token("--color-danger-500", "#b4342f"),
        borderRadius: token("--radius-md", "8px"),
        fontFamily: token("--font-sans", "system-ui, sans-serif"),
      },
    });
  }, []);

  const hyper = useMemo(
    () =>
      loadSelfHostedHyper().then((Hyper) => {
        const result = Hyper(
          { publishableKey: props.publishableKey, profileId: props.profileId },
          {
            // Point the SDK at our own router rather than Hyperswitch's cloud.
            customBackendUrl: props.baseUrl,
            env: props.isSandbox ? "SANDBOX" : "PROD",
          },
        );
        void result;
        return result;
      }),
    [props.publishableKey, props.profileId, props.baseUrl, props.isSandbox],
  );

  // Hold the widget back until the palette is resolved. Mounting with the
  // fallback palette first would repaint the iframe a moment later, which reads
  // as a flicker on the most trust-sensitive screen in the product.
  if (!appearance) {
    return <div className="h-64 animate-pulse rounded-[var(--radius-md)] bg-[var(--bg-sunken)]" />;
  }

  return (
    <HyperElements hyper={hyper} options={{ clientSecret: props.clientSecret, appearance }}>
      <CheckoutForm returnUrl={props.returnUrl} amountLabel={props.amountLabel} />
    </HyperElements>
  );
}

function CheckoutForm({ returnUrl, amountLabel }: { returnUrl: string; amountLabel: string }) {
  const hyper = useHyper();
  const widgets = useWidgets();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const result = await hyper.confirmPayment({
        widgets,
        confirmParams: { return_url: returnUrl },
      });

      // A successful redirect flow never returns — the browser has already left
      // for the 3DS page. Reaching here means either an inline decline or a
      // payment that completed without a redirect, both of which the return
      // route reconciles. Surface the error and let the customer retry.
      if (result?.error?.message) {
        setError(result.error.message);
      } else {
        window.location.assign(returnUrl);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We could not complete the payment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <UnifiedCheckout
        id="apex-invoice-checkout"
        onReady={() => {
          console.log("[hyperswitch] onReady fired");
          (window as unknown as { __hyperswitchReady?: boolean }).__hyperswitchReady = true;
          setReady(true);
        }}
      />

      {error ? (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] border border-[var(--color-danger-500)] px-4 py-3 text-sm text-[var(--color-danger-500)]"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || !ready}
        className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-medium text-[var(--ink-on-accent)] disabled:opacity-60"
      >
        {submitting ? "Processing…" : `Pay ${amountLabel}`}
      </button>

      <p className="text-2xs text-[var(--ink-muted)]">
        Card details are entered directly into our payment provider and never reach Apex servers.
      </p>
    </form>
  );
}
