import Link from "next/link";
import { getApiUrl } from "../lib/api-utils";
import ProductCard from "../components/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: any[] = [];
  let categories: any[] = [];
  
  try {
    const [prodRes, catRes] = await Promise.all([
      fetch(getApiUrl('/api/products'), { cache: 'no-store' }),
      fetch(getApiUrl('/api/categories'), { cache: 'no-store' })
    ]);

    if (prodRes.ok) products = await prodRes.json();
    if (catRes.ok) categories = await catRes.json();
  } catch (error) {
    console.error("Home Page Error fetching data:", error);
  }

  // Filter categories to only those that have products
  const activeCategories = categories.filter(cat => 
    products.some(prod => prod.categoryId === cat.id)
  );

  // Sections
  const heroProduct = products.find(p => p.stock > 0) || products[0];
  const featuredProducts = products.filter(p => p.stock > 5).slice(0, 4);
  const newArrivals = [...products].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 4);
  
  // Best Sellers (Mocking for now with items that have lower stock assuming they sold more, or just random slice if no sales data)
  const bestSellers = [...products].sort((a, b) => a.stock - b.stock).slice(0, 4);
  
  const recentlyAdded = [...products].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(4, 8);

  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-amazon-bg flex items-center justify-center">
        <div className="text-center p-10 bg-white shadow-md rounded-md max-w-lg mx-4">
           <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H4a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
           <h2 className="text-2xl font-bold text-gray-800 mb-2">Our store is currently resting</h2>
           <p className="text-gray-500">We are restocking our inventory with fresh electronics. Please check back in a bit!</p>
           <Link href="/products" className="mt-6 inline-block text-surya-light font-bold hover:underline">Browse Catalog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 bg-amazon-bg">
      {/* Dynamic Hero Banner */}
      <section className="relative h-[300px] md:h-[550px] overflow-hidden bg-[#0F3D6E]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent z-10" />
        <img 
          src={heroProduct?.imageUrl || "/placeholder-product.png"} 
          alt="Featured Product" 
          className="w-full h-full object-contain opacity-60 scale-110 blur-sm translate-x-20"
        />
        <div className="absolute top-1/2 left-10 md:left-20 -translate-y-1/2 z-20 max-w-2xl space-y-6">
           <span className="bg-amazon-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Featured Offer</span>
           <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-xl">
             {heroProduct?.name || "Premium Electronics"}
           </h1>
           <p className="text-lg md:text-xl text-gray-200 line-clamp-2 drop-shadow-md">
             {heroProduct?.description || "Experience the best in modern home appliances and electronics with SURYA."}
           </p>
           <div className="flex gap-4">
             <Link href={`/products/${heroProduct?.id}`} className="bg-amazon-orange hover:bg-orange-500 text-white font-bold py-4 px-10 rounded-md shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
               Buy Now <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </Link>
             <Link href="/products" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-10 rounded-md border border-white/30 transition-all">
               View All
             </Link>
           </div>
        </div>
      </section>

      {/* Content Container */}
      <div className="mx-auto max-w-[1500px] px-4 -mt-10 md:-mt-20 relative z-30 space-y-12">
        
        {/* Dynamic Category Cards */}
        {activeCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCategories.slice(0, 4).map(cat => (
              <div key={cat.id} className="bg-white p-6 shadow-xl rounded-sm flex flex-col h-[420px] group border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{cat.name}</h3>
                <div className="flex-1 overflow-hidden mb-6 bg-gray-50 flex items-center justify-center rounded-sm">
                  <img 
                    src={cat.image || products.find(p => p.categoryId === cat.id)?.imageUrl || "/placeholder-product.png"} 
                    alt={cat.name} 
                    className="max-h-56 object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                </div>
                <Link href={`/products?category=${cat.name}`} className="text-[#0F3D6E] font-bold hover:text-orange-600 transition-colors flex items-center gap-1 mt-auto">
                  Shop {cat.name} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="bg-white p-8 shadow-sm border border-gray-100 rounded-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#0F3D6E] rounded-full"></span>
                Featured Products
              </h2>
              <Link href="/products" className="text-sm font-bold text-[#5DADE2] hover:text-[#0F3D6E] transition-colors">View All Deals</Link>
            </div>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="bg-white p-8 shadow-sm border border-gray-100 rounded-sm">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-amazon-orange rounded-full"></span>
                New Arrivals
              </h2>
            </div>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="bg-white p-8 shadow-sm border border-gray-100 rounded-sm">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                Best Sellers
              </h2>
            </div>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Added */}
        {recentlyAdded.length > 0 && (
          <section className="bg-white p-8 shadow-sm border border-gray-100 rounded-sm">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                Recently Added
              </h2>
            </div>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
