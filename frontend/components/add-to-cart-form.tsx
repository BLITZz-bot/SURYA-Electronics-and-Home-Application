"use client";

import { useState } from "react";

interface AddToCartFormProps {
  productId: string;
  availableStock: number;
}

export default function AddToCartForm({ productId, availableStock }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? "Could not add item to cart.");
      } else {
        setMessage("Product added to cart successfully.");
      }
    } catch (error) {
      setMessage("Failed to add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Quantity</p>
          <input
            type="number"
            min={1}
            max={availableStock}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="mt-2 w-24 rounded-2xl border border-slate-300 bg-white px-4 py-2 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading || quantity < 1 || quantity > availableStock}
          className="rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Adding..." : "Add to cart"}
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-600">Stock available: {availableStock}</p>
      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
    </div>
  );
}
