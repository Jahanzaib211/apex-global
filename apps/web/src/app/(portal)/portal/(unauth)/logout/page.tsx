import { redirect } from "next/navigation";
import { signOutPortal } from "@/lib/portal/auth";

/**
 * Server-rendered sign-out.
 *
 * Hits the same server action as the layout's form button; this page is
 * here for direct URL access and for completeness.
 */
export default async function LogoutPage() {
  await signOutPortal();
  redirect("/portal/login");
}
