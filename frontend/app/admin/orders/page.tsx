"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "../../../lib/api-utils";
import { useAuth } from "../../../context/auth-context";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Eye, 
  MoreVertical, 
  Download, 
  CreditCard, 
  Truck, 
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function AdminOrdersPage() {
  const { token, isAdmin } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (token && isAdmin) {
      fetchOrders();
    }
  }, [token, isAdmin]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(getApiUrl('/api/orders'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) || 
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0F3D6E] border-t-transparent"></div>
        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Loading Transactions...</p>
      </div>
    );
  }

  if (!isAdmin) return <div className="p-8 text-center font-black text-rose-600">ACCESS DENIED</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-sm text-gray-500 font-medium">Monitor and fulfill customer requests across all channels</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
           <Download size={18} />
           Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Pending", count: orders.filter(o => o.status === 'pending').length, color: "text-amber-500 bg-amber-50" },
           { label: "Shipped", count: orders.filter(o => o.status === 'shipped').length, color: "text-blue-500 bg-blue-50" },
           { label: "Delivered", count: orders.filter(o => o.status === 'delivered').length, color: "text-emerald-500 bg-emerald-50" },
           { label: "Cancelled", count: orders.filter(o => o.status === 'cancelled').length, color: "text-rose-500 bg-rose-50" },
         ].map((stat) => (
           <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <span className={cn("text-xl font-black px-4 py-1 rounded-2xl", stat.color)}>{stat.count}</span>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/30">
           <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by Order ID or Customer..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none"
              />
           </div>
           <div className="flex gap-3">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-600 focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none appearance-none cursor-pointer pr-10 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 15px center', backgroundSize: '15px' }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="px-8 py-5">Order Detail</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5 text-center">Amount</th>
                <th className="px-6 py-5 text-center">Payment</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900">#ORD-{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                      <Clock size={10} className="inline mr-1" />
                      {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold text-gray-900">{order.user?.name || 'Customer'}</p>
                    <p className="text-[10px] font-medium text-blue-400">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-6 text-center font-black text-gray-900">
                    ₹{Number(order.totalAmount).toLocaleString()}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.paymentMethod || 'COD'}</span>
                       <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase",
                          order.paymentStatus === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                       )}>
                          {order.paymentStatus}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      order.status === 'shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      order.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#0F3D6E] hover:border-[#0F3D6E] hover:shadow-lg transition-all inline-block shadow-sm"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="py-32 text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold italic text-lg">No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
