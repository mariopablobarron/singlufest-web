import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, CalendarDays, Building2, Newspaper, Settings, Sparkles, LogOut, Users, Trophy } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/cartel", label: "Cartel", icon: Trophy },
  { href: "/admin/reservas", label: "Reservas", icon: Users },
  { href: "/admin/eventos", label: "Programa", icon: CalendarDays },
  { href: "/admin/sponsors", label: "Patrocinadores", icon: Building2 },
  { href: "/admin/posts", label: "Blog", icon: Newspaper },
  { href: "/admin/agentes", label: "Agentes IA", icon: Sparkles },
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="hidden md:flex md:w-64 flex-col border-r border-line bg-bg-alt">
        <div className="p-6">
          <Logo />
        </div>
        <nav className="px-3 flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink hover:bg-bg"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-line">
          <p className="text-xs text-ink-muted">{session.user.email}</p>
          <p className="text-xs text-ink-muted">{session.user.role}</p>
          <form action={signOutAction} className="mt-3">
            <button className="btn-ghost w-full justify-start gap-2 px-3">
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 max-w-7xl">
        <div className="md:hidden mb-4 flex items-center justify-between">
          <Logo />
          <form action={signOutAction}>
            <button className="btn-ghost text-sm">Salir</button>
          </form>
        </div>
        {children}
      </main>
    </div>
  );
}

export const metadata = {
  title: { default: "Admin", template: "%s · Admin · Singlufest" },
  robots: { index: false, follow: false },
};
