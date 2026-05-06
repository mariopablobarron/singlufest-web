import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-safe: solo authConfig, sin providers que carguen bcrypt/Prisma.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*"],
};
