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
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()) ?? [];
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "admin" },
        });
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role ?? "customer";
      }
      return session;
    },
  },
};
