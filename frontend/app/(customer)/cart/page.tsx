/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/auth-context";
import { getApiUrl } from "../../../lib/api-utils";

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
  const { token, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

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
      setMessage("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && token) {
      fetchCart();
    } else if (!authLoading && !token) {
      setLoading(false);
    }
  }, [authLoading, token, fetchCart]);

  async function removeItem(cartItemId: string) {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(`/api/cart/${cartItemId}`), {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchCart();
      } else {
        const result = await response.json();
        setMessage(result.error ?? "Unable to remove item.");
        setLoading(false);
      }
    } catch (error) {
      setMessage("Failed to remove item.");
      setLoading(false);
    }
  }

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * Number(item.product.price), 0);

  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-[1500px] px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Items */}
          <div className="flex-1 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-medium border-b border-gray-200 pb-4">Shopping Cart</h1>
            
            {message && (
              <div className="mt-4 p-4 bg-rose-50 text-rose-700 rounded-sm border border-rose-100 text-sm">
                {message}
              </div>
            )}

            {loading && cartItems.length === 0 ? (
              <div className="py-20 text-center text-gray-500">Loading your shopping cart...</div>
            ) : cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="text-2xl font-bold">Your Shopping Cart is empty.</p>
                <p className="text-sm">Check your Saved for later items below or <Link href="/products" className="text-sky-700 hover:underline">continue shopping</Link>.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4">
                    <div className="w-44 h-44 flex-shrink-0 flex items-center justify-center">
                      <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between gap-4">
                        <Link href={`/products/${item.product.id}`} className="text-lg font-medium text-slate-900 hover:text-orange-700 line-clamp-2">
                          {item.product.name}
                        </Link>
                        <span className="text-lg font-bold">₹{Number(item.product.price).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-emerald-700">In Stock</p>
                      <p className="text-xs text-gray-500">Eligible for FREE Shipping</p>
                      
                      <div className="flex items-center gap-4 pt-4">
                        <div className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 flex items-center gap-2 shadow-sm text-xs">
                           <span>Qty: {item.quantity}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-sky-700 hover:text-orange-700 hover:underline"
                        >
                          Delete
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-xs text-sky-700 hover:text-orange-700 hover:underline">Save for later</button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 text-right">
                   <p className="text-xl">Subtotal ({totalQuantity} item{totalQuantity !== 1 ? 's' : ''}): <span className="font-bold">₹{totalAmount.toLocaleString()}</span></p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Subtotal Sidebar */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-80 space-y-4">
              <div className="bg-white p-5 shadow-sm space-y-4 border border-gray-100">
                 <div className="flex items-start gap-2 text-emerald-700">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <p className="text-xs">Your order is eligible for FREE Delivery. Select this option at checkout.</p>
                 </div>
                 
                 <div className="py-2">
                    <p className="text-xl">Subtotal ({totalQuantity} item{totalQuantity !== 1 ? "s" : ""}): <span className="font-bold">₹{totalAmount.toLocaleString()}</span></p>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <input type="checkbox" id="gift" className="w-4 h-4 border-gray-300 rounded" />
                   <label htmlFor="gift" className="text-sm cursor-pointer">This order contains a gift</label>
                 </div>

                 <Link
                  href="/checkout"
                  className="block w-full text-center bg-[#0F3D6E] hover:bg-black text-white py-3 rounded-full text-sm font-black shadow-xl shadow-[#0F3D6E]/20 transition-all transform active:scale-95 uppercase tracking-widest"
                >
                  Proceed to Buy
                </Link>
              </div>

              <div className="bg-white p-5 shadow-sm border border-gray-100">
                 <h3 className="text-sm font-bold mb-3">Recently viewed</h3>
                 <div className="space-y-4">
                    <p className="text-xs text-gray-400 italic">No recently viewed items.</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
