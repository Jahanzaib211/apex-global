import { prisma, type PortalRole } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { s3Config, presignedPutUrl } from "@apex/integrations";
import { randomBytes, createHash } from "node:crypto";
import { sendInvitation, approveSignupAccount } from "@apex/auth";
import { ImpersonateButton } from "@/components/billing/impersonate-button";

export const dynamic = "force-dynamic";

const ROLES: PortalRole[] = ["OWNER", "ADMIN", "MEMBER"];

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ approved?: string; error?: string }> };

export default async function AccountDetailPage({ params, searchParams }: Props) {
  await requirePermission("portal:read");
  const { id } = await params;
  const { approved, error } = await searchParams;
  const account = await prisma.portalAccount.findUnique({
    where: { id },
    include: {
      documents: { orderBy: { createdAt: "desc" } },
      invitations: { where: { acceptedAt: null }, orderBy: { createdAt: "desc" } },
      lead: { select: { id: true, name: true, email: true } },
      users: { select: { id: true, name: true, email: true, emailVerifiedAt: true } },
    },
  });
  if (!account) notFound();

  const isSignup = account.slug.startsWith("self-");
  const needsApproval = isSignup && !account.leadId;

  async function approveAccount() {
    "use server";
    const actor = await requirePermission("portal:admin");
    let created = false;
    try {
      const result = await approveSignupAccount(id, {
        actor,
        requiresSelfSignup: true,
      });
      created = result.created;
      await audit({
        actor,
        action: "portal.account_approved",
        entityType: "PortalAccount",
        entityId: id,
        summary: `Approved self-serve signup → ${created ? "created" : "linked"} lead ${result.leadId}`,
      });
    } catch (err) {
      console.error("[account] approval failed", err);
      redirect(`/accounts/${id}?error=approve-failed`);
    }
    redirect(`/accounts/${id}?approved=1`);
  }

  async function uploadDocument(formData: FormData) {
    "use server";
    const actor = await requirePermission("portal:admin");

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      redirect(`/accounts/${id}?error=no-file`);
    }
    const f = file as File;
    if (f.size > 25 * 1024 * 1024) {
      redirect(`/accounts/${id}?error=file-too-large`);
    }

    const title = String(formData.get("title") ?? "").trim() || f.name;
    const key = `team/${id}/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const cfg = s3Config(process.env as NodeJS.ProcessEnv);
    const putUrl = presignedPutUrl(key, { expiresInSeconds: 300, ...cfg });

    // Server-side PUT — avoids MinIO CORS and keeps the credentials server-only.
    const put = await fetch(putUrl, {
      method: "PUT",
      headers: { "Content-Type": f.type || "application/octet-stream" },
      body: Buffer.from(await f.arrayBuffer()),
    });
    if (!put.ok) {
      console.error("[document] upload failed", put.status, await put.text().catch(() => ""));
      redirect(`/accounts/${id}?error=upload-failed`);
    }

    await prisma.clientDocument.create({
      data: {
        portalAccountId: id,
        filename: f.name,
        key,
        mimeType: f.type || "application/octet-stream",
        bytes: f.size,
        title,
        publishedAt: new Date(),
        uploadedByKind: "team",
        uploadedById: actor.id,
      },
    });
    await audit({
      actor,
      action: "portal.doc_uploaded",
      entityType: "ClientDocument",
      entityId: id,
      summary: `Uploaded ${title} to ${account!.name}`,
    });
    redirect(`/accounts/${id}`);
  }

  async function inviteUser(formData: FormData) {
    "use server";
    const actor = await requirePermission("portal:admin");
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const role = String(formData.get("role") ?? "MEMBER").toUpperCase() as PortalRole;
    if (!email.includes("@") || !ROLES.includes(role)) redirect(`/accounts/${id}?error=bad-invite`);
    if (
      await prisma.portalInvitation.findFirst({
        where: { email, portalAccountId: id, acceptedAt: null },
      })
    ) {
      redirect(`/accounts/${id}?error=already-invited`);
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await prisma.portalInvitation.create({
      data: {
        email,
        role,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        portalAccountId: id,
        invitedById: actor.id,
      },
    });
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tech.apexgroupcompanies.com"}/portal/accept-invitation/${token}`;
      await sendInvitation({
        to: email,
        inviterName: actor.name,
        organisation: account!.name,
        url,
        ttlDays: 7,
      });
    } catch (err) {
      console.error("[account] invite email failed", err);
    }
    await audit({
      actor,
      action: "portal.invited",
      entityType: "PortalInvitation",
      entityId: id,
      summary: `Invited ${email} to ${account!.name}`,
    });
    redirect(`/accounts/${id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow={`Account ${account.status}`}
          title={account.name}
          lede={account.lead ? `Converted from lead ${account.lead.name}` : undefined}
        />
        <Link href="/accounts" className="text-sm underline-offset-4 hover:underline">
          ← All accounts
        </Link>
      </div>

      {needsApproval ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--color-amber-500)] bg-[var(--color-amber-100)] px-4 py-3">
          <p className="text-sm text-[var(--color-amber-700)]">
            Self-serve signup waiting for approval. Approving creates a lead in the
            Leads pipeline and links this account to it.
          </p>
          <form action={approveAccount}>
            <Button type="submit" size="sm">
              Approve signup
            </Button>
          </form>
        </div>
      ) : null}
      {approved ? (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-success-500)] bg-[var(--color-success-100)] px-4 py-3 text-sm text-[var(--color-success-700)]">
          Signup approved — the account now appears in Leads.
        </div>
      ) : null}
      {error === "approve-failed" ? (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-danger-500)] bg-[var(--color-danger-100)] px-4 py-3 text-sm text-[var(--color-danger-700)]">
          Could not approve that signup — it may already be linked to a lead.
        </div>
      ) : null}

      <section className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <h2 className="text-lg font-semibold">Documents</h2>
        <form action={uploadDocument} className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            File
            <input type="file" name="file" required className="text-sm" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Title (optional)
            <input
              name="title"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <Button type="submit" size="sm">
            Upload
          </Button>
        </form>

        <ul className="mt-4 space-y-2">
          {account.documents.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] px-3 py-2 text-sm"
            >
              <span>{d.title ?? d.filename}</span>
              <span className="text-2xs text-[var(--ink-muted)]">
                {d.mimeType} · {(d.bytes / 1024).toFixed(0)} KB
              </span>
            </li>
          ))}
          {account.documents.length === 0 ? (
            <li className="text-sm text-[var(--ink-secondary)]">No documents yet.</li>
          ) : null}
        </ul>
      </section>

      <section className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <h2 className="text-lg font-semibold">Team & invitations</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {account.users.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3">
              <span>
                {u.name} — {u.email}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-2xs text-[var(--ink-muted)]">
                  {u.emailVerifiedAt ? "verified" : "unverified"}
                </span>
                <ImpersonateButton
                  userId={u.id}
                  disabled={!u.emailVerifiedAt}
                  aria-label={`Sign in as ${u.name}`}
                />
              </span>
            </li>
          ))}
        </ul>
        <form action={inviteUser} className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Invite email
            <input
              name="email"
              type="email"
              required
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Role
            <select
              name="role"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" size="sm" variant="secondary">
            Invite
          </Button>
        </form>
        {account.invitations.length > 0 ? (
          <p className="text-2xs mt-3 text-[var(--ink-muted)]">
            Pending: {account.invitations.map((i) => i.email).join(", ")}
          </p>
        ) : null}
      </section>
    </div>
  );
}
