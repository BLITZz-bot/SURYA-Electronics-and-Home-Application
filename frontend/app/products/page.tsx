import Link from "next/link";
import { getApiUrl } from "../../lib/api-utils";
import ProductCard from "../../components/product-card";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  let products: any[] = [];
  const { category, search } = searchParams;
  
  try {
    const url = getApiUrl('/api/products');
    const res = await fetch(url, { cache: 'no-store' });
    
    if (res.ok) {
      const allProducts = await res.json();
      products = allProducts;
      
      if (category) {
        products = products.filter(p => p.category?.name === category);
      }
      
      if (search) {
        const query = search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
        );
      }
    }
  } catch (error: any) {
    console.error("Products Page Fetch Error:", error.message);
  }

  return (
    <main className="min-h-screen bg-amazon-bg py-8">
      <div className="mx-auto max-w-[1500px] px-4 space-y-6">
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            {search ? `Results for "${search}"` : category ? `${category} Collection` : "Electronics Catalog"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">Showing {products.length} products</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-40 bg-white border border-dashed border-gray-300 rounded-sm">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <p className="text-gray-500 font-bold text-xl">No products found matching your criteria.</p>
            <Link href="/products" className="text-surya-light hover:underline mt-2 inline-block">Clear all filters</Link>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
