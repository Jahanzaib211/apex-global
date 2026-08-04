import { Button, Logo, TextField } from "@apex/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser, login } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;

  if (await currentUser()) redirect(next || "/");

  async function signIn(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const target = String(formData.get("next") ?? "") || "/";

    const result = await login(email, password);
    if (!result.ok) {
      redirect(`/login?error=${encodeURIComponent(result.message)}`);
    }

    // Only same-origin paths. An open redirect on a login form is a gift to
    // anyone building a credible phishing flow.
    redirect(target.startsWith("/") && !target.startsWith("//") ? target : "/");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg-page)] p-6">
      <div className="w-full max-w-sm">
        <div className="mb-9 flex justify-center">
          <Logo orientation="stacked" />
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-8 shadow-[var(--shadow-md)]">
          <h1 className="text-xl">Sign in</h1>
          <p className="mt-1 text-sm text-[var(--ink-secondary)]">
            Internal console. Access is logged.
          </p>

          <form action={signIn} className="mt-7 flex flex-col gap-5">
            <input type="hidden" name="next" value={next ?? "/"} />
            <TextField label="Email" name="email" type="email" autoComplete="username" required />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />

            {error ? (
              <p
                role="alert"
                className="rounded-[var(--radius-md)] bg-[var(--color-danger-100)] px-4 py-3 text-sm text-[var(--color-danger-500)]"
              >
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
