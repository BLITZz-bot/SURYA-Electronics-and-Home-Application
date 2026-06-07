"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { getApiUrl } from "../lib/api-utils";

interface AddToCartFormProps {
  productId: string;
  availableStock: number;
  price: number | string;
}

export default function AddToCartForm({ productId, availableStock, price }: AddToCartFormProps) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [defaultCity, setDefaultCity] = useState<string | null>(null);

  useState(() => {
    if (token) {
      import("../lib/api-utils").then(m => {
        fetch(m.getApiUrl("/api/addresses"), {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          const def = data.find((a: any) => a.isDefault) || data[0];
          if (def) setDefaultCity(def.city);
        })
        .catch(console.error);
      });
    }
  });

  async function handleAddToCart(isBuyNow = false) {
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
        if (isBuyNow) {
          router.push("/checkout");
        } else {
          router.push("/cart");
        }
      }
    } catch (error) {
      setMessage("Failed to add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 1);
  const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="border border-gray-300 rounded-lg p-4 space-y-4 sticky top-24 bg-white shadow-sm">
      <div className="flex items-baseline gap-0.5">
        <span className="text-sm font-medium self-start mt-1">₹</span>
        <span className="text-2xl font-medium">{Number(price).toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-2">
         <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
         <span className="text-xs text-sky-700 hover:text-orange-700 hover:underline cursor-pointer font-bold">
            {defaultCity ? `Deliver to ${defaultCity}` : 'Select Location'}
         </span>
      </div>

      <div className="space-y-1">
        <p className={`text-lg font-medium ${availableStock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
          {availableStock > 0 ? "In Stock" : "Currently Unavailable"}
        </p>
      </div>

      {availableStock > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Quantity:</span>
            <select 
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-sky-500 outline-none shadow-sm"
            >
              {[...Array(Math.min(10, availableStock))].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleAddToCart(false)}
              disabled={loading || availableStock <= 0}
              className="w-full bg-surya-light hover:bg-surya-dark text-white py-2.5 rounded-full text-sm font-bold shadow-md transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {loading ? "Processing..." : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              disabled={loading || availableStock <= 0}
              className="w-full bg-amazon-orange hover:bg-orange-600 text-white py-2.5 rounded-full text-sm font-bold shadow-md transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200 space-y-2">
         <p className="text-xs text-gray-500 flex justify-between"><span>Ships from</span> <span className="text-gray-900">SURYA Electronics</span></p>
         <p className="text-xs text-gray-500 flex justify-between"><span>Sold by</span> <span className="text-gray-900">SURYA Retail</span></p>
      </div>

      {message && (
        <p className="text-xs text-red-600 mt-2">{message}</p>
      )}
    </div>
  );
}

