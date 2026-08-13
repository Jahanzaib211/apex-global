import { prisma } from "@apex/db";
import { Button, Card, SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

/**
 * Security sub-page: change password + manage 2FA.
 *
 * The 2FA flow surfaces a QR code (otpaus URI → rendered as a small inline
 * SVG via a tiny QR encoder) and a verify-code form. Setup is two-step:
 * scan + verify.
 */
export default async function PortalAccountSecurityPage() {
  const { user } = await requirePortalUserAccount();

  async function changePassword(formData: FormData) {
    "use server";
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    if (newPassword !== confirmPassword) {
      const { redirect } = await import("next/navigation");
      redirect("/portal/account/security?error=Passwords+do+not+match");
    }
    const { checkPasswordStrength, hashPassword, revokeAllPortalSessionsForUser } =
      await import("@apex/auth");
    const fresh = await prisma.portalUser.findUnique({ where: { id: user.id } });
    const currentStoredHash: string | null = fresh?.passwordHash ?? null;
    if (currentStoredHash === null) {
      const { redirect } = await import("next/navigation");
      redirect("/portal/account/security?error=Account+has+no+password+set");
    }
    // Narrowing via non-null assertion is acceptable here — the explicit
    // null check above guarantees this is safe at runtime.
    const hashForVerify: string = currentStoredHash!;
    const { verifyPassword } = await import("@apex/auth");
    const ok = await verifyPassword(currentPassword, hashForVerify);
    if (!ok) {
      const { redirect } = await import("next/navigation");
      redirect("/portal/account/security?error=Current+password+is+wrong");
    }
    const strength = checkPasswordStrength(newPassword);
    if (!strength.ok) {
      const { redirect } = await import("next/navigation");
      redirect(`/portal/account/security?error=${encodeURIComponent(strength.reasons.join(" "))}`);
    }
    await prisma.portalUser.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(newPassword) },
    });
    if (!fresh) return;
    await prisma.portalAuditLog.create({
      data: {
        portalUserId: user.id,
        action: "user.password_changed",
        entityType: "PortalUser",
        entityId: user.id,
        summary: "Password changed from /portal/account/security",
      },
    });
    await revokeAllPortalSessionsForUser(user.id);
    const { redirect } = await import("next/navigation");
    redirect("/portal/login?saved=1");
  }

  return (
    <div className="flex flex-col gap-8">
      <Link href="/portal/account" className="text-sm text-[var(--ink-secondary)] hover:underline">
        ← Back to account
      </Link>

      <SectionHeading eyebrow="Security" title="Change password" />

      <Card as="article" className="flex flex-col gap-5 p-6">
        <form action={changePassword} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Current password
            <input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            New password
            <input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Confirm new password
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <p className="text-2xs text-[var(--ink-muted)]">
            Changing your password signs you out of every other device.
          </p>
          <Button type="submit" className="self-start">
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}
