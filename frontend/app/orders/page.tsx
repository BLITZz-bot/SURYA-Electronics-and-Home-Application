"use client";

import Link from "next/link";
import { useAuth } from "../../context/auth-context";
import { useEffect, useState } from "react";
import { getApiUrl } from "../../lib/api-utils";

export default function OrdersPage() {
  const { user, loading, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  const fetchOrders = async () => {
    setFetching(true);
    try {
      // NOTE: We need to update this endpoint to be authenticated via Firebase token
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
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100">
          <h1 className="text-3xl font-semibold">Sign in to view your orders</h1>
          <p className="mt-4 text-slate-600">Only registered users can view order history and tracking.</p>
          <Link href="/auth/signin" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-white hover:bg-slate-700">
            Sign In Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
          <h1 className="text-3xl font-semibold">Order history</h1>
          <p className="mt-2 text-slate-600">Track your latest orders and shipment status.</p>
        </div>

        {fetching ? (
           <div className="text-center py-10">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-slate-700">
            You have not placed any orders yet. <Link href="/products" className="text-sky-700 underline">Browse products.</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Order ID</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">#{order.id.slice(-6).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="mt-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total amount</p>
                    <p className="mt-1 text-xl font-semibold">₹{Number(order.totalAmount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="rounded-3xl bg-slate-100 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-slate-900">{item.product.name}</p>
                        <p className="text-slate-600">Qty: {item.quantity}</p>
                        <p className="text-slate-900 font-bold">₹{Number(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
