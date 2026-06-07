'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${params.id}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      const updatedOrder = await res.json();
      setOrder(updatedOrder);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (paymentStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update payment status');
      
      const updatedOrder = await res.json();
      setOrder(updatedOrder);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-slate-600 mt-2">{error}</p>
        <Link href="/admin/orders" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Order #{order.id.slice(-6).toUpperCase()}</h1>
          <p className="text-slate-600 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
            className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Items & Customer Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Order Items</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="p-6 flex items-center gap-6">
                  <img src={item.product.imageUrl} alt="" className="h-20 w-20 rounded-xl object-cover bg-slate-100" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                    <p className="text-sm text-slate-600">{item.product.brand}</p>
                    <p className="text-sm text-slate-600 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">₹{Number(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">₹{Number(item.price).toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-6 space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{Number(order.totalAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span>₹{Number(order.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Customer Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Name</p>
                  <p className="text-slate-900 font-medium">{order.user?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</p>
                  <p className="text-slate-900 font-medium">{order.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</p>
                  <p className="text-slate-900 font-medium">{order.shippingPhone}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Shipping Address</h3>
              <div className="space-y-2 text-slate-900 font-medium">
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}, {order.shippingPostalCode}</p>
                <p>{order.shippingCountry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Status */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Information</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Payment Method</p>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-semibold text-sm">
                  {order.paymentMethod}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Payment Status</p>
                <div className="flex flex-col gap-3">
                  <span className={`inline-flex px-3 py-1 rounded-lg font-semibold text-sm w-fit ${
                    order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                  {order.paymentStatus !== 'paid' && (
                    <button 
                      onClick={() => updatePaymentStatus('paid')}
                      disabled={updating}
                      className="text-blue-600 hover:text-blue-700 text-sm font-bold text-left"
                    >
                      Mark as Paid →
                    </button>
                  )}
                </div>
              </div>
              {order.transactionId && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Transaction ID</p>
                  <p className="text-sm font-mono text-slate-600">{order.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Internal Notes</h3>
            <textarea 
              placeholder="Add a note for internal use..."
              className="w-full h-32 p-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
