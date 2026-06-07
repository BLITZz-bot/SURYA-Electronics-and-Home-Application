import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      console.log("Sign-in attempt for:", user.email);
      const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()) ?? [];
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        try {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "admin" },
          });
          console.log("User promoted to admin in DB:", user.email);
        } catch (error) {
          console.error("Failed to set admin role in DB during sign-in:", error);
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user && session.user.email) {
        // Fetch fresh user data from database
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          console.log("Session loaded for:", session.user.email, "Role:", dbUser.role);
        }
      }
      return session;
    },
  },
};
