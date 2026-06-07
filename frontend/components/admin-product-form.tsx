"use client";

import { useState, useEffect } from "react";

const defaultForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
  imageUrl: "",
};

interface AdminProductFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AdminProductForm({ initialData, onSuccess, onCancel }: AdminProductFormProps) {
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price.toString(),
        stock: initialData.stock.toString(),
        category: initialData.category,
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
    setLoading(true);
    setMessage(null);

    const isEditing = !!initialData;
    const url = isEditing ? `/api/products/${initialData.id}` : "/api/products";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          brand: form.brand,
          imageUrl: form.imageUrl,
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
      
      <div className="grid gap-4 md:grid-cols-2">
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
          <input
            value={form.category}
            onChange={(event) => handleChange("category", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none transition-colors"
            required
          />
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
          Price (₹)
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(event) => handleChange("price", event.target.value)}
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
