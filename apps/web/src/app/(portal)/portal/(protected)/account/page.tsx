import { prisma } from "@apex/db";
import { issueCsrfToken, signCsrf } from "@apex/auth";
import { Card, SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export default async function PortalAccountPage() {
  const { user } = await requirePortalUserAccount();

  // CSRF pair for the OAuth unlink form below. Each request issues a fresh
  // pair; verifyCsrf() on the receiving end compares in constant time. The
  // sign-out form in the layout gets its own pair from the layout; this one
  // is for the per-provider unlink forms on this page.
  const oauthCsrf = issueCsrfToken();
  const oauthCsrfSignature = signCsrf(oauthCsrf);

  const [sessions, oauthAccounts] = await Promise.all([
    prisma.portalSession.findMany({
      where: { userId: user.id, expiresAt: { gt: new Date() } },
      orderBy: { lastSeenAt: "desc" },
      take: 5,
    }),
    prisma.portalOAuthAccount.findMany({
      where: { userId: user.id },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading eyebrow="Account" title="Your profile" />

      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" value={user.email} />
          <Field label="Name" value={user.name} />
          <Field label="Account" value={user.portalAccountName} />
          <Field label="Role" value={user.role.toLowerCase()} />
          <Field label="2FA" value={user.totpEnabled ? "Enabled" : "Off"} />
          <Field
            label="Email verified"
            value={
              user.emailVerifiedAt ? user.emailVerifiedAt.toLocaleDateString("en-GB") : "Pending"
            }
          />
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Security</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card as="article" className="flex flex-col gap-3 p-5">
            <h3 className="font-semibold">Password</h3>
            <p className="text-sm text-[var(--ink-secondary)]">
              Change your password. All other sessions are signed out.
            </p>
            <Link
              href="/portal/account/security"
              className="mt-auto self-start text-sm font-medium underline-offset-4 hover:underline"
            >
              Change password →
            </Link>
          </Card>
          <Card as="article" className="flex flex-col gap-3 p-5">
            <h3 className="font-semibold">Two-factor authentication</h3>
            <p className="text-sm text-[var(--ink-secondary)]">
              {user.totpEnabled
                ? "2FA is on. You need a code from your authenticator app to sign in."
                : "Add an authenticator app to require a code on every sign-in."}
            </p>
            <Link
              href="/portal/account/security"
              className="mt-auto self-start text-sm font-medium underline-offset-4 hover:underline"
            >
              {user.totpEnabled ? "Manage 2FA →" : "Enable 2FA →"}
            </Link>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Linked accounts</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(["google", "microsoft"] as const).map((p) => {
            const linked = oauthAccounts.find((o) => o.provider === p);
            return (
              <div
                key={p}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4"
              >
                <span className="capitalize">{p}</span>
                <span
                  className={`text-2xs rounded-full px-2.5 py-0.5 font-medium uppercase ${
                    linked
                      ? "bg-[var(--color-success-100)] text-[var(--color-success-500)]"
                      : "bg-[var(--bg-sunken)] text-[var(--ink-secondary)]"
                  }`}
                >
                  {linked ? "Linked" : "Not linked"}
                </span>
                {linked ? (
                  <form action={`/api/portal/auth/oauth/unlink/${p}`} method="post">
                    <input type="hidden" name="csrf" value={oauthCsrf} />
                    <input type="hidden" name="csrfSignature" value={oauthCsrfSignature} />
                    <button
                      type="submit"
                      className="text-sm font-medium text-[var(--color-danger-500)] underline-offset-4 hover:underline"
                    >
                      Unlink
                    </button>
                  </form>
                ) : (
                  <Link
                    href={`/portal/auth/${p}/start`}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    Link
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Active sessions</h2>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-2xs border-b border-[var(--border-subtle)] text-left tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                <th className="px-5 py-3 font-semibold">Last seen</th>
                <th className="px-5 py-3 font-semibold">IP</th>
                <th className="px-5 py-3 font-semibold">User agent</th>
                <th className="px-5 py-3 font-semibold">Expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3">{s.lastSeenAt.toLocaleString("en-GB")}</td>
                  <td className="text-2xs px-5 py-3 font-mono">{s.ipAddress ?? "—"}</td>
                  <td className="text-2xs px-5 py-3 text-[var(--ink-secondary)]">
                    {s.userAgent ?? "—"}
                  </td>
                  <td className="text-2xs px-5 py-3">{s.expiresAt.toLocaleString("en-GB")}</td>
                </tr>
              ))}
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-[var(--ink-secondary)]">
                    No active sessions.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-2xs tracking-[0.16em] text-[var(--ink-muted)] uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
