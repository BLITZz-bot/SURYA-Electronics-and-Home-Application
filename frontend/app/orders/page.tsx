"use client";

import Link from "next/link";
import { useAuth } from "../../context/auth-context";
import { useEffect, useState, useCallback } from "react";
import { getApiUrl } from "../../lib/api-utils";

export default function OrdersPage() {
  const { user, loading, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setFetching(true);
    try {
      const res = await fetch(getApiUrl('/api/orders/my-orders'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token, fetchOrders]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amazon-bg">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#0F3D6E]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-amazon-bg px-4 py-20">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 shadow-xl border border-gray-100 text-center">
          <svg className="w-20 h-20 text-gray-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in to view orders</h1>
          <p className="text-gray-500 mb-8">Please log in to track your shipments and view your full order history.</p>
          <Link href="/auth/signin" className="inline-block w-full bg-[#0F3D6E] text-white font-bold py-3 rounded-lg hover:bg-black transition-all transform active:scale-95">
            Sign In Securely
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amazon-bg py-10">
      <div className="mx-auto max-w-[1100px] px-4 space-y-8">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
           <Link href="/" className="hover:underline">Home</Link>
           <span>›</span>
           <Link href="/account" className="hover:underline">Your Account</Link>
           <span>›</span>
           <span className="font-bold text-gray-900 tracking-tight">Your Orders</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Orders</h1>

        {fetching ? (
           <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-gray-100 shadow-sm">
             <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#0F3D6E] mb-4"></div>
             <p className="text-gray-400 font-medium">Retrieving your order data...</p>
           </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-20 shadow-sm text-center">
            <svg className="w-16 h-16 text-gray-100 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <p className="text-xl font-bold text-gray-800">You haven't placed any orders yet.</p>
            <p className="text-gray-400 mt-1 mb-8">Check out our latest arrivals and start shopping!</p>
            <Link href="/products" className="bg-amazon-orange text-white px-10 py-3 rounded-full font-bold shadow-lg transform transition-all active:scale-95">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <div>
                    <p className="mb-1">Order Placed</p>
                    <p className="text-gray-900 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="mb-1">Total</p>
                    <p className="text-gray-900 text-sm">₹{Number(order.totalAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="mb-1">Ship To</p>
                    <p className="text-[#0F3D6E] text-sm hover:underline cursor-pointer">{user.displayName || user.email?.split('@')[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1">Order # {order.id.slice(-8).toUpperCase()}</p>
                    <Link href={`/orders/${order.id}`} className="text-[#0F3D6E] text-[10px] hover:underline">View Order Details</Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-8 space-y-8">
                  <div className="flex items-center gap-2 mb-4">
                     <span className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-amazon-orange'}`}></span>
                     <h2 className="text-lg font-bold text-gray-900 capitalize">{order.status}</h2>
                  </div>
                  
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-6 items-start">
                      <div className="h-24 w-24 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center p-3 border border-gray-100">
                        <img src={item.product?.imageUrl} alt={item.product?.name} className="max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product?.id}`} className="text-[#0F3D6E] font-bold text-lg hover:text-orange-600 hover:underline line-clamp-2 leading-tight mb-1">
                          {item.product?.name}
                        </Link>
                        <p className="text-sm text-gray-500 mb-4 italic">Return window closed on {new Date(new Date(order.createdAt).getTime() + 30*24*60*60*1000).toLocaleDateString()}</p>
                        <div className="flex gap-4">
                           <Link href={`/products/${item.product?.id}`} className="bg-amazon-yellow text-amazon-dark px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-yellow-400 transform transition-all active:scale-95">Buy it again</Link>
                           <button className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 shadow-sm transition-all">View your item</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Footer */}
                <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex justify-end">
                   <button className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-tighter">Archive Order</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
