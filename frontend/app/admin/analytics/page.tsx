"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../context/auth-context";
import { getApiUrl } from "../../../lib/api-utils";
import Link from "next/link";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import { 
  TrendingUp, DollarSign, Users, ShoppingCart, 
  Package, Calendar, Activity, Loader2,
  CheckCircle2, ShoppingBag, BarChart3, PieChart as PieIcon,
  Layers, History, Boxes
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";

const COLORS = ['#0F3D6E', '#5DADE2', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

export default function AnalyticsPage() {
  const { token, isAdmin } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl("/api/settings/stats"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && isAdmin) fetchAnalytics();
  }, [token, isAdmin, fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#0F3D6E]" />
        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Processing Store Intelligence...</p>
      </div>
    );
  }

  const hasData = (data?.totalOrders || 0) > 0;

  if (!hasData) {
    return (
      <div className="p-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200 shadow-xl max-w-4xl mx-auto animate-in zoom-in duration-500">
         <div className="w-24 h-24 rounded-full bg-[#0F3D6E]/5 flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg">
            <BarChart3 size={40} className="text-[#0F3D6E]" />
         </div>
         <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase mb-4">No analytics data available yet</h2>
         <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed mb-10">
            Start receiving orders to unlock deep business insights, revenue trends, and performance analytics.
         </p>
         <Link href="/admin/products" className="bg-[#0F3D6E] text-white px-10 py-4 rounded-full font-black shadow-xl shadow-[#0F3D6E]/20 hover:bg-black transition-all transform active:scale-95 uppercase text-xs tracking-widest">
            View My Products
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Business Intelligence</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Real-time performance analysis and growth forecasting</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
           <Calendar size={18} className="text-[#0F3D6E] ml-2" />
           <span className="text-xs font-black text-[#0F3D6E] uppercase tracking-widest">Last 6 Months</span>
           <div className="w-1 h-4 bg-gray-100 mx-2" />
           <button onClick={fetchAnalytics} className="p-2 hover:bg-gray-50 rounded-xl transition-all"><Activity size={16} className="text-gray-400" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* 1. Revenue Overview */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center gap-3">
               <DollarSign size={20} className="text-[#0F3D6E]" />
               Revenue Overview
            </h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                    <Line type="monotone" dataKey="revenue" stroke="#0F3D6E" strokeWidth={6} dot={{ r: 6, fill: '#5DADE2', strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         {/* 2. Order Volume */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center gap-3">
               <ShoppingCart size={20} className="text-[#5DADE2]" />
               Order Volume
            </h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.monthlyOrders || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none'}} />
                    <Bar dataKey="orders" fill="#5DADE2" radius={[10, 10, 10, 10]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         {/* 3. Category Performance */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center gap-3">
               <Layers size={20} className="text-[#F59E0B]" />
               Revenue by Department
            </h3>
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.categoryPerformance || []} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'black', fill: '#0F3D6E'}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="revenue" fill="#0F3D6E" radius={[0, 10, 10, 0]} barSize={25} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         {/* 7. Order Status Distribution */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center gap-3">
               <PieIcon size={20} className="text-[#10B981]" />
               Fulfillment mix
            </h3>
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.orderStatusDistribution || []}
                      cx="50%" cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {(data?.orderStatusDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: 'bold', fontSize: '12px'}} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         {/* 5. Inventory Health */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center gap-3">
               <Boxes size={20} className="text-[#EF4444]" />
               Shelf Health
            </h3>
            <div className="grid grid-cols-2 gap-8 py-4">
               <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
                  <p className="text-[10px] font-black uppercase text-emerald-600 mb-1 tracking-widest">In Stock</p>
                  <p className="text-3xl font-black text-emerald-700">{data?.totalProducts - data?.outOfStockCount}</p>
               </div>
               <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 text-center">
                  <p className="text-[10px] font-black uppercase text-rose-600 mb-1 tracking-widest">Depleted</p>
                  <p className="text-3xl font-black text-rose-700">{data?.outOfStockCount}</p>
               </div>
               <div className="col-span-2 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-700">Stock Availability</span>
                  <div className="flex-1 max-w-[200px] h-2 bg-white rounded-full mx-4 overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full" style={{ width: `${((data?.totalProducts - data?.outOfStockCount) / (data?.totalProducts || 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs font-black text-blue-900">{Math.round(((data?.totalProducts - data?.outOfStockCount) / (data?.totalProducts || 1)) * 100)}%</span>
               </div>
            </div>
         </motion.div>

         {/* 6. Customer Growth */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center gap-3">
               <Users size={20} className="text-[#0F3D6E]" />
               User Acquisition
            </h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.monthlyCustomers || []}>
                    <defs>
                      <linearGradient id="colorCust2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F3D6E" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0F3D6E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" hide />
                    <Tooltip />
                    <Area type="stepAfter" dataKey="customers" stroke="#0F3D6E" strokeWidth={3} fillOpacity={1} fill="url(#colorCust2)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="text-center pt-6">
               <p className="text-4xl font-black text-gray-900 tracking-tighter">{data?.totalCustomers}</p>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Registered Base</p>
            </div>
         </motion.div>

         {/* 4. Top Selling Products */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3 uppercase">
                  <TrendingUp size={24} className="text-[#0F3D6E]" />
                  Sales Leaderboard
               </h3>
               <Link href="/admin/products" className="text-[10px] font-black uppercase text-[#5DADE2] hover:text-[#0F3D6E] transition-colors">Catalog Analysis ›</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {(data?.topProducts || []).map((p: any, i: number) => (
                 <div key={p.name} className="space-y-4 group">
                    <div className="flex items-center justify-between">
                       <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center font-black text-xs text-gray-400 group-hover:bg-[#0F3D6E] group-hover:text-white transition-all">{i + 1}</span>
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{p.sales} Sold</span>
                    </div>
                    <p className="text-sm font-black text-gray-900 line-clamp-1 italic uppercase tracking-tighter">{p.name}</p>
                    <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full bg-amazon-orange rounded-full" style={{ width: `${(p.sales / (data?.topProducts?.[0]?.sales || 1)) * 100}%` }} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.category} • ₹{p.revenue.toLocaleString()}</p>
                 </div>
               ))}
            </div>
         </motion.div>

         {/* 10. Live Activity Feed */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-black text-gray-900 mb-10 uppercase tracking-widest flex items-center gap-3">
               <History size={20} className="text-[#5DADE2]" />
               Business Activity
            </h3>
            <div className="space-y-8 relative">
               <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-50" />
               {(data?.recentOrders || []).slice(0, 5).map((order: any) => (
                 <div key={order.id} className="relative flex items-center gap-8 group pl-2">
                    <div className="w-10 h-10 rounded-full bg-white border-4 border-gray-50 flex items-center justify-center z-10 shadow-sm group-hover:border-[#0F3D6E]/10 transition-all">
                       <CheckCircle2 size={16} className={cn(order.status === 'delivered' ? 'text-emerald-500' : 'text-amber-500')} />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                       <div>
                          <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Order #{order.id.slice(-8).toUpperCase()} • {order.user?.name || 'Customer'}</p>
                          <p className="text-[10px] font-medium text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString()} • {order.user?.email}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-gray-900">₹{Number(order.totalAmount).toLocaleString()}</p>
                          <p className={cn("text-[9px] font-black uppercase tracking-widest", order.status === 'delivered' ? 'text-emerald-500' : 'text-amber-500')}>{order.status}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </motion.div>
      </div>
    </div>
  );
}
