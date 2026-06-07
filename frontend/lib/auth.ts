import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Added error page
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Promotion logic moved to JWT callback to avoid blocking the sign-in redirect
      if (user && user.email) {
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()) ?? [];
        if (adminEmails.includes(user.email.toLowerCase())) {
          try {
            await prisma.user.update({
              where: { email: user.email },
              data: { role: "admin" },
            });
          } catch (error) {
            console.error("JWT promotion error:", error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && session.user.email) {
        // Use the token to persist user ID and Role without repeated DB lookups if possible
        // But for absolute certainty, we do one quick lookup
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development", // Enable debug logs in development
};
