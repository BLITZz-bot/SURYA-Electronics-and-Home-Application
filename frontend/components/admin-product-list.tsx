"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { getApiUrl } from "../lib/api-utils";

interface AdminProductListProps {
  initialProducts: any[];
  onEdit: (product: any) => void;
}

export default function AdminProductList({ initialProducts, onEdit }: AdminProductListProps) {
  const { token } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  async function deleteProduct(id: string) {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    setLoadingId(id);
    try {
      const response = await fetch(getApiUrl(`/api/products/${id}`), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
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
                <span className="text-xs font-medium text-[#0F3D6E] bg-[#0F3D6E]/5 px-3 py-1 rounded-full uppercase tracking-tighter">{product.category?.name || 'Uncategorized'}</span>
              </td>
              <td className="py-5 text-center">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                  product.stock < 10 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}>
                  {product.stock} left
                </span>
              </td>
              <td className="py-5 text-right">
                 <p className="font-black text-gray-900">₹{Number(product.price).toLocaleString()}</p>
                 {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                   <p className="text-[10px] text-gray-400 line-through">₹{Number(product.originalPrice).toLocaleString()}</p>
                 )}
              </td>
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
