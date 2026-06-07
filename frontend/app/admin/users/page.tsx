"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "../../../lib/api-utils";
import { useAuth } from "../../../context/auth-context";

export default function AdminUsersPage() {
  const { token, isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (token && isAdmin) {
      fetchUsers();
    }
  }, [token, isAdmin]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(getApiUrl('/api/users'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    setUpdatingId(userId);
    try {
      const res = await fetch(getApiUrl(`/api/users/${userId}`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        // Update local state
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update user role');
      }
    } catch (err) {
      alert('An error occurred while updating the role');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) return <div className="p-8 text-center">Access Denied</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
        <p className="text-slate-600 mt-1">View and manage registered customers and team members</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Joined</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {user.image ? (
                        <img src={user.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{user.name || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.email !== 'bharatha9483@gmail.com' ? (
                      user.role === 'admin' ? (
                        <button 
                          onClick={() => handleRoleChange(user.id, 'customer')}
                          disabled={updatingId === user.id}
                          className="text-amber-600 hover:text-amber-700 font-semibold text-sm disabled:opacity-50"
                        >
                          {updatingId === user.id ? 'Updating...' : 'Demote to Customer'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRoleChange(user.id, 'admin')}
                          disabled={updatingId === user.id}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
                        >
                          {updatingId === user.id ? 'Updating...' : 'Make Admin'}
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-slate-400 italic">Primary Owner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
