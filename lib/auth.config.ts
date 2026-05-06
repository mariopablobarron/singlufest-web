import type { NextAuthConfig } from "next-auth";

/**
 * Configuración edge-safe de NextAuth.
 * Todo lo que va aquí debe ejecutarse en el edge runtime (middleware).
 * NO importar Prisma, bcrypt ni nada que dependa de Node APIs.
 *
 * Los providers (que SÍ usan bcrypt + Prisma) viven en lib/auth.ts.
 */
export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  providers: [], // se añaden en lib/auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: "ADMIN" | "EDITOR" | "STAFF" }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "EDITOR" | "STAFF";
      }
      return session;
    },
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = request.nextUrl.pathname === "/admin/login";
      if (!isAdminRoute) return true;
      if (isLoginRoute) return true;
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
