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
    strategy: "jwt",
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
          // We don't return false here because we still want them to be able to sign in
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Check admin emails directly in JWT for immediate recognition
      const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()) ?? [];
      
      if (user) {
        token.id = user.id;
        token.email = user.email;
        const isEmailAdmin = user.email && adminEmails.includes(user.email.toLowerCase());
        token.role = isEmailAdmin ? "admin" : (user.role ?? "customer");
        console.log("JWT token created for:", user.email, "Role:", token.role);
      } else if (token.email) {
        // Refresh role on every token check if needed
        const isEmailAdmin = typeof token.email === 'string' && adminEmails.includes(token.email.toLowerCase());
        if (isEmailAdmin) {
          token.role = "admin";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "customer";
        console.log("Session created for:", session.user.email, "Role:", session.user.role);
      }
      return session;
    },
  },
};
