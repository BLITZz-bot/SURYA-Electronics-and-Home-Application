"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getApiUrl } from "../../lib/api-utils";
import { useAuth } from "../../context/auth-context";

export default function AdminDashboard() {
  const { token, loading: authLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && isAdmin) {
      fetchStats();
    }
  }, [token, isAdmin]);

  const fetchStats = async () => {
    try {
      const res = await fetch(getApiUrl('/api/settings/stats'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) return <div className="p-8 text-center">Access Denied</div>;

  return (
    <div className="space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">SURYA Electronics Admin Control Center</p>
        </div>
        <div className="text-sm text-slate-500">
          {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">Total Revenue</p>
          <p className="text-4xl font-bold mt-3">₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</p>
          <p className="text-emerald-100 text-sm mt-2">{stats?.deliveredCount || 0} delivered orders</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide">Total Orders</p>
          <p className="text-4xl font-bold mt-3">{stats?.totalOrders || 0}</p>
          <p className="text-blue-100 text-sm mt-2">{stats?.todaysOrders || 0} today</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-purple-100 text-xs font-semibold uppercase tracking-wide">Inventory</p>
          <p className="text-4xl font-bold mt-3">{stats?.totalProducts || 0}</p>
          <p className="text-purple-100 text-sm mt-2">{stats?.outOfStockCount || 0} out of stock</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-orange-100 text-xs font-semibold uppercase tracking-wide">Customers</p>
          <p className="text-4xl font-bold mt-3">{stats?.totalCustomers || 0}</p>
          <p className="text-orange-100 text-sm mt-2">Total registered</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats?.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">{order.user.name || order.user.email}</td>
                    <td className="px-6 py-4 font-semibold">₹{Number(order.totalAmount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-bold uppercase">{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Low Stock Alerts</h2>
          <div className="space-y-4">
            {stats?.lowStockProducts?.length > 0 ? stats.lowStockProducts.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                <span className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{p.name}</span>
                <span className="text-red-600 font-bold">{p.stock} left</span>
              </div>
            )) : <p className="text-slate-500 text-sm italic">All items well stocked.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
