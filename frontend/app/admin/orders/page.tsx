'use dynamic';

import { prisma } from "../../../lib/prisma";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } }
    },
  });

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-600 mt-1">Manage customer orders and track shipments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{orders.length}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white border border-amber-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{pendingOrders}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5a1 1 0 002 0V7z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-purple-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Shipped</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">{shippedOrders}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3.5a1 1 0 01-1-1v-2a1 1 0 10-2 0v2a1 1 0 01-1 1H4a1 1 0 110-2V4z" />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Delivered</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{deliveredOrders}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Order ID</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Customer</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Items</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="font-medium text-slate-900">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-600">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">₹{Number(order.totalAmount).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.items.length} items</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : 
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
