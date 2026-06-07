"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "../../../lib/api-utils";
import { useAuth } from "../../../context/auth-context";
import AdminProductList from "../../../components/admin-product-list";
import { RefreshCcw, Package } from "lucide-react";

export default function AdminProductsPage() {
  const { token, isAdmin } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && isAdmin) {
      fetchProducts();
    }
  }, [token, isAdmin]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/products'));
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <RefreshCcw className="h-10 w-10 animate-spin text-[#0F3D6E]" />
        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Syncing Catalog...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">Product Catalog</h1>
          <p className="text-sm text-gray-500 font-medium">Manage your retail inventory and pricing strategies</p>
        </div>
      </div>

      <AdminProductList 
        initialProducts={products} 
        onEdit={(p) => window.location.href = `/admin/products/${p.id}`} 
      />
    </div>
  );
}
