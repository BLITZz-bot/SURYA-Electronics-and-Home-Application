"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth-context";
import { getApiUrl } from "../../../lib/api-utils";
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar as CalendarIcon, 
  Table as TableIcon,
  PieChart as ChartIcon,
  ArrowRight,
  TrendingUp,
  Package,
  Users,
  CreditCard
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function ReportsPage() {
  const { token, isAdmin } = useAuth();
  const [activeReport, setActiveTab] = useState("revenue");

  if (!isAdmin) return <div className="p-10">Access Denied</div>;

  const reportTypes = [
    { id: "revenue", label: "Revenue Reports", icon: CreditCard, description: "Detailed breakdown of sales, taxes, and net profit." },
    { id: "products", label: "Product Performance", icon: Package, description: "Top selling items, inventory movement, and returns." },
    { id: "customers", label: "Customer Insights", icon: Users, description: "Acquisition trends, lifetime value, and demographic data." },
    { id: "inventory", label: "Inventory Audit", icon: FileText, description: "Stock levels, valuation, and low stock projections." },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">Intelligence & Reports</h1>
        <p className="text-sm text-gray-500 font-medium">Generate professional business insights and export for auditing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {reportTypes.map((report) => (
           <button 
            key={report.id}
            onClick={() => setActiveTab(report.id)}
            className={cn(
              "p-6 rounded-[32px] border transition-all text-left group",
              activeReport === report.id 
                ? "bg-[#0F3D6E] border-[#0F3D6E] text-white shadow-xl shadow-[#0F3D6E]/20" 
                : "bg-white border-gray-100 text-gray-900 hover:border-[#0F3D6E]/30"
            )}
           >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                activeReport === report.id ? "bg-white/10" : "bg-gray-50 text-[#0F3D6E] group-hover:bg-[#0F3D6E] group-hover:text-white"
              )}>
                 <report.icon size={24} />
              </div>
              <h3 className="font-black uppercase tracking-widest text-xs mb-2">{report.label}</h3>
              <p className={cn("text-xs font-medium leading-relaxed", activeReport === report.id ? "text-blue-100/60" : "text-gray-400")}>
                {report.description}
              </p>
           </button>
         ))}
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
         {/* Report Preview / Filter Header */}
         <div className="p-10 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Time Range</label>
                  <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm">
                     <CalendarIcon size={16} className="text-[#0F3D6E]" />
                     <span className="text-sm font-bold text-gray-700">Last 30 Days</span>
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Format</label>
                  <select className="bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm text-sm font-bold text-gray-700 outline-none appearance-none pr-8">
                     <option>Interactive Grid</option>
                     <option>PDF Summary</option>
                     <option>Raw Excel (XLSX)</option>
                     <option>CSV (Comma Separated)</option>
                  </select>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-8 py-3.5 bg-[#0F3D6E] text-white rounded-2xl text-sm font-black shadow-xl shadow-[#0F3D6E]/20 hover:bg-black transition-all transform active:scale-95">
                  <Download size={18} />
                  Download Report
               </button>
            </div>
         </div>

         {/* Report Content Placeholder */}
         <div className="p-20 text-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
               <ChartIcon size={40} className="text-[#5DADE2] animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter italic">Generating {activeReport} Preview...</h2>
            <p className="text-gray-400 font-medium max-w-sm mx-auto">This report is being aggregated from real-time database records. Please wait while we process the latest transactions.</p>
            
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-2xl mx-auto opacity-20 grayscale pointer-events-none">
               {[1,2,3].map(i => (
                 <div key={i} className="h-4 bg-gray-200 rounded-full w-full" />
               ))}
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="h-4 bg-gray-100 rounded-full w-full" />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
