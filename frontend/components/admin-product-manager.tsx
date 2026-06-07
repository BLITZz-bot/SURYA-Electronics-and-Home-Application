"use client";

import { useState } from "react";
import AdminProductForm from "./admin-product-form";
import AdminProductList from "./admin-product-list";
import { useRouter } from "next/navigation";

export default function AdminProductManager({ initialProducts }: { initialProducts: any[] }) {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const router = useRouter();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.4fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Inventory</h2>
          <button 
            onClick={() => setEditingProduct(null)}
            className="text-xs font-bold uppercase tracking-wider text-sky-600 hover:text-sky-800"
          >
            Refresh List
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

      <div className="space-y-6">
        <div className="sticky top-24">
          <AdminProductForm 
            initialData={editingProduct} 
            onCancel={() => setEditingProduct(null)}
            onSuccess={() => {
              setEditingProduct(null);
              router.refresh();
            }}
          />
        </div>
      </div>
    </div>
  );
}
