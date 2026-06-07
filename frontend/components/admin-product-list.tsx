"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminProductListProps {
  initialProducts: any[];
  onEdit: (product: any) => void;
}

export default function AdminProductList({ initialProducts, onEdit }: AdminProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    setLoadingId(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
        router.refresh();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to delete product.");
      }
    } catch (error) {
      alert("An error occurred while deleting the product.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            <th className="pb-4 px-2">Image</th>
            <th className="pb-4">Product</th>
            <th className="pb-4">Category</th>
            <th className="pb-4 text-center">Stock</th>
            <th className="pb-4 text-right">Price</th>
            <th className="pb-4 text-right px-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.map((product) => (
            <tr key={product.id} className="text-sm group hover:bg-slate-50/50 transition-colors">
              <td className="py-5 px-2">
                <img src={product.imageUrl} alt="" className="h-12 w-12 rounded-2xl object-cover shadow-sm border border-slate-100" />
              </td>
              <td className="py-5">
                <p className="font-bold text-slate-900">{product.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{product.brand}</p>
              </td>
              <td className="py-5">
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{product.category}</span>
              </td>
              <td className="py-5 text-center">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  product.stock < 10 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {product.stock} units
                </span>
              </td>
              <td className="py-5 text-right font-bold text-slate-900">₹{Number(product.price).toLocaleString()}</td>
              <td className="py-5 text-right px-2">
                <div className="flex items-center justify-end gap-3">
                  <button 
                    onClick={() => onEdit(product)}
                    className="text-[10px] font-bold uppercase tracking-widest text-sky-600 hover:text-sky-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    disabled={loadingId === product.id}
                    className="text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:text-rose-800 disabled:opacity-50 transition-colors"
                  >
                    {loadingId === product.id ? "..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="py-20 text-center text-slate-400 italic font-medium">No products found in inventory.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
