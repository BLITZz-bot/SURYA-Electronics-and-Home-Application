"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { getApiUrl } from "../lib/api-utils";

const defaultForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  discountValue: "",
  discountType: "",
  stock: "",
  categoryId: "",
  brand: "",
  imageUrl: "",
};

interface AdminProductFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AdminProductForm({ initialData, onSuccess, onCancel }: AdminProductFormProps) {
  const { token } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch(getApiUrl("/api/categories"));
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price.toString(),
        originalPrice: initialData.originalPrice?.toString() || "",
        discountValue: initialData.discountValue?.toString() || "",
        discountType: initialData.discountType || "",
        stock: initialData.stock.toString(),
        categoryId: initialData.categoryId,
        brand: initialData.brand,
        imageUrl: initialData.imageUrl,
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData]);

  const handleChange = (name: string, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage(null);

    const isEditing = !!initialData;
    const url = isEditing ? getApiUrl(`/api/products/${initialData.id}`) : getApiUrl("/api/products");
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
          discountValue: form.discountValue ? Number(form.discountValue) : null,
          stock: Number(form.stock),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? `Could not ${isEditing ? 'update' : 'create'} product.`);
      } else {
        setMessage(`Product ${isEditing ? 'updated' : 'created'} successfully.`);
        if (!isEditing) setForm(defaultForm);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      setMessage(`Failed to ${isEditing ? 'update' : 'create'} product. Please try again.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 rounded-3xl border border-slate-200 p-6 ${initialData ? 'bg-white shadow-lg' : 'bg-slate-50'}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
        {initialData && (
          <button 
            type="button" 
            onClick={onCancel}
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Product name
          <input
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none transition-colors"
            required
          />
        </label>
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Brand
          <input
            value={form.brand}
            onChange={(event) => handleChange("brand", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none transition-colors"
            required
          />
        </label>
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Category
          <select
            value={form.categoryId}
            onChange={(event) => handleChange("categoryId", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none transition-colors"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Image URL
          <input
            value={form.imageUrl}
            onChange={(event) => handleChange("imageUrl", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none transition-colors"
            required
          />
        </label>
        <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Stock
          <input
            type="number"
            value={form.stock}
            onChange={(event) => handleChange("stock", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none transition-colors"
            required
          />
        </label>
        <div className="md:col-span-2 lg:col-span-3 border-t pt-4 mt-2">
           <h3 className="text-sm font-black text-[#0F3D6E] mb-4 uppercase tracking-widest">Pricing & Discounts</h3>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                Sale Price (₹)
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => handleChange("price", event.target.value)}
                  className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none transition-colors font-bold"
                  required
                />
              </label>
              <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Original MRP (₹)
                <input
                  type="number"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={(event) => handleChange("originalPrice", event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none transition-colors"
                />
              </label>
              <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                Discount Value
                <input
                  type="number"
                  step="0.01"
                  value={form.discountValue}
                  onChange={(event) => handleChange("discountValue", event.target.value)}
                  className="w-full rounded-2xl border border-rose-50 bg-rose-50/30 px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </label>
              <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                Discount Type
                <select
                  value={form.discountType}
                  onChange={(event) => handleChange("discountType", event.target.value)}
                  className="w-full rounded-2xl border border-rose-50 bg-rose-50/30 px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:outline-none transition-colors"
                >
                  <option value="">None</option>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </label>
           </div>
        </div>
      </div>

      <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-500 block">
        Description
        <textarea
          value={form.description}
          onChange={(event) => handleChange("description", event.target.value)}
          className="min-h-[120px] w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none transition-colors"
          required
        />
      </label>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Saving..." : initialData ? "Update product" : "Add product"}
        </button>
      </div>

      {message ? (
        <p className={`text-sm font-medium ${message.includes('successfully') ? 'text-emerald-600' : 'text-rose-600'}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
