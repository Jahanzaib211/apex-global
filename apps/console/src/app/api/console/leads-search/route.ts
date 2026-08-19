import { prisma } from "@apex/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export type LeadSearchEntry = {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  interestSlug: string | null;
  stage: string;
  portalAccountName: string | null;
  defaultCurrency: string | null;
};

/**
 * Lead typeahead for the invoice/quote editors. Replaces the old hard cap of
 * 50 rows on the page with a search endpoint the combobox queries as the
 * operator types.
 */
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });
  if (!user.permissions.includes("crm:read") && !user.permissions.includes("billing:write")) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  const leads = await prisma.lead.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { companyName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      interestSlug: true,
      stage: true,
      portalAccounts: { select: { name: true, slug: true, defaultCurrency: true }, take: 1 },
    },
  });

  const entries: LeadSearchEntry[] = leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    companyName: l.companyName,
    interestSlug: l.interestSlug,
    stage: l.stage,
    portalAccountName: l.portalAccounts[0]?.name ?? null,
    defaultCurrency: l.portalAccounts[0]?.defaultCurrency ?? null,
  }));

  return Response.json({ entries });
}