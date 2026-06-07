import { notFound } from "next/navigation";
import AddToCartForm from "../../../components/add-to-cart-form";
import { getApiUrl } from "../../../lib/api-utils";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product = null;
  try {
    const res = await fetch(getApiUrl(`/api/products/${params.id}`), { cache: 'no-store' });
    if (res.ok) {
      product = await res.json();
    }
  } catch (error) {
    console.error("Product Detail Page Error:", error);
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-[420px] w-full rounded-3xl object-cover"
            />
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-700">{(product as any).category?.name || 'Electronics'}</p>
                <h1 className="mt-3 text-4xl font-semibold text-slate-900">{product.name}</h1>
                <p className="mt-4 text-slate-600">{product.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                  Brand
                  <p className="mt-2 font-medium text-slate-900">{product.brand}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                  Price
                  <p className="mt-2 font-medium text-slate-900">₹{Number(product.price).toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                  Stock
                  <p className="mt-2 font-medium text-slate-900">{product.stock}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <AddToCartForm productId={product.id} availableStock={product.stock} />
          </div>
        </div>
      </div>
    </main>
  );
}
