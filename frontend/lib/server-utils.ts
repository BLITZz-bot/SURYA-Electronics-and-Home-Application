import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }
  return prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
  return user;
}
