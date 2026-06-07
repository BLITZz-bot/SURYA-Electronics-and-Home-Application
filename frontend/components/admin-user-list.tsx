"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { getApiUrl } from "../lib/api-utils";

export default function AdminUserList({ initialUsers }: { initialUsers: any[] }) {
  const { token } = useAuth();
  const [users, setUsers] = useState(initialUsers);
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleRole(userId: string, currentRole: string) {
    if (!token) return;
    const newRole = currentRole === "admin" ? "customer" : "admin";
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    setLoadingId(userId);
    try {
      const response = await fetch(getApiUrl(`/api/users/${userId}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        router.refresh();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to update user role.");
      }
    } catch (error) {
      alert("An error occurred while updating the role.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            <th className="pb-4">User</th>
            <th className="pb-4">Role</th>
            <th className="pb-4 text-center">Total Orders</th>
            <th className="pb-4 text-right px-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map((user) => (
            <tr key={user.id} className="text-sm group hover:bg-slate-50/50 transition-colors">
              <td className="py-5">
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <img src={user.image} alt="" className="h-10 w-10 rounded-2xl border border-slate-100 shadow-sm" />
                  ) : (
                    <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-900">{user.name || 'No Name'}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-5">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="py-5 text-center font-bold text-slate-900">
                {user._count.orders}
              </td>
              <td className="py-5 text-right px-2">
                <button 
                  onClick={() => toggleRole(user.id, user.role)}
                  disabled={loadingId === user.id}
                  className="text-[10px] font-bold uppercase tracking-widest text-sky-600 hover:text-sky-800 disabled:opacity-50 transition-colors"
                >
                  {loadingId === user.id ? "..." : user.role === 'admin' ? "Make Customer" : "Make Admin"}
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="py-20 text-center text-slate-400 italic font-medium">No users registered yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
