"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getApiUrl } from "../../../lib/api-utils";
import ProductCard from "../../../components/product-card";
import { Search, Loader2 } from "lucide-react";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { category, search } = searchParams;
  
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = getApiUrl('/api/products');
      const res = await fetch(url);
      
      if (res.ok) {
        let allProducts = await res.json();
        
        if (category) {
          allProducts = allProducts.filter((p: any) => p.category?.name === category);
        }
        
        if (search) {
          const query = search.toLowerCase();
          allProducts = allProducts.filter((p: any) => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query)
          );
        }
        setProducts(allProducts);
      }
    } catch (error: any) {
      console.error("Products Page Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amazon-bg">
        <Loader2 className="h-12 w-12 animate-spin text-[#0F3D6E]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amazon-bg py-8">
      <div className="mx-auto max-w-[1500px] px-4 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {search ? `Results for "${search}"` : category ? `${category} Collection` : "Electronics Catalog"}
          </h1>
          <p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-widest">{products.length} products found in database</p>
        </div>

        {products.length === 0 ? (
          <div className="space-y-16 py-20">
            <div className="text-center bg-white p-16 rounded-[50px] border border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto">
              <Search size={64} className="mx-auto text-gray-100 mb-6" strokeWidth={3} />
              <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Zero matches for your search.</h2>
              <p className="text-gray-400 font-medium italic mb-8">We couldn&apos;t find anything matching &quot;{search || category}&quot;. Try adjusting your filters or checking your spelling.</p>
              <Link href="/products" className="inline-block bg-[#0F3D6E] text-white px-10 py-4 rounded-full font-black shadow-xl shadow-[#0F3D6E]/20 transform active:scale-95 transition-all uppercase text-xs tracking-widest">Explore All Inventory</Link>
            </div>
            
            {/* Suggestions */}
            <div className="space-y-8">
               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic border-l-4 border-[#5DADE2] pl-4 tracking-widest">Recommended products</h3>
               <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  <p className="col-span-full text-center text-gray-300 italic font-bold">Please clear filters to see our full catalog.</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
