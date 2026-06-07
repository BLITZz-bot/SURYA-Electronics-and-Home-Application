'use dynamic';

import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import DeleteProductButton from "../../../components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } }
    }
  });

  const lowStock = products.filter(p => p.stock <= 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1">Manage your product inventory</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Total Products</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{products.length}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Low Stock</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{lowStock}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{outOfStock}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Product</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Category</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Price</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Stock</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.name} className="h-12 w-12 rounded-lg object-cover bg-slate-100" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-slate-600">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{product.category?.name}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{product.stock}</span>
                      {product.stock <= 2 && (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Critical</span>
                      )}
                      {product.stock <= 5 && product.stock > 2 && (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Low</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.stock === 0 ? (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Out of Stock</span>
                    ) : (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No products yet</p>
            <Link href="/admin/products/new" className="text-blue-600 hover:text-blue-700 font-semibold">
              Create your first product →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
