import { prisma } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";
import { sendInvitation } from "@apex/auth";
import { invitationPath, invitationUrl, redeemInvitation } from "@/lib/portal/invitations";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Accept invitation",
  robots: { index: false, follow: false },
};

/**
 * Invitation accept page.
 *
 * Operator creates an invitation in the console. The invited email gets a link
 * like `/portal/accept-invitation/<token>`. The token is a path segment, not a
 * query parameter — this is a `[token]` dynamic route, so reading it from the
 * query string made every real invitation link render "Missing token".
 *
 * We look the invitation up by hash, show them the account name they're being
 * added to, and let them set a password (or link an OAuth provider).
 */
type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AcceptInvitationPage({ params, searchParams }: Props) {
  const { token } = await params;
  const { error, saved } = await searchParams;

  if (!token) return <Shell title="Missing token" body="The invitation link is malformed." />;

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const invitation = await prisma.portalInvitation.findUnique({
    where: { tokenHash },
    include: { portalAccount: true },
  });

  if (!invitation) return <Shell title="Invalid link" body="That invitation is not recognised." />;  if (invitation.acceptedAt) {
    return (
      <Shell
        title="Already accepted"
        body="This invitation has already been used. Sign in to continue."
      />
    );
  }
  if (invitation.expiresAt < new Date()) {
    return (
      <Shell
        title="Expired"
        body="This invitation has expired. Ask the operator to send a new one."
      />
    );
  }

  // OAuth sign-in can only work for an invitee who already has a portal user
  // (the callback matches by email and fails closed otherwise). A fresh
  // invitee must accept with a password first; showing the provider buttons
  // to them just dead-ends at "No portal account exists for that email".
  const oauthUsable = await prisma.portalUser.findUnique({
    where: { email: invitation.email },
    select: { id: true },
  });

  if (saved) {
    return (
      <Shell
        title="Invitation accepted"
        body={`You are now a ${invitation.role.toLowerCase()} of ${invitation.portalAccount.name}. Sign in to continue.`}
        cta={{ label: "Sign in", href: "/portal/login" }}
      />
    );
  }

  async function accept(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (name.length < 2 || password.length < 12) {
      // Round-trip the page rather than return — server actions can't easily
      // surface field-level errors from a server component.
      redirect(`${invitationPath(token)}?error=Name+and+12+char+password+required`);
    }

    // Call the redemption directly. This used to `fetch` our own API route over
    // the network, which cost a round trip and hid every failure behind a
    // `.catch(() => undefined)` — the user was told "accepted" either way.
    const result = await redeemInvitation({ token, name, password });
    if (!result.ok) {
      redirect(`${invitationPath(token)}?error=${encodeURIComponent(result.error)}`);
    }
    redirect(`${invitationPath(token)}?saved=1`);
  }

  // Resend the invitation email — useful if the link expired or was lost.
  async function resend() {
    "use server";
    if (!invitation) return;
    await sendInvitation({
      to: invitation.email,
      inviterName: "Apex",
      organisation: invitation.portalAccount.name,
      url: invitationUrl(token),
      ttlDays: 7,
    });
    redirect(`${invitationPath(token)}?saved=1`);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl">You've been invited</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Apex Global Tech Solution invited <strong>{invitation.email}</strong> to the{" "}
          <strong>{invitation.portalAccount.name}</strong> portal as a{" "}
          {invitation.role.toLowerCase()}.
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        {error ? (
          <p
            role="alert"
            className="mb-4 rounded-[var(--radius-md)] bg-[var(--color-danger-100)] px-3 py-2 text-sm text-[var(--color-danger-500)]"
          >
            {error}
          </p>
        ) : null}

        <form action={accept} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Full name
            <input
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              defaultValue={invitation.email.split("@")[0]}
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Choose a password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <p className="text-2xs text-[var(--ink-muted)]">
            At least 12 characters, mixing three of: lowercase, uppercase, digits, symbols.
          </p>
          <Button type="submit">Accept and create account</Button>
        </form>

        <div className="text-2xs my-6 flex items-center gap-3 tracking-[0.16em] text-[var(--ink-muted)] uppercase">
          <span className="h-px flex-1 bg-[var(--border-default)]" />
          or
          <span className="h-px flex-1 bg-[var(--border-default)]" />
        </div>

        <div className="flex flex-col gap-2">
          {oauthUsable ? (
            <>
              <Link
                href={`/portal/auth/google/start?next=${encodeURIComponent(invitationPath(token))}`}
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-4 text-sm font-medium transition-colors hover:border-[var(--color-amber-500)]"
              >
                Continue with Google
              </Link>
              <Link
                href={`/portal/auth/microsoft/start?next=${encodeURIComponent(invitationPath(token))}`}
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-4 text-sm font-medium transition-colors hover:border-[var(--color-amber-500)]"
              >
                Continue with Microsoft
              </Link>
            </>
          ) : (
            <p className="text-2xs text-[var(--ink-muted)]">
              Set a password above to create your account. You can link Google or Microsoft from the
              account page after signing in.
            </p>
          )}
        </div>
      </div>

      <form action={resend} className="mt-4 text-center">
        <button
          type="submit"
          className="text-sm text-[var(--ink-secondary)] underline-offset-4 hover:underline"
        >
          Resend invitation
        </button>
      </form>
    </div>
  );
}

function Shell({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        <h1 className="text-xl">{title}</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">{body}</p>
        <Link
          href={cta?.href ?? "/portal/login"}
          className="mt-6 inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 text-sm font-medium text-[var(--ink-on-accent)]"
        >
          {cta?.label ?? "Back to sign-in"}
        </Link>
      </div>
    </div>
  );
}
