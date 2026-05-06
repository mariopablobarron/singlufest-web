import { redirect } from "next/navigation";
import { signIn, auth } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Acceso staff" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;
  const session = await auth();
  if (session?.user) redirect(callbackUrl ?? "/admin");

  async function loginAction(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/admin",
      });
    } catch (err) {
      // NextAuth lanza redirect — re-lanzar
      throw err;
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-alt p-6">
      <div className="w-full max-w-md card-elevated">
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <span className="badge">Staff</span>
        </div>
        <h1 className="text-3xl font-display tracking-tight">Acceso al panel</h1>
        <p className="mt-2 text-ink-muted">Solo para equipo y editores autorizados.</p>

        <form action={loginAction} className="mt-8 space-y-5">
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="field-input" autoComplete="email" />
          </div>
          <div>
            <label className="field-label" htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required className="field-input" autoComplete="current-password" />
          </div>
          {error && (
            <p className="field-error">
              No hemos podido validar esos datos. Vuelve a intentarlo.
            </p>
          )}
          <button className="btn-primary btn-lg w-full">Entrar</button>
        </form>
      </div>
    </main>
  );
}
