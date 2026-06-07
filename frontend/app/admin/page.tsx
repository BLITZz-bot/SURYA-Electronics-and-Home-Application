"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getApiUrl } from "../../lib/api-utils";
import { useAuth } from "../../context/auth-context";

// Simple global cache to prevent re-fetching on tab switch
let cachedStats: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function AdminDashboard() {
  const { token, loading: authLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(cachedStats);
  const [loading, setLoading] = useState(!cachedStats);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(getApiUrl('/api/settings/stats'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        cachedStats = data;
        lastFetchTime = Date.now();
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const now = Date.now();
    if (token && isAdmin && (!cachedStats || now - lastFetchTime > CACHE_DURATION)) {
      fetchStats();
    }
  }, [token, isAdmin]);

  const handleManualRefresh = () => {
    fetchStats(true);
  };

  if (authLoading || (loading && !refreshing)) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">SURYA Electronics Admin Control Center</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" height="16" 
              viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round"
              className={refreshing ? 'animate-spin' : ''}
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <div className="hidden sm:block text-right text-xs text-slate-500">
            Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
          </div>
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
