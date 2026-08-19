/**
 * Type declarations for `@juspay-tech/react-hyper-js`.
 *
 * The package ships a UMD/ESM bundle with no `.d.ts` of its own (unlike its
 * sibling `@juspay-tech/hyper-js`, which does). These declarations cover only
 * the surface the portal checkout uses; they are deliberately narrow rather
 * than a speculative full typing of the library.
 *
 * Shapes verified against `node_modules/@juspay-tech/react-hyper-js/dist/index.mjs`
 * at v2.3.0 — `HyperElements` provides both the hyper and widgets contexts,
 * `UnifiedCheckout` is an alias of the payment element, and `useHyper` /
 * `useWidgets` read those two contexts.
 */
declare module "@juspay-tech/react-hyper-js" {
  import type { ReactNode } from "react";
  import type { HyperInstance } from "@juspay-tech/hyper-js";

  export interface HyperElementsOptions {
    clientSecret: string;
    appearance?: Record<string, unknown>;
    locale?: string;
    loader?: "auto" | "always" | "never";
    fonts?: unknown[];
  }

  export function HyperElements(props: {
    hyper: Promise<HyperInstance> | HyperInstance;
    options: HyperElementsOptions;
    children?: ReactNode;
  }): JSX.Element;

  export function UnifiedCheckout(props: {
    id?: string;
    options?: Record<string, unknown>;
    onReady?: (event: unknown) => void;
    onChange?: (event: unknown) => void;
    onFocus?: (event: unknown) => void;
    onBlur?: (event: unknown) => void;
    onClick?: (event: unknown) => void;
  }): JSX.Element;

  /** The widgets/elements handle that `confirmPayment` needs. */
  export interface Widgets {
    getElement(componentName: string): unknown;
    update(options: object): void;
    fetchUpdates(): Promise<object>;
    create(componentType: string, options: object): unknown;
  }

  export interface HyperContext {
    clientSecret: string;
    confirmPayment(params: {
      widgets?: Widgets;
      elements?: Widgets;
      confirmParams: { return_url?: string };
      redirect?: "always" | "if_required";
    }): Promise<{
      status?: string;
      error?: { message?: string; type?: string };
      [key: string]: unknown;
    }>;
    retrievePaymentIntent(paymentIntentId: string): Promise<unknown>;
  }

  export function useHyper(): HyperContext;
  export function useWidgets(): Widgets;
}
