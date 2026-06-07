import { prisma } from "../../../lib/prisma";
import AdminUserList from "../../../components/admin-user-list";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      role: "asc",
    },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">User Management</h1>
        <p className="text-slate-500">Manage customer accounts and administrative roles.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Registered Users</h2>
        <AdminUserList initialUsers={users} />
      </div>
    </div>
  );
}
