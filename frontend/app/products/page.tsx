import Link from "next/link";
import { getApiUrl } from "../../lib/api-utils";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    const url = getApiUrl('/api/products');
    console.log("Fetching products from:", url);
    const res = await fetch(url, { cache: 'no-store' });
    
    if (res.ok) {
      products = await res.json();
      console.log("Successfully fetched", products.length, "products");
    } else {
      console.error("Failed to fetch products. Status:", res.status);
      const errorText = await res.text();
      console.error("Backend Error Response:", errorText);
    }
  } catch (error: any) {
    console.error("Products Page Fetch Crash:", error.message);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-700">Product catalog</p>
          <h1 className="mt-4 text-4xl font-semibold">Browse electronic products</h1>
          <p className="mt-3 text-slate-600">
            Discover the latest mobile phones, home appliances, audio accessories, and more from SURYA Electronics.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500">No products found. Please ensure the database is seeded.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-56 overflow-hidden rounded-t-3xl bg-slate-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{(product as any).category?.name || 'Electronics'}</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-900">{product.name}</h2>
                  <p className="mt-3 text-sm text-slate-600 line-clamp-3">{product.description}</p>
                  <div className="mt-6 flex items-center justify-between text-slate-900">
                    <p className="text-lg font-semibold">₹{Number(product.price).toLocaleString()}</p>
                    <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
