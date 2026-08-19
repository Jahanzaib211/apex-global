import { prisma } from "@apex/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export type CatalogEntry = {
  id: string;
  kind: "SERVICE" | "PRODUCT" | "CUSTOM";
  name: string;
  description: string | null;
  unitAmount: number | null; // minor units
  currency: string;
  source: "catalog" | "service" | "product";
};

/**
 * The price-module picker for the invoice/quote editors.
 *
 * Union of three sources, normalised to one shape:
 *  - admin-managed PricingItem rows (active only)
 *  - published services with a fixed fee
 *  - published products with a priced (non-custom) plan
 * So the operator's picker and the customer's catalogue page both draw from
 * exactly the same set.
 */
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });
  if (!user.permissions.includes("pricing:read") && !user.permissions.includes("billing:write")) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const cap = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 25), 1), 50);
  const where = q ? { name: { contains: q, mode: "insensitive" as const } } : {};

  const [items, services, products] = await Promise.all([
    prisma.pricingItem.findMany({
      where: { isActive: true, ...where },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: cap,
    }),
    prisma.service.findMany({
      where: { status: "LIVE", ...where },
      orderBy: { order: "asc" },
      take: cap,
    }),
    prisma.saasProduct.findMany({
      where: { status: "LIVE", ...where },
      orderBy: { order: "asc" },
      take: cap,
      include: {
        plans: {
          where: { isCustom: false, priceAmount: { not: null } },
          orderBy: { order: "asc" },
        },
      },
    }),
  ]);

  const entries: CatalogEntry[] = [
    ...items.map<CatalogEntry>((i) => ({
      id: `pi:${i.id}`,
      kind: i.kind,
      name: i.name,
      description: i.description,
      unitAmount: i.defaultUnitAmount,
      currency: i.defaultCurrency,
      source: "catalog",
    })),
    ...services.map<CatalogEntry>((s) => ({
      id: `svc:${s.slug}`,
      kind: "SERVICE" as const,
      name: s.name,
      description: s.tagline,
      // Service fees are whole USD units in the schema; invoices are minor units.
      unitAmount: s.flatFeeAmount * 100,
      currency: s.feeCurrency,
      source: "service",
    })),
    ...products.flatMap<CatalogEntry>((p) =>
      p.plans.slice(0, 1).map((plan) => ({
        id: `prod:${p.slug}:${plan.id}`,
        kind: "PRODUCT" as const,
        name: `${p.name} — ${plan.name}`,
        description: plan.description,
        unitAmount: plan.priceAmount,
        currency: plan.priceCurrency,
        source: "product",
      })),
    ),
  ].slice(0, cap);

  return Response.json({ entries });
}