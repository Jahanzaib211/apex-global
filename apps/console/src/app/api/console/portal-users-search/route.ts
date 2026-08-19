import { prisma } from "@apex/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export type PortalUserSearchEntry = {
  id: string;
  name: string;
  email: string;
  accountName: string;
  emailVerified: boolean;
};

/** Portal-user typeahead for the impersonation picker. */
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });
  if (!user.permissions.includes("portal:admin")) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  const users = await prisma.portalUser.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { portalAccount: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerifiedAt: true,
      portalAccount: { select: { name: true } },
    },
  });

  const entries: PortalUserSearchEntry[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    accountName: u.portalAccount.name,
    emailVerified: u.emailVerifiedAt !== null,
  }));

  return Response.json({ entries });
}