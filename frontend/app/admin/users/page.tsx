"use client";

import { useEffect, useState, useCallback } from "react";
import { getApiUrl } from "../../../lib/api-utils";
import { useAuth } from "../../../context/auth-context";
import Image from "next/image";
import { RefreshCcw, 
  Users, 
  Search, 
  Shield, 
  Mail, 
  Lock, 
  ShoppingBag,
  CheckCircle2
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function AdminUsersPage() {
  const { token, isAdmin, refreshToken } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const freshToken = isManual ? await refreshToken() : token;
      const res = await fetch(getApiUrl('/api/users'), {
        headers: { 'Authorization': `Bearer ${freshToken || token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        if (isManual) {
          setNotification({ type: 'success', message: 'Customers updated successfully' });
          setTimeout(() => setNotification(null), 3000);
        }
      } else if (isManual) {
        setNotification({ type: 'error', message: 'Failed to refresh customers' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      if (isManual) {
        setNotification({ type: 'error', message: 'Failed to refresh customers' });
        setTimeout(() => setNotification(null), 3000);
      }
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  }, [token, refreshToken]);

  useEffect(() => {
    if (token && isAdmin) {
      fetchUsers();
      const interval = setInterval(fetchUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [token, isAdmin, fetchUsers]);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    setUpdatingId(userId);
    try {
      const freshToken = await refreshToken();
      const res = await fetch(getApiUrl(`/api/users/${userId}`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${freshToken || token}` 
        },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0F3D6E] border-t-transparent"></div>
        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Accessing User Records...</p>
      </div>
    );
  }

  if (!isAdmin) return <div className="p-8 text-center font-black text-rose-600 uppercase tracking-tighter">RESTRICTED ACCESS</div>;

return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Toast */}
      {notification && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300",
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-rose-50 border-rose-100 text-rose-700"
          )}
        >
          <CheckCircle2 size={20} />
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest">{notification.type === 'success' ? 'Success' : 'Error'}</span>
            <span className="text-sm font-bold">{notification.message}</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Customer Directory</h1>
          <p className="text-sm text-gray-500 font-medium">Manage user permissions and view customer engagement</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fetchUsers(true)}
            disabled={isRefreshing}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs transition-all",
              isRefreshing ? "bg-gray-50 border-gray-200 text-gray-400 cursor-wait" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
            <RefreshCcw size={16} className={cn(isRefreshing && "animate-spin")} />
            {isRefreshing ? "Updating..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none"
              />
           </div>
           <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Total Members: <span className="text-gray-900 font-black ml-1">{users.length}</span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="px-8 py-5 text-left">User Profile</th>
                <th className="px-6 py-5 text-center">Account Role</th>
                <th className="px-6 py-5 text-center">Orders</th>
                <th className="px-6 py-5 text-center">Total Value</th>
                <th className="px-6 py-5 text-center">Joined Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-[#0F3D6E] flex items-center justify-center text-white font-black shadow-lg shadow-[#0F3D6E]/10 relative overflow-hidden">
                          {user.image ? (
                            <Image 
                              src={user.image} 
                              alt={user.name || "User Profile"} 
                              fill 
                              className="object-cover" 
                            />
                          ) : (
                            user.email?.[0]?.toUpperCase() || "U"
                          )}
                       </div>
                       <div>
                          <p className="font-black text-gray-900">{user.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 mt-0.5">
                             <Mail size={10} />
                             {user.email}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      user.role === 'admin' ? "bg-purple-50 text-purple-700 border-purple-100" : "bg-gray-100 text-gray-600 border-transparent"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-black text-gray-900">
                       <ShoppingBag size={14} className="text-[#5DADE2]" />
                       {user._count?.orders || 0}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center font-black text-gray-900">
                    ₹{(user.orders?.reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0) || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-gray-400 text-[10px] uppercase">
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {user.email !== 'bharatha9483@gmail.com' ? (
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {user.role === 'admin' ? (
                             <button 
                              onClick={() => handleRoleChange(user.id, 'customer')}
                              disabled={updatingId === user.id}
                              className="p-3 bg-white border border-gray-100 rounded-xl text-amber-500 hover:border-amber-500 hover:shadow-lg transition-all shadow-sm"
                              title="Demote to Customer"
                             >
                                <Lock size={18} />
                             </button>
                          ) : (
                             <button 
                              onClick={() => handleRoleChange(user.id, 'admin')}
                              disabled={updatingId === user.id}
                              className="p-3 bg-white border border-gray-100 rounded-xl text-blue-500 hover:border-blue-500 hover:shadow-lg transition-all shadow-sm"
                              title="Make Admin"
                             >
                                <Shield size={18} />
                             </button>
                          )}
                       </div>
                    ) : (
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">Owner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="py-32 text-center">
              <Users size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold italic text-lg">No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
