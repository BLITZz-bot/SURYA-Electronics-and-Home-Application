"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../../context/auth-context";
import { getApiUrl } from "../../../../lib/api-utils";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "../../../../lib/utils";

interface OrderDetailProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: OrderDetailProps) {
  const { token, user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(getApiUrl(`/api/orders/${params.id}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.id, token]);

  useEffect(() => {
    if (token) fetchOrder();
  }, [token, fetchOrder]);

  if (loading) return <div className="py-40 text-center font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading order details...</div>;
  if (!order) return (
    <div className="py-40 text-center">
       <h1 className="text-2xl font-black text-gray-900">Order not found</h1>
       <Link href="/orders" className="text-[#0F3D6E] underline font-bold mt-4 inline-block">Back to orders</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-amazon-bg py-10">
      <div className="mx-auto max-w-4xl px-4 space-y-8">
        <Link href="/orders" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0F3D6E] transition-all group w-fit">
           <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
           Back to orders
        </Link>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Order Summary</h1>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Order # {order.id.slice(-12).toUpperCase()}</p>
           </div>
           <div className="text-right">
              <span className={cn(
                "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border",
                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-[#0F3D6E] text-white'
              )}>
                {order.status}
              </span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Items */}
           <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-3">
                    <Package size={20} className="text-[#0F3D6E]" />
                    Shipment Items
                 </h2>
                 <div className="divide-y divide-gray-50">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-6">
                         <img src={item.product?.imageUrl} alt="" className="w-20 h-20 object-contain bg-gray-50 rounded-2xl p-2" />
                         <div className="flex-1">
                            <Link href={`/products/${item.product?.id}`} className="font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">{item.product?.name}</Link>
                            <p className="text-xs text-gray-400 mt-1 uppercase font-black">Qty: {item.quantity} • ₹{Number(item.price).toLocaleString()}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-gray-900">₹{(item.quantity * Number(item.price)).toLocaleString()}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Summary & Address */}
           <div className="space-y-8">
              <div className="bg-[#0F3D6E] text-white p-8 rounded-[40px] shadow-xl shadow-[#0F3D6E]/20 space-y-6">
                 <h2 className="text-lg font-black uppercase tracking-widest text-[#5DADE2]">Order Total</h2>
                 <div className="space-y-3 text-sm font-bold opacity-80">
                    <div className="flex justify-between"><span>Items</span> <span>₹{Number(order.totalAmount).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Shipping</span> <span className="text-emerald-400">FREE</span></div>
                 </div>
                 <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                    <span className="text-xs font-black uppercase opacity-60">Grand Total</span>
                    <span className="text-3xl font-black italic">₹{Number(order.totalAmount).toLocaleString()}</span>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
                 <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <MapPin size={14} className="text-[#0F3D6E]" />
                    Delivery Address
                 </h2>
                 <div className="text-sm font-bold text-gray-900">
                    <p>{order.shippingAddress}</p>
                    <p>{order.shippingCity}, {order.shippingPostalCode}</p>
                    <p className="text-gray-400 mt-2 font-medium">{order.shippingPhone}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
