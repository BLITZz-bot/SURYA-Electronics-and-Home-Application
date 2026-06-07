"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight, LayoutGrid, Smartphone, Laptop, Tv, Speaker, Watch, Zap, Shield } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/auth-context";

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
}

const iconMap: Record<string, any> = {
  "Mobiles": Smartphone,
  "Laptops": Laptop,
  "TV & Appliances": Tv,
  "Audio": Speaker,
  "Smartwatch": Watch,
  "Accessories": Zap,
};

export default function CategoryDrawer({ isOpen, onClose, categories }: CategoryDrawerProps) {
  const { isAdmin } = useAuth();

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-full max-w-[380px] bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="bg-[#0F3D6E] text-white p-6 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <LayoutGrid className="text-amazon-orange" size={24} />
              <h2 className="text-xl font-black uppercase tracking-tighter italic">All Categories</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
           </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
           <div className="px-6 mb-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Shop By Department</h3>
           </div>
           
           <nav className="space-y-1">
              {categories.map((cat) => {
                const Icon = iconMap[cat.name] || LayoutGrid;
                return (
                  <Link 
                    key={cat.id} 
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all border-l-4 border-transparent hover:border-amazon-orange group"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[#0F3D6E]/5 group-hover:text-[#0F3D6E] transition-colors">
                          <Icon size={20} />
                       </div>
                       <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{cat.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-amazon-orange transition-all" />
                  </Link>
                );
              })}

              {categories.length === 0 && (
                <div className="px-6 py-10 text-center text-gray-400 italic text-sm">
                   No categories found in database.
                </div>
              )}
           </nav>
           
           <div className="mt-10 px-6 pt-10 border-t border-gray-100">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Help & Settings</h3>
              <div className="space-y-4">
                 <Link href="/account" onClick={onClose} className="block text-sm font-bold text-gray-600 hover:text-[#0F3D6E]">Your Account</Link>
                 <Link href="/orders" onClick={onClose} className="block text-sm font-bold text-gray-600 hover:text-[#0F3D6E]">Your Orders</Link>
                 {isAdmin && (
                   <Link href="/admin" onClick={onClose} className="flex items-center gap-2 text-sm font-black text-amazon-orange hover:text-[#0F3D6E]">
                     <Shield size={16} />
                     Admin Dashboard
                   </Link>
                 )}
                 <Link href="/contact" onClick={onClose} className="block text-sm font-bold text-gray-600 hover:text-[#0F3D6E]">Customer Service</Link>
              </div>
           </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">SURYA Electronics © 2026</p>
        </div>
      </aside>
    </>
  );
}
