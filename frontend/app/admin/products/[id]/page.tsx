'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getApiUrl } from "../../../../lib/api-utils";
import { useAuth } from "../../../../context/auth-context";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const { token, isAdmin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(getApiUrl(`/api/products/${params.id}`)),
          fetch(getApiUrl('/api/categories'))
        ]);

        if (!productRes.ok) throw new Error('Product not found');
        
        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();

        setProduct(productData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
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

      const res = await fetch(getApiUrl(`/api/products/${params.id}`), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update product');

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    if (!token) return;

    setDeleting(true);
    setError('');

    try {
      const res = await fetch(getApiUrl(`/api/products/${params.id}`), {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });

      if (!res.ok) throw new Error('Failed to delete product');

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) return <div className="p-8 text-center">Access Denied</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link href="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-4">Edit Product</h1>
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
            <input type="text" name="name" defaultValue={product.name} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Description *</label>
            <textarea name="description" defaultValue={product.description} rows={5} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Category *</label>
              <select name="categoryId" defaultValue={product.categoryId} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" required>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Brand *</label>
              <input type="text" name="brand" defaultValue={product.brand} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Price (₹) *</label>
              <input type="number" name="price" step="0.01" defaultValue={Number(product.price)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Stock *</label>
              <input type="number" name="stock" defaultValue={product.stock} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Image URL</label>
            <input type="url" name="imageUrl" defaultValue={product.imageUrl} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:bg-slate-400">{saving ? 'Saving...' : 'Save Changes'}</button>
            <button type="button" onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 rounded-xl disabled:bg-slate-200">{deleting ? 'Deleting...' : 'Delete Product'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
