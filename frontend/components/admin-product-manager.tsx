"use client";

import { useState } from "react";
import AdminProductForm from "./admin-product-form";
import AdminProductList from "./admin-product-list";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw } from "lucide-react";

export default function AdminProductManager({ initialProducts }: { initialProducts: any[] }) {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <AnimatePresence mode="wait">
        {editingProduct ? (
          <motion.div 
            key="edit-form"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-10 rounded-[40px] border-2 border-[#0F3D6E]/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-[#0F3D6E] uppercase italic tracking-tighter">Modify Product Entity</h2>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest">Cancel Edition</button>
            </div>
            <AdminProductForm 
              initialData={editingProduct} 
              onCancel={() => setEditingProduct(null)}
              onSuccess={() => {
                setEditingProduct(null);
                router.refresh();
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Inventory Intelligence</h2>
            <p className="text-sm text-gray-400 font-medium">Real-time stock monitoring and catalog control</p>
          </div>
          <button 
            onClick={() => router.refresh()}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#0F3D6E] transition-all shadow-sm"
            title="Refresh Data"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
        
        <AdminProductList 
          initialProducts={initialProducts} 
          onEdit={(product) => {
            setEditingProduct(product);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </div>
    </div>
  );
}
