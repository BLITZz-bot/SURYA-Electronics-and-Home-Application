"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const router = useRouter();

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

  const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  function handleChange(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress: form.address,
          shippingCity: form.city,
          shippingPostalCode: form.postalCode,
          shippingCountry: form.country,
          shippingPhone: form.phone,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? "Unable to place order.");
      } else {
        router.push("/orders");
      }
    } catch (error) {
      setMessage("Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
          <h1 className="text-3xl font-semibold">Checkout</h1>
          <p className="mt-2 text-slate-600">Enter delivery details and confirm your order with cash on delivery.</p>
        </div>

        {message ? <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-800">{message}</div> : null}

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Order summary</h2>
            {loading ? (
              <p className="text-slate-600">Loading cart...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-slate-600">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{item.product.name}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{item.quantity * item.product.price}</p>
                    </div>
                  </div>
                ))}
                <div className="rounded-3xl bg-slate-900 p-5 text-white">
                  <p className="text-sm text-slate-200">Total amount</p>
                  <p className="mt-2 text-3xl font-semibold">₹{totalAmount.toFixed(0)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleCheckout} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Shipping details</h2>
          <div className="grid gap-4 py-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Address
              <input
                value={form.address}
                onChange={(event) => handleChange("address", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              City
              <input
                value={form.city}
                onChange={(event) => handleChange("city", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Postal code
              <input
                value={form.postalCode}
                onChange={(event) => handleChange("postalCode", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Country
              <input
                value={form.country}
                onChange={(event) => handleChange("country", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
              Phone
              <input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting || cartItems.length === 0}
            className="rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? "Placing order..." : "Place order with COD"}
          </button>
        </form>
      </div>
    </main>
  );
}
