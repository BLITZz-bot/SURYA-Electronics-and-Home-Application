"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    setLoading(true);
    const response = await fetch("/api/cart");
    const result = await response.json();
    if (response.ok) {
      setCartItems(result.items ?? []);
    } else {
      setMessage(result.error ?? "Unable to load cart.");
    }
    setLoading(false);
  }

  async function removeItem(cartItemId: string) {
    setLoading(true);
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (response.ok) {
      fetchCart();
    } else {
      setMessage(result.error ?? "Unable to remove item.");
      setLoading(false);
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
          <h1 className="text-3xl font-semibold">Your cart</h1>
          <p className="mt-2 text-slate-600">Review items before checkout.</p>
        </div>

        {message ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-800">{message}</div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">Loading cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
            Your cart is empty. <Link href="/products" className="text-sky-700 underline">Browse products.</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.product.imageUrl} alt={item.product.name} className="h-24 w-24 rounded-3xl object-cover" />
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{item.product.name}</h2>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      <p className="text-sm text-slate-600">Price: ₹{item.product.price}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <p className="text-lg font-semibold">₹{item.quantity * item.product.price}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xl font-semibold">Total</p>
                <p className="text-2xl font-semibold">₹{totalAmount.toFixed(0)}</p>
              </div>
              <Link
                href="/checkout"
                className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-white hover:bg-slate-700"
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
