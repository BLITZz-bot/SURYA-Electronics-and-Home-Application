"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/auth-context";
import { getApiUrl } from "../../lib/api-utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  ShoppingCart, 
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Plus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../../lib/utils";

const COLORS = ['#0F3D6E', '#5DADE2', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

export default function AdminDashboard() {
  const { token, isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl("/api/settings/stats"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && isAdmin) {
      fetchStats();
      const interval = setInterval(fetchStats, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [token, isAdmin, fetchStats]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <RefreshCcw className="h-10 w-10 animate-spin text-[#0F3D6E]" />
        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Analyzing Metrics...</p>
      </div>
    );
  }

  const kpis = [
    { 
      label: "Total Revenue", 
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      trend: stats?.revenueGrowth !== null ? `${stats?.revenueGrowth?.toFixed(1)}%` : null, 
      isUp: (stats?.revenueGrowth || 0) >= 0, 
      color: "from-blue-600 to-[#0F3D6E]" 
    },
    { 
      label: "Total Orders", 
      value: stats?.totalOrders || 0, 
      icon: ShoppingCart, 
      trend: stats?.ordersGrowth !== null ? `${stats?.ordersGrowth?.toFixed(1)}%` : null, 
      isUp: (stats?.ordersGrowth || 0) >= 0, 
      color: "from-[#5DADE2] to-blue-500" 
    },
    { 
      label: "Active Customers", 
      value: stats?.totalCustomers || 0, 
      icon: Users, 
      trend: stats?.customersGrowth !== null ? `${stats?.customersGrowth?.toFixed(1)}%` : null, 
      isUp: (stats?.customersGrowth || 0) >= 0, 
      color: "from-emerald-500 to-teal-600" 
    },
    { 
      label: "Avg Order Value", 
      value: `₹${(stats?.avgOrderValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
      icon: TrendingUp, 
      trend: null, 
      isUp: true, 
      color: "from-amber-500 to-[#F59E0B]" 
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map((kpi, i) => (
          <motion.div 
            key={kpi.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "relative overflow-hidden p-8 rounded-[24px] shadow-lg hover:shadow-2xl transition-all group",
              "bg-gradient-to-br",
              kpi.color,
              "text-white"
            )}
          >
            {/* Background Icon Decoration */}
            <kpi.icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                     <kpi.icon size={24} />
                  </div>
                  {kpi.trend && (
                    <div className={cn(
                      "flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md border",
                      kpi.isUp ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/20" : "bg-rose-500/20 text-rose-100 border-rose-500/20"
                    )}>
                       {kpi.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                       {kpi.trend}
                    </div>
                  )}
               </div>
               <p className="text-xs font-bold text-white/70 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
               <h3 className="text-4xl font-black tracking-tighter">{kpi.value}</h3>
               {kpi.trend && <p className="text-[10px] font-medium text-white/50 mt-4 italic tracking-wider">vs previous month</p>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Trends</h3>
                  <p className="text-sm text-gray-400 font-medium">Monthly performance overview</p>
               </div>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors">Monthly</button>
                  <button className="px-4 py-2 bg-[#0F3D6E] rounded-xl text-xs font-bold text-white shadow-lg shadow-[#0F3D6E]/20 transition-all">Yearly</button>
               </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyRevenue || []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F3D6E" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0F3D6E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '15px' }}
                    labelStyle={{ fontWeight: 'black', color: '#0F3D6E', marginBottom: '5px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0F3D6E" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Pie Chart */}
         <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Category Sales</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.categoryPerformance || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="sales"
                  >
                    {(stats?.categoryPerformance || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-8">
               {(stats?.categoryPerformance || []).slice(0, 3).map((cat: any, i: number) => (
                 <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                       <span className="text-sm font-bold text-gray-600">{cat.name}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">₹{cat.sales.toLocaleString()}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
           <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Orders</h3>
              <Link href="/admin/orders" className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-[#0F3D6E] transition-all">
                 <ArrowUpRight size={20} />
              </Link>
           </div>
           <div className="space-y-6">
              {(stats?.recentOrders || []).slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-[#0F3D6E] group-hover:bg-[#0F3D6E] group-hover:text-white transition-all shadow-sm">
                         {order.user?.name?.[0].toUpperCase() || 'C'}
                      </div>
                      <div>
                         <p className="text-sm font-black text-gray-900">{order.user?.name || order.user?.email || 'Customer'}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #{order.id.slice(-6)}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-gray-900">₹{Number(order.totalAmount).toLocaleString()}</p>
                      <span className={cn("text-[10px] font-black uppercase tracking-tighter", order.status === 'delivered' ? 'text-emerald-500' : 'text-amber-500')}>
                         {order.status}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
           <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Low Stock Alerts</h3>
              <Link href="/admin/products" className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-[#0F3D6E] transition-all">
                 <Plus size={20} />
              </Link>
           </div>
           <div className="space-y-6">
              {(stats?.lowStockProducts || []).length > 0 ? (stats?.lowStockProducts || []).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative bg-gray-50 rounded-2xl overflow-hidden p-2 border border-gray-100 shadow-sm">
                        <Image 
                          src={p.imageUrl} 
                          alt={p.name} 
                          fill
                          className="object-contain p-1" 
                        />
                      </div>
                      <div>
                         <p className="text-sm font-black text-gray-900 line-clamp-1">{p.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.brand}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", p.stock === 0 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-amber-50 text-amber-600 border border-amber-100")}>
                         {p.stock === 0 ? "Out of Stock" : `${p.stock} Units Left`}
                      </span>
                   </div>
                </div>
              )) : (
                <div className="py-20 text-center text-gray-300 font-bold italic">All inventory healthy.</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
