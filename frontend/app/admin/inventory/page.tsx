"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../context/auth-context";
import { getApiUrl } from "../../../lib/api-utils";
import { 
  Warehouse, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  Search,
  PackageCheck,
  PackageX,
  RefreshCcw,
  Plus,
  Minus
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function InventoryPage() {
  const { token, isAdmin } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl("/api/products"), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && isAdmin) fetchInventory();
  }, [token, isAdmin, fetchInventory]);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const outOfStock = products.filter(p => p.stock === 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);

  if (loading) {
     return <div className="py-40 text-center font-black text-gray-400 uppercase tracking-widest animate-pulse">Scanning Warehouse...</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">Inventory Control</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time stock monitoring and replenishment system</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <PackageCheck className="text-emerald-500" size={20} />
              <span className="text-sm font-black text-gray-900">{products.filter(p => p.stock > 0).length} Active SKUs</span>
           </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[40px] space-y-6">
            <div className="flex items-center gap-3 text-rose-700">
               <PackageX size={24} />
               <h2 className="text-lg font-black uppercase tracking-widest">Out of Stock ({outOfStock.length})</h2>
            </div>
            <div className="space-y-3">
               {outOfStock.slice(0, 3).map(p => (
                 <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{p.name}</span>
                    <button className="text-[10px] font-black text-[#0F3D6E] uppercase hover:underline">Restock Now ›</button>
                 </div>
               ))}
               {outOfStock.length === 0 && <p className="text-rose-400 text-sm font-medium italic">All shelves are full.</p>}
            </div>
         </div>

         <div className="bg-amber-50 border-2 border-amber-100 p-8 rounded-[40px] space-y-6">
            <div className="flex items-center gap-3 text-amber-700">
               <AlertTriangle size={24} />
               <h2 className="text-lg font-black uppercase tracking-widest">Critical Low Stock ({lowStock.length})</h2>
            </div>
            <div className="space-y-3">
               {lowStock.slice(0, 3).map(p => (
                 <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{p.name}</span>
                    <span className="text-xs font-black text-amber-600">{p.stock} left</span>
                 </div>
               ))}
               {lowStock.length === 0 && <p className="text-amber-400 text-sm font-medium italic">No immediate replenishment needed.</p>}
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <div className="relative w-96">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                type="text" 
                placeholder="Audit inventory by name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-[#0F3D6E]/5 outline-none"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <tr>
                     <th className="px-8 py-5">Product Detail</th>
                     <th className="px-6 py-5 text-center">Shelf Stock</th>
                     <th className="px-6 py-5 text-center">Status</th>
                     <th className="px-8 py-5 text-right">Quick Adjust</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                       <td className="px-8 py-6">
                          <p className="font-black text-gray-900">{p.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{p.brand} • {p.category?.name}</p>
                       </td>
                       <td className="px-6 py-6 text-center">
                          <span className={cn(
                             "text-lg font-black",
                             p.stock === 0 ? "text-rose-600" : p.stock <= 5 ? "text-amber-600" : "text-gray-900"
                          )}>
                             {p.stock}
                          </span>
                       </td>
                       <td className="px-6 py-6 text-center">
                          <span className={cn(
                             "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                             p.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          )}>
                             {p.stock > 0 ? "In Stock" : "Depleted"}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-emerald-600 transition-all"><Plus size={16} /></button>
                             <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-rose-600 transition-all"><Minus size={16} /></button>
                          </div>
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
