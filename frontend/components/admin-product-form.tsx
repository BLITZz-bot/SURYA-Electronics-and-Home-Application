"use client";

import { useState } from "react";

const defaultForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
  imageUrl: "",
};

export default function AdminProductForm() {
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
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
        setMessage(result.error ?? "Could not create product.");
      } else {
        setMessage("Product created successfully.");
        setForm(defaultForm);
      }
    } catch (error) {
      setMessage("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="text-xl font-semibold">Add New Product</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          Product name
          <input
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
            required
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Brand
          <input
            value={form.brand}
            onChange={(event) => handleChange("brand", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
            required
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Category
          <input
            value={form.category}
            onChange={(event) => handleChange("category", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
            required
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Image URL
          <input
            value={form.imageUrl}
            onChange={(event) => handleChange("imageUrl", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
            required
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Price
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(event) => handleChange("price", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
            required
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Stock
          <input
            type="number"
            value={form.stock}
            onChange={(event) => handleChange("stock", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
            required
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-700">
        Description
        <textarea
          value={form.description}
          onChange={(event) => handleChange("description", event.target.value)}
          className="min-h-[120px] w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Saving..." : "Add product"}
      </button>

      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </form>
  );
}
