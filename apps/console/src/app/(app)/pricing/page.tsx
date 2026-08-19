import { prisma, type PricingItemKind } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const KINDS: PricingItemKind[] = ["SERVICE", "PRODUCT", "CUSTOM"];
const KIND_LABELS: Record<PricingItemKind, string> = {
  SERVICE: "Service",
  PRODUCT: "Product",
  CUSTOM: "Custom",
};

export default async function PricingPage() {
  await requirePermission("pricing:read");
  const items = await prisma.pricingItem.findMany({ orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }] });

  async function saveItem(formData: FormData) {
    "use server";
    const actor = await requirePermission("pricing:write");
    const intent = String(formData.get("intent") ?? "update");
    const id = String(formData.get("id") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim().toLowerCase().replace(/\s+/g, "-");
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim() || null;
    const kind = (String(formData.get("kind") ?? "CUSTOM") as PricingItemKind) || "CUSTOM";
    const defaultCurrency = (String(formData.get("defaultCurrency") ?? "USD").trim() || "USD").toUpperCase();
    const rawAmount = String(formData.get("defaultUnitAmount") ?? "").trim();
    const defaultUnitAmount = rawAmount ? Math.round(Number(rawAmount) * 100) : null;
    const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

    if (intent === "deactivate" && id) {
      await prisma.pricingItem.update({ where: { id }, data: { isActive: false } });
      await audit({
        actor,
        action: "pricing.item_deactivated",
        entityType: "PricingItem",
        entityId: id,
        summary: `Deactivated price module ${slug || id}`,
      });
      redirect("/pricing");
    }
    if (intent === "activate" && id) {
      await prisma.pricingItem.update({ where: { id }, data: { isActive: true } });
      await audit({
        actor,
        action: "pricing.item_activated",
        entityType: "PricingItem",
        entityId: id,
        summary: `Activated price module ${slug || id}`,
      });
      redirect("/pricing");
    }
    if (!slug || !name) redirect("/pricing?error=missing-fields");

    if (id) {
      const before = await prisma.pricingItem.findUnique({ where: { id } });
      if (!before) redirect("/pricing?error=not-found");
      await prisma.pricingItem.update({
        where: { id },
        data: {
          slug,
          name,
          description,
          kind,
          defaultUnitAmount,
          defaultCurrency,
          sortOrder,
        },
      });
      await audit({
        actor,
        action: "pricing.item_updated",
        entityType: "PricingItem",
        entityId: id,
        summary: `Updated price module ${name}`,
        changes: {
          name: { from: before.name, to: name },
          defaultUnitAmount: {
            from: String(before.defaultUnitAmount ?? ""),
            to: String(defaultUnitAmount ?? ""),
          },
        },
      });
    } else {
      const created = await prisma.pricingItem.create({
        data: { slug, name, description, kind, defaultUnitAmount, defaultCurrency, sortOrder },
      });
      await audit({
        actor,
        action: "pricing.item_created",
        entityType: "PricingItem",
        entityId: created.id,
        summary: `Created price module ${name}`,
      });
    }
    redirect("/pricing");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeading
        eyebrow="Billing"
        title="Price modules"
        lede="Catalogue entries the invoice and quote editors offer when picking line items. Amounts are defaults — every invoice can still override them. Services and published products with a price are offered automatically alongside these."
      />

      {items.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-2xs text-left tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                <th className="px-4 py-3 font-medium">Module</th>
                <th className="px-4 py-3 font-medium">Kind</th>
                <th className="px-4 py-3 font-medium">Default unit price</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {items.map((item) => (
                <tr key={item.id} className={item.isActive ? "" : "opacity-60"}>
                  <td className="px-4 py-3" colSpan={5}>
                    <form action={saveItem} className="grid grid-cols-12 items-end gap-3">
                      <input type="hidden" name="id" value={item.id} />
                      <label className="col-span-4 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
                        Slug
                        <input
                          name="slug"
                          defaultValue={item.slug}
                          className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
                        />
                      </label>
                      <label className="col-span-4 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
                        Name
                        <input
                          name="name"
                          defaultValue={item.name}
                          className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
                        />
                      </label>
                      <label className="col-span-4 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
                        Description (line item text)
                        <input
                          name="description"
                          defaultValue={item.description ?? ""}
                          className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
                        />
                      </label>
                      <label className="col-span-2 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
                        Kind
                        <select
                          name="kind"
                          defaultValue={item.kind}
                          className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
                        >
                          {KINDS.map((k) => (
                            <option key={k} value={k}>
                              {KIND_LABELS[k]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="col-span-3 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
                        Unit price (major)
                        <input
                          name="defaultUnitAmount"
                          type="number"
                          step="0.01"
                          defaultValue={item.defaultUnitAmount != null ? (item.defaultUnitAmount / 100).toFixed(2) : ""}
                          placeholder="Contact us"
                          className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
                        />
                      </label>
                      <label className="col-span-2 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
                        Currency
                        <input
                          name="defaultCurrency"
                          defaultValue={item.defaultCurrency}
                          className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
                        />
                      </label>
                      <label className="col-span-2 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
                        Order
                        <input
                          name="sortOrder"
                          type="number"
                          step="1"
                          defaultValue={item.sortOrder}
                          className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
                        />
                      </label>
                      <div className="col-span-3 flex gap-2">
                        <Button type="submit" size="sm" name="intent" value="update">
                          Save
                        </Button>
                        <Button type="submit" size="sm" variant="ghost" name="intent" value={item.isActive ? "deactivate" : "activate"}>
                          {item.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-[var(--ink-muted)]">No price modules yet — add one below.</p>
      )}

      <form
        action={saveItem}
        className="mt-8 grid grid-cols-12 items-end gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] p-5"
      >
        <p className="text-2xs col-span-12 tracking-[0.16em] text-[var(--ink-muted)] uppercase">
          New module
        </p>
        <label className="col-span-3 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
          Slug
          <input
            name="slug"
            required
            placeholder="brand-audit"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
          />
        </label>
        <label className="col-span-3 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
          Name
          <input
            name="name"
            required
            placeholder="Brand audit"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
          Kind
          <select
            name="kind"
            defaultValue="CUSTOM"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
          Unit price (major, optional)
          <input
            name="defaultUnitAmount"
            type="number"
            step="0.01"
            placeholder="500.00"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
          Currency
          <input
            name="defaultCurrency"
            defaultValue="USD"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
          />
        </label>
        <div className="col-span-3 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
          Description
          <input
            name="description"
            placeholder="Fixed-scope brand and positioning audit"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
          />
        </div>
        <label className="col-span-2 flex flex-col gap-1 text-2xs font-medium text-[var(--ink-muted)]">
          Order
          <input
            name="sortOrder"
            type="number"
            step="1"
            defaultValue="0"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm font-normal text-[var(--ink-primary)]"
          />
        </label>
        <div className="col-span-4">
          <Button type="submit" size="sm">
            + Add module
          </Button>
        </div>
      </form>
    </div>
  );
}