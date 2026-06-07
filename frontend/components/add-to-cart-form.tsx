"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { getApiUrl } from "../lib/api-utils";

interface AddToCartFormProps {
  productId: string;
  availableStock: number;
}

export default function AddToCartForm({ productId, availableStock }: AddToCartFormProps) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    if (!user || !token) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(getApiUrl("/api/cart"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? "Could not add item to cart.");
      } else {
        setMessage("Product added to cart successfully.");
        router.push("/cart");
      }
    } catch (error) {
      setMessage("Failed to add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="quantity" className="text-sm font-medium text-slate-700">Quantity</label>
          <div className="mt-2 flex items-center gap-4">
            <input
              id="quantity"
              type="number"
              min={1}
              max={availableStock}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none transition"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading || quantity < 1 || quantity > availableStock}
          className="w-full rounded-full bg-slate-900 px-6 py-4 text-white font-semibold transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Processing..." : user ? "Add to cart" : "Sign in to Buy"}
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-slate-500">Availability</span>
        <span className={availableStock > 0 ? "font-medium text-green-600" : "font-medium text-red-600"}>
          {availableStock > 0 ? `${availableStock} in stock` : "Out of stock"}
        </span>
      </div>
      
      {message ? (
        <div className={`mt-4 rounded-2xl p-4 text-sm ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
          {message}
        </div>
      ) : null}
    </div>
  );
}
