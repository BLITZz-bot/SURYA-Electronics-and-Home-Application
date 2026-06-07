'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getApiUrl } from "../../../../lib/api-utils";
import { useAuth } from "../../../../context/auth-context";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, isAdmin } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(getApiUrl('/api/categories'));
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        categoryId: formData.get('categoryId'),
        brand: formData.get('brand'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        imageUrl: formData.get('imageUrl') || '',
      };

      const res = await fetch(getApiUrl('/api/products'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create product');

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin && !loading) return <div className="p-8 text-center">Access Denied</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link href="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-4">Add New Product</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Product Name *</label>
            <input type="text" name="name" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="e.g., Samsung Galaxy S25" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Description *</label>
            <textarea name="description" rows={5} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Enter product description" required />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Category *</label>
              <select name="categoryId" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select category</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Brand *</label>
              <input type="text" name="brand" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="e.g., Samsung" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Price (₹) *</label>
              <input type="number" name="price" step="0.01" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="0.00" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Stock *</label>
              <input type="number" name="stock" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="0" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Image URL</label>
            <input type="url" name="imageUrl" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="https://example.com/image.jpg" />
          </div>

          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:bg-slate-400">{loading ? 'Creating...' : 'Create Product'}</button>
            <Link href="/admin/products" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-xl text-center">Cancel</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
