import Link from "next/link";
import { prisma } from "../lib/prisma";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-700 font-semibold">Welcome to SURYA Electronics</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">Your one-stop shop for modern home appliances.</h1>
            <p className="mt-6 text-lg text-slate-600 leading-8">
              Experience the best in electronics. Browse our curated collection of high-quality products, from the latest smartphones to essential home appliances.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/products" className="rounded-full bg-slate-900 px-8 py-4 text-white hover:bg-slate-700 transition font-medium">
                Browse Products
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Latest Arrivals</h2>
            <Link href="/products" className="text-sky-700 hover:underline font-medium">
              View all products →
            </Link>
          </div>
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
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{product.category}</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-900">{product.name}</h2>
                  <p className="mt-3 text-sm text-slate-600 line-clamp-2">{product.description}</p>
                  <div className="mt-6 flex items-center justify-between text-slate-900">
                    <p className="text-lg font-semibold">₹{Number(product.price).toFixed(0)}</p>
                    <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
