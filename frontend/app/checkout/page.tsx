"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/auth-context";
import { getApiUrl } from "../../lib/api-utils";
import Link from "next/link";

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
  const { token, loading: authLoading, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
    phone: "",
  });
  const router = useRouter();

  const fetchCart = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(getApiUrl("/api/cart"), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        setCartItems(Array.isArray(result) ? result : (result.items ?? []));
      } else {
        setMessage(result.error ?? "Unable to load cart.");
      }
    } catch (error) {
      setMessage("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && token) {
      fetchCart();
    } else if (!authLoading && !token) {
      router.push("/auth/signin");
    }
  }, [authLoading, token, fetchCart, router]);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * Number(item.product.price), 0);

  function handleChange(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCheckout(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(getApiUrl("/api/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
    <main className="min-h-screen bg-amazon-bg pb-20">
      {/* Distraction-free Header */}
      <div className="bg-white border-b border-gray-200 py-6 mb-10 shadow-sm">
         <div className="mx-auto max-w-[1150px] px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-bold tracking-tight text-[#0F3D6E]">SURYA</span>
              <span className="text-amazon-orange text-xs font-bold mt-2 ml-1 group-hover:translate-x-1 transition-transform">Electronics</span>
            </Link>
            <h1 className="text-3xl font-light text-gray-700 hidden md:block">Checkout</h1>
            <div className="flex items-center gap-2 text-gray-400">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
               <span className="text-xs font-bold uppercase tracking-widest">Secure SSL</span>
            </div>
         </div>
      </div>

      <div className="mx-auto max-w-[1150px] px-4">
        {message && (
          <div className="mb-8 p-5 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm font-bold shadow-sm animate-pulse">
            {message}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Flow */}
          <div className="flex-1 space-y-8">
             {/* Section 1: Address */}
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex gap-6">
                   <span className="text-2xl font-black text-[#0F3D6E]">1</span>
                   <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                      <form className="grid gap-6 sm:grid-cols-2">
                        <label className="sm:col-span-2 space-y-2">
                          <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Street Address</span>
                          <input
                            value={form.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            required
                            placeholder="Apt, Suite, Street name"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#0F3D6E] focus:ring-2 focus:ring-[#0F3D6E]/20 outline-none transition-all shadow-inner"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">City</span>
                          <input
                            value={form.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#0F3D6E] focus:ring-2 focus:ring-[#0F3D6E]/20 outline-none transition-all shadow-inner"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Postal Code</span>
                          <input
                            value={form.postalCode}
                            onChange={(e) => handleChange("postalCode", e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#0F3D6E] focus:ring-2 focus:ring-[#0F3D6E]/20 outline-none transition-all shadow-inner"
                          />
                        </label>
                      </form>
                   </div>
                </div>
             </div>

             {/* Section 2: Payment */}
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm opacity-90">
                <div className="flex gap-6">
                   <span className="text-2xl font-black text-gray-300">2</span>
                   <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                      <div className="bg-[#0F3D6E]/5 border-2 border-[#0F3D6E]/10 p-5 rounded-2xl flex gap-4">
                         <div className="w-5 h-5 rounded-full border-4 border-[#0F3D6E] bg-white mt-1"></div>
                         <div>
                            <p className="text-base font-bold text-[#0F3D6E]">Cash on Delivery (COD)</p>
                            <p className="text-xs text-gray-500 mt-1">Simple and secure. Pay when your items arrive.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Section 3: Review */}
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex gap-6">
                   <span className="text-2xl font-black text-gray-300">3</span>
                   <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Items</h2>
                      <div className="divide-y divide-gray-50 border border-gray-50 rounded-2xl overflow-hidden bg-gray-50/30">
                         {cartItems.map((item) => (
                           <div key={item.id} className="p-4 flex gap-4 text-sm items-center">
                              <span className="bg-[#0F3D6E] text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">{item.quantity}</span>
                              <span className="font-bold text-[#0F3D6E] line-clamp-1 flex-1">{item.product.name}</span>
                              <span className="font-black text-gray-900">₹{(item.quantity * Number(item.product.price)).toLocaleString()}</span>
                           </div>
                         ))}
                      </div>
                      <p className="mt-4 text-[10px] text-emerald-600 font-black uppercase tracking-widest text-right">Guaranteed Arrival: Within 24-48 Hours</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Sticky Summary Sidebar */}
          <div className="w-full lg:w-[350px] space-y-6">
             <div className="bg-[#0F3D6E] text-white p-8 rounded-[40px] space-y-8 sticky top-10 shadow-2xl shadow-[#0F3D6E]/30">
                <div className="space-y-2">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-[#5DADE2]">Order Summary</h3>
                   <div className="text-sm space-y-3 pt-4">
                      <div className="flex justify-between font-medium opacity-80"><span>Subtotal ({totalQuantity} items)</span> <span>₹{totalAmount.toLocaleString()}</span></div>
                      <div className="flex justify-between font-medium opacity-80"><span>Shipping</span> <span className="text-emerald-400 font-black">FREE</span></div>
                   </div>
                </div>
                
                <div className="border-t border-white/10 pt-6">
                   <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold opacity-60">Total</span>
                      <span className="text-4xl font-black text-white tracking-tighter">₹{totalAmount.toLocaleString()}</span>
                   </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={submitting || cartItems.length === 0}
                  className="w-full bg-amazon-orange hover:bg-orange-500 text-white py-5 rounded-2xl text-lg font-black shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-tighter"
                >
                  {submitting ? "Processing..." : "Place Your Order"}
                </button>
                
                <p className="text-[10px] text-white/40 text-center leading-relaxed">
                   By confirming your order, you agree to SURYA's terms of service and standard return policy.
                </p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
