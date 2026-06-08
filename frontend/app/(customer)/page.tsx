"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "../../lib/api-utils";
import ProductCard from "../../components/product-card";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(getApiUrl('/api/products')),
        fetch(getApiUrl('/api/categories'))
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (error) {
      console.error("Home Page Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter categories to only those that have products
  const activeCategories = categories.filter(cat => 
    products.some(prod => prod.categoryId === cat.id)
  );

  const featuredProducts = products.filter(p => p.stock > 5).slice(0, 4);
  const newArrivals = [...products].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 4);
  
  const bestSellers = [...products].sort((a, b) => a.stock - b.stock).slice(0, 4);
  
  const recentlyAdded = [...products].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(4, 8);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amazon-bg">
        <Loader2 className="h-12 w-12 animate-spin text-[#0F3D6E]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20 bg-amazon-bg overflow-x-hidden">
      {/* Centered Brand-Focused Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center bg-black overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop"
          alt="Modern Home Interior with Lighting and Appliances"
          fill
          className="object-cover object-center scale-105 opacity-90"
          priority
        />
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md border-b border-white/20 bg-gradient-to-br from-black/40 to-transparent" />

        <div className="mx-auto max-w-[1500px] px-6 relative z-20 w-full text-center space-y-8 pb-20 lg:pb-32">
           <div className="space-y-6 relative py-4">
              {/* Backlight to make text pop against any background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-black/60 blur-[60px] rounded-[100%] pointer-events-none" />

              <h1 className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter uppercase italic select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 drop-shadow-2xl">
                 SURYA
              </h1>
              
              <div className="relative flex items-center justify-center gap-4 sm:gap-6">
                 <div className="hidden sm:block h-[2px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-orange-500 rounded-full opacity-80" />
                 <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-[0.15em] uppercase drop-shadow-xl">
                    Electronics <span className="text-orange-500">&</span> Home Appliances
                 </h2>
                 <div className="hidden sm:block h-[2px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-orange-500 rounded-full opacity-80" />
              </div>
           </div>

           <p className="relative text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-medium max-w-3xl mx-auto px-4 drop-shadow-md z-10">
              Your trusted destination for premium electronics, home appliances, smartphones, laptops, accessories, and technology solutions.
           </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/products" className="w-full sm:w-auto bg-[#0F3D6E] hover:bg-black text-white font-black py-4 px-12 rounded-xl shadow-2xl transition-all transform active:scale-95 uppercase tracking-widest text-sm border border-white/10">
                 Explore Products
              </Link>
              <Link href="/products" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-12 rounded-xl border border-white/30 transition-all transform active:scale-95 uppercase tracking-widest text-sm">
                 Browse Categories
              </Link>
           </div>
        </div>
      </section>

      {/* Content Container - Overlapping Hero */}
      <div className="mx-auto max-w-[1500px] px-8 pb-16 relative z-30 space-y-16 -mt-10 lg:-mt-16">
        
        {/* Dynamic Category Row */}
        {activeCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeCategories.slice(0, 4).map((cat, i) => (
              <div key={cat.id} className="bg-white p-8 shadow-2xl rounded-[40px] flex flex-col h-[480px] group border border-gray-100 hover:border-[#0F3D6E]/20 transition-all transform hover:-translate-y-2">
                <h3 className="text-2xl font-black text-[#0F3D6E] mb-6 italic tracking-tighter uppercase">{cat.name}</h3>
                <div className="flex-1 overflow-hidden mb-8 bg-gray-50 flex items-center justify-center rounded-[30px] border border-gray-50 shadow-inner group-hover:bg-blue-50 transition-colors duration-500 relative">
                  <Image 
                    src={cat.image || products.find(p => p.categoryId === cat.id)?.imageUrl || "/placeholder-product.png"} 
                    alt={cat.name} 
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                </div>
                <Link href={`/products?category=${cat.name}`} className="text-[#0F3D6E] font-black hover:text-orange-600 transition-colors flex items-center gap-2 mt-auto uppercase text-xs tracking-widest">
                  Shop Department <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="bg-white p-10 shadow-sm border border-gray-100 rounded-[50px]">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4 italic uppercase tracking-tighter">
                <span className="w-3 h-10 bg-[#0F3D6E] rounded-full shadow-lg shadow-[#0F3D6E]/20"></span>
                Premium Picks
              </h2>
              <Link href="/products" className="text-xs font-black text-[#5DADE2] hover:text-[#0F3D6E] transition-colors uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-[#0F3D6E] pb-1">See All Collections</Link>
            </div>
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="bg-[#0F3D6E] p-10 shadow-2xl rounded-[50px] text-white">
            <div className="flex items-center mb-10">
              <h2 className="text-3xl font-black flex items-center gap-4 italic uppercase tracking-tighter">
                <span className="w-3 h-10 bg-amazon-orange rounded-full shadow-lg shadow-orange-500/20"></span>
                The Latest Tech
              </h2>
            </div>
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="bg-white p-10 shadow-sm border border-gray-100 rounded-[50px]">
            <div className="flex items-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4 italic uppercase tracking-tighter">
                <span className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20"></span>
                Store Favorites
              </h2>
            </div>
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Added */}
        {recentlyAdded.length > 0 && (
          <section className="bg-gray-900 p-10 shadow-2xl rounded-[50px] text-white">
            <div className="flex items-center mb-10">
              <h2 className="text-3xl font-black flex items-center gap-4 italic uppercase tracking-tighter text-blue-300">
                <span className="w-3 h-10 bg-blue-400 rounded-full shadow-lg shadow-blue-500/20"></span>
                Freshly restocked
              </h2>
            </div>
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyAdded.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
